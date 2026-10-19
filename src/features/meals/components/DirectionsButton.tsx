import React from 'react';
import {
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  Alert,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';

export interface DirectionsButtonProps {
  latitude: number;
  longitude: number;
  venueName?: string;
  label?: string;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  latitude,
  longitude,
  venueName,
  label = 'Get Directions',
  fullWidth = false,
  style,
}) => {
  const handleOpenDirections = async () => {
    const webFallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    let primaryUrl = webFallbackUrl;

    if (Platform.OS === 'ios') {
      primaryUrl = `maps://?daddr=${latitude},${longitude}&dirflg=w`;
    } else if (Platform.OS === 'android') {
      primaryUrl = `google.navigation:q=${latitude},${longitude}&mode=w`;
    }

    try {
      const supported = await Linking.canOpenURL(primaryUrl);
      if (supported) {
        await Linking.openURL(primaryUrl);
      } else {
        await Linking.openURL(webFallbackUrl);
      }
    } catch (error) {
      console.warn('[NearBites Directions] Error launching maps navigation:', error);
      try {
        await Linking.openURL(webFallbackUrl);
      } catch (fallbackError) {
        Alert.alert(
          'Navigation Error',
          `Unable to open maps navigation to ${venueName || 'this destination'}.`
        );
      }
    }
  };

  return (
    <Pressable
      onPress={handleOpenDirections}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.buttonFullWidth,
        pressed && styles.buttonPressed,
        style,
      ]}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${label} to ${venueName || 'venue'}`}
    >
      <Ionicons name="navigate" size={18} color={colors.surface} style={styles.icon} />
      <Text variant="caption" color="surface" style={styles.label}>
        {label}
      </Text>
      <Ionicons name="arrow-forward" size={16} color={colors.surface} style={styles.arrow} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  arrow: {
    marginLeft: 6,
  },
});
