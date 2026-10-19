import { supabase } from '@/lib/supabase';
import {
  IMapService,
  ViewportBounds,
  MealMarkerPayload,
  FreshnessTier,
  UnifiedSearchResult,
  SearchDishItem,
  SearchPlaceItem,
} from '@/features/map/types';
import { MealDetail, OtherMealItem } from '@/features/meals/types';
import { mockMapService, FEATURED_NEIGHBORHOODS } from './MockMapService';
import { calculateDistanceMeters } from '@/features/map/utils/distance';

const KNOWN_RESTAURANTS: Record<string, string> = {
  // Metro Manila
  'a0000001-0000-0000-0000-000000000001': "Ate Fe's Lutong Bahay",
  'a0000001-0000-0000-0000-000000000002': "Mang Larry's Isawan U-Belt",
  'a0000001-0000-0000-0000-000000000003': 'Dapitan Tapsi Express',
  'a0000001-0000-0000-0000-000000000004': 'Aling Tinay Siomai Rice',
  'a0000001-0000-0000-0000-000000000005': 'Jonas Pares Mami House',
  'a0000001-0000-0000-0000-000000000006': 'Kanto Silog Point',
  'a0000001-0000-0000-0000-000000000007': "Lola Nena's Merienda Corner",
  'a0000001-0000-0000-0000-000000000008': "Nanay's Lugawan & Tokwa",
  'a0000001-0000-0000-0000-000000000009': 'Ilocos Empanada Hub',
  'a0000001-0000-0000-0000-000000000010': 'Bicol Express Eatery',

  // Davao City
  'd0000001-0000-0000-0000-000000000001': "Sana's Original Kabawan & Bulaloan",
  'd0000001-0000-0000-0000-000000000002': 'Bulcachong',
  'd0000001-0000-0000-0000-000000000003': "Lachi's Sans Rival Atbp.",
  'd0000001-0000-0000-0000-000000000004': "Romeo's Sisigan sa Dakbayan",
  'd0000001-0000-0000-0000-000000000005': 'TAPS Davao',
  'd0000001-0000-0000-0000-000000000006': 'Luz Kinilaw Place',
  'd0000001-0000-0000-0000-000000000007': "Colasa's Bar-B-Que",
  'd0000001-0000-0000-0000-000000000008': "Penong's Barbecue Seafood & Grill",
  'd0000001-0000-0000-0000-000000000009': 'Roxas Night Market Stalls',
  'd0000001-0000-0000-0000-000000000010': 'Del Mar Painitan Bankerohan',
  'd0000001-0000-0000-0000-000000000011': "Dencia's Restaurant",
  'd0000001-0000-0000-0000-000000000012': "Cecil's Snack Inn & Bakeshop",
  'd0000001-0000-0000-0000-000000000013': 'New Davao Famous Restaurant',
  'd0000001-0000-0000-0000-000000000014': 'Purge Coffee Roasters',
  'd0000001-0000-0000-0000-000000000015': 'Huckleberry Southern Kitchen & Bar',
};

function inferCategory(title: string): string {
  const t = title.toLowerCase();
  if (
    t.includes('silog') ||
    t.includes('tapsi') ||
    t.includes('tocilog') ||
    t.includes('bangsilog') ||
    t.includes('longsilog')
  ) {
    return 'Silog';
  }
  if (
    t.includes('mami') ||
    t.includes('soup') ||
    t.includes('lugaw') ||
    t.includes('sinigang') ||
    t.includes('palabok')
  ) {
    return 'Noodles & Soup';
  }
  if (t.includes('isaw') || t.includes('bbq') || t.includes('betamax')) {
    return 'Street Food & BBQ';
  }
  if (t.includes('siopao') || t.includes('empanada') || t.includes('tokwa')) {
    return 'Snacks & Merienda';
  }
  return 'Rice Meals';
}

function computeDaysAgo(timestamp?: string | null): number {
  if (!timestamp) return 3;
  const time = new Date(timestamp).getTime();
  if (isNaN(time)) return 3;
  const diff = Date.now() - time;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatDaysAgoText(days: number): string {
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function isSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('placeholder') || key.includes('placeholder')) return false;
  return true;
}

interface ViewportRpcRow {
  id: string;
  meal_id?: string;
  restaurant_id: string;
  restaurant_name?: string;
  title: string;
  price: number | string;
  category?: string;
  latitude: number | string;
  longitude: number | string;
  thumbnail_url: string;
  freshness_tier?: string;
}

interface MealDetailsRpcResult {
  meal?: {
    id: string;
    title: string;
    description?: string;
    price: number | string;
    category?: string;
    hero_photo_url: string;
    freshness_tier?: string;
    last_confirmed_at?: string;
    additional_photos?: string[];
  };
  restaurant?: {
    id: string;
    name: string;
    address: string;
    latitude: number | string;
    longitude: number | string;
    opening_hours?: Record<string, { open: string; close: string; closed: boolean }>;
    is_verified?: boolean;
    distance_meters?: number | null;
  };
  other_meals?: Array<{
    id: string;
    title: string;
    price: number | string;
    photo_url: string;
  }>;
}

