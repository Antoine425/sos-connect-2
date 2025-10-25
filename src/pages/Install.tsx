import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Stethoscope, Car, CreditCard, CheckCircle2, Smartphone } from "lucide-react";
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
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Vérifier si on est déjà dans l'app installée
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const iosStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(standalone || iosStandalone);
      
      if (standalone || iosStandalone) {
        // Si on est déjà dans l'app installée, rediriger vers l'app
        navigate("/");
      }
    };

    checkStandalone();

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

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      console.log('Application installée via événement appinstalled');
      setInstallSuccess(true);
      setDeferredPrompt(null);
      setIsInstalling(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [location.search, navigate]);

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
        // Attendre que l'installation se termine
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Vérifier si l'app a été installée
        const isStandaloneNow = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSNow = (window.navigator as any).standalone === true;
        
        if (isStandaloneNow || isIOSNow) {
          // Si l'événement appinstalled n'a pas été déclenché, afficher quand même le succès
          if (!installSuccess) {
            setInstallSuccess(true);
          }
        } else {
          // L'installation a été acceptée mais on n'est pas encore dans l'app installée
          // Attendre un peu plus et afficher le succès
          setTimeout(() => {
            setInstallSuccess(true);
          }, 1000);
        }
      } else {
        console.log('Installation annulée');
      }
      
      setDeferredPrompt(null);
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

  const handleContinueToApp = () => {
    // Essayer de fermer l'onglet (peut être bloqué par certains navigateurs)
    window.close();
    
    // Si l'onglet ne se ferme pas, rediriger vers l'app
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  // Afficher l'écran de succès
  if (installSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Installation réussie !
            </h1>
            <p className="text-gray-600">
              L'application SOS Connect a été installée sur votre appareil.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-left space-y-3">
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">Pour ouvrir l'application :</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>Fermez cet onglet du navigateur</li>
                  <li>Recherchez l'icône "SOS Connect" sur votre écran d'accueil</li>
                  <li>Appuyez sur l'icône pour lancer l'application</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleContinueToApp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Fermer et ouvrir l'application
            </Button>
            
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Continuer dans le navigateur
            </Button>
          </div>

          <p className="text-xs text-gray-500 pt-4">
            💡 Pour une meilleure expérience, utilisez l'icône installée sur votre écran d'accueil
          </p>
        </div>
      </div>
    );
  }

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
