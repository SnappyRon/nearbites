import React from 'react';
import { StyleSheet, View } from 'react-native';
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

export default function ProfileScreen() {
  const router = useRouter();
  const { session, user, setSession } = useAuthStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="background" p={spacing.space4}>
        <Text variant="heading1" style={styles.header}>
          Profile & Settings
        </Text>

        <Card variant="surface" style={styles.profileCard}>
          <Box row align="center">
            <Box style={styles.avatar}>
              <Ionicons name="person" size={28} color={colors.primary} />
            </Box>
            <Box flex={1} ml={spacing.space3}>
              <Text variant="heading3">
                {user ? user.email : 'Neighborhood Scout'}
              </Text>
              <Text variant="caption" color="textMuted">
                {session ? 'Authenticated Scout' : 'Anonymous Explorer'}
              </Text>
            </Box>
          </Box>
        </Card>

        <Card variant="surface" style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text variant="body">Market Region</Text>
            <Text variant="body" color="primary" style={styles.boldText}>
              Philippines (Metro Manila)
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text variant="body">Price Freshness Window</Text>
            <Text variant="caption" color="fresh">
              30 Days Active
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text variant="body">App Version</Text>
            <Text variant="caption" color="textMuted">
              v1.0.0 (MVP Beta)
            </Text>
          </View>
        </Card>

        <Box mt={spacing.space6}>
          {!session ? (
            <Button
              label="Sign In / Create Account"
              variant="primary"
              onPress={() => router.push('/(modals)/auth')}
            />
          ) : (
            <Button
              label="Sign Out"
              variant="outline"
              onPress={() => setSession(null)}
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
  profileCard: {
    marginBottom: spacing.space4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsCard: {
    paddingVertical: spacing.space2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  boldText: {
    fontWeight: '600',
  },
});