interface SearchRpcResult {
  dishes?: Array<{
    id: string;
    title: string;
    price: number | string;
    category?: string;
    venue_name?: string;
    latitude: number | string;
    longitude: number | string;
    hero_photo_url?: string;
  }>;
  venues?: Array<{
    id: string;
    name: string;
    address: string;
    latitude: number | string;
    longitude: number | string;
  }>;
}

export class SupabaseMapService implements IMapService {
  /**
   * Fetches meals within bounding box envelope using PostGIS ST_MakeEnvelope RPC
   */
  public async getViewportMeals(
    bounds: ViewportBounds,
    maxBudget?: number,
    category?: string
  ): Promise<MealMarkerPayload[]> {
    if (!isSupabaseConfigured()) {
      console.warn('[NearBites] Supabase not configured. Falling back to MockMapService.');
      return mockMapService.getViewportMeals(bounds, maxBudget, category);
    }

    try {
      const budgetParam =
        !maxBudget || maxBudget <= 0 || maxBudget >= 9999 ? 10000 : Number(maxBudget);
      const categoryParam = !category || category === 'All' ? null : category;

      const { data, error } = await supabase.rpc('get_viewport_meals', {
        min_lat: Math.min(bounds.minLat, bounds.maxLat),
        min_lng: Math.min(bounds.minLng, bounds.maxLng),
        max_lat: Math.max(bounds.minLat, bounds.maxLat),
        max_lng: Math.max(bounds.minLng, bounds.maxLng),
        max_budget: budgetParam,
        category_filter: categoryParam,
      });

      if (error) {
        console.warn('[NearBites] RPC get_viewport_meals failed:', error.message);
        return mockMapService.getViewportMeals(bounds, maxBudget, category);
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        // Fallback to local verified seed dataset when remote PostGIS DB has no records in this bounding box
        return mockMapService.getViewportMeals(bounds, maxBudget, category);
      }

      const rows = data as ViewportRpcRow[];
      if (rows.length === 0) {
        return mockMapService.getViewportMeals(bounds, maxBudget, category);
      }
      return rows.map((row) => {
        const id = row.id || row.meal_id || '';
        const title = row.title || 'Affordable Dish';
        const categoryVal = row.category || inferCategory(title);
        const venueName =
          row.restaurant_name || KNOWN_RESTAURANTS[row.restaurant_id] || 'Local Eatery';

        return {
          id,
          mealId: row.meal_id || id,
          restaurantId: row.restaurant_id,
          restaurantName: venueName,
          title,
          price: Number(row.price),
          category: categoryVal,
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          thumbnailUrl: row.thumbnail_url,
          freshnessTier: (row.freshness_tier as FreshnessTier) || 'fresh',
        };
      });
    } catch (err) {
      console.warn('[NearBites] Network error in getViewportMeals, falling back to mock:', err);
      return mockMapService.getViewportMeals(bounds, maxBudget, category);
    }
  }

  public async fetchViewportMarkers(
    bounds: ViewportBounds,
    maxBudget: number,
    category?: string
  ): Promise<MealMarkerPayload[]> {
    return this.getViewportMeals(bounds, maxBudget, category);
  }

  /**
   * Fetches detailed meal information, venue info, and photos
   */
  public async getMealDetail(
    mealId: string,
    userLocation?: { latitude: number; longitude: number } | null
  ): Promise<MealDetail | null> {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!isSupabaseConfigured() || !UUID_REGEX.test(mealId)) {
      return mockMapService.getMealDetail(mealId, userLocation);
    }

