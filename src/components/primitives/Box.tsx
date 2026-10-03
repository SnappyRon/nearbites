import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';

export interface BoxProps extends ViewProps {
  children?: React.ReactNode;
  bg?: keyof typeof colors | string;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  rounded?: number;
  row?: boolean;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  flex?: number;
}

export const Box: React.FC<BoxProps> = ({
  children,
  bg,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  rounded,
  row,
  align,
  justify,
  flex,
  style,
  ...props
}) => {
  const computedStyle: ViewStyle = {
    ...(bg ? { backgroundColor: (colors as Record<string, string>)[bg] || bg } : {}),
    ...(p !== undefined ? { padding: p } : {}),
    ...(px !== undefined ? { paddingHorizontal: px } : {}),
    ...(py !== undefined ? { paddingVertical: py } : {}),
    ...(pt !== undefined ? { paddingTop: pt } : {}),
    ...(pb !== undefined ? { paddingBottom: pb } : {}),
    ...(pl !== undefined ? { paddingLeft: pl } : {}),
    ...(pr !== undefined ? { paddingRight: pr } : {}),
    ...(m !== undefined ? { margin: m } : {}),
    ...(mx !== undefined ? { marginHorizontal: mx } : {}),
    ...(my !== undefined ? { marginVertical: my } : {}),
    ...(mt !== undefined ? { marginTop: mt } : {}),
    ...(mb !== undefined ? { marginBottom: mb } : {}),
    ...(ml !== undefined ? { marginLeft: ml } : {}),
    ...(mr !== undefined ? { marginRight: mr } : {}),
    ...(rounded !== undefined ? { borderRadius: rounded } : {}),
    ...(row ? { flexDirection: 'row' } : {}),
    ...(align ? { alignItems: align } : {}),
    ...(justify ? { justifyContent: justify } : {}),
    ...(flex !== undefined ? { flex } : {}),
  };

  return (
    <View style={[computedStyle, style]} {...props}>
      {children}
    </View>
  );
};
