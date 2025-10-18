import { SOSButtonConfig } from '@/types/sos';

// Configuration du titulaire - à récupérer depuis l'API ou les paramètres
export const TITULAIRE_NAME = "Marie"; // Nom du titulaire - sera dynamique plus tard

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
    title: 'Aide financière',
    icon: '',
    color: '#4CAF50',
    message: 'J\'ai besoin d\'aide pour ma carte.',
    gpsRequired: false,
    amountOptions: [10, 20, 50],
    animation: 'none',
    priority: 'low'
  }
];

export const getSOSButton = (type: string): SOSButtonConfig | undefined => {
  return SOS_BUTTONS.find(button => button.id === type);
};
