import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable, Platform, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useDiscoveryStore } from '@/store/useDiscoveryStore';
import { useLocation, MANILA_PILOT_CENTER } from '@/features/map/hooks/useLocation';
import { useViewportMeals } from '@/features/map/api/useViewportMeals';
import { PriceMarker } from '@/features/map/components/PriceMarker';
import { BudgetFilterBar } from '@/features/map/components/BudgetFilterBar';
import { ViewportBounds, MealMarkerPayload } from '@/features/map/types';

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

  const { activeBudget, setActiveBudget, selectedMarkerId, setSelectedMarkerId } =
    useDiscoveryStore();

  const { location, isFallback, isLoading: isLocationLoading, getInitialRegion, requestLocation } =
    useLocation();

  const [currentRegion, setCurrentRegion] = useState<Region>(getInitialRegion());
  const [debouncedBounds, setDebouncedBounds] = useState<ViewportBounds | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial camera when GPS lock or fallback completes
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        500
      );
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

  // Recenter camera smoothly to user GPS coordinates or Manila pilot center
  const handleRecenter = useCallback(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        400
      );
    }
  }, [location]);

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

  return (
    <View style={styles.container}>
      {/* Interactive PostGIS Map Canvas */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={getInitialRegion()}
        customMapStyle={NEARBITES_MAP_STYLE}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={() => setSelectedMarkerId(null)}
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

      {/* Floating Top Header Overlay */}
      <SafeAreaView style={styles.topOverlay} edges={['top']}>
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
                Location off. Showing Manila U-Belt pilot area.
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
          onOpenCustomModal={() => router.push('/(modals)/search')}
        />
      </SafeAreaView>

      {/* Bottom Floating Recenter GPS Action Button */}
      <View style={styles.bottomControls}>
        <Pressable
          style={styles.recenterButton}
          onPress={handleRecenter}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Recenter map on current location"
        >
          <Ionicons
            name={isFallback ? 'navigate-outline' : 'navigate'}
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {/* Empty State Card when Budget Filter yields 0 matches */}
      {!isMealsLoading && markers.length === 0 && (
        <View style={styles.emptyStateOverlay}>
          <Card variant="surface" style={styles.emptyCard}>
            <Box style={styles.mascotBadge}>
              <Text style={styles.mascotEmoji}>🦅</Text>
            </Box>
            <Text variant="heading3" align="center" style={styles.emptyTitle}>
              No meals under ₱{activeBudget} here
            </Text>
            <Text variant="caption" color="textMuted" align="center" style={styles.emptySubtitle}>
              Our scout couldn't spot any dishes under this budget in the visible area. Try raising your budget or exploring a wider street!
            </Text>
            <Button
              label="Reset to Under ₱150"
              variant="primary"
              onPress={() => setActiveBudget(150)}
              style={styles.resetButton}
            />
          </Card>
        </View>
      )}
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
  bottomControls: {
    position: 'absolute',
    right: spacing.space4,
    bottom: Platform.OS === 'ios' ? 104 : 80,
    zIndex: 10,
  },
  recenterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyStateOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 76,
    left: spacing.space4,
    right: spacing.space4,
    alignItems: 'center',
    zIndex: 10,
  },
  emptyCard: {
    width: '100%',
    padding: spacing.space4,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },
  mascotBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space2,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  mascotEmoji: {
    fontSize: 24,
  },
  emptyTitle: {
    marginBottom: spacing.space1,
  },
  emptySubtitle: {
    maxWidth: 280,
    marginBottom: spacing.space4,
  },
  resetButton: {
    minWidth: 180,
  },
});
