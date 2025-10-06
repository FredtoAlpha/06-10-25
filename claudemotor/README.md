# 🚀 CLAUDEMOTOR ENGINE

**Version 2.0.0** - Moteur de répartition intelligent pour l'équilibrage des classes

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Algorithmes](#algorithmes)
- [Migration depuis NIRVANA](#migration-depuis-nirvana)

---

## 🎯 Vue d'ensemble

**ClaudeMotor** est un moteur de répartition entièrement réécrit qui remplace l'ancien système NIRVANA. Il optimise l'équilibrage des classes selon plusieurs critères :

- **Équilibrage des scores** (COM, TRA, PART, ABS) sur une échelle 1-4
- **Correction de la parité** Filles/Garçons
- **Respect des contraintes** (mobilité, options, dissociations)

### ✨ Avantages par rapport à NIRVANA

| Aspect | NIRVANA | ClaudeMotor |
|--------|---------|-------------|
| **Code** | ~5000 lignes dupliquées | Architecture modulaire optimisée |
| **Maintenance** | 5 fichiers redondants | Structure claire et documentée |
| **Performance** | Algorithmes fragmentés | Algorithmes unifiés et optimisés |
| **Évolutivité** | Difficile à étendre | Facile à faire évoluer |

---

## 🏗️ Architecture

```
claudemotor/
├── core/
│   └── ClaudeMotor.js          # Moteur principal
│
├── algorithms/
│   ├── ScoresBalancer.js       # Équilibrage scores (1-2-3-4)
│   └── ParityCorrector.js      # Correction parité F/M
│
├── utils/
│   ├── validators.js           # Validations (mobilité, options, dissociations)
│   └── calculators.js          # Calculs (effectifs, écarts, scores)
│
└── ui/
    └── Orchestrator.js         # Interface utilisateur Google Sheets
```

### 🔧 Modules principaux

#### **ClaudeMotor.js** (Core)
Moteur central qui orchestre les 3 phases d'optimisation :
1. Équilibrage des scores
2. Correction de parité
3. MultiSwap (cycles complexes)

#### **ScoresBalancer.js** (Algorithm)
Équilibre les effectifs par score pour chaque critère :
- Stratégies adaptatives selon la mobilité
- Recherche intelligente de candidats
- Optimisation itérative

#### **ParityCorrector.js** (Algorithm)
Corrige la répartition Filles/Garçons :
- Détection des déséquilibres
- Échanges ciblés F↔M
- Respect de la tolérance (±1)

#### **validators.js** (Utils)
Gestion centralisée des contraintes :
- Types de mobilité (LIBRE, FIXE, PERMUT, CONDI, SPEC)
- Validation des options
- Vérification des dissociations
- Gestion des groupes SPEC

#### **calculators.js** (Utils)
Tous les calculs statistiques :
- Distribution actuelle vs cibles
- Calcul des écarts
- Scores d'équilibre et de parité
- Statistiques globales

---

## 📦 Installation

### 1. Copier les fichiers dans votre projet Google Apps Script

```
Votre_Projet/
├── ClaudeMotor.js           (depuis core/ClaudeMotor.js)
├── ScoresBalancer.js        (depuis algorithms/ScoresBalancer.js)
├── ParityCorrector.js       (depuis algorithms/ParityCorrector.js)
├── Validators.js            (depuis utils/validators.js)
├── Calculators.js           (depuis utils/calculators.js)
└── Orchestrator.js          (depuis ui/Orchestrator.js)
```

### 2. Ordre de chargement (important !)

Google Apps Script charge les fichiers par ordre alphabétique. Renommez si nécessaire :

1. `01_Validators.js`
2. `02_Calculators.js`
3. `03_ScoresBalancer.js`
4. `04_ParityCorrector.js`
5. `05_ClaudeMotor.js`
6. `06_Orchestrator.js`

---

## 🚀 Utilisation

### Interface Google Sheets

Une fois installé, un menu **🚀 ClaudeMotor** apparaît automatiquement :

- **🎯 Optimisation Complète** : Lance les 3 phases (scores + parité + multiswap)
- **📈 Équilibrage Scores** : Équilibre uniquement les scores 1-2-3-4
- **⚖️ Correction Parité** : Corrige uniquement la parité F/M
- **📊 Diagnostic** : Affiche un rapport détaillé de l'état actuel

### Code direct

```javascript
// Optimisation complète
const results = ClaudeMotor.optimize(dataContext, {
  enableMultiSwap: true
});

// Équilibrage scores uniquement
const scoresResults = ScoresBalancer.balance(dataContext, {
  maxIterations: 50,
  maxSwapsPerIteration: 10
});

// Correction parité uniquement
const parityResults = ParityCorrector.correct(dataContext, {
  tolerance: 1,
  maxIterations: 20
});

// Diagnostic
const stats = ClaudeMotorCalculators.calculateGlobalStats(dataContext);
const report = ParityCorrector.diagnose(dataContext);
```

---

## 🧮 Algorithmes

### 📈 ScoresBalancer

**Objectif** : Équilibrer les effectifs de chaque score (1-2-3-4) pour chaque critère (COM, TRA, PART, ABS).

**Fonctionnement** :
1. Calcul de la distribution globale réelle
2. Calcul des cibles proportionnelles par classe
3. Identification des surplus et déficits
4. Recherche de candidats d'échange selon mobilité
5. Application des échanges par ordre de priorité
6. Itération jusqu'à convergence

**Stratégies d'échange** :
- **LIBRE** (priorité 1.0) : Échange sans contrainte
- **PERMUT** (priorité 0.8) : Échange si LV2 et OPT identiques
- **CONDI** (priorité 0.7) : Échange si même code DISSO
- **SPEC** (priorité 0.6) : Échange de groupe associé

### ⚖️ ParityCorrector

**Objectif** : Équilibrer la répartition Filles/Garçons dans chaque classe.

**Fonctionnement** :
1. Calcul de la distribution F/M par classe
2. Identification des déséquilibres (delta > tolérance)
3. Recherche de paires F↔M entre classes complémentaires
4. Application des corrections
5. Itération jusqu'à équilibre

**Tolérance** : ±1 élève par défaut (configurable)

---

## 🔄 Migration depuis NIRVANA

### Fichiers à supprimer

Après installation de ClaudeMotor, vous pouvez **supprimer** :

- ❌ `Nirvana_Combined_Orchestrator.js`
- ❌ `Nirvana_V2_Amelioree.js`
- ❌ `nirvana_parity_combined.js`
- ❌ `NIRVANA_SCORES_EQUILIBRAGEV1.2.js`
- ❌ `NIRVANATESTV2.js`

### Correspondance des fonctions

| Ancienne fonction NIRVANA | Nouvelle fonction ClaudeMotor |
|---------------------------|-------------------------------|
| `lancerCombinaisonNirvanaOptimale()` | `ClaudeMotorUI.runOptimization()` |
| `lancerEquilibrageScores_UI()` | `ClaudeMotorUI.runScoresOnly()` |
| `correctionPariteFinale()` | `ParityCorrector.correct()` |
| `diagnostiquerEffectifs_Ameliore()` | `ClaudeMotorUI.runDiagnostic()` |

### Compatibilité

ClaudeMotor utilise le même format de données que NIRVANA :
- ✅ `dataContext.classesState`
- ✅ `config` retourné par `getConfig()`
- ✅ Fonctions de préparation existantes

**Aucune modification** des données n'est nécessaire.

---

## 📊 Résultats

ClaudeMotor retourne un objet structuré :

```javascript
{
  success: true,
  engineVersion: "2.0.0",
  durationMs: 15234,
  totalSwaps: 45,
  scoreInitial: 72.5,
  scoreFinal: 89.3,
  improvement: 16.8,
  phases: {
    phase1: { swaps: [...], iterations: 12, scoreFinal: 85.2 },
    phase2: { corrections: [...], iterations: 5, scoreFinal: 89.3 },
    phase3: { cycles: [...] }
  },
  allSwaps: [...]
}
```

---

## 🛠️ Configuration

### Options d'optimisation

```javascript
ClaudeMotor.optimize(dataContext, {
  // Config du moteur
  config: {
    POIDS_CRITERES: {
      COM: 0.35,
      TRA: 0.30,
      PART: 0.25,
      ABS: 0.10
    },
    LIMITS: {
      MAX_ITERATIONS: 50,
      MAX_SWAPS_PER_ITERATION: 10,
      SEUIL_AMELIORATION: 0.01
    }
  },

  // Options d'exécution
  enableMultiSwap: true  // Active la phase 3 (cycles complexes)
});
```

---

## 🐛 Debug

### Logs détaillés

ClaudeMotor génère des logs structurés dans la console Google Apps Script :

```
═══════════════════════════════════════════════════════════════════════
🚀 CLAUDEMOTOR ENGINE v2.0.0 - DÉMARRAGE
═══════════════════════════════════════════════════════════════════════
ℹ️ 12 classe(s) détectée(s): 6A, 6B, 6C, ...
📊 Score initial: 72.50/100

────────────────────────────────────────────────────────────────────────
📈 PHASE 1: Équilibrage des scores (COM, TRA, PART, ABS)
────────────────────────────────────────────────────────────────────────
...
```

---

## 📝 Support

Pour toute question ou problème :
1. Consulter les logs Google Apps Script
2. Vérifier la structure de `dataContext`
3. Tester avec le diagnostic : `ClaudeMotorUI.runDiagnostic()`

---

## 📜 Licence

Développé avec Claude Code - 2025