    try {
      const { data, error } = await supabase.rpc('get_meal_details', {
        p_meal_id: mealId,
        p_user_lat: userLocation?.latitude ?? null,
        p_user_lng: userLocation?.longitude ?? null,
      });

      if (error || !data) {
        console.warn('[NearBites] RPC get_meal_details failed:', error?.message);
        return mockMapService.getMealDetail(mealId, userLocation);
      }

      const res = data as MealDetailsRpcResult;
      if (!res.meal || !res.restaurant) {
        return mockMapService.getMealDetail(mealId, userLocation);
      }

      const meal = res.meal;
      const restaurant = res.restaurant;
      const daysAgo = computeDaysAgo(meal.last_confirmed_at);
      const lastConfirmedAt = formatDaysAgoText(daysAgo);

      const lat = Number(restaurant.latitude);
      const lng = Number(restaurant.longitude);

      let distanceMeters = restaurant.distance_meters ?? null;
      if (distanceMeters === null && userLocation) {
        distanceMeters = this.calculateDistanceMeters(userLocation, {
          latitude: lat,
          longitude: lng,
        });
      }

      const extraPhotos = Array.isArray(meal.additional_photos)
        ? meal.additional_photos.filter(Boolean)
        : [];
      const allPhotos = [meal.hero_photo_url, ...extraPhotos];

      const otherMeals: OtherMealItem[] = Array.isArray(res.other_meals)
        ? res.other_meals.map((om) => ({
            id: om.id,
            mealId: om.id,
            title: om.title,
            price: Number(om.price),
            thumbnailUrl: om.photo_url,
          }))
        : [];

      return {
        id: meal.id,
        mealId: meal.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        title: meal.title,
        description: meal.description || 'Affordable local favorite made fresh daily.',
        price: Number(meal.price),
        category: meal.category || inferCategory(meal.title),
        heroPhotoUrl: meal.hero_photo_url,
        additionalPhotos: allPhotos,
        freshnessTier: (meal.freshness_tier as FreshnessTier) || 'fresh',
        lastConfirmedAt,
        daysAgo,
        confirmedBy: 'Community Scout',
        openingHours: '8:00 AM – 9:00 PM',
        isOpenNow: true,
        isVerifiedVenue: restaurant.is_verified ?? true,
        latitude: lat,
        longitude: lng,
        distanceMeters,
        otherMeals,
      };
    } catch (err) {
      console.warn('[NearBites] Network error in getMealDetail, falling back to mock:', err);
      return mockMapService.getMealDetail(mealId, userLocation);
    }
  }

  /**
   * Fetches other affordable dishes at the same venue
   */
  public async getOtherMealsAtRestaurant(
    restaurantId: string,
    currentMealId: string
  ): Promise<OtherMealItem[]> {
    if (!isSupabaseConfigured()) {
      return mockMapService.getOtherMealsAtRestaurant(restaurantId, currentMealId);
    }

    try {
      const { data, error } = await supabase
        .from('meals')
        .select('id, title, current_price, hero_photo_url')
        .eq('restaurant_id', restaurantId)
        .neq('id', currentMealId)
        .eq('moderation_status', 'approved')
        .limit(5);

      if (error || !data) {
        return mockMapService.getOtherMealsAtRestaurant(restaurantId, currentMealId);
      }

      return data.map((row) => ({
        id: row.id,
        mealId: row.id,
        title: row.title,
        price: Number(row.current_price),
        thumbnailUrl: row.hero_photo_url,
      }));
    } catch {
      return mockMapService.getOtherMealsAtRestaurant(restaurantId, currentMealId);
    }
  }

  /**
   * Unified search across dishes, venues, and Metro Manila neighborhoods
   */
  public async searchFoodAndPlaces(
    query: string,
    userLocation?: { latitude: number; longitude: number } | null,
    limit: number = 10
  ): Promise<UnifiedSearchResult> {
    if (!isSupabaseConfigured()) {
      return mockMapService.searchFoodAndPlaces(query, userLocation, limit);
    }

    const q = query.trim().toLowerCase();

    // Neighborhoods filter is always responsive and localized
    const matchingNeighborhoods = FEATURED_NEIGHBORHOODS.filter(
      (hood) =>
        q === '' ||
        hood.name.toLowerCase().includes(q) ||
        hood.description.toLowerCase().includes(q)
    ).slice(0, limit);

    try {
      const { data, error } = await supabase.rpc('search_food_and_places', {
        p_query: q,
        p_user_lat: userLocation?.latitude ?? null,
        p_user_lng: userLocation?.longitude ?? null,
        p_limit: limit,
      });

      if (error || !data) {
        console.warn('[NearBites] RPC search_food_and_places error, falling back to mock:', error?.message);
        return mockMapService.searchFoodAndPlaces(query, userLocation, limit);
      }

      const res = data as SearchRpcResult;

      const dishes: SearchDishItem[] = Array.isArray(res.dishes)
        ? res.dishes.map((d) => ({
            id: d.id,
            title: d.title,
            price: Number(d.price),
            category: d.category || inferCategory(d.title),
            venueName: d.venue_name || 'Eatery',
            latitude: Number(d.latitude),
            longitude: Number(d.longitude),
            thumbnailUrl: d.hero_photo_url,
          }))
        : [];

      const places: SearchPlaceItem[] = Array.isArray(res.venues)
        ? res.venues.map((v) => {
            const lat = Number(v.latitude);
            const lng = Number(v.longitude);
            const distanceMeters = userLocation
              ? this.calculateDistanceMeters(userLocation, { latitude: lat, longitude: lng })
              : null;

            return {
              id: v.id,
              name: v.name,
              address: v.address,
              latitude: lat,
              longitude: lng,
              distanceMeters,
            };
          })
        : [];

      // If remote database returns no matches (e.g. for Davao items not yet migrated to DB), fallback to mock
      if (dishes.length === 0 && places.length === 0) {
        return mockMapService.searchFoodAndPlaces(query, userLocation, limit);
      }

      return {
        dishes,
        places,
        neighborhoods: matchingNeighborhoods,
      };
    } catch (err) {
      console.warn('[NearBites] Network error in searchFoodAndPlaces, falling back to mock:', err);
      return mockMapService.searchFoodAndPlaces(query, userLocation, limit);
    }
  }

  public async geocodeAddress(
    address: string
  ): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
    return mockMapService.geocodeAddress(address);
  }

  public calculateDistanceMeters(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): number {
    return calculateDistanceMeters(origin, destination);
  }
}

export const supabaseMapService = new SupabaseMapService();
