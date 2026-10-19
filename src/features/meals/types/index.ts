import { FreshnessTier } from '@/features/map/types';

export interface OtherMealItem {
  id: string;
  mealId: string;
  title: string;
  price: number;
  thumbnailUrl: string;
}

export interface MealDetail {
  id: string;
  mealId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCoverPhotoUrl?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  heroPhotoUrl: string;
  additionalPhotos: string[];
  freshnessTier: FreshnessTier;
  lastConfirmedAt: string;
  daysAgo: number;
  confirmedBy?: string;
  openingHours: string;
  isOpenNow: boolean;
  isVerifiedVenue: boolean;
  latitude: number;
  longitude: number;
  distanceMeters?: number | null;
  otherMeals: OtherMealItem[];
}
