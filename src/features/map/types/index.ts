export interface ViewportBounds {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export type FreshnessTier = 'fresh' | 'aging' | 'stale';

export interface MealMarkerPayload {
  id: string;
  mealId: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  price: number;
  category: string;
  latitude: number;
  longitude: number;
  thumbnailUrl: string;
  freshnessTier: FreshnessTier;
}

export interface IMapService {
  fetchViewportMarkers(
    bounds: ViewportBounds,
    maxBudget: number,
    category?: string
  ): Promise<MealMarkerPayload[]>;

  geocodeAddress(
    address: string
  ): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null>;

  calculateDistanceMeters(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): number;
}
