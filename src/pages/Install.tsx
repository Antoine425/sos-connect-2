import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Stethoscope, Car, CreditCard } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInstalling, setIsInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [tokenData, setTokenData] = useState<{beneficiaryName?: string} | null>(null);

  useEffect(() => {
    // Récupérer le token depuis l'URL (version simplifiée)
    const urlParams = new URLSearchParams(location.search);
    const name = urlParams.get('name');

    if (name) {
      setTokenData({ beneficiaryName: name });
      // Stocker le nom pour l'app
      localStorage.setItem('sos_connect_titulaire', name);
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [location.search]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Rediriger vers l'app si pas de prompt disponible
      navigate("/");
      return;
    }

    setIsInstalling(true);
    
    try {
      // Afficher le prompt d'installation
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installée avec succès');
      } else {
        console.log('Installation annulée');
      }
      
      setDeferredPrompt(null);
      
      // Rediriger vers l'app après installation
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      navigate("/");
    } finally {
      setIsInstalling(false);
    }
  };

  const handleSkipInstall = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-24">
      <div className="w-full px-4 py-6">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src="/sos-connect-2/logo-sos-connect.png" 
              alt="SOS Connect" 
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Baseline personnalisée */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              En cas d'urgence, vous pouvez compter sur{" "}
              <span className="text-primary">
                {tokenData?.beneficiaryName || "votre proche"}
              </span>
            </h1>
          </div>

          {/* Bouton de téléchargement */}
          <div className="space-y-3">
            {deferredPrompt ? (
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-lg shadow-lg"
              >
                {isInstalling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Installation en cours...
                  </>
                ) : (
                  "Ajouter SOS Connect à mon écran d'accueil"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSkipInstall}
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-lg shadow-lg"
              >
                Ajouter SOS Connect à mon écran d'accueil
              </Button>
            )}
          </div>

          {/* Fonctionnalités */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-border">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground">
              4 boutons pour alerter rapidement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-base mb-1">Je suis en danger</h3>
                  <p className="text-sm text-muted-foreground">
                    Alerte immédiate avec votre position GPS exacte
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-base mb-1">Détresse médicale</h3>
                  <p className="text-sm text-muted-foreground">
                    Besoin de soins d'urgence avec localisation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-base mb-1">Viens me chercher</h3>
                  <p className="text-sm text-muted-foreground">
                    Demande de transport avec votre position
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-base mb-1">Recharge ma carte</h3>
                  <p className="text-sm text-muted-foreground">
                    Demande d'aide financière rapide
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fonctionnement */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-border">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground">
              Comment ça fonctionne ?
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Installation simple</h3>
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur le bouton de téléchargement ci-dessus et ajoutez l'application à votre écran d'accueil
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Un bouton, une alerte</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez le bouton correspondant à votre situation. Votre proche reçoit instantanément une notification avec votre position exacte
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Localisation automatique</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre position GPS est automatiquement partagée pour une intervention rapide
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Fonctionne partout</h3>
                  <p className="text-sm text-muted-foreground">
                    L'application fonctionne même hors ligne et ne nécessite pas de connexion permanente
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Install;
