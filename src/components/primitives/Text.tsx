import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle, StyleSheet } from 'react-native';
import { typography, TypographyVariant } from '@/theme/typography';
import { colors } from '@/theme/colors';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: keyof typeof colors | string;
  align?: TextStyle['textAlign'];
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  align,
  style,
  children,
  allowFontScaling = true,
  ...props
}) => {
  const variantStyle = typography[variant] || typography.body;
  const textColor = (colors as Record<string, string>)[color] || color;

  return (
    <RNText
      allowFontScaling={allowFontScaling}
      style={[
        styles.base,
        variantStyle,
        { color: textColor },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
});
