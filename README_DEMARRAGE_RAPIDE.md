# 🚀 DÉMARRAGE RAPIDE - Répartition Classes

**Version** : 2.0 JulesMotor
**Date** : 6 octobre 2025
**Statut** : ✅ Prêt pour Google Apps Script

---

## ⚡ POUR COMMENCER (3 étapes)

### 1️⃣ **Préparer le projet** (1 minute)

Double-cliquez sur :
```
prepare_for_google_apps_script.bat
```

Ce script va :
- ✅ Supprimer les fichiers Nirvana obsolètes.
- ✅ Créer les 6 fichiers JulesMotor renommés.
- ✅ Afficher un rapport complet.

---

### 2️⃣ **Uploader dans Google Apps Script** (10 minutes)

Ouvrez votre projet Google Apps Script et :

**A. Supprimer les anciens fichiers** (si présents).

**B. Ajouter depuis `google_apps_script_ready/` (6 fichiers)** :
```
✅ JulesMotor_Utils_Calculators.gs
✅ JulesMotor_Utils_Validators.gs
✅ JulesMotor_Core.gs
✅ JulesMotor_Algorithm_ParityCorrector.gs
✅ JulesMotor_Algorithm_ScoresBalancer.gs
✅ JulesMotor_UI_Orchestrator.gs
```

**C. Vérifier ces fichiers essentiels** :
```
✅ ui/InterfaceV2.html
✅ core/Config.js
✅ core/BackendV2.js
✅ core/Menu.js
```

---

### 3️⃣ **Tester et déployer** (5 minutes)

Dans Google Sheets :
1. Actualiser la page.
2. Un menu `🚀 JulesMotor` doit apparaître.
3. Tester les fonctionnalités.
4. **Déployer** si tout fonctionne !

---

## 📚 DOCUMENTATION COMPLÈTE

| Document | Description |
|----------|-------------|
| **AUDIT_JULES.md** | 🔍 Audit complet du projet (LIRE EN PREMIER) |
| **docs/GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md** | 📖 Guide détaillé d'upload |
| **docs/ARCHITECTURE_MODULAIRE.md** | 🏗️ Architecture du code |

---

## ✅ CHECKLIST DE VALIDATION

Avant d'uploader dans Google Apps Script :

- [ ] `prepare_for_google_apps_script.bat` exécuté.
- [ ] Dossier `google_apps_script_ready/` créé avec 6 fichiers JulesMotor.
- [ ] Fichiers Nirvana supprimés.

Après upload dans Google Apps Script :

- [ ] 6 fichiers JulesMotor ajoutés.
- [ ] Menu `🚀 JulesMotor` visible.
- [ ] Interface V2 s'ouvre correctement.
- [ ] Aucune erreur dans les logs (Ctrl+Entrée).

---

## 🎯 NOUVEAUTÉS DE CETTE VERSION

### Interface V2 (`ui/InterfaceV2.html`) ⭐⭐⭐

- **Architecture modulaire finalisée** : Maintenance et évolutivité améliorées.
- **Header simplifié** : Menu unique ⚙️ **Paramètres**.
- **Accessibilité ARIA** : Amélioration du support pour les lecteurs d'écran.

### JulesMotor (nouveau moteur)

Remplace Nirvana avec une architecture propre et testée :
- **Core** : Moteur principal.
- **Utils** : Calculateurs + Validateurs corrigés.
- **Algorithms** : Algorithmes de répartition optimisés.
- **UI** : Orchestrateur pour l'interface Google Sheets.

---

## 🔧 FICHIERS ESSENTIELS À VÉRIFIER

### ui/InterfaceV2.html
```
✅ Architecture modulaire complète (App.*)
✅ Header menu ⚙️ unique
✅ Mode sombre + Zoom connectés
```

### core/Config.js
```
✅ Version : 14.0
✅ Configuration centralisée
```

### julesmotor/core/JulesMotor.js
```
✅ Moteur principal de l'application
✅ Logique d'orchestration des algorithmes
```

---

## ⚠️ DÉPANNAGE

### Problème : Interface V2 ne s'ouvre pas
**Solution** : Vérifier que `ui/InterfaceV2.html` est bien uploadé.

### Problème : Erreur "JulesMotor not found"
**Solution** : S'assurer que les 6 fichiers du moteur JulesMotor sont bien présents et dans le bon ordre.

### Problème : Menu ⚙️ ne fonctionne pas
**Solution** : Vider le cache du navigateur (Ctrl+F5).

---

## 🚀 SUPPORT

### En cas de problème :
1. Consulter **AUDIT_JULES.md**.
2. Vérifier les logs Google Apps Script (Ctrl+Entrée).
3. Consulter la documentation dans `docs/`.
4. Vérifier la checklist de validation ci-dessus.

---

**Créé le** : 6 octobre 2025
**Version** : 2.0
**Statut** : ✅ Production Ready