import type { MealDetail, OtherMealItem } from '@/features/meals/types';

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

export interface SearchDishItem {
  id: string;
  title: string;
  price: number;
  category: string;
  venueName: string;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
}

export interface SearchPlaceItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number | null;
  coverPhotoUrl?: string;
}

export interface SearchNeighborhoodItem {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface UnifiedSearchResult {
  dishes: SearchDishItem[];
  places: SearchPlaceItem[];
  neighborhoods: SearchNeighborhoodItem[];
}

export interface IMapService {
  getViewportMeals(
    bounds: ViewportBounds,
    maxBudget?: number,
    category?: string
  ): Promise<MealMarkerPayload[]>;

  fetchViewportMarkers(
    bounds: ViewportBounds,
    maxBudget: number,
    category?: string
  ): Promise<MealMarkerPayload[]>;

  getMealDetail(
    mealId: string,
    userLocation?: { latitude: number; longitude: number } | null
  ): Promise<MealDetail | null>;

  getOtherMealsAtRestaurant(
    restaurantId: string,
    currentMealId: string
  ): Promise<OtherMealItem[]>;

  searchFoodAndPlaces(
    query: string,
    userLocation?: { latitude: number; longitude: number } | null,
    limit?: number
  ): Promise<UnifiedSearchResult>;

  geocodeAddress(
    address: string
  ): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null>;

  calculateDistanceMeters(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): number;
}
