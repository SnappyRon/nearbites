import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MealDetail } from '../types';
import { MealThumbnail } from './MealThumbnail';
import { DirectionsButton } from './DirectionsButton';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';

export interface MealPeekViewProps {
  meal: MealDetail;
  onExpand: () => void;
}

export const MealPeekView: React.FC<MealPeekViewProps> = ({ meal, onExpand }) => {
  const formatProximity = (meters: number | null | undefined): string => {
    if (!meters && meters !== 0) return 'Nearby';
    if (meters < 1000) {
      const walkMinutes = Math.max(1, Math.round(meters / 80));
      return `${meters}m (${walkMinutes} min walk)`;
    }
    const km = (meters / 1000).toFixed(1);
    return `${km}km`;
  };

  const proximityText = formatProximity(meal.distanceMeters);

  return (
    <Pressable
      onPress={onExpand}
      style={styles.container}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`View full details for ${meal.title}, ₱${meal.price} at ${meal.restaurantName}`}
    >
      {/* Left: 1:1 Food Photo Thumbnail */}
      <MealThumbnail
        uri={meal.heroPhotoUrl}
        category={meal.category}
        size={96}
        borderRadius={12}
      />

      {/* Right Content Column */}
      <View style={styles.contentColumn}>
        {/* Meal Title & Proximity */}
        <View style={styles.headerBlock}>
          <Text
            variant="heading3"
            numberOfLines={2}
            style={styles.title}
          >
            {meal.title}
          </Text>
          <Text
            variant="caption"
            color="textMuted"
            numberOfLines={1}
            style={styles.venueSubtitle}
          >
            {meal.restaurantName} • {proximityText}
          </Text>
        </View>

        {/* Bottom Row: Price Pill & Directions CTA */}
        <View style={styles.actionRow}>
          <View style={styles.pricePill}>
            <Text variant="priceBadge" style={styles.priceText}>
              ₱{meal.price}
            </Text>
          </View>

          <DirectionsButton
            latitude={meal.latitude}
            longitude={meal.longitude}
            venueName={meal.restaurantName}
            label="Directions"
            style={styles.directionsBtn}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  contentColumn: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    minHeight: 96,
  },
  headerBlock: {
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    color: colors.text,
  },
  venueSubtitle: {
    fontSize: 13,
    marginTop: 3,
    color: colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pricePill: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  priceText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  directionsBtn: {
    height: 38,
    minHeight: 38,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
});
