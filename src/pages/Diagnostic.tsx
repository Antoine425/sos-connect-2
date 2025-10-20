import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Smartphone, Wifi, Battery, Globe } from "lucide-react";
import { toast } from "sonner";

const Diagnostic = () => {
  const navigate = useNavigate();
  const [diagnostics, setDiagnostics] = useState<Record<string, { status: string; details: string }>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [gpsResult, setGpsResult] = useState<{
    lat?: number;
    lng?: number;
    accuracy?: number;
    error?: string;
  } | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics({});
    setGpsResult(null);
    const results: Record<string, { status: string; details: string }> = {};

    // 1. Check if browser supports geolocation
    if ('geolocation' in navigator) {
      results.geolocation = {
        status: '✅',
        details: 'API Geolocation disponible'
      };
    } else {
      results.geolocation = {
        status: '❌',
        details: 'API Geolocation non disponible sur ce navigateur'
      };
    }

    // 2. Check online status
    results.online = {
      status: navigator.onLine ? '✅' : '❌',
      details: navigator.onLine ? 'Connexion Internet active' : 'Hors ligne'
    };

    // 3. Check HTTPS
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    results.https = {
      status: isSecure ? '✅' : '❌',
      details: isSecure ? `Connexion sécurisée (${window.location.protocol})` : 'HTTPS requis pour la géolocalisation'
    };

    // 4. Check user agent (mobile/desktop)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    results.device = {
      status: '📱',
      details: isMobile ? 'Appareil mobile détecté' : 'Ordinateur de bureau détecté'
    };

    // 5. Check permissions API if available
    if ('permissions' in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        results.permission = {
          status: permissionStatus.state === 'granted' ? '✅' : 
                  permissionStatus.state === 'denied' ? '❌' : '⚠️',
          details: `Permission: ${permissionStatus.state === 'granted' ? 'Accordée' : 
                                  permissionStatus.state === 'denied' ? 'Refusée (à réactiver dans les paramètres)' : 
                                  'Non demandée encore'}`
        };
      } catch (e) {
        results.permission = {
          status: '⚠️',
          details: 'Impossible de vérifier les permissions'
        };
      }
    } else {
      results.permission = {
        status: '⚠️',
        details: 'API Permissions non disponible'
      };
    }

    setDiagnostics(results);

    // 6. Try to get GPS location
    if ('geolocation' in navigator && isSecure) {
      toast.info("Test de géolocalisation en cours...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsResult({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          toast.success("Géolocalisation réussie !");
        },
        (error) => {
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permission refusée. Sur mobile, allez dans Paramètres > Safari/Chrome > Autoriser l'accès à la position pour ce site.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Position indisponible. Vérifiez que le GPS est activé dans les paramètres de votre téléphone.";
              break;
            case error.TIMEOUT:
              errorMessage = "Délai d'attente dépassé. Le GPS met trop de temps à répondre.";
              break;
            default:
              errorMessage = "Erreur inconnue.";
          }
          setGpsResult({ error: errorMessage });
          toast.error("Échec de géolocalisation");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }

    setIsRunning(false);
  };

  return (
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
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              🔍 Diagnostic GPS
            </h1>
            <p className="text-sm text-muted-foreground">
              Vérifiez pourquoi la géolocalisation ne fonctionne pas sur votre appareil
            </p>
          </div>

          {/* Run Diagnostic Button */}
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-full"
          >
            {isRunning ? "Diagnostic en cours..." : "Lancer le diagnostic"}
          </Button>

          {/* Results */}
          {Object.keys(diagnostics).length > 0 && (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-soft space-y-4">
              <h2 className="text-lg font-semibold mb-4">Résultats:</h2>
              
              {Object.entries(diagnostics).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3 text-sm">
                  <span className="text-2xl flex-shrink-0">{value.status}</span>
                  <div className="flex-1">
                    <div className="font-medium capitalize">{key}</div>
                    <div className="text-muted-foreground text-xs">{value.details}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GPS Result */}
          {gpsResult && (
            <div className={`bg-card rounded-2xl p-6 border shadow-soft ${
              gpsResult.error ? 'border-red-500' : 'border-green-500'
            }`}>
              <h2 className="text-lg font-semibold mb-4">
                {gpsResult.error ? '❌ Test GPS échoué' : '✅ Test GPS réussi'}
              </h2>
              
              {gpsResult.error ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-600">{gpsResult.error}</p>
                  
                  <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 text-xs space-y-2">
                    <p className="font-semibold">Solutions:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sur <strong>iPhone</strong>: Réglages → Safari → Localisation → Autoriser</li>
                      <li>Sur <strong>Android</strong>: Paramètres → Applications → Chrome → Autorisations → Localisation</li>
                      <li>Activez le <strong>GPS</strong> dans les paramètres de votre téléphone</li>
                      <li>Désactivez le <strong>mode économie d'énergie</strong></li>
                      <li>Essayez de <strong>redémarrer votre navigateur</strong></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-xs bg-muted/50 rounded p-3 space-y-1">
                    <div>📍 Latitude: {gpsResult.lat?.toFixed(6)}</div>
                    <div>📍 Longitude: {gpsResult.lng?.toFixed(6)}</div>
                    {gpsResult.accuracy !== undefined && (
                      <div className={`font-semibold ${
                        gpsResult.accuracy < 20 ? 'text-green-600' :
                        gpsResult.accuracy < 50 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        🎯 Précision: {gpsResult.accuracy.toFixed(0)}m
                      </div>
                    )}
                  </div>
                  
                  <a 
                    href={`https://www.google.com/maps?q=${gpsResult.lat},${gpsResult.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline inline-block font-semibold"
                  >
                    🗺️ Voir sur la carte
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Info Card */}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Pourquoi ça ne marche pas sur mobile?
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Permissions:</strong> Les navigateurs mobiles demandent explicitement l'autorisation</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>HTTPS requis:</strong> La géolocalisation ne fonctionne que sur des sites sécurisés</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>GPS désactivé:</strong> Vérifiez que le GPS est activé dans les paramètres</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Mode éco:</strong> Le mode économie d'énergie peut bloquer le GPS</span>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-full"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4 mt-4">
        <div className="container max-w-md mx-auto flex flex-col items-center gap-2">
          <img 
            src="/sos-connect-2/logo-sos-connect.png" 
            alt="SOS Connect" 
            className="h-8 w-auto object-contain opacity-70"
          />
          <div className="text-xs text-muted-foreground text-center">
            <p>© 2025. PayTrip.fr. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Diagnostic;

