import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Card } from '@/components/primitives/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useDiscoveryStore } from '@/store/useDiscoveryStore';
import { mapService } from '@/services/MapService';
import {
  UnifiedSearchResult,
  SearchDishItem,
  SearchPlaceItem,
  SearchNeighborhoodItem,
} from '@/features/map/types';
import { FEATURED_NEIGHBORHOODS } from '@/services/MockMapService';

interface FeaturedEatery {
  id: string;
  name: string;
  neighborhood: string;
  priceRange: string;
  photoUrl: string;
  signatureDish: string;
  latitude: number;
  longitude: number;
}

const FEATURED_EATERIES: FeaturedEatery[] = [
  {
    id: 'd0000001-0000-0000-0000-000000000001',
    name: "Sana's Kabawan & Bulaloan",
    neighborhood: 'Poblacion, Davao City',
    priceRange: '₱80 – ₱165',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    signatureDish: 'Crispy Kalabaw Tapa',
    latitude: 7.0742,
    longitude: 125.6143,
  },
  {
    id: 'd0000001-0000-0000-0000-000000000002',
    name: 'Bulcachong',
    neighborhood: 'Gen. Luna, Davao City',
    priceRange: '₱150 – ₱165',
    photoUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
    signatureDish: 'Carabao Bulalo Stew',
    latitude: 7.0689,
    longitude: 125.6074,
  },
  {
    id: 'd0000001-0000-0000-0000-000000000003',
    name: "Lachi's Sans Rival Atbp.",
    neighborhood: 'Marfori Heights, Davao',
    priceRange: '₱85 – ₱240',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
    signatureDish: 'Grilled Pork Ribs',
    latitude: 7.0768,
    longitude: 125.6042,
  },
  {
    id: 'd0000001-0000-0000-0000-000000000004',
    name: "Romeo's Sisigan sa Dakbayan",
    neighborhood: 'Barrio Obrero, Davao',
    priceRange: '₱80 – ₱125',
    photoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&q=80',
    signatureDish: 'Sizzling Pork Sisig',
    latitude: 7.0818,
    longitude: 125.6186,
  },
  {
    id: 'd0000001-0000-0000-0000-000000000010',
    name: 'Del Mar Painitan Bankerohan',
    neighborhood: 'Bankerohan Market, Davao',
    priceRange: '₱20 – ₱75',
    photoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80',
    signatureDish: 'Puto Maya & Hot Sikwate',
    latitude: 7.0645,
    longitude: 125.6033,
  },
  {
    id: 'd0000001-0000-0000-0000-000000000005',
    name: 'TAPS Davao',
    neighborhood: 'Bolton St, Davao City',
    priceRange: '₱85 – ₱110',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    signatureDish: 'Crispy Lekasilog',
    latitude: 7.0674,
    longitude: 125.6062,
  },
  {
    id: 'd0000001-0000-0000-0000-000000000006',
    name: 'Luz Kinilaw Place',
    neighborhood: 'Salmonan, Davao City',
    priceRange: '₱200 – ₱250',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    signatureDish: 'Yellowfin Tuna Kinilaw',
    latitude: 7.0632,
    longitude: 125.6158,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000001',
    name: "Ate Fe's Lutong Bahay",
    neighborhood: 'Ermita, Manila',
    priceRange: '₱50 – ₱99',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
    signatureDish: 'Crispy Sisig w/ Rice',
    latitude: 14.5995,
    longitude: 120.9842,
  },
];

const FOOD_CATEGORIES = [
  { name: 'Silog', emoji: '🍳' },
  { name: 'Rice Meals', emoji: '🍛' },
  { name: 'Noodles & Soup', emoji: '🍜' },
  { name: 'Street Food & BBQ', emoji: '🍢' },
  { name: 'Snacks & Merienda', emoji: '🥟' },
];

