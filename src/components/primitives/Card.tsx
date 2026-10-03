import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface CardProps extends ViewProps {
  children?: React.ReactNode;
  variant?: 'surface' | 'cream' | 'flat';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  style,
  ...props
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'surface':
        return styles.surfaceCard;
      case 'cream':
        return styles.creamCard;
      case 'flat':
        return styles.flatCard;
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: spacing.space4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  surfaceCard: {
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  creamCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  flatCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
