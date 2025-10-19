# 🚨 SOS Connect v2

> Application d'urgence familiale - Alertez vos proches en un clic

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/Antoine425/sos-connect-2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-orange.svg)](https://web.dev/progressive-web-apps/)

## 🎯 **Présentation**

SOS Connect est une application web progressive (PWA) qui permet aux utilisateurs d'envoyer des alertes d'urgence à leurs proches en un seul clic. L'application partage automatiquement la position GPS et envoie des notifications push pour une intervention rapide.

### ✨ **Fonctionnalités principales**

- 🚨 **4 types d'alertes** : Danger, Détresse médicale, Transport, Aide financière
- 📍 **Géolocalisation automatique** avec stratégie de fallback
- 📱 **PWA installable** sur mobile et desktop
- 🔔 **Notifications push** en temps réel
- 🌐 **Fonctionne hors ligne** grâce au cache
- 🎨 **Interface mobile-first** responsive

## 🚀 **Démo en ligne**

[**Tester l'application**](https://antoine425.github.io/sos-connect-2/)

## 📱 **Installation**

### **Sur mobile (recommandé)**
1. Ouvrez [l'application](https://antoine425.github.io/sos-connect-2/) dans votre navigateur
2. Cliquez sur "Ajouter SOS Connect à mon écran d'accueil"
3. L'icône apparaîtra sur votre écran d'accueil

### **Sur desktop**
1. Ouvrez [l'application](https://antoine425.github.io/sos-connect-2/) dans Chrome/Edge
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. L'application s'ouvrira comme une application native

## 🛠️ **Développement local**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn

### **Installation**
```bash
# Cloner le repository
git clone https://github.com/Antoine425/sos-connect-2.git
cd sos-connect-2

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### **Scripts disponibles**
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Linter ESLint
```

## 🏗️ **Architecture technique**

### **Stack technologique**
- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui
- **PWA** : Vite PWA Plugin
- **Routing** : React Router v6
- **State** : React Query (TanStack Query)
- **Icons** : Lucide React

### **Structure du projet**
```
src/
├── components/          # Composants réutilisables
│   ├── SOSButtonsGrid.tsx
│   └── ui/             # Composants UI (shadcn)
├── config/             # Configuration
│   ├── sos-config.ts
│   └── paytrip-config.ts
├── hooks/              # Hooks personnalisés
│   ├── useGeolocation.ts
│   └── usePWAInstall.ts
├── pages/              # Pages de l'application
│   ├── Index.tsx       # Page principale
│   ├── Install.tsx     # Page d'installation
│   └── Confirmation.tsx
└── types/              # Types TypeScript
    └── sos.ts
```

## 🔧 **Configuration**

### **Variables d'environnement**
Créez un fichier `.env.local` :
```env
VITE_APP_TITLE=SOS Connect
VITE_APP_DESCRIPTION=Application d'urgence familiale
```

### **Configuration PWA**
Le manifeste PWA est configuré dans `vite.config.ts` :
- **Nom** : SOS Connect
- **Icônes** : 192x192 et 512x512
- **Thème** : Couleur primaire bleue
- **Mode** : Standalone

## 📊 **Fonctionnalités détaillées**

### **1. Système d'alertes**
- **Danger** : Alerte immédiate avec position GPS
- **Médical** : Détresse médicale avec localisation
- **Transport** : Demande de transport avec position
- **Financier** : Aide financière avec montant personnalisable

### **2. Géolocalisation intelligente**
- **Stratégie de fallback** : 2 tentatives avec paramètres différents
- **Détection d'appareil** : Paramètres optimisés mobile/desktop
- **Gestion d'erreurs** : Messages clairs et logs détaillés
- **Mode hors ligne** : Cache de la dernière position connue

### **3. Interface utilisateur**
- **Mobile-first** : Design optimisé pour les écrans tactiles
- **Responsive** : Adaptation automatique desktop/tablet
- **Accessibilité** : Contraste élevé et navigation clavier
- **Animations** : Transitions fluides et feedback visuel

## 🚀 **Déploiement**

### **GitHub Pages (automatique)**
Le déploiement est configuré via GitHub Actions :
- **Trigger** : Push sur la branche `main`
- **Build** : Vite build en mode production
- **Deploy** : GitHub Pages automatique
- **URL** : https://antoine425.github.io/sos-connect-2/

### **Déploiement manuel**
```bash
# Build de production
npm run build

# Les fichiers sont dans le dossier dist/
# Déployez le contenu sur votre serveur web
```

## 🔒 **Sécurité et confidentialité**

- **Données locales** : Stockage sécurisé dans localStorage
- **Géolocalisation** : Demande d'autorisation explicite
- **HTTPS** : Communication chiffrée obligatoire
- **PWA** : Service Worker pour la sécurité offline

## 📈 **Roadmap**

### **v2.1** (Prochaine version)
- [ ] Notifications push avec Firebase
- [ ] Intégration backend PayTrip
- [ ] Historique des alertes
- [ ] Mode sombre

### **v2.2** (Futur)
- [ ] Support multi-langues
- [ ] Géolocalisation améliorée
- [ ] Tests automatisés
- [ ] Analytics

## 🤝 **Contribution**

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 **Équipe**

- **Antoine** - Développement principal
- **PayTrip** - Partenaire technique

## 📞 **Support**

- **Issues** : [GitHub Issues](https://github.com/Antoine425/sos-connect-2/issues)
- **Email** : support@sos-connect.fr
- **Documentation** : [Wiki du projet](https://github.com/Antoine425/sos-connect-2/wiki)

---

<div align="center">
  <p>Fait avec ❤️ par l'équipe PayTrip</p>
  <p>© 2025 PayTrip.fr - Tous droits réservés</p>
</div>