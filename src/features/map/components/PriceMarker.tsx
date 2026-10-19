import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Marker, MarkerPressEvent } from 'react-native-maps';
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
  onSelect,
}) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Keep tracksViewChanges active during initial render & state switches to prevent blank image snapshots on iOS
  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [isSelected, marker.thumbnailUrl, imageLoaded]);

  const glyph = getCategoryGlyph(marker.category);

  return (
    <Marker
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      onPress={(e: MarkerPressEvent) => {
        e.stopPropagation();
        onSelect(marker);
      }}
      anchor={{ x: 0.5, y: 1.0 }}
      tracksViewChanges={tracksViewChanges || isSelected}
      zIndex={isSelected ? 999 : 1}
    >
      <View style={[styles.markerWrapper, isSelected && styles.markerWrapperSelected]}>
        {/* Main Pin Teardrop Body */}
        <View style={[styles.pinHead, isSelected && styles.pinHeadSelected]}>
          {/* Restaurant/Food Photo Container */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: marker.thumbnailUrl }}
              style={styles.image}
              onLoad={() => setImageLoaded(true)}
              resizeMode="cover"
            />
            {!imageLoaded && (
              <View style={styles.placeholderContainer}>
                <Text style={styles.glyphText}>{glyph}</Text>
              </View>
            )}
          </View>

          {/* Integrated Price Badge Pill */}
          <View style={[styles.priceBadge, isSelected && styles.priceBadgeSelected]}>
            <Text
              style={[styles.priceText, isSelected && styles.priceTextSelected]}
              numberOfLines={1}
            >
              ₱{Math.round(marker.price)}
            </Text>
          </View>
        </View>

        {/* Pin Point Needle pointing to ground coordinate */}
        <View style={[styles.pinTail, isSelected && styles.pinTailSelected]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    paddingBottom: 2,
  },
  markerWrapperSelected: {
    transform: [{ scale: 1.15 }],
  },
  pinHead: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.surface,
    padding: 2,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },
  pinHeadSelected: {
    borderColor: colors.accent,
    borderWidth: 2.5,
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphText: {
    fontSize: 16,
  },
  priceBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    marginTop: -8,
    borderWidth: 1.5,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
  },
  priceBadgeSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.surface,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.surface,
  },
  priceTextSelected: {
    color: colors.surface,
  },
  pinTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
    marginTop: -1,
  },
  pinTailSelected: {
    borderTopColor: colors.accent,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
  },
});
