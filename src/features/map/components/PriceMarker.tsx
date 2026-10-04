import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Marker } from 'react-native-maps';
import { MealMarkerPayload } from '@/features/map/types';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';

export interface PriceMarkerProps {
  marker: MealMarkerPayload;
  isSelected: boolean;
  latitudeDelta: number;
  onSelect: (marker: MealMarkerPayload) => void;
}

const getCategoryGlyph = (category: string): string => {
  switch (category) {
    case 'Noodles & Soup':
      return '🍜';
    case 'Silog':
      return '🍳';
    case 'Street Food & BBQ':
      return '🍢';
    case 'Snacks & Merienda':
      return '🥟';
    case 'Rice Meals':
    default:
      return '🍛';
  }
};

export const PriceMarker: React.FC<PriceMarkerProps> = ({
  marker,
  isSelected,
  latitudeDelta,
  onSelect,
}) => {
  // Determine zoom mode based on latitudeDelta
  // Low Zoom (< 13z): latitudeDelta > 0.08
  // Mid Zoom (13z - 15z): 0.02 < latitudeDelta <= 0.08
  // High Zoom (16z+): latitudeDelta <= 0.02
  const isHighZoom = latitudeDelta <= 0.02;
  const isLowZoom = latitudeDelta > 0.08;

  const glyph = getCategoryGlyph(marker.category);

  // Dynamic tracksViewChanges to optimize 60fps pan/zoom while ensuring
  // custom marker re-renders reliably upon selection or zoom state transitions
  const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

  React.useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [isSelected, isHighZoom, isLowZoom, marker.price]);

  return (
    <Marker
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      onPress={() => onSelect(marker)}
      tracksViewChanges={tracksViewChanges}
      zIndex={isSelected ? 999 : 1}
    >
      <Pressable
        onPress={() => onSelect(marker)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[
          styles.container,
          isSelected && styles.containerSelected,
          isLowZoom && styles.containerLowZoom,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Meal: ${marker.title}, Price: ₱${marker.price}, at ${marker.restaurantName}`}
        accessibilityState={{ selected: isSelected }}
      >
        <View
          style={[
            styles.pill,
            isSelected && styles.pillSelected,
            isLowZoom && styles.pillLowZoom,
          ]}
        >
          {isLowZoom ? (
            <Text variant="caption" color="surface" style={styles.lowZoomText}>
              ● ₱{marker.price}
            </Text>
          ) : (
            <View style={styles.pillContent}>
              {isHighZoom && (
                <Text style={styles.glyphText}>{glyph}</Text>
              )}
              <Text
                variant="priceBadge"
                color={isSelected ? 'surface' : 'primary'}
                style={[styles.priceText, isSelected && styles.priceTextSelected]}
              >
                ₱{marker.price}
              </Text>
            </View>
          )}
        </View>

        {/* Marker Pointing Stem */}
        <View
          style={[
            styles.stem,
            isSelected && styles.stemSelected,
            isLowZoom && styles.stemLowZoom,
          ]}
        />
      </Pressable>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  containerSelected: {
    transform: [{ scale: 1.15 }],
  },
  containerLowZoom: {
    transform: [{ scale: 0.9 }],
  },
  pill: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    borderWidth: 2.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  pillLowZoom: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphText: {
    fontSize: 12,
    marginRight: 4,
  },
  priceText: {
    fontWeight: '700',
  },
  priceTextSelected: {
    color: colors.surface,
  },
  lowZoomText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stem: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    marginTop: -1,
  },
  stemSelected: {
    borderTopColor: colors.accent,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
  },
  stemLowZoom: {
    borderTopColor: colors.primary,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
  },
});
