// Tokens de test pour le développement
// En production, ces tokens seraient générés par l'API PayTrip

import { PayTripTokenPayload } from './paytrip-config';

// Token de test valide (expire dans 30 jours)
export const TEST_TOKEN_VALID = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYXJpZV8xMjMiLCJiZW5lZmljaWFyeU5hbWUiOiJKZWFuIiwiZXhwaXJlc0F0IjoxNzM3MDA4NjAwMDAwLCJwZXJtaXNzaW9ucyI6WyJzb3Nfc2VuZCIsImxvY2F0aW9uX3NoYXJlIiwiZmluYW5jaWFsX3JlcXVlc3QiXX0.test-signature";

// Token de test expiré
export const TEST_TOKEN_EXPIRED = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYXJpZV8xMjMiLCJiZW5lZmljaWFyeU5hbWUiOiJKZWFuIiwiZXhwaXJlc0F0IjoxNzA4MDA4NjAwMDAwLCJwZXJtaXNzaW9ucyI6WyJzb3Nfc2VuZCJdfQ.expired-signature";

// Token de test invalide (corrompu)
export const TEST_TOKEN_INVALID = "invalid.token.here";

// Payload de test
export const TEST_PAYLOAD: PayTripTokenPayload = {
  userId: "marie_123",
  beneficiaryName: "Jean",
  expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 jours
  permissions: ["sos_send", "location_share", "financial_request"]
};

// URLs de test pour les différents scénarios
export const TEST_URLS = {
  VALID: `/install?token=${TEST_TOKEN_VALID}&name=Marie`,
  EXPIRED: `/install?token=${TEST_TOKEN_EXPIRED}&name=Marie`,
  INVALID: `/install?token=${TEST_TOKEN_INVALID}&name=Marie`,
  NO_TOKEN: `/install?name=Marie`,
  NO_PARAMS: `/install`
};

// Fonction pour générer un token de test avec un nom personnalisé
export const generateTestToken = (beneficiaryName: string): string => {
  const payload = {
    ...TEST_PAYLOAD,
    beneficiaryName,
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
  };
  
  // Encoder le payload en base64 (version simplifiée pour les tests)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadB64 = btoa(JSON.stringify(payload));
  const signature = "test-signature";
  
  return `${header}.${payloadB64}.${signature}`;
};

// Fonction pour générer une URL de test
export const generateTestUrl = (beneficiaryName: string): string => {
  const token = generateTestToken(beneficiaryName);
  return `/install?token=${token}&name=${encodeURIComponent(beneficiaryName)}`;
};

