import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';
import { OtherMealItem } from '../types';

export interface OtherMealsRowProps {
  meals: OtherMealItem[];
  restaurantName: string;
  onSelectMeal: (mealId: string) => void;
}

export const OtherMealsRow: React.FC<OtherMealsRowProps> = ({
  meals,
  restaurantName,
  onSelectMeal,
}) => {
  if (!meals || meals.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="caption" color="textMuted" style={styles.sectionHeader}>
        MORE BUDGET DISHES AT {restaurantName.toUpperCase()}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {meals.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelectMeal(item.id)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}, ₱${item.price}`}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>

            <View style={styles.info}>
              <Text
                variant="caption"
                numberOfLines={2}
                style={styles.itemTitle}
              >
                {item.title}
              </Text>
              <View style={styles.pricePill}>
                <Text variant="caption" style={styles.priceText}>
                  ₱{item.price}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    fontSize: 11,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: 85,
    backgroundColor: colors.background,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 8,
    justifyContent: 'space-between',
    minHeight: 64,
  },
  itemTitle: {
    fontWeight: '600',
    color: colors.text,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 12,
  },
});
