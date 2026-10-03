import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAuthStore } from '@/store/useAuthStore';

export default function AddMealScreen() {
  const router = useRouter();
  const { session } = useAuthStore();

  const steps = [
    { num: '1', title: 'Pick Eatery', desc: 'Select an existing venue or drop a pin on the map' },
    { num: '2', title: 'Meal Details', desc: 'Enter dish name, category, and exact price in ₱' },
    { num: '3', title: 'Snap Food Photo', desc: 'Clear, well-lit photo of the real meal' },
    { num: '4', title: 'Scout Review', desc: 'Moderation review before going live publicly' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="heading1" style={styles.header}>
          Contribute a Meal
        </Text>
        <Text variant="body" color="textMuted" style={styles.subhead}>
          Help your neighborhood discover authentic, affordable food. Every submission is reviewed by our scouts.
        </Text>

        <Card variant="surface" style={styles.stepsCard}>
          <Text variant="heading3" style={styles.stepsTitle}>
            How It Works
          </Text>
          {steps.map((step, idx) => (
            <Box key={step.num} row align="flex-start" my={spacing.space2}>
              <Box style={styles.stepBadge}>
                <Text variant="caption" color="surface" style={styles.stepNum}>
                  {step.num}
                </Text>
              </Box>
              <Box flex={1} style={styles.stepTextContainer}>
                <Text variant="body" style={styles.stepTitle}>
                  {step.title}
                </Text>
                <Text variant="caption" color="textMuted">
                  {step.desc}
                </Text>
              </Box>
            </Box>
          ))}
        </Card>

        <Box bg="surface" rounded={12} p={spacing.space4} my={spacing.space4} style={styles.noticeBox}>
          <Box row align="center" mb={spacing.space1}>
            <Ionicons name="shield-checkmark" size={18} color={colors.fresh} />
            <Text variant="caption" color="fresh" style={styles.noticeTitle}>
              Quality Guardrail
            </Text>
          </Box>
          <Text variant="caption" color="textMuted">
            To prevent spam and unappetizing uploads, submissions are staged in pending status and verified by community moderators.
          </Text>
        </Box>

        <Button
          label={session ? 'Start 4-Step Submission' : 'Sign In to Contribute'}
          variant="primary"
          onPress={() => {
            if (!session) {
              router.push('/(modals)/auth');
            } else {
              // Submission wizard active in Phase 8
            }
          }}
          style={styles.actionButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.space4,
  },
  header: {
    marginBottom: spacing.space1,
  },
  subhead: {
    marginBottom: spacing.space4,
    lineHeight: 20,
  },
  stepsCard: {
    marginBottom: spacing.space2,
  },
  stepsTitle: {
    marginBottom: spacing.space3,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.space3,
    marginTop: 2,
  },
  stepNum: {
    fontWeight: '700',
  },
  stepTextContainer: {
    paddingBottom: spacing.space2,
  },
  stepTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  noticeBox: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeTitle: {
    fontWeight: '700',
    marginLeft: spacing.space1,
  },
  actionButton: {
    marginTop: spacing.space2,
  },
});
