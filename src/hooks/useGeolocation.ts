import { useState, useCallback } from 'react';

interface GeolocationHook {
  location: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<{ lat: number; lng: number } | null>;
}

export const useGeolocation = (): GeolocationHook => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        setError("La géolocalisation n'est pas disponible sur votre appareil");
        setIsLoading(false);
        resolve(null);
        return;
      }

      // Check if device is offline
      if (!navigator.onLine) {
        setError("Mode hors ligne - géolocalisation indisponible");
        setIsLoading(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(coords);
          setIsLoading(false);
          resolve(coords);
        },
        (error) => {
          let errorMessage = "Impossible d'obtenir votre position";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Géolocalisation refusée";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position indisponible";
              break;
            case error.TIMEOUT:
              errorMessage = "Délai d'attente dépassé";
              break;
          }
          
          setError(errorMessage);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Réduit le timeout pour une réponse plus rapide
          maximumAge: 0
        }
      );
    });
  }, []);

  return {
    location,
    isLoading,
    error,
    requestLocation
  };
};
