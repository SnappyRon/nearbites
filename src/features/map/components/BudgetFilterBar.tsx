import React from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface BudgetFilterBarProps {
  activeBudget: number;
  onSelectBudget: (budget: number) => void;
  onOpenCustomModal?: () => void;
}

interface BudgetOption {
  label: string;
  value: number;
  isCustom?: boolean;
}

const BUDGET_OPTIONS: BudgetOption[] = [
  { label: 'All Meals', value: 0 },
  { label: '≤ ₱99', value: 99 },
  { label: '≤ ₱150', value: 150 },
  { label: '≤ ₱250', value: 250 },
];

export const BudgetFilterBar: React.FC<BudgetFilterBarProps> = ({
  activeBudget,
  onSelectBudget,
  onOpenCustomModal,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      {BUDGET_OPTIONS.map((option) => {
        const isSelected = activeBudget === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelectBudget(option.value)}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Filter by budget: ${option.label}`}
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              variant="caption"
              color={isSelected ? 'surface' : 'text'}
              style={[styles.chipText, isSelected && styles.chipTextSelected]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}

      {/* Custom Slider Trigger Pill */}
      {onOpenCustomModal && (
        <Pressable
          onPress={onOpenCustomModal}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          style={[styles.chip, styles.chipUnselected, styles.customChip]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open custom budget slider"
        >
          <Text variant="caption" color="primary" style={styles.chipText}>
            ⚙ Custom...
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 44,
  },
  scrollContainer: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
    gap: spacing.space2,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customChip: {
    borderStyle: 'dashed',
  },
  chipText: {
    fontWeight: '600',
  },
  chipTextSelected: {
    fontWeight: '700',
  },
});
