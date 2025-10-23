import React from 'react';
import { SOSType } from '@/types/sos';
import { SOS_BUTTONS } from '@/config/sos-config';
import { Heart, AlertTriangle, MapPin, DollarSign } from 'lucide-react';

interface SOSLoaderProps {
  type: SOSType;
  amount?: number;
  isGettingLocation?: boolean;
}

const SOSLoader = ({ type, amount, isGettingLocation = false }: SOSLoaderProps) => {
  const sosConfig = SOS_BUTTONS.find(btn => btn.id === type);
  
  const getIconForType = () => {
    switch (type) {
      case 'security':
        return <AlertTriangle className="w-16 h-16" strokeWidth={2.5} />;
      case 'medical':
        return <Heart className="w-16 h-16" strokeWidth={2.5} />;
      case 'location':
        return <MapPin className="w-16 h-16" strokeWidth={2.5} />;
      case 'financial':
        return <DollarSign className="w-16 h-16" strokeWidth={2.5} />;
      default:
        return <AlertTriangle className="w-16 h-16" strokeWidth={2.5} />;
    }
  };

  const getMessage = () => {
    if (isGettingLocation) {
      return "Obtention de votre position haute précision...";
    }
    
    switch (type) {
      case 'security':
        return "Envoi de votre alerte de sécurité...";
      case 'medical':
        return "Transmission de votre alerte médicale...";
      case 'location':
        return "Partage de votre position...";
      case 'financial':
        return amount ? `Envoi de votre demande de ${amount}€...` : "Envoi de votre demande financière...";
      default:
        return "Envoi de votre demande SOS...";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icône animée */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Cercle de pulsation */}
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: sosConfig?.color || '#DC2626' }}
              />
              <div 
                className="relative w-24 h-24 rounded-full text-white flex items-center justify-center shadow-lg"
                style={{ backgroundColor: sosConfig?.color || '#DC2626' }}
              >
                {getIconForType()}
              </div>
            </div>
          </div>

          {/* Message principal */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {sosConfig?.title || 'SOS'}
            </h2>
            <p className="text-muted-foreground">
              {getMessage()}
            </p>
          </div>

          {/* Barre de progression animée */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full animate-pulse"
                style={{ 
                  backgroundColor: sosConfig?.color || '#DC2626',
                  animation: 'progress 2s ease-in-out infinite'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>En cours...</span>
              <span>Veuillez patienter</span>
            </div>
          </div>

          {/* Points d'animation */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour l'animation de progression */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SOSLoader;
