import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { TEST_URLS, generateTestUrl } from "@/config/test-tokens";
import { toast } from "sonner";

const TestTokens = () => {
  const navigate = useNavigate();
  const [customName, setCustomName] = useState("Marie");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Lien copié dans le presse-papier");
    } catch (error) {
      toast.error("Impossible de copier le lien");
    }
  };

  const openTestUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const generateCustomUrl = () => {
    return generateTestUrl(customName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="container max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Test Tokens</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Instructions */}
          <Card className="p-4 border-blue-200 bg-blue-50">
            <h2 className="font-semibold text-blue-900 mb-2">🧪 Page de test des tokens</h2>
            <p className="text-sm text-blue-800">
              Cette page permet de tester les différents scénarios d'installation avec des tokens.
              Utilisez les liens ci-dessous pour simuler le partage depuis l'app PayTrip.
            </p>
          </Card>

          {/* Scénarios de test */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Scénarios de test</h2>
            
            {/* Token valide */}
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-900">✅ Token valide</h3>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">SUCCESS</span>
              </div>
              <p className="text-sm text-green-800 mb-3">
                Teste l'installation avec un token valide et non expiré.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openTestUrl(TEST_URLS.VALID)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Tester
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.origin + TEST_URLS.VALID)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
            </Card>

            {/* Token expiré */}
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-orange-900">⏰ Token expiré</h3>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">EXPIRED</span>
              </div>
              <p className="text-sm text-orange-800 mb-3">
                Teste la gestion d'un token expiré.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openTestUrl(TEST_URLS.EXPIRED)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Tester
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.origin + TEST_URLS.EXPIRED)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
            </Card>

            {/* Token invalide */}
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-900">❌ Token invalide</h3>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">ERROR</span>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Teste la gestion d'un token corrompu ou invalide.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openTestUrl(TEST_URLS.INVALID)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Tester
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.origin + TEST_URLS.INVALID)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
            </Card>

            {/* Pas de token */}
            <Card className="p-4 border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">🚫 Pas de token</h3>
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">NO TOKEN</span>
              </div>
              <p className="text-sm text-gray-800 mb-3">
                Teste l'accès sans token (doit rediriger vers l'erreur).
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openTestUrl(TEST_URLS.NO_TOKEN)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Tester
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.origin + TEST_URLS.NO_TOKEN)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
            </Card>
          </div>

          {/* Génération personnalisée */}
          <Card className="p-4 border-purple-200 bg-purple-50">
            <h3 className="font-semibold text-purple-900 mb-3">🎯 Token personnalisé</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-purple-800">Nom du titulaire :</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-purple-300 rounded-md text-sm"
                  placeholder="Marie"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => openTestUrl(generateCustomUrl())}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Tester
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.origin + generateCustomUrl())}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
            </div>
          </Card>

          {/* Informations */}
          <Card className="p-4 border-blue-200 bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informations</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Les tokens de test expirent dans 30 jours</p>
              <p>• Utilisez ces liens pour simuler le partage depuis PayTrip</p>
              <p>• Les tokens réels seront générés par l'API PayTrip</p>
              <p>• Cette page n'est disponible qu'en développement</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TestTokens;

