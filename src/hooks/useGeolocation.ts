import { useState, useCallback } from 'react';

interface GeolocationHook {
  location: { lat: number; lng: number; accuracy?: number } | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<{ lat: number; lng: number; accuracy?: number } | null>;
}

export const useGeolocation = (): GeolocationHook => {
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<{ lat: number; lng: number; accuracy?: number } | null> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      console.log("=== DÉBUT GÉOLOCALISATION ===");
      console.log("🌐 Navigator.geolocation disponible:", 'geolocation' in navigator);
      console.log("📶 En ligne:", navigator.onLine);
      console.log("🔒 Protocol:", window.location.protocol);
      console.log("🏠 Hostname:", window.location.hostname);
      
      // Vérifications préalables pour mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log("📱 Appareil mobile détecté:", isMobile);
      
      if (isMobile && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        console.warn("⚠️ ATTENTION: Géolocalisation sur mobile nécessite HTTPS");
        setError("Géolocalisation impossible: HTTPS requis sur mobile");
        setIsLoading(false);
        resolve(null);
        return;
      }
      
      // Check if geolocation is available
      if (!navigator.geolocation) {
        console.error("❌ API Geolocation non disponible");
        setError("La géolocalisation n'est pas disponible sur votre appareil");
        setIsLoading(false);
        resolve(null);
        return;
      }

      // Check if device is offline
      if (!navigator.onLine) {
        console.error("❌ Appareil hors ligne");
        setError("Mode hors ligne - géolocalisation indisponible");
        setIsLoading(false);
        resolve(null);
        return;
      }

      let bestPosition: { lat: number; lng: number; accuracy: number } | null = null;
      let watchId: number | null = null;
      let hasResolved = false;
      
      // Timer pour accepter la meilleure position après 15 secondes (plus long pour mobile)
      const timer = setTimeout(() => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
        
        if (bestPosition && !hasResolved) {
          console.log(`✅ Position finale acceptée après timeout:`, bestPosition);
          setLocation(bestPosition);
          setIsLoading(false);
          hasResolved = true;
          resolve(bestPosition);
        } else if (!hasResolved) {
          console.warn("❌ Aucune position obtenue après timeout");
          setError("Impossible d'obtenir une position précise. Vérifiez que le GPS est activé et que vous êtes en extérieur.");
          setIsLoading(false);
          hasResolved = true;
          resolve(null);
        }
      }, 15000); // 15 secondes pour mobile (plus de temps pour le GPS)

      // Options pour une haute précision (optimisées pour mobile)
      const options: PositionOptions = {
        enableHighAccuracy: true, // Active le GPS pour une meilleure précision
        timeout: 15000, // Timeout par position (plus long pour mobile)
        maximumAge: 0 // Force une nouvelle position, pas de cache
      };

      console.log('🎯 Démarrage géolocalisation haute précision...');

      // Utilise watchPosition pour obtenir plusieurs positions et garder la meilleure
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          console.log(`📍 Position reçue - Précision: ${coords.accuracy.toFixed(0)}m`, coords);

          // Garde la position la plus précise (accuracy la plus faible)
          if (!bestPosition || coords.accuracy < bestPosition.accuracy) {
            bestPosition = coords;
            console.log(`⭐ Nouvelle meilleure position - Précision: ${coords.accuracy.toFixed(0)}m`);
          }

          // Si on obtient une très bonne précision (< 20m), on peut s'arrêter
          if (coords.accuracy < 20 && !hasResolved) {
            clearTimeout(timer);
            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
            }
            console.log(`✅ Position excellente obtenue (${coords.accuracy.toFixed(0)}m) - Arrêt`);
            setLocation(coords);
            setIsLoading(false);
            hasResolved = true;
            resolve(coords);
          }
        },
        (error) => {
          console.error("❌ ERREUR GÉOLOCALISATION");
          console.error("Code d'erreur:", error.code);
          console.error("Message:", error.message);
          console.error("Type:", 
            error.code === 1 ? "PERMISSION_DENIED" :
            error.code === 2 ? "POSITION_UNAVAILABLE" :
            error.code === 3 ? "TIMEOUT" : "UNKNOWN"
          );
          
          clearTimeout(timer);
          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
          }

          // Si on a déjà une position, on l'utilise malgré l'erreur
          if (bestPosition && !hasResolved) {
            console.log(`⚠️ Erreur mais position disponible - Précision: ${bestPosition.accuracy.toFixed(0)}m`);
            setLocation(bestPosition);
            setIsLoading(false);
            hasResolved = true;
            resolve(bestPosition);
            return;
          }

          if (!hasResolved) {
            let errorMessage = "Impossible d'obtenir votre position";
            let detailedMessage = "";
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Géolocalisation refusée";
                detailedMessage = "Sur iPhone: Réglages → Safari → Localisation → Autoriser\nSur Android: Paramètres → Applications → Chrome → Autorisations → Localisation";
                console.error("💡 Solution:", detailedMessage);
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Position indisponible";
                detailedMessage = "Vérifiez que le GPS est activé dans les paramètres de votre téléphone et que vous êtes en extérieur";
                console.error("💡 Solution:", detailedMessage);
                break;
              case error.TIMEOUT:
                errorMessage = "Délai d'attente dépassé";
                detailedMessage = "Le GPS met trop de temps. Essayez d'aller en extérieur avec une vue dégagée sur le ciel";
                console.error("💡 Solution:", detailedMessage);
                break;
            }
            
            console.error("=== FIN GÉOLOCALISATION (ÉCHEC) ===");
            setError(errorMessage);
            setIsLoading(false);
            hasResolved = true;
            resolve(null);
          }
        },
        options
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
