import { TextStyle } from 'react-native';

/**
 * NearBites Typography Scale
 * Conforming strictly to /docs/design-system.md
 */

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  heading1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.3,
  } as TextStyle,
  heading2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  heading3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: 0,
  } as TextStyle,
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  } as TextStyle,
  priceBadge: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  priceHero: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
