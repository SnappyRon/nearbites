import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/primitives/Text';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useDiscoveryStore, MapTypeOption } from '@/store/useDiscoveryStore';

interface LayerOption {
  type: MapTypeOption;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const LAYER_OPTIONS: LayerOption[] = [
  {
    type: 'standard',
    label: 'Standard (NearBites)',
    description: 'Warm cream & teal theme tuned for affordable street eats',
    icon: 'map-outline',
  },
  {
    type: 'satellite',
    label: 'Satellite',
    description: 'High-res photorealistic aerial rooftops and alleys',
    icon: 'earth',
  },
  {
    type: 'hybrid',
    label: 'Hybrid',
    description: 'Satellite imagery with street names and road labels',
    icon: 'navigate-circle-outline',
  },
];

export const MapLayersModal: React.FC = () => {
  const { mapType, setMapType, isLayerModalOpen, setLayerModalOpen } =
    useDiscoveryStore();

  const handleSelect = (selected: MapTypeOption) => {
    setMapType(selected);
    setLayerModalOpen(false);
  };

  return (
    <Modal
      visible={isLayerModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setLayerModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setLayerModalOpen(false)}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Drag Grabber */}
              <View style={styles.grabber} />

              {/* Title & Close */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Ionicons name="layers" size={20} color={colors.primary} />
                  <Text variant="heading3" style={styles.title}>
                    Map Layer View
                  </Text>
                </View>
                <Pressable
                  onPress={() => setLayerModalOpen(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color={colors.textMuted} />
                </Pressable>
              </View>

              {/* Options */}
              <View style={styles.optionsList}>
                {LAYER_OPTIONS.map((option) => {
                  const isSelected = mapType === option.type;
                  return (
                    <Pressable
                      key={option.type}
                      onPress={() => handleSelect(option.type)}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Switch map view to ${option.label}`}
                    >
                      <View
                        style={[
                          styles.iconWrapper,
                          isSelected && styles.iconWrapperSelected,
                        ]}
                      >
                        <Ionicons
                          name={option.icon}
                          size={24}
                          color={isSelected ? colors.surface : colors.primary}
                        />
                      </View>

                      <View style={styles.textCol}>
                        <View style={styles.labelRow}>
                          <Text
                            variant="body"
                            style={[
                              styles.optionLabel,
                              isSelected && styles.optionLabelSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                          {isSelected && (
                            <View style={styles.activeBadge}>
                              <Text variant="caption" style={styles.activeBadgeText}>
                                Active
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text variant="caption" color="textMuted">
                          {option.description}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(34, 42, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.space4,
    paddingTop: spacing.space2,
    paddingBottom: spacing.space6,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.space3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: spacing.space2,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: spacing.space3,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.space3,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF4F2',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.space3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapperSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textCol: {
    flex: 1,
    marginRight: spacing.space2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  optionLabel: {
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
