import { useQuery } from '@tanstack/react-query';
import { mapService } from '@/services/MapService';
import { ViewportBounds, MealMarkerPayload } from '@/features/map/types';

export const useViewportMeals = (
  bounds: ViewportBounds | null,
  maxBudget: number,
  category?: string
) => {
  return useQuery<MealMarkerPayload[], Error>({
    queryKey: ['meals', 'viewport', bounds, maxBudget, category ?? 'All'],
    queryFn: async () => {
      if (!bounds) {
        return [];
      }
      return mapService.fetchViewportMarkers(bounds, maxBudget, category);
    },
    enabled: Boolean(bounds && bounds.minLat !== 0),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
