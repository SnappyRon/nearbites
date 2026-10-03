import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthModal() {
  const router = useRouter();
  const { pendingAction, clearPendingAction, setSession } = useAuthStore();

  const handleDismiss = () => {
    clearPendingAction();
    router.back();
  };

  const handleSimulateLogin = () => {
    // Progressive login mock for foundation testing
    setSession({
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'mock-user-id',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: 'scout@nearbites.ph',
      },
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="surface" p={spacing.space5} justify="space-between">
        {/* Top Dismiss Action */}
        <Box row justify="flex-end">
          <Pressable
            onPress={handleDismiss}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </Box>

        {/* Brand Explainer */}
        <Box align="center">
          <Box style={styles.mascotBadge}>
            <Text style={styles.mascotEmoji}>🦅</Text>
          </Box>
          <Text variant="heading2" align="center" style={styles.title}>
            Join the Food Scouts
          </Text>
          <Text variant="body" color="textMuted" align="center" style={styles.subtitle}>
            {pendingAction
              ? 'Sign in to complete your action and help your neighborhood discover authentic, budget-friendly meals.'
              : 'Save your favorites, verify prices in one tap, and contribute local dining gems.'}
          </Text>
        </Box>

        {/* Social / Progressive Auth Providers */}
        <Box style={styles.buttonGroup}>
          <Button
            label="Continue with Google"
            variant="outline"
            icon={<Ionicons name="logo-google" size={18} color={colors.primary} />}
            onPress={handleSimulateLogin}
            style={styles.providerButton}
          />
          <Button
            label="Continue with Apple"
            variant="outline"
            icon={<Ionicons name="logo-apple" size={18} color={colors.primary} />}
            onPress={handleSimulateLogin}
            style={styles.providerButton}
          />
          <Button
            label="Email Magic Link"
            variant="primary"
            icon={<Ionicons name="mail-outline" size={18} color={colors.surface} />}
            onPress={handleSimulateLogin}
            style={styles.providerButton}
          />
          <Text variant="caption" color="textMuted" align="center" style={styles.termsText}>
            By signing in, you agree to NearBites Terms and Privacy Policy. We never sell your location.
          </Text>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  mascotBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space4,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  mascotEmoji: {
    fontSize: 36,
  },
  title: {
    marginBottom: spacing.space2,
  },
  subtitle: {
    maxWidth: 290,
  },
  buttonGroup: {
    gap: spacing.space3,
  },
  providerButton: {
    height: 48,
  },
  termsText: {
    marginTop: spacing.space2,
    paddingHorizontal: spacing.space4,
    lineHeight: 16,
  },
});
