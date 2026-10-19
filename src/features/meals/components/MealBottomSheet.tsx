import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { MealDetail } from '../types';
import { MealPeekView } from './MealPeekView';
import { MealExpandedView } from './MealExpandedView';
import { colors } from '@/theme/colors';
import { useDiscoveryStore, BottomSheetSnapState } from '@/store/useDiscoveryStore';

export interface MealBottomSheetProps {
  meal: MealDetail | null;
  onSelectMeal: (mealId: string) => void;
}

export const MealBottomSheet: React.FC<MealBottomSheetProps> = ({
  meal,
  onSelectMeal,
}) => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [activeMeal, setActiveMeal] = React.useState<MealDetail | null>(meal);

  const {
    bottomSheetState,
    setBottomSheetState,
    setSelectedMarkerId,
  } = useDiscoveryStore();

  // Cache latest active meal so it doesn't flicker or pop on sheet dismiss
  useEffect(() => {
    if (meal) {
      setActiveMeal(meal);
    }
  }, [meal]);

  // Snap Points: 200dp Peek State and 85% Expanded State
  const snapPoints = useMemo(() => [200, '85%'], []);

  // Sync ref with Zustand bottomSheetState
  useEffect(() => {
    if (bottomSheetState === 'PEEK') {
      bottomSheetRef.current?.snapToIndex(0);
    } else if (bottomSheetState === 'EXPANDED') {
      bottomSheetRef.current?.snapToIndex(1);
    } else if (bottomSheetState === 'HIDDEN') {
      bottomSheetRef.current?.close();
    }
  }, [bottomSheetState]);

  // Handle Sheet Snap Index Transitions
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setBottomSheetState('HIDDEN');
        setSelectedMarkerId(null);
      } else if (index === 0) {
        setBottomSheetState('PEEK');
      } else if (index === 1) {
        setBottomSheetState('EXPANDED');
      }
    },
    [setBottomSheetState, setSelectedMarkerId]
  );

  const handleAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex === -1) {
        setBottomSheetState('HIDDEN');
        setSelectedMarkerId(null);
      } else if (toIndex === 0) {
        setBottomSheetState('PEEK');
      } else if (toIndex === 1) {
        setBottomSheetState('EXPANDED');
      }
    },
    [setBottomSheetState, setSelectedMarkerId]
  );

  // Expand to 85% when user taps Peek View
  const handleExpand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
    setBottomSheetState('EXPANDED');
  }, [setBottomSheetState]);

  // Collapse back to 200dp Peek View
  const handleCollapseToPeek = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setBottomSheetState('PEEK');
  }, [setBottomSheetState]);

  // Render Dim Backdrop only in Expanded State (index 1), allowing touch-through in Peek State (index 0)
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        opacity={0.3}
        pressBehavior="collapse"
        onPress={handleCollapseToPeek}
      />
    ),
    [handleCollapseToPeek]
  );

  const isExpanded = bottomSheetState === 'EXPANDED';
  const initialIndex =
    bottomSheetState === 'EXPANDED' ? 1 : bottomSheetState === 'PEEK' ? 0 : -1;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={initialIndex}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onAnimate={handleAnimate}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animateOnMount={false}
    >
      <View style={styles.sheetContent}>
        {activeMeal ? (
          isExpanded ? (
            <MealExpandedView
              meal={activeMeal}
              onCollapseToPeek={handleCollapseToPeek}
              onSelectOtherMeal={onSelectMeal}
            />
          ) : (
            <MealPeekView
              meal={activeMeal}
              onExpand={handleExpand}
            />
          )
        ) : null}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  handleIndicator: {
    backgroundColor: '#E2D9CC',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
  },
  sheetContent: {
    flex: 1,
  },
});
