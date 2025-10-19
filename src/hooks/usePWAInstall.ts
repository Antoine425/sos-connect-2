import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface UsePWAInstallReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  install: () => Promise<void>;
  isInstalling: boolean;
}

export const usePWAInstall = (): UsePWAInstallReturn => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      // Vérifier si on est dans une PWA installée
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true; // iOS Safari
      
      setIsInstalled(isStandalone || isInApp);
    };

    checkIfInstalled();

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsInstalling(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<void> => {
    if (!installPrompt) {
      throw new Error('Installation non disponible');
    }

    setIsInstalling(true);

    try {
      // Afficher le prompt d'installation
      await installPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installée avec succès');
      } else {
        console.log('Installation annulée par l\'utilisateur');
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      throw error;
    } finally {
      setIsInstalling(false);
    }
  };

  return {
    isInstallable: !!installPrompt,
    isInstalled,
    installPrompt,
    install,
    isInstalling
  };
};

