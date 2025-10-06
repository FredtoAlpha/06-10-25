# 🎓 Répartition Classes - Système de Gestion Scolaire

[![Version](https://img.shields.io/badge/version-14.0-blue.svg)](https://github.com)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Ready-green.svg)](https://script.google.com)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Maintenu-success.svg)]()

> Système complet de répartition automatique d'élèves en classes avec optimisation multi-critères, interface moderne et algorithmes avancés.

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Contribution](#-contribution)
- [Sécurité](#-sécurité)
- [License](#-license)

---

## 🎯 Aperçu

**Répartition Classes** est une solution complète pour automatiser la répartition des élèves en classes selon de multiples critères :

- ✅ **Parité F/M** (équilibre garçons/filles)
- ✅ **Équilibrage des scores** (comportement, travail, participation)
- ✅ **Contraintes** (associations, dissociations, mobilité)
- ✅ **Options** (LV2, options facultatives)
- ✅ **Optimisation** (algorithmes avancés JulesMotor)

### 🎬 Demo

![Interface V2](docs/screenshots/interface_v2.png)
*Interface moderne avec drag & drop, modes de vue, et menu simplifié*

---

## ✨ Fonctionnalités

### 🎨 Interface V2 (Nouvelle version)

- **3 modes de vue** :
  - 📊 **Complet** : Tous les détails (badges, scores, source)
  - ⭐ **Essentiel** : Badges essentiels uniquement (mobilité, disso, asso, LV2)
  - 📝 **Simple** : Nom uniquement avec couleurs F/M

- **Menu unifié ⚙️ Paramètres** :
  - Affichage (lisibilité, mode sombre, zoom)
  - Actions (undo/redo, swap, historique, optimisation)
  - Données (import, export, sauvegarde)
  - Filtres (PERMUT, FIXE, LV2, contraintes)
  - Aide (raccourcis, tutoriel)

- **Accessibilité ARIA** :
  - Support lecteurs d'écran
  - Navigation au clavier
  - États dynamiques (expanded, pressed, grabbed)

- **Fonctionnalités avancées** :
  - Drag & drop fluide (SortableJS)
  - Statistiques en temps réel
  - Historique avec undo/redo
  - Mode swap pour échanges
  - Recherche et filtres rapides
  - Export Excel/PDF/Pronote

### 🤖 JulesMotor (Nouveau moteur d'optimisation)

Remplace Nirvana avec une architecture modulaire :

```
julesmotor/
├── core/
│   └── JulesMotor.js      # Moteur principal
├── utils/
│   ├── calculators.js   # Calculs métriques
│   └── validators.js    # Validations contraintes
├── algorithms/
│   ├── ParityCorrector.js   # Équilibrage parité
│   └── ScoresBalancer.js    # Équilibrage scores
└── ui/
    └── Orchestrator.js      # Interface utilisateur
```

### 💾 Backend robuste

- Configuration centralisée (`core/Config.js`)
- Gestion complète des élèves (`core/BackendV2.js`)
- Système de groupes flexible
- Validation des contraintes
- Gestion des erreurs standardisée

---

## 🛠️ Technologies

- **Google Apps Script** : Backend et logique métier
- **HTML/CSS/JavaScript** : Interface utilisateur
- **Tailwind CSS** : Framework CSS moderne
- **SortableJS** : Drag & drop
- **Chart.js** : Graphiques et statistiques
- **SheetJS** : Export Excel
- **jsPDF** : Export PDF
- **Font Awesome** : Icônes

---

## 🚀 Installation

### Prérequis

- Compte Google avec accès à Google Sheets
- Google Apps Script activé
- Navigateur moderne (Chrome, Firefox, Edge)

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/votre-username/repartition-classes.git
cd repartition-classes
```

### Étape 2 : Préparer les fichiers

Le script `prepare_for_google_apps_script.bat` prépare automatiquement les fichiers pour l'importation, notamment en renommant les fichiers du moteur JulesMotor.

```bash
# Windows
prepare_for_google_apps_script.bat
```

### Étape 3 : Uploader dans Google Apps Script

1. Ouvrir [Google Apps Script](https://script.google.com)
2. Créer un nouveau projet
3. Uploader les fichiers du répertoire `google_apps_script_ready/`
4. Autoriser les permissions nécessaires

**📖 Documentation complète** : [GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md](docs/GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md)

---

## 🏗️ Architecture

### Structure du projet

```
repartition-classes/
│
├── 📦 core/
│   ├── Config.js
│   ├── BackendV2.js
│   ├── Menu.js
│   ├── Utils.js
│   └── Initialisation.js
│
├── 🤖 julesmotor/
│   ├── core/JulesMotor.js
│   ├── utils/
│   ├── algorithms/
│   └── ui/
│
├── 🎨 ui/
│   ├── InterfaceV2.html
│   └── [autres interfaces...]
│
├── 📚 docs/
│   └── [documentation...]
│
└── 🧪 tests/
    └── [tests...]
```

### Architecture logicielle

```
┌─────────────────────────────────────────────────────┐
│                  INTERFACE V2 (ui/)                 │
│  (HTML/CSS/JS - Drag & Drop - Modes de vue)        │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│                   CORE (core/)                      │
│ (Menu.js, BackendV2.js, Config.js, Utils.js)        │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│              JULESMOTOR ENGINE                      │
│  (Orchestration des algorithmes d'optimisation)     │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│              GOOGLE SHEETS API                      │
│         (Lecture/Écriture données)                  │
└─────────────────────────────────────────────────────┘
```

**📖 Documentation architecture** : [ARCHITECTURE_MODULAIRE.md](docs/ARCHITECTURE_MODULAIRE.md)

---

## 📚 Documentation

### Guides principaux

| Document | Description |
|----------|-------------|
| [README_DEMARRAGE_RAPIDE.md](README_DEMARRAGE_RAPIDE.md) | 🚀 Guide de démarrage rapide |
| [AUDIT_JULES.md](AUDIT_JULES.md) | 🔍 Audit complet du projet |
| [docs/GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md](docs/GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md) | 📖 Guide d'installation |
| [ARCHITECTURE_MODULAIRE.md](ARCHITECTURE_MODULAIRE.md) | 🏗️ Architecture logicielle |

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Suivez les conventions de commit pour participer.

---

## 🔒 Sécurité

Ce projet est conçu pour être utilisé avec des données fictives. **Ne commitez jamais de données réelles d'élèves.**

---

## 🎓 Analyse par IA / Code Review

Ce projet est optimisé pour l'analyse par IA.

**Fichiers clés à reviewer** :
1. `ui/InterfaceV2.html` - Interface principale
2. `core/Config.js` - Configuration
3. `core/BackendV2.js` - Backend
4. `julesmotor/core/JulesMotor.js` - Moteur d'optimisation

---

## 📄 License

Ce projet est sous licence **MIT**.

---

## 👥 Auteurs

- **Développement initial** : [Votre nom]
- **Architecture JulesMotor** : Jules
- **Interface V2** : [Nom]

---

**Version** : 14.0 (Refactorisation Jules)
**Dernière mise à jour** : 6 octobre 2025
**Statut** : ✅ Actif et maintenu