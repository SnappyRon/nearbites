import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/theme/colors';

export interface PhotoCarouselProps {
  photos: string[];
  category?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32; // 16pt margin on each side
const CAROUSEL_HEIGHT = (CAROUSEL_WIDTH * 9) / 16; // 16:9 Aspect Ratio

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, category = 'Food' }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CAROUSEL_WIDTH);
    if (index !== activeIndex && index >= 0 && index < photos.length) {
      setActiveIndex(index);
    }
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* 16:9 Horizontal Paging ScrollView */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CAROUSEL_WIDTH}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
        style={{ width: CAROUSEL_WIDTH, height: CAROUSEL_HEIGHT }}
      >
        {photos.map((photoUri, index) => {
          const isLoading = loadingMap[index] ?? true;

          return (
            <View key={`${photoUri}-${index}`} style={styles.slide}>
              <View style={styles.imageWrapper}>
                {isLoading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
                <Image
                  source={{ uri: photoUri }}
                  style={styles.heroImage}
                  resizeMode="cover"
                  onLoadStart={() =>
                    setLoadingMap((prev) => ({ ...prev, [index]: true }))
                  }
                  onLoadEnd={() =>
                    setLoadingMap((prev) => ({ ...prev, [index]: false }))
                  }
                  accessible={true}
                  accessibilityRole="image"
                  accessibilityLabel={`${category} photo ${index + 1} of ${photos.length}`}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Pagination Dot Indicators */}
      {photos.length > 1 && (
        <View style={styles.paginationRow}>
          {photos.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.accent,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.border,
  },
});
