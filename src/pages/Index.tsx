import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SOSButtonsGrid } from "@/components/SOSButtonsGrid";
import { Button } from "@/components/ui/button";
import { History, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { SOSType } from "@/types/sos";
import { SOS_BUTTONS, TITULAIRE_NAME } from "@/config/sos-config";
import { useGeolocation } from "@/hooks/useGeolocation";

const Index = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSOSType, setCurrentSOSType] = useState<SOSType | null>(null);
  const { requestLocation } = useGeolocation();

  const handleSOSClick = async (type: SOSType, amount?: number) => {
    setCurrentSOSType(type);

    try {
      // Get location if required BEFORE showing "sending" screen
      let location = null;
      const sosConfig = SOS_BUTTONS.find(btn => btn.id === type);
      
      if (sosConfig?.gpsRequired) {
        location = await requestLocation();
        
        if (!location) {
          toast.error("Le SOS sera envoyé sans géolocalisation");
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
      navigate("/confirmation", { state: { type, amount, hasLocation: !!location } });
    } catch (error) {
      console.error("Error sending SOS:", error);
      toast.error("Erreur lors de l'envoi du SOS");
    } finally {
      setIsSubmitting(false);
      setCurrentSOSType(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="container max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">SOS HELP</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/history")}
            className="rounded-full"
          >
            <History className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <div className="space-y-10">
          {/* Instructions */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                SOS CONNECT
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-sm mx-auto">
              En cas de besoin, choisissez votre situation et <span className="font-semibold text-foreground">{TITULAIRE_NAME}</span> sera immédiatement alerté.
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
                    Envoi en cours...
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Votre SOS est en cours d'envoi à {TITULAIRE_NAME}.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Restez calme.</strong> Votre position est partagée automatiquement. 
                    {TITULAIRE_NAME} recevra votre demande et vous répondra rapidement.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="py-6">
                <SOSButtonsGrid 
                  onSOSClick={handleSOSClick} 
                  disabled={isSubmitting}
                />
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-base text-muted-foreground font-medium">
                  Restez calme. Votre message sera envoyé instantanément.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