export default function SearchModal() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const {
    userLocation,
    setSelectedMealId,
    setSelectedMarkerId,
    setPendingCameraTarget,
  } = useDiscoveryStore();

  // 300ms debouncing of search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputText.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [inputText]);

  // Query search_food_and_places RPC via canonical mapService
  const { data: searchResults, isLoading, isFetching } = useQuery<UnifiedSearchResult>({
    queryKey: ['search', debouncedQuery, userLocation?.latitude, userLocation?.longitude],
    queryFn: async () => {
      return mapService.searchFoodAndPlaces(debouncedQuery, userLocation, 10);
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const dishes = useMemo(() => searchResults?.dishes ?? [], [searchResults]);
  const places = useMemo(() => searchResults?.places ?? [], [searchResults]);
  const neighborhoods = useMemo(() => {
    if (debouncedQuery.length === 0) {
      return FEATURED_NEIGHBORHOODS;
    }
    return searchResults?.neighborhoods ?? [];
  }, [searchResults, debouncedQuery]);

  const hasResults = dishes.length > 0 || places.length > 0 || neighborhoods.length > 0;
  const isSearchActive = debouncedQuery.length > 0;
  const isSearching = isSearchActive && (isLoading || isFetching);

  // Quick preset pills when search input is empty
  const trendingDishes = [
    'Kalabaw Tapa',
    'Bulcachong',
    'Tuna Kinilaw',
    'Pork Sisig',
    'Puto Maya & Sikwate',
    'Lekasilog',
    'Durian Pie',
    'Beef Tapsilog',
  ];

  // Selection handlers
  const handleSelectDish = useCallback(
    (dish: SearchDishItem) => {
      Keyboard.dismiss();
      // Apply Northward pan offset (+80dp / ~22% latitude delta) so the peek bottom sheet does not occlude the marker
      const latOffset = 0.015 * 0.22;
      setPendingCameraTarget({
        latitude: dish.latitude - latOffset,
        longitude: dish.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
      setSelectedMealId(dish.id);
      router.back();
    },
    [setPendingCameraTarget, setSelectedMealId, router]
  );

  const handleSelectPlace = useCallback(
    (place: SearchPlaceItem) => {
      Keyboard.dismiss();
      setSelectedMarkerId(null);
      setPendingCameraTarget({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      });
      router.back();
    },
    [setPendingCameraTarget, setSelectedMarkerId, router]
  );

  const handleSelectNeighborhood = useCallback(
    (hood: SearchNeighborhoodItem) => {
      Keyboard.dismiss();
      setSelectedMarkerId(null);
      setPendingCameraTarget({
        latitude: hood.latitude,
        longitude: hood.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      router.back();
    },
    [setPendingCameraTarget, setSelectedMarkerId, router]
  );

  const formatDistance = (meters?: number | null): string => {
    if (!meters || meters <= 0) return '';
    if (meters < 1000) {
      return `${Math.round(meters)}m away`;
    }
    return `${(meters / 1000).toFixed(1)} km away`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Modal Drag Grabber Handle */}
      <View style={styles.dragHandle} />

      {/* Search Header Bar */}
      <Box px={spacing.space4} pt={spacing.space1} pb={spacing.space3}>
        <Box row align="center" style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
          <TextInput
            autoFocus
            value={inputText}
            onChangeText={setInputText}
            placeholder="Search dish, carinderia, or area..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessible={true}
            accessibilityLabel="Search input field"
          />
          {inputText.length > 0 && (
            <Pressable
              onPress={() => {
                setInputText('');
                setDebouncedQuery('');
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clearButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
          <Pressable
            onPress={() => router.back()}
            style={styles.cancelButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel search and return to map"
          >
            <Text variant="body" color="primary" style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </Box>
      </Box>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Active Searching Spinner State */}
        {isSearching && (
          <Box row align="center" justify="center" py={spacing.space5}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text variant="caption" color="textMuted" style={styles.searchingText}>
              Searching affordable dishes & places...
            </Text>
          </Box>
        )}

        {/* 1. Empty / Idle State: Quick Discovery Hub */}
        {!isSearchActive && (
          <>
            {/* Featured Authentic Carinderias with Storefront Photos */}
            <Box mb={spacing.space4}>
              <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                FEATURED AFFORDABLE EATERIES
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredListContainer}
              >
                {FEATURED_EATERIES.map((eatery) => (
                  <Pressable
                    key={eatery.id}
                    style={styles.featuredCard}
                    onPress={() =>
                      handleSelectPlace({
                        id: eatery.id,
                        name: eatery.name,
                        address: eatery.neighborhood,
                        latitude: eatery.latitude,
                        longitude: eatery.longitude,
                      })
                    }
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Explore ${eatery.name}`}
                  >
                    <Image
                      source={{ uri: eatery.photoUrl }}
                      style={styles.featuredCardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.featuredCardBody}>
                      <Text variant="body" numberOfLines={1} style={styles.featuredCardName}>
                        {eatery.name}
                      </Text>
                      <Text variant="caption" color="textMuted" numberOfLines={1}>
                        {eatery.neighborhood}
                      </Text>
                      <View style={styles.featuredPriceTag}>
                        <Text variant="caption" style={styles.featuredPriceText}>
                          {eatery.priceRange}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </Box>

            {/* Popular Davao & Metro Manila Food Districts */}
            <Box mb={spacing.space4}>
              <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                POPULAR NEIGHBORHOODS & DISTRICTS
              </Text>
              <Box row style={styles.chipsContainer}>
                {FEATURED_NEIGHBORHOODS.map((hood) => (
                  <Pressable
                    key={hood.id}
                    style={styles.hoodChip}
                    onPress={() => handleSelectNeighborhood(hood)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Explore neighborhood ${hood.name}`}
                  >
                    <Ionicons name="location-sharp" size={14} color={colors.accent} />
                    <Text variant="caption" color="text" style={styles.hoodChipText}>
                      {hood.name}
                    </Text>
                  </Pressable>
                ))}
              </Box>
            </Box>

            {/* Browse by Food Category */}
            <Box mb={spacing.space4}>
              <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                BROWSE BY FOOD CATEGORY
              </Text>
              <Box row style={styles.chipsContainer}>
                {FOOD_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.name}
                    style={styles.trendingChip}
                    onPress={() => {
                      setInputText(cat.name);
                      setDebouncedQuery(cat.name);
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter by ${cat.name}`}
                  >
                    <Text style={styles.dishEmoji}>{cat.emoji}</Text>
                    <Text variant="caption" color="text" style={styles.hoodChipText}>
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </Box>
            </Box>

            {/* Trending Student & Budget Dishes */}
            <Box mb={spacing.space4}>
              <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                TRENDING AFFORDABLE DISHES
              </Text>
              <Box row style={styles.chipsContainer}>
                {trendingDishes.map((dishName) => (
                  <Pressable
                    key={dishName}
                    style={styles.trendingChip}
                    onPress={() => {
                      setInputText(dishName);
                      setDebouncedQuery(dishName);
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Search for ${dishName}`}
                  >
                    <Text style={styles.dishEmoji}>🍛</Text>
                    <Text variant="caption" color="text" style={styles.hoodChipText}>
                      {dishName}
                    </Text>
                  </Pressable>
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* 2. Tripartite Search Results */}
        {isSearchActive && !isSearching && (
          <>
            {/* Section A: MEALS / DISHES */}
            {dishes.length > 0 && (
              <Box mb={spacing.space4}>
                <Box row align="center" justify="space-between" mb={spacing.space2}>
                  <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                    AFFORDABLE MEALS ({dishes.length})
                  </Text>
                </Box>
                {dishes.map((dish) => (
                  <Pressable
                    key={`dish-${dish.id}`}
                    style={({ pressed }) => [
                      styles.resultItem,
                      pressed && styles.resultItemPressed,
                    ]}
                    onPress={() => handleSelectDish(dish)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Meal: ${dish.title}, Price: ₱${dish.price}, at ${dish.venueName}`}
                  >
                    <Box style={styles.mealIconBadge}>
                      <Text style={styles.resultItemEmoji}>🍲</Text>
                    </Box>
                    <Box flex={1} ml={spacing.space3}>
                      <Text variant="body" color="text" numberOfLines={1} style={styles.itemTitle}>
                        {dish.title}
                      </Text>
                      <Text variant="caption" color="textMuted" numberOfLines={1}>
                        {dish.venueName} • {dish.category}
                      </Text>
                    </Box>
                    <View style={styles.pricePill}>
                      <Text variant="caption" color="surface" style={styles.pricePillText}>
                        ₱{dish.price}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </Box>
            )}

            {/* Section B: PLACES / EATERIES */}
            {places.length > 0 && (
              <Box mb={spacing.space4}>
                <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                  PLACES & EATERIES ({places.length})
                </Text>
                {places.map((place) => (
                  <Pressable
                    key={`place-${place.id}`}
                    style={({ pressed }) => [
                      styles.resultItem,
                      pressed && styles.resultItemPressed,
                    ]}
                    onPress={() => handleSelectPlace(place)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Eatery: ${place.name}, ${place.address}`}
                  >
                    {place.coverPhotoUrl ? (
                      <Image
                        source={{ uri: place.coverPhotoUrl }}
                        style={styles.placeImageThumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <Box style={styles.placeIconBadge}>
                        <Ionicons name="storefront" size={18} color={colors.primary} />
                      </Box>
                    )}
                    <Box flex={1} ml={spacing.space3}>
                      <Text variant="body" color="text" numberOfLines={1} style={styles.itemTitle}>
                        {place.name}
                      </Text>
                      <Text variant="caption" color="textMuted" numberOfLines={1}>
                        {place.address}
                      </Text>
                    </Box>
                    {place.distanceMeters !== undefined && place.distanceMeters !== null && (
                      <Text variant="caption" color="accent" style={styles.distanceBadge}>
                        {formatDistance(place.distanceMeters)}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </Box>
            )}

            {/* Section C: NEIGHBORHOODS */}
            {neighborhoods.length > 0 && (
              <Box mb={spacing.space4}>
                <Text variant="caption" color="textMuted" style={styles.sectionHeaderTitle}>
                  NEIGHBORHOODS ({neighborhoods.length})
                </Text>
                {neighborhoods.map((hood) => (
                  <Pressable
                    key={`hood-${hood.id}`}
                    style={({ pressed }) => [
                      styles.resultItem,
                      pressed && styles.resultItemPressed,
                    ]}
                    onPress={() => handleSelectNeighborhood(hood)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Neighborhood: ${hood.name}, ${hood.description}`}
                  >
                    <Box style={styles.hoodIconBadge}>
                      <Ionicons name="location" size={18} color={colors.accent} />
                    </Box>
                    <Box flex={1} ml={spacing.space3}>
                      <Text variant="body" color="text" numberOfLines={1} style={styles.itemTitle}>
                        {hood.name}
                      </Text>
                      <Text variant="caption" color="textMuted" numberOfLines={1}>
                        {hood.description}
                      </Text>
                    </Box>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  </Pressable>
                ))}
              </Box>
            )}

            {/* 3. Empty Search Results State */}
            {!hasResults && (
              <Box align="center" justify="center" py={spacing.space6} px={spacing.space4}>
                <Card variant="surface" style={styles.emptyCard}>
                  <Box style={styles.mascotBadge}>
                    <Text style={styles.mascotEmoji}>🦅</Text>
                  </Box>
                  <Text variant="heading3" align="center" style={styles.emptyTitle}>
                    No affordable dishes found
                  </Text>
                  <Text variant="caption" color="textMuted" align="center" style={styles.emptySubtitle}>
                    We couldn't spot any dishes or eateries matching "{inputText}". Try checking for typos or explore nearby student areas.
                  </Text>
                  <Pressable
                    style={styles.resetButton}
                    onPress={() => {
                      setInputText('');
                      setDebouncedQuery('');
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search query"
                  >
                    <Text variant="body" color="surface" style={styles.resetButtonText}>
                      Clear Search
                    </Text>
                  </Pressable>
                </Card>
              </Box>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  searchBarContainer: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.space3,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.space2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
    height: 48,
  },
  clearButton: {
    padding: spacing.space1,
    marginRight: spacing.space2,
  },
  cancelButton: {
    paddingHorizontal: spacing.space2,
    paddingVertical: spacing.space1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.space4,
    paddingBottom: spacing.space6,
  },
  searchingText: {
    marginLeft: spacing.space2,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: spacing.space2,
  },
  chipsContainer: {
    flexWrap: 'wrap',
    gap: spacing.space2,
  },
  hoodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  hoodChipText: {
    marginLeft: spacing.space1,
    fontWeight: '600',
  },
  dishEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  featuredListContainer: {
    paddingRight: spacing.space4,
    gap: spacing.space3,
    paddingVertical: spacing.space1,
  },
  featuredCard: {
    width: 160,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  featuredCardImage: {
    width: '100%',
    height: 90,
    backgroundColor: colors.border,
  },
  featuredCardBody: {
    padding: 10,
  },
  featuredCardName: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 2,
  },
  featuredPriceTag: {
    marginTop: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredPriceText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  placeImageThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space3,
    borderRadius: 12,
    marginBottom: spacing.space2,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52, // Touch target ≥ 44pt
  },
  resultItemPressed: {
    backgroundColor: '#EBE2D0',
  },
  mealIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAE1CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCE9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoodIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8EAD7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultItemEmoji: {
    fontSize: 18,
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  pricePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.space2,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pricePillText: {
    fontWeight: '700',
    fontSize: 13,
  },
  distanceBadge: {
    fontWeight: '600',
  },
  emptyCard: {
    padding: spacing.space5,
    alignItems: 'center',
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mascotBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAE1CE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space3,
  },
  mascotEmoji: {
    fontSize: 28,
  },
  emptyTitle: {
    color: colors.primary,
    marginBottom: spacing.space2,
  },
  emptySubtitle: {
    lineHeight: 18,
    marginBottom: spacing.space4,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    borderRadius: 20,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontWeight: '700',
  },
});
