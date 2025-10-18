# 🚀 Guide de Déploiement sur GitHub Pages

## ✅ Configuration terminée !

Votre projet est maintenant configuré pour être déployé automatiquement sur GitHub Pages.

## 📋 Étapes pour déployer :

### 1. **Créer un repository GitHub**

Si vous n'avez pas encore de repository :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Initial commit - SOS Quick Connect MVP"
```

Ensuite, sur GitHub.com :
- Allez sur https://github.com/new
- Donnez un nom à votre repository (ex: `sos-quick-connect-main`)
- **NE COCHEZ PAS** "Add a README file"
- Cliquez sur "Create repository"

### 2. **Lier votre projet au repository**

Copiez les commandes que GitHub vous donne, par exemple :

```bash
git remote add origin https://github.com/VOTRE-NOM/sos-quick-connect-main.git
git branch -M main
git push -u origin main
```

### 3. **Activer GitHub Pages**

1. Allez dans votre repository sur GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous "Build and deployment" :
   - **Source** : sélectionnez "GitHub Actions"
5. C'est tout ! 🎉

### 4. **Déploiement automatique**

Dès que vous poussez du code sur la branche `main`, GitHub Actions va :
1. ✅ Installer les dépendances
2. ✅ Construire le projet
3. ✅ Déployer automatiquement

Vous pouvez suivre le déploiement dans l'onglet **Actions** de votre repository.

### 5. **Accéder à votre site**

Une fois le déploiement terminé (environ 2-3 minutes), votre site sera accessible à :

```
https://VOTRE-NOM.github.io/sos-quick-connect-main/
```

## 🔄 Mises à jour

Pour mettre à jour votre site, il suffit de :

```bash
git add .
git commit -m "Description des modifications"
git push
```

Le site se mettra à jour automatiquement ! 🚀

## 📱 Installation sur téléphone

1. Ouvrez l'URL de votre site sur votre téléphone
2. Sur **iPhone** : Cliquez sur le bouton "Partager" puis "Sur l'écran d'accueil"
3. Sur **Android** : Le navigateur vous proposera d'installer l'application

## ⚙️ Configuration importante

**ATTENTION** : Dans le fichier `vite.config.ts`, la ligne suivante doit correspondre au nom de votre repository :

```typescript
base: mode === 'production' ? '/sos-quick-connect-main/' : '/',
```

Si votre repository s'appelle différemment, changez `/sos-quick-connect-main/` par `/NOM-DE-VOTRE-REPO/`

## 🆘 Problèmes courants

### Le site ne charge pas correctement
- Vérifiez que la configuration `base` dans `vite.config.ts` correspond au nom de votre repository
- Vérifiez que GitHub Pages est activé dans Settings > Pages

### Le déploiement échoue
- Regardez les logs dans l'onglet "Actions"
- Vérifiez que vous avez bien activé GitHub Pages avec "GitHub Actions" comme source

### Les modifications ne s'affichent pas
- Attendez 2-3 minutes après le push
- Videz le cache de votre navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

## 🎉 C'est tout !

Votre MVP SOS Quick Connect est maintenant en ligne et accessible de n'importe où ! 

