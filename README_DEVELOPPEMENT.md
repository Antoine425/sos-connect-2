# SOS Connect - Guide de développement

## 🚀 Démarrage rapide

### Installation
```bash
npm install
npm run dev
```

### URLs de test
- **App principale :** http://localhost:8089/
- **Page d'installation :** http://localhost:8089/install
- **Test des tokens :** http://localhost:8089/test-tokens

## 🧪 Tests des tokens

### Accès à la page de test
Naviguez vers `/test-tokens` pour accéder à la page de démonstration des tokens.

### Scénarios disponibles :
1. **Token valide** - Installation réussie
2. **Token expiré** - Gestion d'erreur avec message
3. **Token invalide** - Gestion d'erreur avec message
4. **Pas de token** - Redirection vers erreur
5. **Token personnalisé** - Génération avec nom personnalisé

### Exemple d'URL de test :
```
http://localhost:8089/install?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&name=Marie
```

## 🔧 Architecture technique

### Structure des fichiers :
```
src/
├── config/
│   ├── paytrip-config.ts     # Configuration PayTrip
│   ├── sos-config.ts         # Configuration SOS
│   └── test-tokens.ts        # Tokens de test
├── hooks/
│   ├── usePayTripToken.ts    # Gestion des tokens
│   ├── usePWAInstall.ts      # Installation PWA
│   └── useGeolocation.ts     # Géolocalisation
├── pages/
│   ├── Index.tsx             # Page principale
│   ├── Install.tsx           # Page d'installation
│   ├── TestTokens.tsx        # Page de test
│   └── Confirmation.tsx      # Page de confirmation
└── types/
    └── sos.ts               # Types TypeScript
```

### Flux d'installation :
1. **PayTrip** génère un token JWT
2. **Lien partagé** vers `/install?token=...&name=...`
3. **Validation** du token côté frontend
4. **Installation** PWA avec prompt
5. **Stockage** du token dans localStorage
6. **Redirection** vers l'app principale

## 🔐 Sécurité

### Tokens JWT :
- **Validation** côté frontend (développement)
- **Validation** côté serveur (production)
- **Expiration** configurable (30 jours par défaut)
- **Permissions** granulaires

### Données stockées :
- `sos_connect_token` : Token JWT
- `sos_connect_titulaire` : Nom du titulaire

## 📱 PWA

### Installation :
- **Prompt automatique** sur navigateurs compatibles
- **Instructions manuelles** pour iOS Safari
- **Détection** de l'état d'installation

### Manifest :
- **Icône** : `/icon-192.png`, `/icon-512.png`
- **Nom** : SOS Connect
- **Thème** : Auto
- **Affichage** : Standalone

## 🌐 Intégration PayTrip

### API Endpoints requis :
```typescript
// Génération de token
POST /api/sos-connect/generate-token
{
  "beneficiaryName": "Jean",
  "permissions": ["sos_send", "location_share"]
}

// Validation de token (optionnel)
GET /api/sos-connect/validate-token?token=...

// Réception des SOS
POST /api/sos-connect/sos-sent
{
  "token": "...",
  "sosType": "danger",
  "location": {...},
  "message": "..."
}
```

### Format du token JWT :
```json
{
  "userId": "marie_123",
  "beneficiaryName": "Jean",
  "expiresAt": 1737008600000,
  "permissions": ["sos_send", "location_share", "financial_request"]
}
```

## 🚨 Types de SOS

### Configuration actuelle :
- **Danger** : Alerte immédiate avec géolocalisation
- **Médical** : Urgence médicale avec géolocalisation
- **Transport** : Demande de transport avec géolocalisation
- **Financier** : Recharge de carte sans géolocalisation

### Messages personnalisés :
- **Titulaire** : Nom récupéré depuis le token
- **Géolocalisation** : Statut affiché dans la confirmation
- **Montants** : Options fixes (20€, 50€, 100€) + personnalisé

## 🔍 Débogage

### Console logs :
- **Token validation** : Détails de la validation
- **PWA installation** : État de l'installation
- **Géolocalisation** : Résultats de la géolocalisation
- **SOS sending** : Données envoyées

### LocalStorage :
```javascript
// Vérifier les données stockées
console.log(localStorage.getItem('sos_connect_token'));
console.log(localStorage.getItem('sos_connect_titulaire'));
```

## 📋 Checklist de déploiement

### Avant la mise en production :
- [ ] Configurer les variables d'environnement PayTrip
- [ ] Tester avec des tokens réels
- [ ] Valider l'installation PWA
- [ ] Vérifier la géolocalisation
- [ ] Tester les notifications push
- [ ] Valider les liens de partage
- [ ] Configurer HTTPS (requis pour PWA)

### Variables d'environnement :
```env
VITE_PAYTRIP_API_URL=https://api.paytrip.fr/sos-connect
VITE_PAYTRIP_JWT_SECRET=your-secret-key
```

## 🆘 Support

### Problèmes courants :
1. **Token invalide** : Vérifier le format JWT
2. **Installation échoue** : Vérifier HTTPS et manifest
3. **Géolocalisation échoue** : Vérifier les permissions
4. **PWA ne se lance pas** : Vérifier le service worker

### Logs utiles :
- **Network** : Requêtes API
- **Application** : Service Worker, LocalStorage
- **Console** : Erreurs JavaScript
- **Security** : Problèmes HTTPS/CSP

---

**Version :** 1.0  
**Dernière mise à jour :** 15 janvier 2025

