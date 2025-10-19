import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
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
  const sosConfig = getSOSButton(sosType);

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
    return '✓';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container max-w-md mx-auto">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: sosConfig?.color || '#10B981' }}
              />
              <div 
                className="relative w-32 h-32 rounded-full text-white flex items-center justify-center"
                style={{ backgroundColor: sosConfig?.color || '#10B981' }}
              >
                <span className="text-6xl">{getIconForType()}</span>
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
                <div className="text-center mb-3">
                  <span className="text-lg font-semibold">{sosConfig.title}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  "{sosConfig.message}"
                </p>

                        {sosConfig.gpsRequired && (
                          <div className="text-center text-sm">
                            <span className={hasLocation ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                              {hasLocation
                                ? "✅ Position partagée automatiquement"
                                : "⚠️ Position non disponible - SOS envoyé sans géolocalisation"
                              }
                            </span>
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

