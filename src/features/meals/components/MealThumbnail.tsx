import React, { useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';

export interface MealThumbnailProps {
  uri: string;
  category?: string;
  size?: number;
  borderRadius?: number;
}

const getCategoryPlaceholderEmoji = (category?: string): string => {
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

export const MealThumbnail: React.FC<MealThumbnailProps> = ({
  uri,
  category = 'Rice Meals',
  size = 96,
  borderRadius = 12,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const emoji = getCategoryPlaceholderEmoji(category);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Photo of ${category}`}
    >
      {/* Fallback & Loading Background */}
      <View
        style={[
          styles.placeholder,
          { borderRadius },
        ]}
      >
        <Text style={styles.placeholderEmoji}>{emoji}</Text>
        {isLoading && !hasError && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </View>

      {/* Main Food Photo */}
      {!hasError && (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { borderRadius },
            isLoading && styles.imageLoading,
          ]}
          resizeMode="cover"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EBE2D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLoading: {
    opacity: 0,
  },
});
