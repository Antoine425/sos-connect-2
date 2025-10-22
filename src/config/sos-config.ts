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
    id: 'financial',
    title: 'SOS Finance',
    icon: '',
    color: '#FF521C',
    message: 'Demande d\'aide financière.',
    gpsRequired: true,
    amountOptions: [20, 50, 100],
    animation: 'none',
    priority: 'medium'
  },
  {
    id: 'security',
    title: 'SOS Sécurité',
    icon: '',
    color: '#DC2626',
    message: 'Demande d\'aide pour sécurité.',
    gpsRequired: true,
    animation: 'none',
    priority: 'high'
  },
  {
    id: 'medical',
    title: 'SOS Santé',
    icon: '',
    color: '#059669',
    message: 'Demande d\'aide médicale.',
    gpsRequired: true,
    animation: 'none',
    priority: 'high'
  },
  {
    id: 'location',
    title: 'SOS Localisation',
    icon: '',
    color: '#2563EB',
    message: 'Demande de partage de localisation.',
    gpsRequired: true,
    animation: 'none',
    priority: 'medium'
  }
];

export const getSOSButton = (type: string): SOSButtonConfig | undefined => {
  return SOS_BUTTONS.find(button => button.id === type);
};

// Messages d'aide contextuels affichés en bas de la page principale
export const getHelpMessage = (sosType?: string): string => {
  if (!sosType) {
    return 'Sélectionnez un type d\'assistance pour envoyer votre demande.';
  }

  switch (sosType) {
    case 'financial':
      return 'Sélectionnez un montant pour votre demande financière.';
    case 'security':
      return 'Votre position sera partagée pour assurer votre sécurité.';
    case 'medical':
      return 'Votre position sera partagée pour l\'assistance médicale.';
    case 'location':
      return 'Votre position sera partagée avec votre titulaire.';
    default:
      return 'Sélectionnez un type d\'assistance pour envoyer votre demande.';
  }
};
