import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { useDiscoveryStore, LocationCoords } from '@/store/useDiscoveryStore';

export const MANILA_PILOT_CENTER: LocationCoords = {
  latitude: 14.5995,
  longitude: 120.9842,
};

export interface UseLocationResult {
  location: LocationCoords;
  hasPermission: boolean;
  isLoading: boolean;
  isFallback: boolean;
  errorMsg: string | null;
  requestLocation: () => Promise<void>;
  getInitialRegion: () => {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export const useLocation = (): UseLocationResult => {
  const { userLocation, setUserLocation, hasLocationPermission, setHasLocationPermission } =
    useDiscoveryStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Location permission denied. Showing Manila University Belt pilot area.');
        setHasLocationPermission(false);
        setUserLocation(MANILA_PILOT_CENTER);
        setIsFallback(true);
        setIsLoading(false);
        return;
      }

      setHasLocationPermission(true);
      setIsFallback(false);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setUserLocation(coords);
    } catch (error) {
      console.warn('[NearBites useLocation] Error acquiring GPS, defaulting to pilot coordinates:', error);
      setErrorMsg('Unable to retrieve current location. Using Manila pilot area.');
      setUserLocation(MANILA_PILOT_CENTER);
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [setUserLocation, setHasLocationPermission]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const activeCoords = userLocation || MANILA_PILOT_CENTER;

  const getInitialRegion = useCallback(() => {
    return {
      latitude: activeCoords.latitude,
      longitude: activeCoords.longitude,
      latitudeDelta: 0.015, // Street walking zoom level (~15z-16z)
      longitudeDelta: 0.015,
    };
  }, [activeCoords]);

  return {
    location: activeCoords,
    hasPermission: hasLocationPermission,
    isLoading,
    isFallback,
    errorMsg,
    requestLocation,
    getInitialRegion,
  };
};
