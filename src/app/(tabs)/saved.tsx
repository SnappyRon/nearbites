import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAuthStore } from '@/store/useAuthStore';

export default function SavedScreen() {
  const router = useRouter();
  const { session } = useAuthStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="background" p={spacing.space4}>
        <Text variant="heading1" style={styles.header}>
          Saved Meals
        </Text>

        <Box
          flex={1}
          bg="surface"
          rounded={16}
          p={spacing.space6}
          align="center"
          justify="center"
          style={styles.emptyContainer}
        >
          <Box style={styles.mascotBadge}>
            <Text style={styles.mascotEmoji}>❤️</Text>
          </Box>
          <Text variant="heading2" align="center" style={styles.title}>
            {session ? 'No Saved Meals Yet' : 'Keep Your Favorites Close'}
          </Text>
          <Text variant="body" color="textMuted" align="center" style={styles.message}>
            {session
              ? 'Tap the heart icon on any meal detail to bookmark it for your next budget craving.'
              : 'Sign in to sync your favorite affordable eats across devices and get notified when prices update.'}
          </Text>

          {!session ? (
            <Button
              label="Sign In / Register"
              variant="primary"
              onPress={() => router.push('/(modals)/auth')}
              style={styles.actionButton}
            />
          ) : (
            <Button
              label="Explore Meals Nearby"
              variant="primary"
              onPress={() => router.push('/(tabs)')}
              style={styles.actionButton}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.space4,
  },
  emptyContainer: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  mascotBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space3,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  mascotEmoji: {
    fontSize: 28,
  },
  title: {
    marginBottom: spacing.space2,
  },
  message: {
    maxWidth: 280,
    marginBottom: spacing.space6,
  },
  actionButton: {
    minWidth: 200,
  },
});
