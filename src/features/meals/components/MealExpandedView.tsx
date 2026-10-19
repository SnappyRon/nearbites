import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Share,
  Alert,
  Image,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MealDetail } from '../types';
import { PhotoCarousel } from './PhotoCarousel';
import { PriceFreshnessBadge } from './PriceFreshnessBadge';
import { DirectionsButton } from './DirectionsButton';
import { OtherMealsRow } from './OtherMealsRow';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/components/primitives/Card';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';

export interface MealExpandedViewProps {
  meal: MealDetail;
  onCollapseToPeek: () => void;
  onSelectOtherMeal: (mealId: string) => void;
}

export const MealExpandedView: React.FC<MealExpandedViewProps> = ({
  meal,
  onCollapseToPeek,
  onSelectOtherMeal,
}) => {
  const router = useRouter();
  const { session, setPendingAction } = useAuthStore();

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [hasConfirmedPrice, setHasConfirmedPrice] = useState<boolean>(false);

  // Handle Favorite Toggle with Progressive Auth Check
  const handleToggleFavorite = () => {
    if (!session) {
      setPendingAction({ type: 'FAVORITE', mealId: meal.id });
      router.push('/(modals)/auth');
      return;
    }

    setIsFavorited((prev) => !prev);
  };

  // Handle Share Meal Link
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${meal.title} for only ₱${meal.price} at ${meal.restaurantName} on NearBites!`,
        title: `${meal.title} • NearBites`,
      });
    } catch (error) {
      console.warn('[NearBites Share] Error sharing meal:', error);
    }
  };

  // Handle Confirm Price
  const handleConfirmPrice = () => {
    if (!session) {
      setPendingAction({ type: 'CONFIRM_PRICE', mealId: meal.id });
      router.push('/(modals)/auth');
      return;
    }

    setHasConfirmedPrice(true);
    Alert.alert(
      'Thank You, Food Scout! 🦅',
      `You verified that ${meal.title} is still ₱${meal.price}. Your update keeps NearBites reliable for everyone!`
    );
  };

  // Handle Suggest Price Correction
  const handleSuggestCorrection = () => {
    if (!session) {
      setPendingAction({ type: 'CORRECTION', mealId: meal.id });
      router.push('/(modals)/auth');
      return;
    }

    Alert.alert(
      'Price Correction',
      'Community price correction submissions will open in Phase 8.'
    );
  };

  // Handle Report
  const handleReport = () => {
    if (!session) {
      setPendingAction({ type: 'REPORT', targetId: meal.id, targetType: 'meal' });
      router.push('/(modals)/auth');
      return;
    }

    Alert.alert('Report Listing', 'Thank you. Our moderation team has been notified.');
  };

  const formatDistance = (meters: number | null | undefined): string => {
    if (!meters && meters !== 0) return 'Nearby';
    if (meters < 1000) return `${meters}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  return (
    <View style={styles.container}>
      {/* Top Floating Action Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={onCollapseToPeek}
          style={styles.iconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back to peek view"
        >
          <Ionicons name="chevron-down" size={24} color={colors.text} />
        </Pressable>

        <Text
          variant="caption"
          color="textMuted"
          numberOfLines={1}
          style={styles.topBarTitle}
        >
          {meal.restaurantName}
        </Text>

        <View style={styles.topRightActions}>
          <Pressable
            onPress={handleToggleFavorite}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFavorited ? 'Remove from saved' : 'Save meal'}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorited ? colors.accent : colors.text}
            />
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Share meal"
          >
            <Ionicons name="share-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Scrollable Expanded Content */}
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 16:9 High-Res Hero Photo Carousel */}
        <PhotoCarousel
          photos={meal.additionalPhotos}
          category={meal.category}
        />

        {/* Dish Title & Hero Price Header */}
        <View style={styles.dishHeader}>
          <View style={styles.dishTitleCol}>
            <Text variant="heading2" style={styles.mealTitle}>
              {meal.title}
            </Text>
            <Text variant="caption" color="textMuted" style={styles.categoryText}>
              {meal.category} • Philippine Street & Eatery Classic
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text variant="priceHero" style={styles.priceHeroText}>
              ₱{meal.price}
            </Text>
          </View>
        </View>

        {/* Meal Description */}
        {meal.description ? (
          <Text variant="body" color="text" style={styles.description}>
            {meal.description}
          </Text>
        ) : null}

        {/* Price Freshness Verification Badge */}
        <View style={styles.badgeWrapper}>
          <PriceFreshnessBadge
            freshnessTier={meal.freshnessTier}
            daysAgo={meal.daysAgo}
            confirmedBy={meal.confirmedBy}
          />
        </View>

        {/* Community Verification Action Row */}
        <View style={styles.communityActionRow}>
          <Pressable
            onPress={handleConfirmPrice}
            style={[
              styles.communityButton,
              hasConfirmedPrice && styles.communityButtonConfirmed,
            ]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={hasConfirmedPrice ? 'checkmark' : 'thumbs-up-outline'}
              size={15}
              color={hasConfirmedPrice ? colors.fresh : colors.primary}
            />
            <Text
              variant="caption"
              style={[
                styles.communityButtonText,
                hasConfirmedPrice && styles.communityButtonTextConfirmed,
              ]}
            >
              {hasConfirmedPrice ? 'Price Verified!' : 'Confirm Price'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSuggestCorrection}
            style={styles.communityButtonSecondary}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="create-outline" size={15} color={colors.textMuted} />
            <Text variant="caption" color="textMuted" style={styles.communityButtonText}>
              Suggest Correction
            </Text>
          </Pressable>
        </View>

        {/* Primary Full-Width Turn-by-Turn Navigation Button */}
        <View style={styles.directionsWrapper}>
          <DirectionsButton
            latitude={meal.latitude}
            longitude={meal.longitude}
            venueName={meal.restaurantName}
            label="Get Turn-by-Turn Directions"
            fullWidth
          />
        </View>

        {/* Venue Information Card with Storefront Photo */}
        <Card variant="surface" style={styles.venueCard}>
          {meal.restaurantCoverPhotoUrl ? (
            <View style={styles.venueImageWrapper}>
              <Image
                source={{ uri: meal.restaurantCoverPhotoUrl }}
                style={styles.venueCoverImage}
                resizeMode="cover"
              />
              <View style={styles.storefrontTag}>
                <Ionicons name="storefront" size={12} color={colors.surface} />
                <Text style={styles.storefrontTagText}>Storefront Preview</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.venueBody}>
            <View style={styles.venueHeader}>
              <View style={styles.venueIcon}>
                <Ionicons name="restaurant" size={20} color={colors.primary} />
              </View>
              <View style={styles.venueTitleCol}>
                <View style={styles.venueNameRow}>
                  <Text variant="heading3" style={styles.venueName}>
                    {meal.restaurantName}
                  </Text>
                  {meal.isVerifiedVenue && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={colors.primary}
                      style={styles.verifiedIcon}
                    />
                  )}
                </View>
                <Text variant="caption" color="textMuted" style={styles.venueAddress}>
                  {meal.restaurantAddress} • {formatDistance(meal.distanceMeters)}
                </Text>
              </View>
            </View>

            <View style={styles.venueDivider} />

            <View style={styles.venueMetaRow}>
              <Ionicons name="time-outline" size={16} color={colors.fresh} />
              <Text variant="caption" style={styles.hoursText}>
                {meal.isOpenNow ? 'Open Now' : 'Closed'} • {meal.openingHours}
              </Text>
            </View>
          </View>
        </Card>

        {/* Other Affordable Dishes at this Venue */}
        <OtherMealsRow
          meals={meal.otherMeals}
          restaurantName={meal.restaurantName}
          onSelectMeal={onSelectOtherMeal}
        />

        {/* Report Affordance */}
        <Pressable
          onPress={handleReport}
          style={styles.reportRow}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="flag-outline" size={14} color={colors.textMuted} />
          <Text variant="caption" color="textMuted" style={styles.reportText}>
            Report an issue with this meal or price
          </Text>
        </Pressable>
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dishTitleCol: {
    flex: 1,
    paddingRight: 12,
  },
  mealTitle: {
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
  },
  categoryText: {
    marginTop: 4,
  },
  priceContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  priceHeroText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 22,
  },
  description: {
    marginTop: 8,
    marginBottom: 14,
    lineHeight: 22,
    fontSize: 14,
  },
  badgeWrapper: {
    marginBottom: 12,
  },
  communityActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  communityButton: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
  },
  communityButtonConfirmed: {
    backgroundColor: colors.freshLight,
    borderColor: colors.fresh,
  },
  communityButtonSecondary: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
  },
  communityButtonText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 12,
    color: colors.primary,
  },
  communityButtonTextConfirmed: {
    color: colors.fresh,
    fontWeight: '700',
  },
  directionsWrapper: {
    marginBottom: 18,
  },
  venueCard: {
    padding: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  venueImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  venueCoverImage: {
    width: '100%',
    height: 120,
  },
  storefrontTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(34, 42, 40, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storefrontTagText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  venueBody: {
    padding: 14,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  venueTitleCol: {
    flex: 1,
  },
  venueNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueName: {
    fontWeight: '700',
    fontSize: 15,
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  venueAddress: {
    marginTop: 2,
    fontSize: 12,
  },
  venueDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  venueMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    marginLeft: 6,
    color: colors.fresh,
    fontWeight: '600',
    fontSize: 12,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  reportText: {
    marginLeft: 6,
    textDecorationLine: 'underline',
    fontSize: 12,
  },
});
