import {
  IMapService,
  ViewportBounds,
  MealMarkerPayload,
  UnifiedSearchResult,
  SearchDishItem,
  SearchPlaceItem,
  SearchNeighborhoodItem,
} from '@/features/map/types';
import { MealDetail, OtherMealItem } from '@/features/meals/types';
import { SEED_MEALS } from './mockData/seedMeals';
import { getMealDetailById, RESTAURANT_METADATA } from '@/features/meals/api/mealDetails';
import { calculateDistanceMeters } from '@/features/map/utils/distance';

export const DAVAO_NEIGHBORHOODS: SearchNeighborhoodItem[] = [
  {
    id: 'hood-davao-poblacion',
    name: 'Poblacion (Downtown)',
    description: 'City Hall, San Pedro & Bolton food hubs',
    latitude: 7.0707,
    longitude: 125.6087,
  },
  {
    id: 'hood-davao-obrero',
    name: 'Barrio Obrero',
    description: 'Sisig, student spots & nightlife',
    latitude: 7.0818,
    longitude: 125.6186,
  },
  {
    id: 'hood-davao-bankerohan',
    name: 'Bankerohan Market',
    description: 'Morning painitans, puto maya & sikwate',
    latitude: 7.0645,
    longitude: 125.6033,
  },
  {
    id: 'hood-davao-roxas',
    name: 'Roxas Avenue',
    description: 'Famous Roxas Night Market street food',
    latitude: 7.0722,
    longitude: 125.6125,
  },
  {
    id: 'hood-davao-marfori',
    name: 'Marfori Heights',
    description: 'Artisan cafes, ribs & pastry houses',
    latitude: 7.0768,
    longitude: 125.6042,
  },
  {
    id: 'hood-davao-matina',
    name: 'Matina / Tulip Drive',
    description: 'Specialty coffee roasters & student eats',
    latitude: 7.0543,
    longitude: 125.5892,
  },
];

export const METRO_MANILA_NEIGHBORHOODS: SearchNeighborhoodItem[] = [
  {
    id: 'hood-ubelt',
    name: 'University Belt',
    description: 'Sampaloc / Morayta student eats',
    latitude: 14.5995,
    longitude: 120.9842,
  },
  {
    id: 'hood-kapitolyo',
    name: 'Kapitolyo',
    description: 'East Capitol Dr food strip',
    latitude: 14.5712,
    longitude: 121.0585,
  },
  {
    id: 'hood-dapitan',
    name: 'Dapitan (UST)',
    description: 'Affordable silog & mami',
    latitude: 14.611,
    longitude: 120.9912,
  },
  {
    id: 'hood-ortigas',
    name: 'Ortigas Center',
    description: 'Emerald Ave & Pioneer carinderias',
    latitude: 14.5869,
    longitude: 121.0614,
  },
  {
    id: 'hood-ermita',
    name: 'Ermita / Taft',
    description: 'Pedro Gil & Robinson’s food stalls',
    latitude: 14.58,
    longitude: 120.983,
  },
  {
    id: 'hood-maginhawa',
    name: 'Maginhawa',
    description: 'UP Diliman food street',
    latitude: 14.6465,
    longitude: 121.0601,
  },
  {
    id: 'hood-katipunan',
    name: 'Katipunan',
    description: 'Loyola Heights student hub',
    latitude: 14.6397,
    longitude: 121.0767,
  },
];

export const FEATURED_NEIGHBORHOODS: SearchNeighborhoodItem[] = [
  ...DAVAO_NEIGHBORHOODS,
  ...METRO_MANILA_NEIGHBORHOODS,
];

