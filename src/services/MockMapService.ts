import { IMapService, ViewportBounds, MealMarkerPayload } from '@/features/map/types';
import { SEED_MEALS } from './mockData/seedMeals';

export class MockMapService implements IMapService {
  public async fetchViewportMarkers(
    bounds: ViewportBounds,
    maxBudget: number,
    category?: string
  ): Promise<MealMarkerPayload[]> {
    // Simulate 50ms database RPC network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 50));

    return SEED_MEALS.filter((meal) => {
      // Check bounding box intersection
      const withinLat =
        meal.latitude >= Math.min(bounds.minLat, bounds.maxLat) &&
        meal.latitude <= Math.max(bounds.minLat, bounds.maxLat);
      const withinLng =
        meal.longitude >= Math.min(bounds.minLng, bounds.maxLng) &&
        meal.longitude <= Math.max(bounds.minLng, bounds.maxLng);

      if (!withinLat || !withinLng) {
        return false;
      }

      // Check max budget ceiling (0 = All Meals)
      if (maxBudget > 0 && meal.price > maxBudget) {
        return false;
      }

      // Check category filter
      if (category && category !== 'All' && meal.category !== category) {
        return false;
      }

      return true;
    });
  }

  public async geocodeAddress(
    address: string
  ): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
    const query = address.toLowerCase();

    if (query.includes('belt') || query.includes('sampaloc') || query.includes('manila')) {
      return {
        latitude: 14.5995,
        longitude: 120.9842,
        formattedAddress: 'University Belt, Manila, Philippines',
      };
    }

    if (query.includes('kapitolyo') || query.includes('pasig')) {
      return {
        latitude: 14.5712,
        longitude: 121.0585,
        formattedAddress: 'Kapitolyo, Pasig City, Philippines',
      };
    }

    return {
      latitude: 14.5995,
      longitude: 120.9842,
      formattedAddress: `${address}, Metro Manila, Philippines`,
    };
  }

  public calculateDistanceMeters(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(destination.latitude - origin.latitude);
    const dLng = toRad(destination.longitude - origin.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(origin.latitude)) *
        Math.cos(toRad(destination.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
}

export const mockMapService = new MockMapService();
