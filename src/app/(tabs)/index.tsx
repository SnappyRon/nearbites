import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Pressable, Platform, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useDiscoveryStore } from '@/store/useDiscoveryStore';
import { useLocation, DAVAO_PILOT_CENTER, MANILA_PILOT_CENTER } from '@/features/map/hooks/useLocation';
import { useViewportMeals } from '@/features/map/api/useViewportMeals';
import { PriceMarker } from '@/features/map/components/PriceMarker';
import { BudgetFilterBar } from '@/features/map/components/BudgetFilterBar';
import { MapLayersModal } from '@/features/map/components/MapLayersModal';
import { BudgetSettingsModal } from '@/features/map/components/BudgetSettingsModal';
import { ViewportBounds, MealMarkerPayload } from '@/features/map/types';
import { MealBottomSheet } from '@/features/meals/components/MealBottomSheet';
import { MealPreviewCarousel } from '@/features/meals/components/MealPreviewCarousel';
import { useMealDetail } from '@/features/meals/api/useMealDetail';

// Custom Map Style tuned to NearBites Cream & Teal palette
const NEARBITES_MAP_STYLE = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9ded9' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5ebd7' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#ede2ce' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#d8e5dd' }],
  },
];

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const insets = useSafeAreaInsets();

  const {
    activeBudget,
    setActiveBudget,
    selectedMarkerId,
    setSelectedMarkerId,
    bottomSheetState,
    pendingCameraTarget,
    setPendingCameraTarget,
    mapType,
    setLayerModalOpen,
    setBudgetModalOpen,
  } = useDiscoveryStore();

  const { location, isFallback, isLoading: isLocationLoading, getInitialRegion, requestLocation } =
    useLocation();

  const [currentRegion, setCurrentRegion] = useState<Region>(getInitialRegion());
  const [debouncedBounds, setDebouncedBounds] = useState<ViewportBounds | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animate map camera when a pending camera target is requested (e.g. from Search modal)
  useEffect(() => {
    if (pendingCameraTarget && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: pendingCameraTarget.latitude,
          longitude: pendingCameraTarget.longitude,
          latitudeDelta: pendingCameraTarget.latitudeDelta ?? currentRegion.latitudeDelta,
          longitudeDelta: pendingCameraTarget.longitudeDelta ?? currentRegion.longitudeDelta,
        },
        500
      );
      setPendingCameraTarget(null);
    }
  }, [pendingCameraTarget, currentRegion, setPendingCameraTarget]);

  // Sync initial camera when GPS lock or fallback completes
  useEffect(() => {
    if (location && mapRef.current) {
      const region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      mapRef.current.animateToRegion(region, 500);

      // Also set initial bounds so the query fires immediately
      const bounds: ViewportBounds = {
        minLat: region.latitude - region.latitudeDelta / 2,
        maxLat: region.latitude + region.latitudeDelta / 2,
        minLng: region.longitude - region.longitudeDelta / 2,
        maxLng: region.longitude + region.longitudeDelta / 2,
      };
      setDebouncedBounds(bounds);
    }
  }, [location]);

  // Debounce viewport bounding box calculation upon map camera idle (300ms)
  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      setCurrentRegion(region);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const bounds: ViewportBounds = {
          minLat: region.latitude - region.latitudeDelta / 2,
          maxLat: region.latitude + region.latitudeDelta / 2,
          minLng: region.longitude - region.longitudeDelta / 2,
          maxLng: region.longitude + region.longitudeDelta / 2,
        };
        setDebouncedBounds(bounds);
      }, 300);
    },
    []
  );

  // Fetch meals within visible bounding box
  const { data: markers = [], isLoading: isMealsLoading } = useViewportMeals(
    debouncedBounds,
    activeBudget
  );

  // Active meal detail resolved via TanStack Query from live Supabase / fallback
  const { data: selectedMeal = null } = useMealDetail(selectedMarkerId, location);
  const isExpanded = bottomSheetState === 'EXPANDED';

  // Recenter camera smoothly to user GPS coordinates or Manila pilot center
  const handleRecenter = useCallback(() => {
    if (!mapRef.current) return;
    const target = location || MANILA_PILOT_CENTER;
    mapRef.current.animateToRegion(
      {
        latitude: target.latitude,
        longitude: target.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      400
    );
  }, [location]);

  // Jump camera directly to Davao City pilot center where seed meals are located
  const handleJumpToPilot = useCallback(() => {
    if (!mapRef.current) return;
    const pilotRegion = {
      latitude: DAVAO_PILOT_CENTER.latitude,
      longitude: DAVAO_PILOT_CENTER.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045,
    };
    mapRef.current.animateToRegion(pilotRegion, 500);

    const bounds: ViewportBounds = {
      minLat: pilotRegion.latitude - pilotRegion.latitudeDelta / 2,
      maxLat: pilotRegion.latitude + pilotRegion.latitudeDelta / 2,
      minLng: pilotRegion.longitude - pilotRegion.longitudeDelta / 2,
      maxLng: pilotRegion.longitude + pilotRegion.longitudeDelta / 2,
    };
    setDebouncedBounds(bounds);
  }, []);

  // Marker selection with Northward pan offset (+80dp)
  const handleSelectMarker = useCallback(
    (marker: MealMarkerPayload) => {
      setSelectedMarkerId(marker.id);

      // Pan camera slightly south so the marker shifts Northward on screen,
      // avoiding occlusion by the Peek Bottom Sheet (~200dp)
      if (mapRef.current) {
        const latOffset = currentRegion.latitudeDelta * 0.22;
        mapRef.current.animateToRegion(
          {
            latitude: marker.latitude - latOffset,
            longitude: marker.longitude,
            latitudeDelta: currentRegion.latitudeDelta,
            longitudeDelta: currentRegion.longitudeDelta,
          },
          300
        );
      }
    },
    [currentRegion, setSelectedMarkerId]
  );

  // Switch dish from Other Meals carousel
  const handleSelectMealId = useCallback(
    (mealId: string) => {
      setSelectedMarkerId(mealId);
    },
    [setSelectedMarkerId]
  );

  return (
    <View style={styles.container}>
      {/* Interactive PostGIS Map Canvas */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={getInitialRegion()}
        mapType={mapType}
        customMapStyle={mapType === 'standard' ? NEARBITES_MAP_STYLE : undefined}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={(e) => {
          if (e.nativeEvent.action === 'marker-press') {
            return;
          }
          setSelectedMarkerId(null);
        }}
        showsUserLocation={!isFallback}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {markers.map((marker) => (
          <PriceMarker
            key={marker.id}
            marker={marker}
            isSelected={selectedMarkerId === marker.id}
            latitudeDelta={currentRegion.latitudeDelta}
            onSelect={handleSelectMarker}
          />
        ))}
      </MapView>

      {/* Floating Top Header Overlay (hidden when meal details sheet is expanded) */}
      {!isExpanded && (
        <SafeAreaView style={styles.topOverlay} edges={['top']} pointerEvents="box-none">
          {/* Search Bar & Area Fallback Indicator */}
          <Box px={spacing.space4} pt={spacing.space2} pb={spacing.space2}>
            <Pressable
              style={styles.searchBar}
              onPress={() => router.push('/(modals)/search')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Search affordable meals, dishes, or areas"
            >
              <Ionicons name="search" size={20} color={colors.primary} />
              <Text variant="body" color="textMuted" style={styles.searchText}>
                Search affordable meals, areas...
              </Text>
              {isMealsLoading && (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loadingSpinner} />
              )}
            </Pressable>
          </Box>

          {/* Non-Blocking Location Fallback Notification Banner */}
          {isFallback && (
            <Box px={spacing.space4} pb={spacing.space2}>
              <Pressable
                style={styles.fallbackBanner}
                onPress={() => router.push('/(modals)/search')}
              >
                <Ionicons name="location" size={14} color={colors.accent} />
                <Text variant="caption" color="text" style={styles.fallbackText}>
                  Location off. Showing Davao City pilot area.
                </Text>
                <Text variant="caption" color="primary" style={styles.changeAreaLink}>
                  Change Area
                </Text>
              </Pressable>
            </Box>
          )}

          {/* Horizontal Budget Filter Bar */}
          <BudgetFilterBar
            activeBudget={activeBudget}
            onSelectBudget={setActiveBudget}
            onOpenCustomModal={() => setBudgetModalOpen(true)}
          />
        </SafeAreaView>
      )}

      {/* Unified Floating Map Control Dock (Layers & Recenter - hidden when expanded) */}
      {!isExpanded && (
        <View
          style={[
            styles.mapControlDock,
            {
              bottom: selectedMarkerId ? 216 : markers.length > 0 ? 124 : 16,
            },
          ]}
          pointerEvents="box-none"
        >
          <Pressable
            style={[
              styles.dockButton,
              mapType !== 'standard' && styles.dockButtonActive,
            ]}
            onPress={() => setLayerModalOpen(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Switch map view layer"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name="layers"
              size={20}
              color={mapType !== 'standard' ? colors.surface : colors.primary}
            />
          </Pressable>

          <View style={styles.dockDivider} />

          <Pressable
            style={styles.dockButton}
            onPress={handleRecenter}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Recenter map location"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name="navigate"
              size={20}
              color={colors.primary}
            />
          </Pressable>
        </View>
      )}

      {/* Bottom Meal Discovery Carousel (when no marker is actively opened) */}
      {!selectedMarkerId && !isExpanded && markers.length > 0 && !isMealsLoading && (
        <View
          style={[
            styles.carouselWrapper,
            { bottom: 12 },
          ]}
          pointerEvents="box-none"
        >
          <MealPreviewCarousel
            meals={markers}
            selectedMealId={selectedMarkerId}
            onSelectMeal={handleSelectMarker}
          />
        </View>
      )}

      {/* Floating Area Discovery Pill when 0 matches in visible viewport */}
      {!isMealsLoading && markers.length === 0 && !selectedMarkerId && !isExpanded && debouncedBounds !== null && (
        <View
          style={[
            styles.floatingPillContainer,
            { top: insets.top + (isFallback ? 148 : 108) },
          ]}
          pointerEvents="box-none"
        >
          <Pressable
            style={styles.floatingAreaPill}
            onPress={handleJumpToPilot}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Explore Davao City Pilot Hub"
          >
            <View style={styles.floatingPillMascot}>
              <Text style={styles.floatingPillEmoji}>🦅</Text>
            </View>
            <View style={styles.floatingPillTextCol}>
              <Text variant="caption" style={styles.floatingPillTitle}>
                {activeBudget === 0 || activeBudget >= 9999
                  ? 'No meals here • Tap to explore Davao City'
                  : `No meals under ₱${activeBudget} here • View Davao Pilot`}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.surface} />
          </Pressable>
        </View>
      )}

      {/* Photo-First Meal Detail Bottom Sheet */}
      <MealBottomSheet
        meal={selectedMeal}
        onSelectMeal={handleSelectMealId}
      />

      {/* Map Layers Modal */}
      <MapLayersModal />

      {/* Budget Settings Modal */}
      <BudgetSettingsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchBar: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.space4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  searchText: {
    flex: 1,
    marginLeft: spacing.space2,
  },
  loadingSpinner: {
    marginLeft: spacing.space2,
  },
  fallbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  fallbackText: {
    marginLeft: spacing.space1,
    flex: 1,
  },
  changeAreaLink: {
    fontWeight: '700',
    marginLeft: spacing.space2,
  },
  mapControlDock: {
    position: 'absolute',
    right: spacing.space4,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  dockButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  dockButtonActive: {
    backgroundColor: colors.primary,
  },
  dockDivider: {
    width: 28,
    height: 1,
    backgroundColor: colors.border,
  },
  carouselWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
  },
  floatingPillContainer: {
    position: 'absolute',
    left: spacing.space4,
    right: spacing.space4,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingAreaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  floatingPillMascot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  floatingPillEmoji: {
    fontSize: 13,
  },
  floatingPillTextCol: {
    marginRight: 8,
  },
  floatingPillTitle: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 13,
  },
});
