#!/usr/bin/env node
/**
 * patch-expo-font.js
 *
 * Patches expo-font/build/Font.js to replace the `in` operator usage
 * with `Object.prototype.hasOwnProperty.call` to prevent Hermes from
 * throwing `TypeError: right operand of 'in' is not an object` when
 * module evaluation order leaves `loaded` / `loadPromises` undefined.
 *
 * This script runs automatically via `postinstall` in package.json.
 */
const fs = require('fs');
const path = require('path');

const FONT_JS = path.resolve(__dirname, '..', 'node_modules', 'expo-font', 'build', 'Font.js');

if (!fs.existsSync(FONT_JS)) {
  console.log('[patch-expo-font] expo-font/build/Font.js not found, skipping.');
  process.exit(0);
}

let content = fs.readFileSync(FONT_JS, 'utf8');

// Check if already patched
if (content.includes('Object.prototype.hasOwnProperty.call(loaded, fontFamily)')) {
  console.log('[patch-expo-font] Already patched, skipping.');
  process.exit(0);
}

// Replace `in` operator usages in isLoaded and isLoading with safe alternatives
const replacements = [
  // isLoaded web path
  {
    from: /loaded\s*&&\s*fontFamily\s+in\s+loaded/g,
    to: "typeof loaded === 'object' && loaded !== null && Object.prototype.hasOwnProperty.call(loaded, fontFamily)",
  },
  // isLoading
  {
    from: /loadPromises\s*&&\s*fontFamily\s+in\s+loadPromises/g,
    to: "typeof loadPromises === 'object' && loadPromises !== null && Object.prototype.hasOwnProperty.call(loadPromises, fontFamily)",
  },
];

let patched = false;
for (const { from, to } of replacements) {
  if (from.test(content)) {
    content = content.replace(from, to);
    patched = true;
  }
}

if (patched) {
  fs.writeFileSync(FONT_JS, content, 'utf8');
  console.log('[patch-expo-font] ✅ Successfully patched expo-font/build/Font.js');
} else {
  console.log('[patch-expo-font] No matching patterns found (may already be patched or API changed).');
}
