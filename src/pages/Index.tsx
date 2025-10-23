import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SOSButtonsGrid } from "@/components/SOSButtonsGrid";
import { MobileDebugConsole } from "@/components/MobileDebugConsole";
import BottomNavigation from "@/components/BottomNavigation";
import SOSLoader from "@/components/SOSLoader";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { SOSType } from "@/types/sos";
import { SOS_BUTTONS, TITULAIRE_NAME, getHelpMessage } from "@/config/sos-config";
import { useGeolocation } from "@/hooks/useGeolocation";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSOSType, setCurrentSOSType] = useState<SOSType | null>(null);
  const [currentAmount, setCurrentAmount] = useState<number | undefined>(undefined);
  const [selectedSOSType, setSelectedSOSType] = useState<SOSType | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { requestLocation } = useGeolocation();
  
  // Enable debug console with ?debug=true URL parameter
  const showDebugConsole = searchParams.get('debug') === 'true';

  const handleSOSClick = async (type: SOSType, amount?: number) => {
    setCurrentSOSType(type);
    setCurrentAmount(amount);

    try {
      // Get location if required BEFORE showing "sending" screen
      let location = null;
      const sosConfig = SOS_BUTTONS.find(btn => btn.id === type);
      
      if (sosConfig?.gpsRequired) {
        console.log("🔍 Géolocalisation requise, tentative d'obtention de la position...");
        console.log("📱 User Agent:", navigator.userAgent);
        console.log("🔒 Protocol:", window.location.protocol);
        console.log("🌐 Hostname:", window.location.hostname);
        console.log("🧭 Geolocation disponible:", 'geolocation' in navigator);
        
        setIsGettingLocation(true);
        
        location = await requestLocation();
        setIsGettingLocation(false);
        
        if (!location) {
          console.error("❌ ÉCHEC GÉOLOCALISATION - Aucune position retournée");
          console.error("Vérifiez la console pour voir les erreurs détaillées");
          
          // Message d'erreur plus visible
          toast.error("❌ Impossible d'obtenir votre position", { 
            duration: 5000,
            description: "Cliquez sur 'Diagnostic GPS' en bas de page pour identifier le problème"
          });
          return; // Arrêter le processus si la géolocalisation échoue
        } else {
          console.log("✅ Géolocalisation réussie:", location);
        }
      }

      // Now show the "sending" screen
      setIsSubmitting(true);

      // Simulate sending SOS
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("SOS sent:", {
        type,
        amount: amount || null,
        message: sosConfig?.message,
        location,
        timestamp: new Date().toISOString(),
      });

      // Navigate to confirmation with SOS type
      console.log("=== AVANT NAVIGATION ===");
      console.log("type:", type);
      console.log("amount:", amount);
      console.log("hasLocation:", !!location);
      console.log("coordinates (location):", location);
      console.log("Objet complet state:", { 
        type, 
        amount, 
        hasLocation: !!location, 
        coordinates: location 
      });
      
      navigate("/confirmation", { 
        state: { 
          type, 
          amount, 
          hasLocation: !!location, 
          coordinates: location // Renommé pour éviter conflit avec React Router "location"
        } 
      });
    } catch (error) {
      console.error("Error sending SOS:", error);
      toast.error("Erreur lors de l'envoi du SOS");
    } finally {
      setIsSubmitting(false);
      setIsGettingLocation(false);
      setCurrentSOSType(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
          <div className="container max-w-md mx-auto flex items-center justify-center">
            <img 
              src="/sos-connect-2/logo-sos-connect.png" 
              alt="SOS Connect" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container max-w-md mx-auto px-4 py-6 pb-24">
        <div className="space-y-4">
          {/* Instructions */}
          <div className="text-center">
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
              En cas de besoin,<br />
              <span className="font-semibold text-foreground">{TITULAIRE_NAME}</span> sera immédiatement alerté.
            </p>
          </div>

          {/* SOS Buttons Grid ou Message d'envoi */}
          {isSubmitting && currentSOSType ? (
            <div className="py-8 space-y-6">
              {/* Message d'envoi en cours */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-accent rounded-full p-6 animate-pulse">
                    <AlertCircle className="w-12 h-12 text-accent-foreground" strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {isGettingLocation ? "Obtention de votre position..." : "Envoi en cours..."}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {isGettingLocation 
                      ? "Veuillez autoriser la géolocalisation dans votre navigateur" 
                      : `Votre SOS est en cours d'envoi à ${TITULAIRE_NAME}.`
                    }
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isGettingLocation ? (
                      <>
                        <strong>🎯 Géolocalisation haute précision en cours...</strong><br/>
                        Votre navigateur va vous demander l'autorisation d'accéder à votre position. 
                        Cliquez sur "Autoriser" pour partager votre localisation exacte avec {TITULAIRE_NAME}.<br/>
                        <span className="text-xs text-muted-foreground/80 mt-2 block">
                          Le GPS peut prendre quelques secondes pour obtenir la meilleure précision possible.
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>Restez calme.</strong> Votre position précise a été partagée automatiquement. 
                        {TITULAIRE_NAME} recevra votre demande et vous répondra rapidement.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
                      <SOSButtonsGrid
                        onSOSClick={(type, amount) => {
                          setSelectedSOSType(type);
                          handleSOSClick(type, amount);
                        }}
                        selectedType={selectedSOSType}
                      />

                {/* Help Text - Contextuel selon le bouton sélectionné */}
                <div className="text-center mt-2">
                  <p className="text-base text-muted-foreground font-medium">
                    {getHelpMessage(selectedSOSType || undefined)}
                  </p>
                </div>
              </>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
      
      {/* SOS Loader */}
      {(isSubmitting || isGettingLocation) && (
        <SOSLoader 
          type={currentSOSType || 'security'} 
          amount={currentAmount}
          isGettingLocation={isGettingLocation}
        />
      )}
      
      {/* Mobile Debug Console (activate with ?debug=true) */}
      {showDebugConsole && <MobileDebugConsole />}
    </>
  );
};

export default Index;
