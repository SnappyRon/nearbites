import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useDiscoveryStore } from '@/store/useDiscoveryStore';

interface BudgetTier {
  value: number;
  label: string;
  tagline: string;
  emoji: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    value: 50,
    label: '≤ ₱50',
    tagline: 'Merienda, snacks & quick skewers',
    emoji: '🍢',
  },
  {
    value: 99,
    label: '≤ ₱99',
    tagline: 'Student budget & sulit rice bowls',
    emoji: '🍛',
  },
  {
    value: 150,
    label: '≤ ₱150',
    tagline: 'Classic silogs, noodles & hearty meals',
    emoji: '🍳',
  },
  {
    value: 250,
    label: '≤ ₱250',
    tagline: 'Special combos & meat platters',
    emoji: '🍖',
  },
  {
    value: 0,
    label: 'All Meals',
    tagline: 'Discover all affordable dishes in area',
    emoji: '✨',
  },
];

export const BudgetSettingsModal: React.FC = () => {
  const {
    activeBudget,
    setActiveBudget,
    isBudgetModalOpen,
    setBudgetModalOpen,
  } = useDiscoveryStore();

  const [tempBudget, setTempBudget] = useState<number>(activeBudget);

  useEffect(() => {
    if (isBudgetModalOpen) {
      setTempBudget(activeBudget);
    }
  }, [isBudgetModalOpen, activeBudget]);

  const handleAdjust = (delta: number) => {
    setTempBudget((prev) => {
      const current = prev === 0 ? 150 : prev;
      const next = Math.max(30, Math.min(500, current + delta));
      return next;
    });
  };

  const handleApply = () => {
    setActiveBudget(tempBudget);
    setBudgetModalOpen(false);
  };

  return (
    <Modal
      visible={isBudgetModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setBudgetModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setBudgetModalOpen(false)}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Drag Grabber */}
              <View style={styles.grabber} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Ionicons name="wallet-outline" size={22} color={colors.primary} />
                  <Text variant="heading3" style={styles.title}>
                    Budget Ceiling Filter
                  </Text>
                </View>
                <Pressable
                  onPress={() => setBudgetModalOpen(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </Pressable>
              </View>

              {/* Price Hero Callout */}
              <View style={styles.budgetHeroBox}>
                <Text variant="caption" color="textMuted">
                  MAXIMUM MEAL PRICE
                </Text>
                <View style={styles.priceRow}>
                  <Text variant="priceHero" style={styles.priceText}>
                    {tempBudget === 0 ? 'No Limit' : `₱${tempBudget}`}
                  </Text>
                  {tempBudget > 0 && (
                    <Text variant="caption" color="textMuted" style={styles.perMealText}>
                      / meal
                    </Text>
                  )}
                </View>

                {/* Stepper Controls */}
                <View style={styles.stepperRow}>
                  <Pressable
                    onPress={() => handleAdjust(-10)}
                    style={styles.stepperBtn}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="remove" size={18} color={colors.primary} />
                    <Text variant="caption" style={styles.stepperBtnText}>
                      ₱10
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleAdjust(-25)}
                    style={styles.stepperBtn}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="remove" size={18} color={colors.primary} />
                    <Text variant="caption" style={styles.stepperBtnText}>
                      ₱25
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleAdjust(25)}
                    style={styles.stepperBtn}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="add" size={18} color={colors.primary} />
                    <Text variant="caption" style={styles.stepperBtnText}>
                      ₱25
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleAdjust(50)}
                    style={styles.stepperBtn}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="add" size={18} color={colors.primary} />
                    <Text variant="caption" style={styles.stepperBtnText}>
                      ₱50
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Quick Preset Tiers */}
              <Text variant="caption" color="textMuted" style={styles.sectionLabel}>
                QUICK BUDGET PRESETS
              </Text>

              <View style={styles.tiersList}>
                {BUDGET_TIERS.map((tier) => {
                  const isSelected = tempBudget === tier.value;
                  return (
                    <Pressable
                      key={tier.value}
                      onPress={() => setTempBudget(tier.value)}
                      style={[
                        styles.tierItem,
                        isSelected && styles.tierItemSelected,
                      ]}
                    >
                      <View style={styles.tierEmojiBox}>
                        <Text style={styles.tierEmoji}>{tier.emoji}</Text>
                      </View>
                      <View style={styles.tierTextCol}>
                        <Text
                          variant="body"
                          style={[
                            styles.tierLabel,
                            isSelected && styles.tierLabelSelected,
                          ]}
                        >
                          {tier.label}
                        </Text>
                        <Text variant="caption" color="textMuted">
                          {tier.tagline}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Apply Action Button */}
              <View style={styles.actionRow}>
                <Button
                  label={
                    tempBudget === 0
                      ? 'Show All Meals'
                      : `Apply Filter (≤ ₱${tempBudget})`
                  }
                  variant="primary"
                  onPress={handleApply}
                  style={{ width: '100%' }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(34, 42, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.space4,
    paddingTop: spacing.space2,
    paddingBottom: spacing.space6,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.space3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space3,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: spacing.space2,
  },
  closeBtn: {
    padding: 4,
  },
  budgetHeroBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.space3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.space3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    marginBottom: spacing.space2,
  },
  priceText: {
    color: colors.primary,
  },
  perMealText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: spacing.space2,
    marginTop: spacing.space1,
  },
  stepperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 2,
  },
  stepperBtnText: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionLabel: {
    marginBottom: spacing.space2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tiersList: {
    gap: spacing.space2,
    marginBottom: spacing.space4,
  },
  tierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.space2,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tierItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF4F2',
  },
  tierEmojiBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.space3,
  },
  tierEmoji: {
    fontSize: 18,
  },
  tierTextCol: {
    flex: 1,
  },
  tierLabel: {
    fontWeight: '600',
  },
  tierLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  actionRow: {
    marginTop: spacing.space1,
  },
});
