import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

export type PendingAction =
  | { type: 'FAVORITE'; mealId: string }
  | { type: 'CONFIRM_PRICE'; mealId: string }
  | { type: 'CORRECTION'; mealId: string }
  | { type: 'CONTRIBUTE' }
  | { type: 'REPORT'; targetId: string; targetType: 'meal' | 'restaurant' };

export interface AuthState {
  session: Session | null;
  user: User | null;
  isInitialized: boolean;
  pendingAction: PendingAction | null;

  setSession: (session: Session | null) => void;
  setPendingAction: (action: PendingAction | null) => void;
  clearPendingAction: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isInitialized: false,
  pendingAction: null,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isInitialized: true,
    }),
  setPendingAction: (action) => set({ pendingAction: action }),
  clearPendingAction: () => set({ pendingAction: null }),
}));
