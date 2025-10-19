import { SOSButtonConfig } from '@/types/sos';

// Configuration du titulaire - récupérée depuis le token ou localStorage
export const getTitulaireName = (): string => {
  // Essayer de récupérer depuis localStorage (après installation via token)
  const storedName = localStorage.getItem('sos_connect_titulaire');
  if (storedName) {
    return storedName;
  }
  
  // Fallback pour le développement
  return "Marie";
};

export const TITULAIRE_NAME = getTitulaireName();

export const SOS_BUTTONS: SOSButtonConfig[] = [
  {
    id: 'danger',
    title: 'Je suis en danger',
    icon: '',
    color: '#FF4444',
    message: 'Je suis en danger. Aide-moi maintenant.',
    gpsRequired: true,
    animation: 'none',
    priority: 'high'
  },
  {
    id: 'medical',
    title: 'Détresse médicale',
    icon: '',
    color: '#FF6B3D',
    message: 'Je suis en détresse médicale. Aide-moi.',
    gpsRequired: true,
    animation: 'none',
    priority: 'high'
  },
  {
    id: 'pickup',
    title: 'Viens me chercher',
    icon: '',
    color: '#2AA5A0',
    message: 'Viens me chercher. Voici ma position.',
    gpsRequired: true,
    animation: 'none',
    priority: 'medium'
  },
  {
    id: 'financial',
    title: 'Recharge ma carte',
    icon: '',
    color: '#4CAF50',
    message: 'J\'ai besoin d\'une recharge de carte.',
    gpsRequired: false,
    amountOptions: [20, 50, 100],
    animation: 'none',
    priority: 'low'
  }
];

export const getSOSButton = (type: string): SOSButtonConfig | undefined => {
  return SOS_BUTTONS.find(button => button.id === type);
};

// Messages d'aide contextuels affichés en bas de la page principale
export const getHelpMessage = (sosType?: string): string => {
  if (!sosType) {
    return 'Appuyez sur un bouton pour envoyer votre SOS.';
  }

  switch (sosType) {
    case 'danger':
      return 'Mettez-vous en sécurité. Votre position sera partagée.';
    case 'medical':
      return 'Installez-vous confortablement. Aide en route.';
    case 'pickup':
      return 'Restez où vous êtes. Votre position sera envoyée.';
    case 'financial':
      return 'Sélectionnez un montant puis validez la recharge.';
    default:
      return 'Appuyez sur un bouton pour envoyer votre SOS.';
  }
};
