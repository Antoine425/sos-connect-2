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

      // Fonction pour essayer la géolocalisation avec des paramètres donnés
      const tryGeolocation = (options: PositionOptions, attempt: number) => {
        console.log(`🔄 Tentative ${attempt} de géolocalisation avec options:`, options);
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log(`✅ Géolocalisation réussie (tentative ${attempt}):`, coords);
            setLocation(coords);
            setIsLoading(false);
            resolve(coords);
          },
          (error) => {
            console.warn(`❌ Échec tentative ${attempt}:`, error.message);
            
            // Si c'est la première tentative et qu'elle échoue, essayer avec enableHighAccuracy: true
            if (attempt === 1) {
              console.log("🔄 Retry avec enableHighAccuracy: true");
              tryGeolocation({
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
              }, 2);
            } else {
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
            }
          },
          options
        );
      };

      // Première tentative avec des paramètres permissifs
      tryGeolocation({
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 300000
      }, 1);
    });
  }, []);

  return {
    location,
    isLoading,
    error,
    requestLocation
  };
};
