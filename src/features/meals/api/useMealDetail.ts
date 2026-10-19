import { useQuery } from '@tanstack/react-query';
import { mapService } from '@/services/MapService';
import { MealDetail } from '../types';

export const useMealDetail = (
  mealId: string | null,
  userLocation?: { latitude: number; longitude: number } | null
) => {
  return useQuery<MealDetail | null, Error>({
    queryKey: ['meals', 'detail', mealId],
    queryFn: async () => {
      if (!mealId) return null;
      return mapService.getMealDetail(mealId, userLocation);
    },
    enabled: Boolean(mealId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