export class MockMapService implements IMapService {
  public async getViewportMeals(
    bounds: ViewportBounds,
    maxBudget?: number,
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

      // Check max budget ceiling (0 or >= 9999 = All Meals / no cap)
      if (maxBudget && maxBudget > 0 && maxBudget < 9999 && meal.price > maxBudget) {
        return false;
      }

      // Check category filter
      if (category && category !== 'All' && meal.category !== category) {
        return false;
      }

      return true;
    });
  }

  public async fetchViewportMarkers(
    bounds: ViewportBounds,
    maxBudget: number,
    category?: string
  ): Promise<MealMarkerPayload[]> {
    return this.getViewportMeals(bounds, maxBudget, category);
  }

  public async getMealDetail(
    mealId: string,
    userLocation?: { latitude: number; longitude: number } | null
  ): Promise<MealDetail | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getMealDetailById(mealId, userLocation);
  }

  public async getOtherMealsAtRestaurant(
    restaurantId: string,
    currentMealId: string
  ): Promise<OtherMealItem[]> {
    return SEED_MEALS.filter(
      (m) => m.restaurantId === restaurantId && m.id !== currentMealId && m.mealId !== currentMealId
    ).map((m) => ({
      id: m.id,
      mealId: m.mealId,
      title: m.title,
      price: m.price,
      thumbnailUrl: m.thumbnailUrl,
    }));
  }

  public async searchFoodAndPlaces(
    query: string,
    userLocation?: { latitude: number; longitude: number } | null,
    limit: number = 10
  ): Promise<UnifiedSearchResult> {
    const q = query.trim().toLowerCase();

    const matchingDishes: SearchDishItem[] = SEED_MEALS.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.restaurantName.toLowerCase().includes(q)
    )
      .slice(0, limit)
      .map((m) => ({
        id: m.id,
        title: m.title,
        price: m.price,
        category: m.category,
        venueName: m.restaurantName,
        latitude: m.latitude,
        longitude: m.longitude,
        thumbnailUrl: m.thumbnailUrl,
      }));

    const venueMap = new Map<string, SearchPlaceItem>();
    for (const m of SEED_MEALS) {
      if (
        (m.restaurantName.toLowerCase().includes(q) || q === '') &&
        !venueMap.has(m.restaurantId)
      ) {
        const distanceMeters = userLocation
          ? this.calculateDistanceMeters(userLocation, {
              latitude: m.latitude,
              longitude: m.longitude,
            })
          : null;

        const meta = RESTAURANT_METADATA[m.restaurantId];
        venueMap.set(m.restaurantId, {
          id: m.restaurantId,
          name: m.restaurantName,
          address: meta?.address || 'Metro Manila, Philippines',
          latitude: m.latitude,
          longitude: m.longitude,
          distanceMeters,
          coverPhotoUrl: meta?.coverPhotoUrl,
        });
      }
    }

    const matchingPlaces = Array.from(venueMap.values()).slice(0, limit);

    const matchingNeighborhoods: SearchNeighborhoodItem[] = FEATURED_NEIGHBORHOODS.filter(
      (hood) =>
        q === '' ||
        hood.name.toLowerCase().includes(q) ||
        hood.description.toLowerCase().includes(q)
    ).slice(0, limit);

    return {
      dishes: matchingDishes,
      places: matchingPlaces,
      neighborhoods: matchingNeighborhoods,
    };
  }

  public async geocodeAddress(
    address: string
  ): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
    const query = address.toLowerCase();

    // Davao City landmarks and districts
    if (
      query.includes('davao') ||
      query.includes('poblacion') ||
      query.includes('san pedro') ||
      query.includes('bolton')
    ) {
      return {
        latitude: 7.0707,
        longitude: 125.6087,
        formattedAddress: 'Poblacion, Davao City, Davao del Sur, Philippines',
      };
    }

    if (query.includes('obrero')) {
      return {
        latitude: 7.0818,
        longitude: 125.6186,
        formattedAddress: 'Barrio Obrero, Davao City, Philippines',
      };
    }

    if (query.includes('bankerohan')) {
      return {
        latitude: 7.0645,
        longitude: 125.6033,
        formattedAddress: 'Bankerohan Public Market, Davao City, Philippines',
      };
    }

    if (query.includes('roxas')) {
      return {
        latitude: 7.0722,
        longitude: 125.6125,
        formattedAddress: 'Roxas Avenue Night Market, Davao City, Philippines',
      };
    }

    if (query.includes('marfori')) {
      return {
        latitude: 7.0768,
        longitude: 125.6042,
        formattedAddress: 'Marfori Heights, Davao City, Philippines',
      };
    }

    if (query.includes('matina') || query.includes('tulip')) {
      return {
        latitude: 7.0543,
        longitude: 125.5892,
        formattedAddress: 'Tulip Drive, Matina, Davao City, Philippines',
      };
    }

    // Metro Manila landmarks and districts
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

    // Default to Davao City pilot area
    return {
      latitude: 7.0707,
      longitude: 125.6087,
      formattedAddress: `${address}, Davao City, Philippines`,
    };
  }

  public calculateDistanceMeters(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): number {
    return calculateDistanceMeters(origin, destination);
  }
}

export const mockMapService = new MockMapService();
