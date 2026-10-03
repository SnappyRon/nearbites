import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function SearchModal() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const quickDistricts = ['University Belt', 'Kapitolyo', 'Ortigas', 'Ermita'];
  const categories = ['Silog', 'Pork Sisig', 'Pares', 'Noodles & Soup'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="background" p={spacing.space4}>
        {/* Search Input Bar */}
        <Box row align="center" style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search dish, category, or area..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        </Box>

        {/* Quick District Exploration */}
        <Box my={spacing.space4}>
          <Text variant="heading3" style={styles.sectionTitle}>
            Popular Neighborhoods
          </Text>
          <Box row style={styles.chipsRow}>
            {quickDistricts.map((district) => (
              <Pressable
                key={district}
                style={styles.chip}
                onPress={() => {
                  setQuery(district);
                }}
              >
                <Ionicons name="location-outline" size={14} color={colors.primary} />
                <Text variant="caption" style={styles.chipText}>
                  {district}
                </Text>
              </Pressable>
            ))}
          </Box>
        </Box>

        {/* Food Categories */}
        <Box mb={spacing.space4}>
          <Text variant="heading3" style={styles.sectionTitle}>
            Trending Dishes
          </Text>
          <Box row style={styles.chipsRow}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={styles.chip}
                onPress={() => {
                  setQuery(cat);
                }}
              >
                <Text style={styles.foodEmoji}>🍜</Text>
                <Text variant="caption" style={styles.chipText}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </Box>
        </Box>

        {/* Informative placeholder notice */}
        <Box flex={1} align="center" justify="center">
          <Text variant="caption" color="textMuted" align="center">
            Debounced PostGIS tripartite search hook connects in Phase 7.
          </Text>
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
  inputContainer: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.space4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    marginHorizontal: spacing.space2,
    fontSize: 15,
    color: colors.text,
  },
  sectionTitle: {
    marginBottom: spacing.space3,
  },
  chipsRow: {
    flexWrap: 'wrap',
    gap: spacing.space2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    marginLeft: spacing.space1,
    fontWeight: '600',
  },
  foodEmoji: {
    fontSize: 14,
  },
});
