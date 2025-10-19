// Configuration pour l'intégration avec PayTrip
export const PAYTRIP_CONFIG = {
  // URL de l'API PayTrip (à configurer selon l'environnement)
  API_ENDPOINT: process.env.VITE_PAYTRIP_API_URL || 'https://api.paytrip.fr/sos-connect',
  
  // Durée de validité des tokens (30 jours par défaut)
  TOKEN_EXPIRY_DAYS: 30,
  
  // Claims supportés dans les tokens JWT
  SUPPORTED_CLAIMS: {
    USER_ID: 'userId',
    BENEFICIARY_NAME: 'beneficiaryName',
    EXPIRES_AT: 'expiresAt',
    PERMISSIONS: 'permissions'
  },
  
  // Permissions disponibles
  PERMISSIONS: {
    SOS_SEND: 'sos_send',
    LOCATION_SHARE: 'location_share',
    FINANCIAL_REQUEST: 'financial_request'
  }
} as const;

// Types pour la validation des tokens
export interface PayTripTokenPayload {
  userId: string;
  beneficiaryName: string;
  expiresAt: number;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: PayTripTokenPayload;
  error?: string;
}

// Messages d'erreur pour l'utilisateur
export const TOKEN_ERROR_MESSAGES = {
  INVALID_TOKEN: 'Lien invalide ou corrompu',
  EXPIRED_TOKEN: 'Ce lien a expiré. Demandez un nouveau lien à votre contact.',
  MISSING_TOKEN: 'Aucun lien de partage trouvé',
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite'
} as const;

