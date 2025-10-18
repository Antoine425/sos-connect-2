import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Download, Share, X } from "lucide-react";
import { toast } from "sonner";

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Request location permission on first visit
    const requestLocationPermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        if (permission.state !== 'granted') {
          // Request location permission
          navigator.geolocation.getCurrentPosition(
            () => {
              console.log("Location permission granted");
            },
            () => {
              console.log("Location permission denied");
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }
    };

    requestLocationPermission();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.error("L'installation automatique n'est pas disponible");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast.success("Application installée avec succès !");
      setDeferredPrompt(null);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="container max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-accent rounded-full p-6">
              <AlertCircle className="w-16 h-16 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Application déjà installée</h1>
          <p className="text-muted-foreground">
            SOS HELP est déjà installé sur votre appareil.
          </p>
          <Button onClick={() => navigate("/")} size="lg" className="w-full rounded-full">
            Aller à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-md mx-auto px-4 py-8">
        <div className="space-y-8 animate-fade-in-up">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 rounded-3xl p-8">
                <AlertCircle className="w-24 h-24 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">Installez SOS HELP</h2>
            <p className="text-lg text-muted-foreground">
              Ajoutez l'icône sur votre téléphone pour contacter votre titulaire en un clic.
            </p>
          </div>

          {/* Benefits */}
          <Card className="p-6 space-y-4 border-border shadow-soft">
            <h3 className="text-lg font-semibold">Pourquoi installer ?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-accent rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                </div>
                <span className="text-muted-foreground">
                  Accès rapide depuis votre écran d'accueil
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-accent rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                </div>
                <span className="text-muted-foreground">
                  Fonctionne même sans connexion internet
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-accent rounded-full p-1 mt-1">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                </div>
                <span className="text-muted-foreground">
                  Notifications instantanées des réponses
                </span>
              </li>
            </ul>
          </Card>

          {/* Install Instructions */}
          {isIOS ? (
            <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share className="w-5 h-5 text-primary" />
                Installation sur iOS
              </h3>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Appuyez sur le bouton Partager en bas de Safari</li>
                <li>Faites défiler et sélectionnez "Sur l'écran d'accueil"</li>
                <li>Appuyez sur "Ajouter" en haut à droite</li>
              </ol>
            </Card>
          ) : deferredPrompt ? (
              <Button
                onClick={handleInstall}
                size="lg"
                className="w-full h-16 text-lg rounded-full"
              >
                <Download className="w-6 h-6 mr-2" />
                Installer l'application
              </Button>
          ) : (
            <Card className="p-6 space-y-4 border-border">
              <p className="text-muted-foreground">
                Pour installer cette application, ouvrez le menu de votre navigateur
                et sélectionnez "Ajouter à l'écran d'accueil" ou "Installer l'application".
              </p>
            </Card>
          )}

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg rounded-full"
          >
            Continuer sans installer
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Install;
