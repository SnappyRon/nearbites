import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';
import { FreshnessTier } from '@/features/map/types';

export interface PriceFreshnessBadgeProps {
  freshnessTier: FreshnessTier;
  daysAgo?: number;
  confirmedBy?: string;
}

export const PriceFreshnessBadge: React.FC<PriceFreshnessBadgeProps> = ({
  freshnessTier,
  daysAgo = 3,
  confirmedBy = 'Community Scout',
}) => {
  if (freshnessTier === 'fresh') {
    return (
      <View
        style={[styles.container, styles.freshContainer]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Verified ${daysAgo} days ago by ${confirmedBy}`}
      >
        <Ionicons name="checkmark-circle" size={16} color={colors.fresh} style={styles.icon} />
        <Text variant="caption" style={[styles.text, styles.freshText]}>
          Verified {daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`} by {confirmedBy}
        </Text>
      </View>
    );
  }

  if (freshnessTier === 'aging') {
    const months = Math.max(1, Math.round(daysAgo / 30));
    return (
      <View
        style={[styles.container, styles.agingContainer]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Confirmed ${months} months ago`}
      >
        <Ionicons name="time" size={16} color={colors.aging} style={styles.icon} />
        <Text variant="caption" style={[styles.text, styles.agingText]}>
          Confirmed {months === 1 ? '1 month ago' : `${months} months ago`}
        </Text>
      </View>
    );
  }

  // Stale
  return (
    <View
      style={[styles.container, styles.staleContainer]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel="Price may have changed. Please verify."
    >
      <Ionicons name="alert-circle" size={16} color={colors.stale} style={styles.icon} />
      <Text variant="caption" style={[styles.text, styles.staleText]}>
        Price may have changed • Tap to verify
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  freshContainer: {
    backgroundColor: colors.freshLight,
    borderColor: 'rgba(59, 125, 104, 0.3)',
  },
  agingContainer: {
    backgroundColor: colors.agingLight,
    borderColor: 'rgba(216, 150, 75, 0.3)',
  },
  staleContainer: {
    backgroundColor: colors.staleLight,
    borderColor: 'rgba(34, 42, 40, 0.2)',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
    flexShrink: 1,
  },
  freshText: {
    color: colors.fresh,
  },
  agingText: {
    color: colors.warmth,
  },
  staleText: {
    color: colors.text,
  },
});
