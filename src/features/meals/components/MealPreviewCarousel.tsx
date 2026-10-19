import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/primitives/Text';
import { MealMarkerPayload } from '@/features/map/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export interface MealPreviewCarouselProps {
  meals: MealMarkerPayload[];
  selectedMealId: string | null;
  onSelectMeal: (meal: MealMarkerPayload) => void;
}

const CARD_WIDTH = 260;
const CARD_GAP = 12;

export const MealPreviewCarousel: React.FC<MealPreviewCarouselProps> = ({
  meals,
  selectedMealId,
  onSelectMeal,
}) => {
  const scrollRef = useRef<ScrollView | null>(null);

  // Auto-scroll to selected meal when marker is tapped on map
  useEffect(() => {
    if (!selectedMealId || meals.length === 0) return;
    const index = meals.findIndex((m) => m.id === selectedMealId);
    if (index >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: index * (CARD_WIDTH + CARD_GAP),
        animated: true,
      });
    }
  }, [selectedMealId, meals]);

  if (meals.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {meals.map((meal) => {
          const isSelected = selectedMealId === meal.id;
          return (
            <Pressable
              key={meal.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => onSelectMeal(meal)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${meal.title} at ${meal.restaurantName} for ₱${meal.price}`}
            >
              <Image
                source={{ uri: meal.thumbnailUrl }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text
                  variant="body"
                  numberOfLines={1}
                  style={styles.title}
                >
                  {meal.title}
                </Text>
                <Text
                  variant="caption"
                  color="textMuted"
                  numberOfLines={1}
                  style={styles.restaurantName}
                >
                  {meal.restaurantName}
                </Text>
                <View style={styles.metaRow}>
                  <View style={[styles.priceTag, isSelected && styles.priceTagSelected]}>
                    <Text variant="caption" style={styles.priceText}>
                      ₱{Math.round(meal.price)}
                    </Text>
                  </View>
                  <Text variant="caption" color="textMuted" style={styles.categoryBadge}>
                    {meal.category}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
  },
  scrollContent: {
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
  },
  card: {
    width: CARD_WIDTH,
    height: 86,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 8,
    marginRight: CARD_GAP,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  cardSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
  },
  restaurantName: {
    fontSize: 11,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  priceTag: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 6,
  },
  priceTagSelected: {
    backgroundColor: colors.accent,
  },
  priceText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 11,
  },
  categoryBadge: {
    fontSize: 10,
  },
});
