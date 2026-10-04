import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { MealMarkerPayload } from '@/features/map/types';
import { LocationCoords } from '@/store/useDiscoveryStore';
import { mapService } from '@/services/MapService';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface MealPeekSheetProps {
  marker: MealMarkerPayload | null;
  userLocation: LocationCoords | null;
  onClose: () => void;
  onFavorite?: (marker: MealMarkerPayload) => void;
  isFavorited?: boolean;
}

export const MealPeekSheet: React.FC<MealPeekSheetProps> = ({
  marker,
  userLocation,
  onClose,
  onFavorite,
  isFavorited = false,
}) => {
  const slideAnim = useRef(new Animated.Value(260)).current;

  useEffect(() => {
    if (marker) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 160,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 260,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [marker, slideAnim]);

  if (!marker) {
    return null;
  }

  // Calculate distance & walking duration
  let distanceText = '';
  if (userLocation) {
    const meters = mapService.calculateDistanceMeters(userLocation, {
      latitude: marker.latitude,
      longitude: marker.longitude,
    });
    const minutes = Math.max(1, Math.round(meters / 80));
    distanceText = meters >= 1000
      ? `${(meters / 1000).toFixed(1)}km (${minutes}m walk)`
      : `${meters}m (${minutes}m walk)`;
  }

  // Launch Native Maps (Apple Maps on iOS / Google Maps on Android)
  const handleGetDirections = () => {
    const lat = marker.latitude;
    const lng = marker.longitude;
    const label = encodeURIComponent(`${marker.restaurantName} - ${marker.title}`);

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    Linking.openURL(url).catch(() => {
      // Fallback to web Google Maps
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    });
  };

  const freshnessLabel =
    marker.freshnessTier === 'fresh'
      ? 'Verified < 30d'
      : marker.freshnessTier === 'aging'
      ? 'Verified 30-90d'
      : 'Price unverified';

  const freshnessColor =
    marker.freshnessTier === 'fresh'
      ? colors.fresh
      : marker.freshnessTier === 'aging'
      ? colors.accent
      : colors.textMuted;

  return (
    <Animated.View
      style={[
        styles.sheetContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Drag Affordance Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.handleBar} />
      </View>

      {/* Main Content Layout */}
      <View style={styles.contentRow}>
        {/* 1:1 Thumbnail (96x96 pt) */}
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: marker.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {/* Category glyph overlay badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{marker.category}</Text>
          </View>
        </View>

        {/* Meal Details & Metadata */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text
              variant="heading3"
              numberOfLines={2}
              style={styles.dishTitle}
            >
              {marker.title}
            </Text>
            {onFavorite && (
              <Pressable
                onPress={() => onFavorite(marker)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.favoriteButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Ionicons
                  name={isFavorited ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorited ? colors.warning : colors.textMuted}
                />
              </Pressable>
            )}
          </View>

          {/* Venue & Proximity */}
          <Text
            variant="caption"
            color="textMuted"
            numberOfLines={1}
            style={styles.venueText}
          >
            {marker.restaurantName}
            {distanceText ? ` • ${distanceText}` : ''}
          </Text>

          {/* Freshness Status */}
          <View style={styles.freshnessRow}>
            <View
              style={[
                styles.freshnessDot,
                { backgroundColor: freshnessColor },
              ]}
            />
            <Text
              variant="caption"
              style={[styles.freshnessText, { color: freshnessColor }]}
            >
              {freshnessLabel}
            </Text>
          </View>

          {/* Price Pill & Direction CTA */}
          <View style={styles.actionRow}>
            <View style={styles.pricePill}>
              <Text variant="priceHero" color="text" style={styles.priceText}>
                ₱{marker.price}
              </Text>
            </View>

            <Button
              label="Directions"
              variant="primary"
              icon={<Ionicons name="navigate" size={16} color={colors.surface} />}
              onPress={handleGetDirections}
              style={styles.directionsButton}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 88 : 64, // Placed directly above Bottom Tab Bar
    left: spacing.space3,
    right: spacing.space3,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.space4,
    paddingBottom: spacing.space4,
    paddingTop: spacing.space2,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.space1,
    marginBottom: spacing.space2,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  contentRow: {
    flexDirection: 'row',
  },
  thumbnailContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  thumbnail: {
    width: 96,
    height: 96,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(34, 42, 40, 0.72)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: spacing.space3,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishTitle: {
    flex: 1,
    color: colors.text,
    lineHeight: 20,
    marginRight: spacing.space2,
  },
  favoriteButton: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  venueText: {
    marginTop: 2,
  },
  freshnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  freshnessDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  freshnessText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  pricePill: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.space3,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  directionsButton: {
    minHeight: 38,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space1,
    borderRadius: 10,
  },
});
