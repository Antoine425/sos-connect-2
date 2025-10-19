import { useState, useCallback } from 'react';
import { PayTripTokenPayload, TokenValidationResult, PAYTRIP_CONFIG, TOKEN_ERROR_MESSAGES } from '@/config/paytrip-config';

interface UsePayTripTokenReturn {
  token: string | null;
  tokenData: PayTripTokenPayload | null;
  isLoading: boolean;
  error: string | null;
  validateToken: (token: string) => Promise<TokenValidationResult>;
  clearToken: () => void;
}

export const usePayTripToken = (): UsePayTripTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<PayTripTokenPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateToken = useCallback(async (tokenToValidate: string): Promise<TokenValidationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Pour l'instant, on simule la validation côté client
      // En production, cela devrait être fait côté serveur pour la sécurité
      const payload = parseJWTToken(tokenToValidate);
      
      if (!payload) {
        const result: TokenValidationResult = {
          valid: false,
          error: TOKEN_ERROR_MESSAGES.INVALID_TOKEN
        };
        setError(result.error);
        setIsLoading(false);
        return result;
      }

      // Vérifier l'expiration
      if (payload.expiresAt && payload.expiresAt < Date.now()) {
        const result: TokenValidationResult = {
          valid: false,
          error: TOKEN_ERROR_MESSAGES.EXPIRED_TOKEN
        };
        setError(result.error);
        setIsLoading(false);
        return result;
      }

      // Token valide
      setToken(tokenToValidate);
      setTokenData(payload);
      
      const result: TokenValidationResult = {
        valid: true,
        payload
      };
      setIsLoading(false);
      return result;

    } catch (err) {
      const result: TokenValidationResult = {
        valid: false,
        error: TOKEN_ERROR_MESSAGES.UNKNOWN_ERROR
      };
      setError(result.error);
      setIsLoading(false);
      return result;
    }
  }, []);

  const clearToken = useCallback(() => {
    setToken(null);
    setTokenData(null);
    setError(null);
  }, []);

  return {
    token,
    tokenData,
    isLoading,
    error,
    validateToken,
    clearToken
  };
};

// Fonction utilitaire pour parser un token JWT (version simplifiée pour le développement)
// En production, cette validation doit être faite côté serveur
const parseJWTToken = (token: string): PayTripTokenPayload | null => {
  try {
    // Décoder le token JWT (partie payload)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // Vérifier que le payload contient les champs requis
    if (!payload.userId || !payload.beneficiaryName) {
      return null;
    }

    return payload as PayTripTokenPayload;
  } catch (error) {
    console.error('Erreur lors du parsing du token:', error);
    return null;
  }
};

