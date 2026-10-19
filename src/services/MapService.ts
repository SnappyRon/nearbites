import { IMapService } from '@/features/map/types';
import { supabaseMapService } from './SupabaseMapService';

/**
 * Canonical MapService instance conforming to ADR-001 abstraction
 * Backed by SupabaseMapService with live PostGIS queries and automatic graceful fallback to MockMapService
 */
export const mapService: IMapService = supabaseMapService;
