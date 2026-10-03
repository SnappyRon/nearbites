/**
 * NearBites Semantic Color Tokens
 * Conforming strictly to /docs/design-system.md
 */

export const colors = {
  // Brand Anchors
  primary: '#325B53',        // Deep Teal (Navigation, Primary CTA, Trusted Anchors)
  accent: '#D8964B',         // Warm Gold (Discovery Chips, Price Badges, Highlights)
  background: '#F5EBD7',     // Cream (App Canvas, Sheet Surfaces, Warm Backdrop)
  warmth: '#764323',         // Cocoa Brown (Secondary Warmth, Tag Outlines)
  
  // High-Contrast Typography & Surfaces
  text: '#222A28',           // Charcoal (Primary Headings & Body Copy, 11.2:1 against Cream)
  textMuted: '#706E6B',      // Muted Gray (Secondary Metadata, Distances, Timestamps)
  surface: '#FFFFFF',        // Pure White (Cards, Input Fields, High-Contrast Pills)
  border: '#E2D9CC',         // Subtle Border (Card Outlines, Sheet Dividers)

  // Status & Freshness Verification
  fresh: '#3B7D68',          // Fresh Green (< 30 days verified price)
  freshLight: 'rgba(59, 125, 104, 0.14)',
  aging: '#D8964B',          // Warm Gold (30-90 days verified price)
  agingLight: 'rgba(216, 150, 75, 0.16)',
  stale: '#706E6B',          // Charcoal / Muted (> 90 days price)
  staleLight: 'rgba(34, 42, 40, 0.10)',
  warning: '#C2410C',        // Warning Red (Destructive Actions, Flagged Alerts)
  warningLight: 'rgba(194, 65, 12, 0.12)',

  // Overlays
  overlay: 'rgba(34, 42, 40, 0.40)',
  shadow: 'rgba(34, 42, 40, 0.12)',
} as const;

export type ColorToken = keyof typeof colors;
