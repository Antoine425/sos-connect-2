# 🚨 SOS Connect - PayTrip PWA

## Objectif

Permettre au bénéficiaire PayTrip d'envoyer un signal d'urgence (SOS) à son titulaire sans ouvrir l'application principale,
grâce à une Progressive Web App (PWA) mobile, légère, installable, et sécurisée.

**👉 1 clic = 1 alerte fiable, instantanée et géolocalisée.**

---

## 💡 Valeur ajoutée produit

| Bénéfice utilisateur | Description |
|----------------------|-------------|
| 🚨 **Réactivité** | Le bénéficiaire peut envoyer une alerte immédiate depuis son écran d'accueil. |
| 🧭 **Simplicité** | Aucun login, aucune friction, interface à un seul bouton. |
| 🔒 **Sécurité** | Authentification par token, envoi chiffré, aucune donnée sensible stockée. |
| ❤️ **Entraide concrète** | Le titulaire reçoit l'alerte et agit instantanément (approuver / appeler / refuser). |
| 🌍 **Accessibilité universelle** | Fonctionne sur tous les smartphones (Android & iOS). |

---

## 🧱 Architecture technique

### 🔹 Frontend : PWA React (Next.js / Vite)

- **Framework** : React + Vite (ou Next.js si besoin SSR)
- **UI** : TailwindCSS ou Chakra UI
- **State management** : Zustand (léger) ou Redux Toolkit
- **Caching offline** : Workbox
- **Geolocation** : API navigateur
- **Hosting** : Vercel / Netlify / Cloudflare Pages
- **Domaine** : https://sos.paytrip.com

### 🔹 Backend : API PayTrip existante

- **Endpoint** : `POST /api/sos/send`
- **Auth** : Token JWT nominatif
- **Services** : Notification push (Firebase / OneSignal)
- **Logs** : Base PayTrip (historique SOS)

### 🔹 Communication :

```
PWA (bénéficiaire)
   ↓ POST (HTTPS)
Serveur PayTrip
   ↓ Push Notification
App PayTrip (titulaire)
```

---

## 🧩 Structure projet PWA

```
/sos-connect/
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   ├── icons/
├── src/
│   ├── pages/
│   │   ├── index.tsx         → écran principal (SOS)
│   │   ├── success.tsx       → confirmation
│   │   └── history.tsx       → historique
│   ├── hooks/                → useLocation, useNetwork, useToken
│   ├── api/                  → sendSOS.ts
│   └── components/           → UI buttons, modals
```

---

## 🔐 Authentification & sécurité

| Élément | Description |
|---------|-------------|
| **Auth token (JWT)** | Généré côté PayTrip, transmis via lien d'installation PWA |
| **Durée de vie token** | 30 jours, renouvelable automatiquement |
| **Scope** | `sendSOS`, `getHistory` |
| **Transport** | HTTPS + TLS 1.3 |
| **Pas de stockage sensible** | Aucun mot de passe ni compte local |
| **Géolocalisation** | Consentement explicite via API navigateur |
| **Déconnexion / révocation** | Possible à distance depuis le compte PayTrip |

---

## 🧠 Fonctionnalités principales

| Fonction | Description | Statut |
|----------|-------------|--------|
| 🚨 **Envoi SOS** | Type + message + montant + géoloc. | MVP |
| 📍 **Géolocalisation** | Incluse dans la requête SOS (optionnelle) | MVP |
| 🔔 **Notification push vers titulaire** | Envoi via FCM / OneSignal | MVP |
| 📜 **Historique des SOS** | Liste locale + backend | MVP |
| ⚙️ **Offline mode** | SOS stocké puis envoyé dès retour réseau | Option |
| 💬 **Message libre** | "Décrivez votre urgence" | MVP |
| 🧾 **Confirmation d'envoi** | "Votre SOS a été transmis." | MVP |

---

## 📱 Expérience utilisateur

### Écran 1 – Accueil

```
"En cas d'urgence, appuyez sur le bouton ci-dessous 
pour prévenir votre titulaire."

🔘 [🚨 Envoyer un SOS]

📍 (case à cocher) "Partager ma position"
💬 (champ texte) "Décrivez votre urgence…"
💰 (champ optionnel) "Montant demandé"
```

### Écran 2 – Confirmation

```
✅ Votre SOS a été envoyé à [Nom du titulaire].
Vous serez notifié dès qu'il aura répondu.
```

### Écran 3 – Historique

```
Liste des SOS précédents
(Date, type, montant, statut : envoyé / approuvé / refusé)
```

---

## 🧭 Installation (PWA)

### Android

- Détection via `beforeinstallprompt`
- Affichage bouton "Installer SOS Connect"
- **Résultat** : icône sur écran d'accueil, plein écran natif

### iOS

- Affichage tutoriel visuel :
  > "Appuyez sur le bouton Partager puis sur Ajouter à l'écran d'accueil."
- **Résultat** : icône SOS Connect installée

---

## 🔔 Notifications Push

| Élément | Détail |
|---------|--------|
| **Service** | Firebase Cloud Messaging (Android) / APNs (iOS ≥ 16.4) |
| **Type** | Haute priorité |
| **Données** | Nom bénéficiaire, type SOS, message, géoloc, montant |
| **Action** | Approuver / Refuser / Appeler |
| **Sécurité** | Données encryptées (payload minimal) |

---

## 🧱 Intégration backend PayTrip

### POST /api/sos/send

**Headers:**
```json
{
  "Authorization": "Bearer <jwt>",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "type": "medical",
  "amount": 30,
  "message": "Besoin urgent pour médicaments",
  "location": { 
    "lat": 48.8566, 
    "lng": 2.3522 
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "sos_id": "SOS_12345",
  "timestamp": "2025-10-18T14:30Z"
}
```

---

## 🧮 Effort estimé de développement

| Tâche | Délai estimé |
|-------|--------------|
| Setup projet (Vite/Next, PWA, UI) | 1 jour |
| Écran principal + API SOS | 2 jours |
| Authentification via token | 1 jour |
| Notifications push | 2 jours |
| Offline mode + géoloc | 1 jour |
| UX / Tests / QA | 2 jours |
| **Total MVP estimé** | **≈ 7–8 jours** |

---

## 🌟 Résultat attendu

| Axe | Impact |
|-----|--------|
| 🎯 **Expérience utilisateur** | Instantanéité, fiabilité, simplicité |
| 🔐 **Sécurité** | Token sécurisé, HTTPS, géoloc consentie |
| 💡 **Différenciation produit** | Unique sur le marché fintech diaspora |
| ❤️ **Valeur émotionnelle** | Lien d'entraide fort entre titulaire et bénéficiaire |
| 🌍 **Scalabilité** | Déploiement global sans store |

---

## 📝 Notes

> **Question ouverte** : Souhaites-tu que je génère maintenant le canevas équivalent pour la partie titulaire (réception SOS, validation, actions) pour compléter ce document ?

