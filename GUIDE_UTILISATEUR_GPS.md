# 📱 Guide Utilisateur - Diagnostic GPS

## 🎯 Pourquoi la géolocalisation ne fonctionne pas sur votre téléphone ?

C'est **normal** ! La géolocalisation sur mobile est beaucoup plus stricte que sur ordinateur. Voici comment résoudre le problème.

---

## ✅ Solution Rapide - 3 Étapes

### Étape 1 : Ouvrez la Page de Diagnostic

Dans l'application, en bas de page, cliquez sur :
```
🔍 Diagnostic GPS
```

### Étape 2 : Lancez le Test

Cliquez sur le bouton bleu :
```
Lancer le diagnostic
```

### Étape 3 : Suivez les Instructions

Le diagnostic vous indiquera **exactement** quel est le problème et comment le résoudre.

---

## 🔧 Problèmes Courants et Solutions

### 1. ❌ "Permission refusée"

**Sur iPhone :**
1. Allez dans **Réglages**
2. Cherchez **Safari**
3. Allez dans **Localisation**
4. Sélectionnez **Autoriser**

**Sur Android :**
1. Allez dans **Paramètres**
2. **Applications** → **Chrome**
3. **Autorisations** → **Localisation**
4. Sélectionnez **Autoriser**

### 2. ❌ "GPS désactivé"

**Sur iPhone :**
1. **Réglages** → **Confidentialité et sécurité**
2. **Localisation**
3. Activez **Services de localisation**

**Sur Android :**
1. **Paramètres** → **Localisation**
2. Activez **Utiliser la localisation**

### 3. ❌ Position toujours imprécise

**Solutions :**
- Sortez **en extérieur** (le GPS ne fonctionne pas bien dans les bâtiments)
- Patientez **quelques secondes** (le GPS a besoin de temps)
- Désactivez le **mode économie d'énergie**

---

## 📊 Comprendre la Précision

Quand vous envoyez un SOS, vous verrez :

```
🎯 Précision: 15m (Excellente)
```

**Que signifient les couleurs ?**

- 🟢 **Vert (< 20m)** : Excellente précision
- 🔵 **Bleu (20-50m)** : Très bonne précision
- 🟠 **Orange (50-100m)** : Bonne précision
- 🔴 **Rouge (> 100m)** : Approximative

---

## 🌍 Pourquoi Desktop vs Mobile ?

| Votre ordinateur | Votre téléphone |
|------------------|-----------------|
| Utilise Wi-Fi/Internet | Utilise le **GPS** |
| Précision : ~1000m | Précision : **~15m** |
| Rapide (< 1s) | Plus long (2-8s) |
| Peu de restrictions | **Beaucoup** de restrictions |

C'est pour ça que **votre téléphone demande plus de permissions** mais donne une **position beaucoup plus précise** !

---

## 🚀 Comment Tester

### Test Simple

1. Sur votre téléphone, ouvrez l'application
2. Cliquez sur le bouton **"🚨 Danger"** ou **"📍 Récupération"**
3. **Autorisez** la géolocalisation quand demandé
4. Patientez **quelques secondes**
5. Vérifiez la précision affichée

### Test Complet

1. En bas de la page d'accueil, cliquez sur **"🔍 Diagnostic GPS"**
2. Cliquez sur **"Lancer le diagnostic"**
3. Vérifiez tous les points
4. Autorisez la géolocalisation si demandé
5. Consultez le résultat

---

## ⚠️ Important à Savoir

### HTTPS Obligatoire

Sur mobile, la géolocalisation **ne fonctionne QUE sur HTTPS** (sites sécurisés).

✅ Votre application utilise GitHub Pages qui fournit automatiquement HTTPS.

### En Extérieur c'est Mieux

- ✅ **Extérieur** : Précision 5-20m
- ⚠️ **Près d'une fenêtre** : Précision 20-50m
- ❌ **Intérieur** : Précision 100-1000m

### Patience

Le GPS a besoin de temps pour :
1. Contacter les satellites (2-3 secondes)
2. Calculer la position (1-2 secondes)
3. Améliorer la précision (2-3 secondes)

**Total : 5-8 secondes** pour la meilleure précision.

---

## 🆘 Ça ne Marche Toujours Pas ?

### Checklist Complète

- [ ] Je suis sur **HTTPS** (pas HTTP)
- [ ] Le **GPS est activé** dans les paramètres
- [ ] J'ai **autorisé** la géolocalisation pour le site
- [ ] Je suis **en extérieur** ou près d'une fenêtre
- [ ] J'ai **patienté** au moins 5 secondes
- [ ] Le **mode économie d'énergie est désactivé**
- [ ] J'ai **essayé la page de diagnostic**

### Réinitialiser Tout

Si vraiment rien ne fonctionne :

**iPhone :**
1. Safari → Réglages → Avancé
2. **Données de sites web**
3. **Supprimer toutes les données**
4. Réessayez l'application

**Android :**
1. Chrome → Paramètres → Confidentialité
2. **Effacer les données de navigation**
3. Cochez **Autorisations de sites**
4. Effacer et réessayez

---

## 💡 Conseil Pro

Pour les **SOS d'urgence**, l'application essaie d'obtenir la **meilleure précision possible** en :

1. ✅ Forçant l'utilisation du **GPS** (pas Wi-Fi)
2. ✅ Ne prenant **jamais** de position en cache
3. ✅ Testant **plusieurs positions** et gardant la meilleure
4. ✅ S'arrêtant dès qu'une **excellente précision** est atteinte

Résultat : **Position très précise** mais prend **quelques secondes**.

---

## 📞 Questions Fréquentes

### Q: Pourquoi ça marche sur mon ordinateur mais pas mon téléphone ?
**R:** Les navigateurs mobiles sont beaucoup plus stricts sur les permissions de géolocalisation pour des raisons de sécurité.

### Q: Est-ce que ça consomme beaucoup de batterie ?
**R:** Non, la position est demandée seulement quand vous envoyez un SOS, pas en continu.

### Q: Pourquoi ça prend plus de temps qu'avant ?
**R:** Pour obtenir une **précision maximale** (15m au lieu de 1000m) ! Mais si une excellente position est trouvée, ça s'arrête immédiatement.

### Q: Ma précision est à 150m, c'est normal ?
**R:** Si vous êtes en intérieur, oui. Essayez en extérieur pour obtenir < 20m.

### Q: Puis-je désactiver le GPS haute précision ?
**R:** Non, pour un SOS d'urgence, il est **vital** d'avoir votre position **exacte**.

---

## 🎉 Tout Fonctionne !

Une fois que tout est configuré :

1. ✅ Les permissions sont accordées
2. ✅ Le GPS fonctionne
3. ✅ Vous obtenez une bonne précision

Vous n'aurez **plus besoin** de refaire ces réglages ! Le téléphone se souviendra de vos choix.

---

**Besoin d'aide ?** Utilisez la page **🔍 Diagnostic GPS** pour identifier le problème exact !

*Guide créé en Octobre 2025 - Version 2.0*

