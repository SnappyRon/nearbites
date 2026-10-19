import { create } from 'zustand';

export type BottomSheetSnapState = 'HIDDEN' | 'PEEK' | 'EXPANDED';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface CameraTarget extends LocationCoords {
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export type MapTypeOption = 'standard' | 'satellite' | 'hybrid';

export interface DiscoveryState {
  activeBudget: number;
  selectedMarkerId: string | null;
  selectedMealId: string | null;
  bottomSheetState: BottomSheetSnapState;
  userLocation: LocationCoords | null;
  hasLocationPermission: boolean;
  pendingCameraTarget: CameraTarget | null;
  mapType: MapTypeOption;
  isLayerModalOpen: boolean;
  isBudgetModalOpen: boolean;

  setActiveBudget: (budget: number) => void;
  setSelectedMarkerId: (id: string | null) => void;
  setSelectedMealId: (id: string | null) => void;
  setBottomSheetState: (state: BottomSheetSnapState) => void;
  setUserLocation: (coords: LocationCoords | null) => void;
  setHasLocationPermission: (hasPerm: boolean) => void;
  setPendingCameraTarget: (target: CameraTarget | null) => void;
  setMapType: (type: MapTypeOption) => void;
  setLayerModalOpen: (open: boolean) => void;
  setBudgetModalOpen: (open: boolean) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  activeBudget: 150, // Default MVP budget ceiling: <= ₱150
  selectedMarkerId: null,
  selectedMealId: null,
  bottomSheetState: 'HIDDEN',
  userLocation: null,
  hasLocationPermission: false,
  pendingCameraTarget: null,
  mapType: 'standard',
  isLayerModalOpen: false,
  isBudgetModalOpen: false,

  setActiveBudget: (budget) => set({ activeBudget: budget }),
  setSelectedMarkerId: (id) =>
    set({
      selectedMarkerId: id,
      selectedMealId: id,
      bottomSheetState: id ? 'PEEK' : 'HIDDEN',
    }),
  setSelectedMealId: (id) =>
    set({
      selectedMarkerId: id,
      selectedMealId: id,
      bottomSheetState: id ? 'PEEK' : 'HIDDEN',
    }),
  setBottomSheetState: (state) => set({ bottomSheetState: state }),
  setUserLocation: (coords) => set({ userLocation: coords }),
  setHasLocationPermission: (hasPerm) => set({ hasLocationPermission: hasPerm }),
  setPendingCameraTarget: (target) => set({ pendingCameraTarget: target }),
  setMapType: (type) => set({ mapType: type }),
  setLayerModalOpen: (open) => set({ isLayerModalOpen: open }),
  setBudgetModalOpen: (open) => set({ isBudgetModalOpen: open }),
}));
