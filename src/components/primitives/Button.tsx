import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const base: ViewStyle = {
      ...styles.base,
      opacity: disabled ? 0.5 : pressed ? 0.85 : 1.0,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case 'accent':
        return {
          ...base,
          backgroundColor: colors.accent,
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  const getTextColor = (): keyof typeof colors => {
    switch (variant) {
      case 'primary':
        return 'surface';
      case 'accent':
        return 'text';
      case 'outline':
      case 'ghost':
        return 'primary';
    }
  };

  return (
    <Pressable
      disabled={disabled || isLoading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.surface : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            variant="heading3"
            color={getTextColor()}
            style={[styles.label, icon ? { marginLeft: spacing.space2 } : null, textStyle]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 44, // Minimum 44pt touch target standard
    paddingHorizontal: spacing.space5,
    paddingVertical: spacing.space3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
