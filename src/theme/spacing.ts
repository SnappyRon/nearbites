/**
 * NearBites Spacing Scale (4pt base increment)
 * Conforming strictly to /docs/design-system.md
 */

export const spacing = {
  space1: 4,    // 4pt
  space2: 8,    // 8pt
  space3: 12,   // 12pt
  space4: 16,   // 16pt (Standard horizontal screen margin)
  space5: 20,   // 20pt
  space6: 24,   // 24pt
  space8: 32,   // 32pt
  space12: 48,  // 48pt
  space16: 64,  // 64pt
} as const;

export type SpacingToken = keyof typeof spacing;

export const hitSlop44 = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
} as const;
