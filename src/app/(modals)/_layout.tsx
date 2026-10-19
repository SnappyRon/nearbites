import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        presentation: 'modal',
      }}
    />
  );
}
