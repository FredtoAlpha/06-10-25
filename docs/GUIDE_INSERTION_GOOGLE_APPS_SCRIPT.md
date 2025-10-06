# 📖 GUIDE D'INSERTION GOOGLE APPS SCRIPT

**Version** : 2.0 (JulesMotor)
**Date** : 6 octobre 2025

Ce guide explique comment installer ou mettre à jour le projet dans l'environnement Google Apps Script.

---

## ✅ ÉTAPE 1 : Supprimer les anciens fichiers (si mise à jour)

Si vous mettez à jour une version précédente, supprimez les fichiers suivants de votre projet Google Apps Script. Ils sont maintenant obsolètes et remplacés par **JulesMotor**.

-   `Nirvana_Combined_Orchestrator.js`
-   `nirvana_parity_combined.js`
-   `NIRVANA_SCORES_EQUILIBRAGEV1.2.js`
-   `Nirvana_V2_Amelioree.js`
-   `NIRVANATESTV2.js`
-   Tous les anciens fichiers `ClaudeMotor_*.gs`

---

## ✅ ÉTAPE 2 : Insérer les fichiers JulesMotor

### Préparation automatique (recommandé)

1.  À la racine du projet, exécutez le script : `prepare_for_google_apps_script.bat`
2.  Ce script va créer un répertoire `google_apps_script_ready/` contenant les 6 fichiers du moteur, déjà renommés.

### Structure JulesMotor (6 fichiers)

| Fichier source | Nom dans Google Apps Script |
| --- | --- |
| `julesmotor/core/JulesMotor.js` | **JulesMotor_Core.gs** |
| `julesmotor/utils/calculators.js` | **JulesMotor_Utils_Calculators.gs** |
| `julesmotor/utils/validators.js` | **JulesMotor_Utils_Validators.gs** |
| `julesmotor/algorithms/ParityCorrector.js` | **JulesMotor_Algorithm_ParityCorrector.gs** |
| `julesmotor/algorithms/ScoresBalancer.js` | **JulesMotor_Algorithm_ScoresBalancer.gs** |
| `julesmotor/ui/Orchestrator.js` | **JulesMotor_UI_Orchestrator.gs** |

### Ordre d'insertion

Créez les fichiers dans votre projet Google Apps Script en respectant **cet ordre précis** pour éviter les erreurs de dépendances :

1.  `JulesMotor_Utils_Validators.gs`
2.  `JulesMotor_Utils_Calculators.gs`
3.  `JulesMotor_Algorithm_ScoresBalancer.js`
4.  `JulesMotor_Algorithm_ParityCorrector.js`
5.  `JulesMotor_Core.gs`
6.  `JulesMotor_UI_Orchestrator.gs`

---

## ✅ ÉTAPE 3 : Insérer les fichiers principaux et UI

Les fichiers suivants doivent également être présents dans votre projet. Ils n'ont pas besoin d'être renommés.

-   **`core/Config.js`**
-   **`core/BackendV2.js`**
-   **`core/Menu.js`**
-   **`core/Utils.js`**
-   **`core/Initialisation.js`**
-   **`ui/InterfaceV2.html`**
-   ... et les autres fichiers HTML du répertoire `ui/`.

---

## ✅ ÉTAPE 4 : Vérification

1.  Actualisez votre feuille Google Sheets.
2.  Un menu **🚀 JulesMotor** doit apparaître.
3.  Lancez un **Diagnostic** depuis ce menu pour vérifier que tout fonctionne.

---

## ⚠️ Dépannage

-   **Erreur "JulesMotor is not defined"** : Vérifiez que les 6 fichiers du moteur sont présents et dans le bon ordre.
-   **Le menu n'apparaît pas** : Vérifiez que `JulesMotor_UI_Orchestrator.gs` est bien présent et que la fonction `onOpen()` est correcte.

---

**JulesMotor** remplace complètement Nirvana, offrant une architecture plus propre, plus performante et plus facile à maintenir.