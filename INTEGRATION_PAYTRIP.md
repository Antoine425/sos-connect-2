# Guide d'intégration PayTrip - SOS Connect

## 📋 Vue d'ensemble

Ce document décrit l'intégration nécessaire côté PayTrip pour permettre le partage et l'installation de l'application SOS Connect via des tokens sécurisés.

## 🔗 Flux d'installation

### 1. Génération du lien de partage
```typescript
// Dans l'app PayTrip mobile
const generateSOSLink = async (beneficiaryName: string) => {
  const response = await fetch('/api/sos-connect/generate-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      beneficiaryName,
      permissions: ['sos_send', 'location_share', 'financial_request']
    })
  });
  
  const { token, shareUrl } = await response.json();
  return shareUrl; // Ex: https://sos-connect.paytrip.fr/install?token=abc123&name=Marie
};
```

### 2. Partage du lien
- SMS, WhatsApp, Email, etc.
- Le bénéficiaire clique sur le lien
- Arrive sur la page d'installation avec token validé

### 3. Installation PWA
- Validation du token côté frontend
- Prompt d'installation du navigateur
- Token stocké dans l'app installée

## 🔐 API Endpoints requis

### POST `/api/sos-connect/generate-token`
**Objectif :** Générer un token JWT pour l'installation

**Headers :**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Body :**
```json
{
  "beneficiaryName": "Jean",
  "permissions": ["sos_send", "location_share", "financial_request"]
}
```

**Response :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "shareUrl": "https://sos-connect.paytrip.fr/install?token=abc123&name=Marie",
  "expiresAt": "2025-02-15T10:30:00Z"
}
```

### GET `/api/sos-connect/validate-token`
**Objectif :** Valider un token (optionnel, pour sécurité renforcée)

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response :**
```json
{
  "valid": true,
  "payload": {
    "userId": "marie_123",
    "beneficiaryName": "Jean",
    "expiresAt": 1708008600000,
    "permissions": ["sos_send", "location_share"]
  }
}
```

### POST `/api/sos-connect/sos-sent`
**Objectif :** Recevoir les notifications SOS

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sosType": "danger",
  "message": "Je suis en danger. Aide-moi maintenant.",
  "location": {
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "timestamp": "2025-01-15T14:30:00Z",
  "amount": 50
}
```

**Response :**
```json
{
  "success": true,
  "notificationSent": true,
  "sosId": "sos_123456"
}
```

## 🎯 Format du Token JWT

### Payload requis :
```json
{
  "userId": "marie_123",           // ID utilisateur PayTrip
  "beneficiaryName": "Jean",       // Nom du bénéficiaire
  "expiresAt": 1708008600000,      // Timestamp d'expiration
  "permissions": [                 // Permissions accordées
    "sos_send",
    "location_share", 
    "financial_request"
  ],
  "iat": 1708008600,              // Issued at
  "exp": 1708008600               // Expires at (standard JWT)
}
```

### Permissions disponibles :
- `sos_send` : Envoyer des SOS
- `location_share` : Partager la géolocalisation
- `financial_request` : Faire des demandes financières

## 🚀 Intégration dans l'app PayTrip

### 1. Interface utilisateur
```typescript
// Bouton de partage dans l'app PayTrip
const ShareSOSConnect = ({ beneficiaryName }: { beneficiaryName: string }) => {
  const handleShare = async () => {
    const shareUrl = await generateSOSLink(beneficiaryName);
    
    // Partage via l'API native
    if (navigator.share) {
      await navigator.share({
        title: 'SOS Connect',
        text: `${currentUser.name} vous partage SOS Connect`,
        url: shareUrl
      });
    } else {
      // Fallback : copier le lien
      await navigator.clipboard.writeText(shareUrl);
      showToast('Lien copié dans le presse-papier');
    }
  };

  return (
    <Button onClick={handleShare}>
      📱 Partager SOS Connect
    </Button>
  );
};
```

### 2. Gestion des notifications
```typescript
// Webhook pour recevoir les SOS
app.post('/webhooks/sos-connect', async (req, res) => {
  const { token, sosType, location, message } = req.body;
  
  // Valider le token
  const decoded = jwt.verify(token, PAYTRIP_JWT_SECRET);
  
  // Envoyer notification push à l'utilisateur
  await sendPushNotification({
    userId: decoded.userId,
    title: '🚨 SOS Reçu',
    body: `Nouveau SOS de type ${sosType}`,
    data: { sosType, location, message }
  });
  
  res.json({ success: true });
});
```

## 🔧 Configuration technique

### Variables d'environnement requises :
```env
PAYTRIP_JWT_SECRET=your-secret-key
SOS_CONNECT_URL=https://sos-connect.paytrip.fr
PUSH_NOTIFICATION_KEY=your-push-key
```

### Dépendances nécessaires :
```json
{
  "jsonwebtoken": "^9.0.0",
  "express": "^4.18.0"
}
```

## 📱 Gestion des erreurs

### Codes d'erreur API :
- `INVALID_TOKEN` : Token corrompu ou invalide
- `EXPIRED_TOKEN` : Token expiré
- `INSUFFICIENT_PERMISSIONS` : Permissions insuffisantes
- `USER_NOT_FOUND` : Utilisateur non trouvé
- `BENEFICIARY_LIMIT_REACHED` : Limite de bénéficiaires atteinte

### Messages utilisateur :
```typescript
const ERROR_MESSAGES = {
  INVALID_TOKEN: 'Lien invalide ou corrompu',
  EXPIRED_TOKEN: 'Ce lien a expiré. Demandez un nouveau lien.',
  NETWORK_ERROR: 'Erreur de connexion. Réessayez plus tard.',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite'
};
```

## 🧪 Tests et validation

### Token de test :
```javascript
// Pour les tests de développement
const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYXJpZV8xMjMiLCJiZW5lZmljaWFyeU5hbWUiOiJKZWFuIiwiZXhwaXJlc0F0IjoxNzA4MDA4NjAwMDAwLCJwZXJtaXNzaW9ucyI6WyJzb3Nfc2VuZCIsImxvY2F0aW9uX3NoYXJlIl19.abc123";
```

### URL de test :
```
https://sos-connect.paytrip.fr/install?token=TEST_TOKEN&name=Marie
```

## 📞 Support

Pour toute question technique :
- **Email :** dev@sos-connect.paytrip.fr
- **Documentation :** [Lien vers docs PayTrip]
- **Status :** [Lien vers status page]

---

**Version :** 1.0  
**Dernière mise à jour :** 15 janvier 2025

