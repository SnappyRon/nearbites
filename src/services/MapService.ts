import { IMapService } from '@/features/map/types';
import { mockMapService } from './MockMapService';

/**
 * Canonical MapService instance conforming to ADR-001 abstraction
 * Currently backed by MockMapService; seamlessly swappable with live PostGIS service in Phase 7
 */
export const mapService: IMapService = mockMapService;
