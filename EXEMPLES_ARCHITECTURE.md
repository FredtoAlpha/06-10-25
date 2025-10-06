# Exemples d'utilisation de l'Architecture Modulaire

## Table des matières

1. [Exemples de base](#exemples-de-base)
2. [Migration de code existant](#migration-de-code-existant)
3. [Création de nouvelles fonctions](#création-de-nouvelles-fonctions)
4. [Patterns recommandés](#patterns-recommandés)

## Exemples de base

### Afficher des notifications

```javascript
// ✅ Nouveau code (recommandé)
App.UI.toast('Élève déplacé avec succès', 'success');
App.UI.toast('Erreur de validation', 'error');
App.UI.toast('Attention : contrainte détectée', 'warning');

// ✅ Code legacy (toujours supporté)
toast('Élève déplacé avec succès', 'success');
```

### Gérer l'historique

```javascript
// ✅ Annuler une action
App.History.undo();

// ✅ Refaire une action
App.History.redo();

// ✅ Mettre à jour les boutons undo/redo
App.History.updateUndoRedoButtons();
```

### Mettre à jour les statistiques

```javascript
// ✅ Mettre à jour toutes les colonnes
App.UI.updateAllColumnStats();

// ✅ Mettre à jour une colonne spécifique
const column = document.querySelector('.class-column');
const eleves = getElevesFromColumn(column);
App.UI.updateColumnStats(column, eleves);

// ✅ Mettre à jour les statistiques avancées
App.Stats.updateAdvancedStats();
```

### Sauvegarder et exporter

```javascript
// ✅ Exporter la disposition actuelle
const disposition = App.Data.exportDisposition();
console.log(disposition); // { "4°1": ["id1", "id2", ...], "4°2": [...] }

// ✅ Sauvegarder dans le cache
await App.Data.saveImmediateCache();

// ✅ Avec gestion d'erreur
try {
  await App.Data.saveImmediateCache();
  App.UI.toast('Sauvegarde réussie', 'success');
} catch (error) {
  App.UI.toast('Erreur de sauvegarde', 'error');
  console.error(error);
}
```

### Fonctions utilitaires

```javascript
// ✅ Vérifier si c'est une vraie classe
if (App.Utils.isRealClass('4°1')) {
  console.log('C\'est une vraie classe');
}

if (!App.Utils.isRealClass('ESP_Groupe1')) {
  console.log('C\'est un groupe, pas une classe');
}
```

### Accéder à l'état global

```javascript
// ✅ Via App.state
if (App.state.swapMode) {
  console.log('Mode swap activé');
}

// ✅ Via STATE (encore supporté)
if (STATE.swapMode) {
  console.log('Mode swap activé');
}

// ✅ Modifier l'état
App.state.viewMode = 'simple';
App.state.darkMode = true;
```

## Migration de code existant

### Exemple 1: Fonction qui utilise plusieurs modules

**Avant:**
```javascript
function handleStudentMove(studentId, targetClasse) {
  // Validation
  if (!isRealClass(targetClasse)) {
    toast('Classe invalide', 'error');
    return;
  }

  // Déplacer l'élève
  moveStudent(studentId, targetClasse);

  // Mettre à jour l'interface
  updateAllColumnStats();
  updateAdvancedStats();

  // Sauvegarder
  saveImmediateCache();

  // Notification
  toast('Élève déplacé', 'success');
}
```

**Après (utilisant App.*):**
```javascript
function handleStudentMove(studentId, targetClasse) {
  // Validation
  if (!App.Utils.isRealClass(targetClasse)) {
    App.UI.toast('Classe invalide', 'error');
    return;
  }

  // Déplacer l'élève
  moveStudent(studentId, targetClasse);

  // Mettre à jour l'interface
  App.UI.updateAllColumnStats();
  App.Stats.updateAdvancedStats();

  // Sauvegarder
  App.Data.saveImmediateCache();

  // Notification
  App.UI.toast('Élève déplacé', 'success');
}
```

**Avantage:** Le code est plus explicite et on voit clairement quels modules sont utilisés.

### Exemple 2: Event Handler

**Avant (HTML):**
```html
<button onclick="undo()">Annuler</button>
<button onclick="toast('Clic!', 'info')">Notifier</button>
```

**Après (Option 1 - avec wrappers, aucun changement nécessaire):**
```html
<!-- Fonctionne toujours grâce aux wrappers -->
<button onclick="undo()">Annuler</button>
<button onclick="toast('Clic!', 'info')">Notifier</button>
```

**Après (Option 2 - utilisant directement App.*):**
```html
<button onclick="App.History.undo()">Annuler</button>
<button onclick="App.UI.toast('Clic!', 'info')">Notifier</button>
```

### Exemple 3: Fonction complexe avec dépendances

**Avant:**
```javascript
function processStudentChange() {
  showSpinner();

  try {
    const disposition = exportDisposition();

    // Traitement...
    updateAllColumnStats();
    updateAdvancedStats();

    toast('Traitement terminé', 'success');
  } catch (error) {
    toast('Erreur: ' + error.message, 'error');
  } finally {
    hideSpinner();
  }
}
```

**Après:**
```javascript
function processStudentChange() {
  App.UI.showSpinner();

  try {
    const disposition = App.Data.exportDisposition();

    // Traitement...
    App.UI.updateAllColumnStats();
    App.Stats.updateAdvancedStats();

    App.UI.toast('Traitement terminé', 'success');
  } catch (error) {
    App.UI.toast('Erreur: ' + error.message, 'error');
  } finally {
    App.UI.hideSpinner();
  }
}
```

## Création de nouvelles fonctions

### Ajouter une fonction à un module existant

```javascript
// Dans le fichier InterfaceV2.html, section App.UI

App.UI.createAlert = function(title, message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
  `;
  document.body.appendChild(alert);

  // Auto-suppression après 5 secondes
  setTimeout(() => alert.remove(), 5000);
};

// Créer un wrapper si nécessaire
function createAlert(title, message, type) {
  return App.UI.createAlert(title, message, type);
}

// Utilisation
App.UI.createAlert('Attention', 'Contrainte détectée', 'warning');
```

### Créer un nouveau sous-module

```javascript
// Ajouter à l'objet App
App.Validation = {
  /**
   * Valide un élève
   * @param {Object} eleve - Objet élève
   * @returns {Object} Résultat de validation
   */
  validateStudent(eleve) {
    const errors = [];

    if (!eleve.nom) errors.push('Nom manquant');
    if (!eleve.prenom) errors.push('Prénom manquant');
    if (!['M', 'F'].includes(eleve.sexe)) errors.push('Sexe invalide');

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Valide une classe
   * @param {string} className - Nom de la classe
   * @returns {boolean}
   */
  validateClassName(className) {
    return App.Utils.isRealClass(className);
  }
};

// Utilisation
const eleve = { nom: 'Dupont', prenom: 'Jean', sexe: 'M' };
const validation = App.Validation.validateStudent(eleve);

if (!validation.valid) {
  App.UI.toast('Erreurs: ' + validation.errors.join(', '), 'error');
}
```

## Patterns recommandés

### Pattern 1: Chaînage de modules

```javascript
function updateInterface() {
  // Chaîner les appels de modules
  App.UI.showSpinner();
  App.UI.updateAllColumnStats();
  App.Stats.updateAdvancedStats();
  App.UI.hideSpinner();
  App.UI.toast('Interface mise à jour', 'success');
}
```

### Pattern 2: Gestion d'erreur centralisée

```javascript
App.Utils.handleError = function(error, context = 'Opération') {
  console.error(`Erreur dans ${context}:`, error);
  App.UI.toast(`${context} échouée: ${error.message}`, 'error');

  // Optionnel: Logger vers le serveur
  if (typeof logError === 'function') {
    logError(context, error);
  }
};

// Utilisation
try {
  await App.Data.saveImmediateCache();
} catch (error) {
  App.Utils.handleError(error, 'Sauvegarde');
}
```

### Pattern 3: Fonction asynchrone avec feedback

```javascript
async function performComplexOperation() {
  App.UI.showSpinner();

  try {
    // Étape 1
    App.UI.toast('Exportation en cours...', 'info');
    const disposition = App.Data.exportDisposition();

    // Étape 2
    App.UI.toast('Sauvegarde en cours...', 'info');
    await App.Data.saveImmediateCache();

    // Étape 3
    App.UI.toast('Mise à jour des stats...', 'info');
    App.Stats.updateAdvancedStats();

    // Succès
    App.UI.toast('Opération terminée avec succès', 'success');

  } catch (error) {
    App.UI.toast('Erreur: ' + error.message, 'error');
    throw error;

  } finally {
    App.UI.hideSpinner();
  }
}
```

### Pattern 4: Observateur d'état

```javascript
// Créer un observateur de changements
App.Utils.watchState = function(property, callback) {
  let oldValue = App.state[property];

  setInterval(() => {
    const newValue = App.state[property];
    if (oldValue !== newValue) {
      callback(newValue, oldValue);
      oldValue = newValue;
    }
  }, 100);
};

// Utilisation
App.Utils.watchState('swapMode', (newValue, oldValue) => {
  console.log(`Swap mode changed: ${oldValue} → ${newValue}`);

  if (newValue) {
    App.UI.toast('Mode swap activé', 'info');
  }
});
```

### Pattern 5: Module avec état local

```javascript
App.UI.Notifications = (function() {
  // État privé du module
  let notifications = [];
  let maxNotifications = 5;

  return {
    add(message, type = 'info') {
      const notification = {
        id: Date.now(),
        message: message,
        type: type,
        timestamp: new Date()
      };

      notifications.push(notification);

      // Limiter le nombre de notifications
      if (notifications.length > maxNotifications) {
        notifications.shift();
      }

      App.UI.toast(message, type);
      return notification;
    },

    getAll() {
      return [...notifications]; // Copie pour éviter modifications
    },

    clear() {
      notifications = [];
    },

    count() {
      return notifications.length;
    }
  };
})();

// Utilisation
App.UI.Notifications.add('Nouvel élève ajouté', 'success');
console.log(`Total notifications: ${App.UI.Notifications.count()}`);
```

## Conseils pour le développement

### 1. Toujours utiliser les modules dans le nouveau code
```javascript
// ✅ BON
App.UI.toast('Message', 'success');

// ❌ ÉVITER dans le nouveau code
toast('Message', 'success');
```

### 2. Documenter les nouvelles fonctions
```javascript
App.UI.nouveauComposant = function(param1, param2) {
  /**
   * Description de la fonction
   * @param {string} param1 - Description param1
   * @param {number} param2 - Description param2
   * @returns {Object} Description du retour
   */
  // Code ici
};
```

### 3. Utiliser const pour les modules immuables
```javascript
// ✅ BON - Les modules ne doivent pas être réassignés
const App = { ... };

// ❌ MAUVAIS
let App = { ... };
```

### 4. Privilégier la clarté à la concision
```javascript
// ✅ BON - Explicite et clair
App.UI.updateAllColumnStats();
App.Stats.updateAdvancedStats();

// ❌ À ÉVITER - Trop concis, perd en clarté
updateAllColumnStats(); updateAdvancedStats();
```

---

**Note:** Ces exemples sont basés sur l'architecture modulaire implémentée dans InterfaceV2.html. Voir ARCHITECTURE_MODULAIRE.md pour plus de détails.
