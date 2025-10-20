# ⚡ Quick Start - Debug GPS sur Mobile

## 🎯 Votre Problème

La géolocalisation **ne fonctionne pas sur votre téléphone**.

---

## ✨ La Solution en 30 Secondes

### 1️⃣ Activez le Mode Debug

Sur votre téléphone, ouvrez :
```
https://votre-site.github.io/sos-connect-2/?debug=true
```

### 2️⃣ Ouvrez la Console

Cliquez sur le bouton **🐛** en bas à droite de l'écran.

### 3️⃣ Testez

Cliquez sur un bouton SOS (Danger, Récupération, etc.)

### 4️⃣ Lisez l'Erreur

Dans la console, vous verrez **EXACTEMENT** le problème :

#### Si vous voyez : `Protocol: http:`
```
❌ PROBLÈME : HTTP utilisé
✅ SOLUTION : Changez l'URL en https://
```

#### Si vous voyez : `Code d'erreur: 1`
```
❌ PROBLÈME : Permission refusée
✅ SOLUTION iPhone : Réglages → Safari → Localisation → Autoriser
✅ SOLUTION Android : Paramètres → Apps → Chrome → Localisation → Autoriser
```

#### Si vous voyez : `Code d'erreur: 2`
```
❌ PROBLÈME : GPS désactivé
✅ SOLUTION iPhone : Réglages → Confidentialité → Localisation → ON
✅ SOLUTION Android : Paramètres → Localisation → ON
```

#### Si vous voyez : `Code d'erreur: 3`
```
❌ PROBLÈME : Timeout
✅ SOLUTION : Sortez en extérieur et attendez 10 secondes
```

---

## 🎉 Logs de Succès

Quand ça fonctionne, vous verrez :
```
✅ Position excellente obtenue (18m)
✅ Géolocalisation réussie
```

---

## 📋 Copier les Logs

1. Dans la console, cliquez sur le bouton **📋 Copier**
2. Tous les logs sont copiés
3. Envoyez-les pour analyse si besoin

---

## 🆘 Toujours Pas Compris ?

### Option 1 : Page de Diagnostic Auto

Allez sur :
```
https://votre-site.github.io/sos-connect-2/diagnostic
```

Et cliquez sur "Lancer le diagnostic".

### Option 2 : Documentation Complète

- **Simple** : `SOLUTION_MOBILE.md`
- **Détaillé** : `README_GPS_DEBUG.md`
- **Pour utilisateurs** : `GUIDE_UTILISATEUR_GPS.md`

---

## 💡 90% des Problèmes

**Cause #1 : HTTP au lieu de HTTPS**
- Vérifiez que l'URL commence par `https://`

**Cause #2 : Permissions refusées**
- Allez dans les réglages et autorisez

**Cause #3 : GPS désactivé**
- Activez le GPS dans les paramètres

---

## 🎯 En Résumé

1. Ajoutez `?debug=true` à l'URL
2. Cliquez sur 🐛
3. Testez
4. Lisez l'erreur
5. Appliquez la solution

**C'est tout ! Les logs vous disent EXACTEMENT quoi faire.**

---

*Version 2.1 - Octobre 2025*

