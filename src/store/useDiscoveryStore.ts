import { create } from 'zustand';

export type BottomSheetSnapState = 'HIDDEN' | 'PEEK' | 'EXPANDED';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface DiscoveryState {
  activeBudget: number;
  selectedMarkerId: string | null;
  bottomSheetState: BottomSheetSnapState;
  userLocation: LocationCoords | null;
  hasLocationPermission: boolean;

  setActiveBudget: (budget: number) => void;
  setSelectedMarkerId: (id: string | null) => void;
  setBottomSheetState: (state: BottomSheetSnapState) => void;
  setUserLocation: (coords: LocationCoords | null) => void;
  setHasLocationPermission: (hasPerm: boolean) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  activeBudget: 150, // Default MVP budget ceiling: <= ₱150
  selectedMarkerId: null,
  bottomSheetState: 'HIDDEN',
  userLocation: null,
  hasLocationPermission: false,

  setActiveBudget: (budget) => set({ activeBudget: budget }),
  setSelectedMarkerId: (id) =>
    set({
      selectedMarkerId: id,
      bottomSheetState: id ? 'PEEK' : 'HIDDEN',
    }),
  setBottomSheetState: (state) => set({ bottomSheetState: state }),
  setUserLocation: (coords) => set({ userLocation: coords }),
  setHasLocationPermission: (hasPerm) => set({ hasLocationPermission: hasPerm }),
}));
