# 🚀 JulesMOTOR ENGINE

**JulesMotor** est un moteur de répartition entièrement réécrit qui remplace l'ancien système NIRVANA. Il optimise l'équilibrage des classes selon plusieurs critères :

-   **Équilibrage des scores** (COM, TRA, PART, ABS)
-   **Correction de la parité** Filles/Garçons
-   **Optimisation multi-swap** (cycles complexes)
-   **Validation des contraintes** (mobilité, options, etc.)

---

## 📊 Comparaison avec NIRVANA

| Aspect | NIRVANA | JulesMotor |
| --- | --- | --- |
| **Modularité** | ❌ Monolithique | ✅ Modulaire |
| **Complexité** | Élevée (12000+ lignes) | Réduite (2600 lignes) |
| **Dépendances** | Fortes | Faibles |
| **Tests** | ❌ Aucun | ✅ Inclus |

---

## 🏗️ Architecture

```
julesmotor/
├── utils/
│   ├── calculators.js
│   └── validators.js
├── algorithms/
│   ├── ScoresBalancer.js
│   ├── ParityCorrector.js
│   └── MultiSwapOptimizer.js
├── core/
│   └── JulesMotor.js          # Moteur principal
└── ui/
    └── Orchestrator.js      # Interface Google Sheets
```

---

## 🚀 Installation

### Prérequis

-   Compte Google avec accès à Google Sheets
-   Google Apps Script activé
-   Connaissances de base en JavaScript

### Fichiers à créer

1.  **Copier les fichiers** de ce répertoire dans votre projet Google Apps Script.
2.  **Renommer les fichiers** pour correspondre à l'ordre de chargement :

    -   `01_JulesMotor_Utils_Validators.js` (depuis `utils/validators.js`)
    -   `02_JulesMotor_Utils_Calculators.js` (depuis `utils/calculators.js`)
    -   `03_JulesMotor_Algorithm_ScoresBalancer.js` (depuis `algorithms/ScoresBalancer.js`)
    -   `04_JulesMotor_Algorithm_ParityCorrector.js` (depuis `algorithms/ParityCorrector.js`)
    -   `05_JulesMotor.js` (depuis `core/JulesMotor.js`)
    -   `06_JulesMotor_UI_Orchestrator.js` (depuis `ui/Orchestrator.js`)

---

## ⚙️ Utilisation

Une fois installé, un menu **🚀 JulesMotor** apparaît automatiquement :

-   **Optimisation Complète**: Lance les 3 phases (scores, parité, multi-swap)
-   **Équilibrage Scores**: Lance uniquement la phase 1
-   **Correction Parité**: Lance uniquement la phase 2
-   **Diagnostic**: Affiche un rapport détaillé sans modifier les données

### Exemple d'appel direct

```javascript
const results = JulesMotor.optimize(dataContext, {
  maxIterations: 50,
  preserveScores: true,
  enableMultiSwap: false
});
```

### Exemple de calcul

```javascript
const stats = JulesMotorCalculators.calculateGlobalStats(dataContext);
console.log(stats.globalScore); // Score global
```

---

## 🗑️ Migration depuis NIRVANA

Après installation de JulesMotor, vous pouvez **supprimer** :

-   `Phase1a_OPT.js`
-   `Phase1b_CODES.js`
-   `Phase1c_PARITE.js`
-   `Phase4_Optimisation.gs.js`
-   `Phase5.V12.js`
-   `UtilsPhase4.js`
-   `Pipeline_Variante_Scores.js`

### Remplacement des fonctions

| Ancienne fonction NIRVANA | Nouvelle fonction JulesMotor |
| --- | --- |
| `lancerCombinaisonNirvanaOptimale()` | `JulesMotorUI.runOptimization()` |
| `lancerEquilibrageScores_UI()` | `JulesMotorUI.runScoresOnly()` |
| `diagnostiquerEffectifs_Ameliore()` | `JulesMotorUI.runDiagnostic()` |

---

## 📦 Format des Données

JulesMotor utilise le même format de données que NIRVANA :

```javascript
const dataContext = {
  classesState: {
    '6°1': [ { ID_ELEVE: '1', ... } ],
    '6°2': [ { ID_ELEVE: '2', ... } ]
  },
  students: {
    '1': { ID_ELEVE: '1', ... }
  },
  optionPools: {
    'LATIN': ['6°1', '6°2']
  }
};
```

---

## 📝 Format des Résultats

JulesMotor retourne un objet structuré :

```javascript
{
  success: true,
  durationMs: 1234,
  scoreInitial: 75.0,
  scoreFinal: 88.5,
  totalSwaps: 25,
  phases: { ... }
}
```

---

## ⚙️ Configuration

Vous pouvez surcharger les options par défaut :

```javascript
JulesMotor.optimize(dataContext, {
  maxIterations: 100,
  parityTolerance: 0
});
```

---

## 📜 Logs

JulesMotor génère des logs structurés dans la console Google Apps Script :

```
🚀 JULESMOTOR ENGINE v2.0.0 - DÉMARRAGE
...
✅ JULESMOTOR ENGINE - TERMINÉ EN 1234ms
```

---

## ✅ Tests

1.  Vérifier que le menu `🚀 JulesMotor` apparaît.
2.  Lancer une optimisation complète.
3.  Tester avec le diagnostic : `JulesMotorUI.runDiagnostic()`
4.  Vérifier les logs pour toute erreur.

---

**Version:** 2.0.0
**Dernière mise à jour:** 2025-10-06
**Auteur:** Jules