import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, CheckCircle2, AlertTriangle, Heart, MapPin, DollarSign } from "lucide-react";
import { useEffect } from "react";
import { SOSType } from "@/types/sos";
import { getSOSButton, TITULAIRE_NAME } from "@/config/sos-config";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get SOS type and amount from navigation state
  const sosType = location.state?.type as SOSType;
  const amount = location.state?.amount as number;
  const hasLocation = location.state?.hasLocation as boolean;
  // CORRECTION: utiliser "coordinates" au lieu de "location" pour éviter conflit
  const gpsLocation = location.state?.coordinates as { lat: number; lng: number; accuracy?: number } | null;
  const sosConfig = getSOSButton(sosType);

  // Debug logs
  console.log("=== PAGE CONFIRMATION ===");
  console.log("hasLocation:", hasLocation);
  console.log("gpsLocation:", gpsLocation);
  console.log("Type de gpsLocation:", typeof gpsLocation);
  console.log("State complet:", location.state);

  useEffect(() => {
    // Optional: Auto-redirect after some time
    const timer = setTimeout(() => {
      // navigate("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getConfirmationMessage = () => {
    if (!sosConfig) return "Votre alerte a été envoyée.";
    
    switch (sosType) {
      case 'danger':
        return `Votre alerte de danger a été envoyée à ${TITULAIRE_NAME}.`;
      case 'medical':
        return `Votre alerte médicale a été transmise à ${TITULAIRE_NAME}.`;
      case 'pickup':
        return `Votre position a été envoyée à ${TITULAIRE_NAME}.`;
      case 'financial':
        return `Votre demande d'aide de ${amount}€ a été envoyée à ${TITULAIRE_NAME}.`;
      default:
        return `Votre SOS a été envoyé avec succès à ${TITULAIRE_NAME} !`;
    }
  };

  const getIconForType = () => {
    switch (sosType) {
      case 'danger':
        return <AlertTriangle className="w-12 h-12" strokeWidth={2.5} />;
      case 'medical':
        return <Heart className="w-12 h-12" strokeWidth={2.5} />;
      case 'pickup':
        return <MapPin className="w-12 h-12" strokeWidth={2.5} />;
      case 'financial':
        return <DollarSign className="w-12 h-12" strokeWidth={2.5} />;
      default:
        return <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container max-w-md mx-auto">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full animate-pulse opacity-30"
                style={{ backgroundColor: sosConfig?.color || '#10B981' }}
              />
              <div 
                className="relative w-20 h-20 rounded-full text-white flex items-center justify-center shadow-lg"
                style={{ backgroundColor: sosConfig?.color || '#10B981' }}
              >
                {getIconForType()}
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {getConfirmationMessage()}
            </h1>
            
            {sosConfig && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                        {sosConfig.gpsRequired && (
                          <div className="text-center text-sm space-y-3">
                            {/* Message seulement si pas de position */}
                            {!hasLocation && (
                              <span className="text-orange-600 font-semibold text-base">
                                ⚠️ Position non disponible - SOS envoyé sans géolocalisation
                              </span>
                            )}
                            
                            {/* Debug: Position reçue mais pas d'objet gpsLocation */}
                            {hasLocation && !gpsLocation && (
                              <div className="mt-3 text-xs bg-red-50 dark:bg-red-950 border border-red-300 rounded-lg p-3">
                                <div className="text-red-600 font-semibold mb-1">⚠️ Debug: Position marquée comme partagée mais coordonnées non disponibles</div>
                                <div className="text-red-600 text-xs">Ouvrez la console pour voir les détails (hasLocation=true mais gpsLocation=null)</div>
                              </div>
                            )}
                            
                            {/* Affichage des coordonnées GPS */}
                            {hasLocation && gpsLocation && (
                              <div className="mt-3 bg-green-50 dark:bg-green-950/30 border-2 border-green-300 dark:border-green-800 rounded-lg p-4 space-y-3">
                                {/* Titre */}
                                <div className="text-green-800 dark:text-green-200 font-bold text-base">
                                  ✅ Position partagée avec succès
                                </div>
                                
                                {/* Précision de la position */}
                                {gpsLocation.accuracy !== undefined && (
                                  <div className={`font-semibold text-base ${
                                    gpsLocation.accuracy < 20 ? 'text-green-600' :
                                    gpsLocation.accuracy < 50 ? 'text-blue-600' :
                                    gpsLocation.accuracy < 100 ? 'text-orange-600' :
                                    'text-red-600'
                                  }`}>
                                    🎯 Précision: {gpsLocation.accuracy.toFixed(0)}m
                                    {gpsLocation.accuracy < 20 && ' (Excellente)'}
                                    {gpsLocation.accuracy >= 20 && gpsLocation.accuracy < 50 && ' (Très bonne)'}
                                    {gpsLocation.accuracy >= 50 && gpsLocation.accuracy < 100 && ' (Bonne)'}
                                    {gpsLocation.accuracy >= 100 && ' (Approximative)'}
                                  </div>
                                )}
                                
                                {/* Coordonnées */}
                                <div className="text-foreground font-mono space-y-1.5 text-sm bg-white dark:bg-gray-900 rounded p-3">
                                  <div className="font-semibold">📍 Latitude: {gpsLocation.lat.toFixed(6)}</div>
                                  <div className="font-semibold">📍 Longitude: {gpsLocation.lng.toFixed(6)}</div>
                                </div>
                                
                                {/* Lien vers Google Maps */}
                                <a 
                                  href={`https://www.google.com/maps?q=${gpsLocation.lat},${gpsLocation.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-center text-blue-600 hover:text-blue-800 underline text-sm font-medium py-1 transition-colors"
                                >
                                  Voir sur Google Maps
                                </a>
                              </div>
                            )}
                          </div>
                        )}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
            <p className="text-base text-muted-foreground leading-relaxed">
              Restez calme. {TITULAIRE_NAME} a été prévenu et vous recevrez une réponse rapidement.
              Restez à proximité de votre téléphone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 px-4 mt-8">
          <div className="container max-w-md mx-auto flex flex-col items-center gap-2">
            <img 
              src="/sos-connect-2/logo-sos-connect.png" 
              alt="SOS Connect" 
              className="h-8 w-auto object-contain opacity-70"
            />
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground text-center">
              <p>© 2025. PayTrip.fr. Tous droits réservés.</p>
              <div className="flex gap-2">
                <a 
                  href="https://paytrip.fr/mentions-legales" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline transition-colors"
                >
                  Mentions légales
                </a>
                <span>/</span>
                <a 
                  href="https://paytrip.fr/confidentialite" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground underline transition-colors"
                >
                  Confidentialité
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Confirmation;

