# Guide de Migration - Architecture Modulaire

Ce guide explique comment continuer la migration des fonctions vers l'architecture modulaire.

## 📋 État actuel de la migration

### ✅ Modules complétés

- **App.UI** - Interface utilisateur (toast, stats, spinner)
- **App.History** - Historique (undo, redo)
- **App.Stats** - Statistiques avancées
- **App.Data** - Export et sauvegarde
- **App.Utils** - Utilitaires (isRealClass)

### ⏳ Modules à migrer

- **App.Views** - Gestion des vues
- **App.DragDrop** - Drag and drop
- **App.Constraints** - Validation des contraintes
- **App.Search** - Recherche et filtres
- **App.Init** - Initialisation

## 🔧 Processus de migration étape par étape

### Étape 1 : Identifier les fonctions à migrer

Pour identifier les fonctions d'un module, chercher dans InterfaceV2.html :

```bash
# Exemple : trouver les fonctions de vue
grep -n "function toggle" InterfaceV2.html
# Résultat : toggleViewMode, toggleSwapMode, toggleDarkMode, toggleZoom
```

### Étape 2 : Copier la fonction dans le module

**Exemple : Migrer toggleViewMode vers App.Views**

1. Trouver la fonction actuelle (ligne ~7301) :
```javascript
function toggleViewMode() {
  const modes = ['complete', 'essential', 'simple'];
  const currentIndex = modes.indexOf(STATE.viewMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  STATE.viewMode = modes[nextIndex];
  // ... reste du code
}
```

2. L'ajouter au module App.Views (dans la section ligne ~6525) :
```javascript
Views: {
  /**
   * Change le mode d'affichage (cycle entre complete, essential, simple)
   */
  toggleViewMode() {
    const modes = ['complete', 'essential', 'simple'];
    const currentIndex = modes.indexOf(STATE.viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    STATE.viewMode = modes[nextIndex];

    localStorage.setItem('viewMode', STATE.viewMode);

    // Mettre à jour les classes body
    document.body.classList.remove('simple-view', 'essential-view');
    if (STATE.viewMode === 'simple') {
      document.body.classList.add('simple-view');
    } else if (STATE.viewMode === 'essential') {
      document.body.classList.add('essential-view');
    }

    // Mettre à jour le bouton
    const btn = document.getElementById('btnSimpleView');
    if (btn) {
      const modeLabels = {
        'complete': '<i class="fas fa-th-list"></i> Vue essentielle',
        'essential': '<i class="fas fa-list"></i> Vue simple',
        'simple': '<i class="fas fa-th-large"></i> Vue complète'
      };
      btn.innerHTML = modeLabels[STATE.viewMode];
      btn.setAttribute('aria-pressed', STATE.viewMode !== 'complete');
    }

    // Recréer les cartes
    document.querySelectorAll('.droppable-zone').forEach(zone => {
      const ids = Array.from(zone.querySelectorAll('.student-card')).map(c => c.dataset.id);
      zone.innerHTML = '';
      ids.forEach(id => {
        if (STATE.students && STATE.students[id]) {
          const card = createStudentCard(STATE.students[id]);
          if (card) zone.appendChild(card);
        }
      });
      setTimeout(() => App.UI.adjustSimpleNamesFontSize(zone), 0);
    });

    if (window.applyLisibilitePreferences) {
      window.applyLisibilitePreferences();
    }
  }
},
```

### Étape 3 : Mettre à jour les appels internes

Si la fonction appelle d'autres fonctions déjà migrées, les mettre à jour :

```javascript
// ❌ AVANT
setTimeout(() => adjustSimpleNamesFontSize(zone), 0);

// ✅ APRÈS
setTimeout(() => App.UI.adjustSimpleNamesFontSize(zone), 0);
```

### Étape 4 : Créer le wrapper

Ajouter le wrapper dans la section "FONCTIONS WRAPPER POUR COMPATIBILITÉ" :

```javascript
// Wrapper pour toggleViewMode
function toggleViewMode() {
  return App.Views.toggleViewMode();
}
```

### Étape 5 : Supprimer ou commenter l'ancienne définition

```javascript
// ========== ANCIENNES FONCTIONS MIGRÉES VERS App.* ==========
// toggleViewMode() migré vers App.Views.toggleViewMode()
```

### Étape 6 : Tester

```javascript
// Dans la console du navigateur
App.Views.toggleViewMode(); // Doit changer la vue
toggleViewMode(); // Doit fonctionner aussi (via wrapper)
```

## 📝 Template de migration

### Pour une fonction simple

```javascript
// 1. Dans le module approprié (ex: App.Views)
Views: {
  /**
   * Description de la fonction
   * @param {type} param - Description
   * @returns {type} Description du retour
   */
  nomDeLaFonction(param) {
    // Code de la fonction
    // Remplacer les appels aux fonctions migrées par App.Module.fonction()
  }
},

// 2. Créer le wrapper
function nomDeLaFonction(param) {
  return App.Views.nomDeLaFonction(param);
}

// 3. Commenter l'ancienne définition
// nomDeLaFonction() migré vers App.Views.nomDeLaFonction()
```

### Pour une fonction asynchrone

```javascript
// 1. Dans le module
Data: {
  /**
   * Description
   */
  async nomAsyncFonction() {
    try {
      // Code async
      await autreOperation();
      return result;
    } catch (error) {
      App.UI.toast('Erreur: ' + error.message, 'error');
      throw error;
    }
  }
},

// 2. Wrapper async
async function nomAsyncFonction() {
  return App.Data.nomAsyncFonction();
}
```

## 🎯 Priorités de migration

### Priorité 1 - High (Impact élevé)
- [ ] App.Views.toggleViewMode()
- [ ] App.Views.toggleSwapMode()
- [ ] App.DragDrop.handleDragStart()
- [ ] App.DragDrop.handleDrop()
- [ ] App.Constraints.canMove()
- [ ] App.Constraints.canSwap()

### Priorité 2 - Medium (Impact moyen)
- [ ] App.Views.toggleDarkMode()
- [ ] App.Views.toggleZoom()
- [ ] App.DragDrop.handleDragOver()
- [ ] App.DragDrop.handleDragEnd()
- [ ] App.Search.searchStudents()

### Priorité 3 - Low (Impact faible)
- [ ] App.Init.setupEventListeners()
- [ ] App.Init.initApp()
- [ ] App.Search.filterByTag()
- [ ] Autres fonctions utilitaires

## 🔍 Liste des fonctions à migrer

### App.Views (Priorité 1)

```javascript
Views: {
  toggleViewMode() { },        // Ligne ~7301
  toggleSwapMode() { },        // Ligne ~7137
  toggleDarkMode() { },        // Ligne ~8143
  toggleZoom() { },            // Ligne ~8165
  toggleFullscreenStats() { }, // Ligne ~8180
  toggleAnchoredStats() { }    // Ligne ~8217
}
```

### App.DragDrop (Priorité 1)

```javascript
DragDrop: {
  handleDragStart(e) { },   // Ligne ~6161
  handleDragEnd(e) { },     // Ligne ~6171
  handleDragOver(e) { },    // Ligne ~6180
  handleDragLeave(e) { },   // Ligne ~6217
  handleDrop(e) { }         // Ligne ~6228
}
```

### App.Constraints (Priorité 1)

```javascript
Constraints: {
  canMove(eleveId, srcClasse, dstClasse) { },  // Ligne ~5441
  canSwap(id1, id2) { },                       // Ligne ~5538
  validateMove(eleveId, targetClasse) { },
  checkAssociations(eleveId) { },
  checkDissociations(eleveId, targetClasse) { }
}
```

### App.Search (Priorité 2)

```javascript
Search: {
  setupSearch() { },        // Ligne ~7067
  searchStudents(term) { },
  filterByTag(tag) { },
  highlightResults(ids) { }
}
```

### App.Init (Priorité 3)

```javascript
Init: {
  setupEventListeners() { },  // Ligne ~8130
  setupKeyboardShortcuts() { }, // Ligne ~8035
  initApp() { },
  loadPreferences() { },      // Ligne ~6646
  applyPreferences() { }      // Ligne ~6660
}
```

## ⚠️ Points d'attention

### 1. Dépendances circulaires

Si une fonction appelle une autre fonction du même module, utiliser `this` :

```javascript
Views: {
  toggleViewMode() {
    // ✅ BON
    this.updateViewButton();
  },

  updateViewButton() {
    // Code...
  }
}
```

### 2. Fonctions utilisées dans le HTML

Les fonctions appelées depuis le HTML doivent avoir un wrapper :

```html
<!-- HTML -->
<button onclick="toggleViewMode()">Changer vue</button>
```

```javascript
// Wrapper nécessaire
function toggleViewMode() {
  return App.Views.toggleViewMode();
}
```

### 3. Event listeners

Les event listeners peuvent utiliser soit le wrapper soit directement App.* :

```javascript
// Option 1 : Via wrapper
btn.addEventListener('click', toggleViewMode);

// Option 2 : Directement (recommandé pour nouveau code)
btn.addEventListener('click', () => App.Views.toggleViewMode());
```

### 4. État global

Toujours utiliser `STATE` ou `App.state` (qui sont identiques) :

```javascript
// ✅ BON
if (STATE.swapMode) { }
if (App.state.swapMode) { }

// ❌ MAUVAIS - Ne pas créer de copie locale
const swapMode = STATE.swapMode;
```

## 📊 Suivi de la migration

### Checklist par module

**App.Views**
- [ ] toggleViewMode
- [ ] toggleSwapMode
- [ ] toggleDarkMode
- [ ] toggleZoom
- [ ] toggleFullscreenStats
- [ ] toggleAnchoredStats

**App.DragDrop**
- [ ] handleDragStart
- [ ] handleDragEnd
- [ ] handleDragOver
- [ ] handleDragLeave
- [ ] handleDrop

**App.Constraints**
- [ ] canMove
- [ ] canSwap
- [ ] validateMove
- [ ] checkAssociations
- [ ] checkDissociations

**App.Search**
- [ ] setupSearch
- [ ] searchStudents
- [ ] filterByTag
- [ ] highlightResults

**App.Init**
- [ ] setupEventListeners
- [ ] setupKeyboardShortcuts
- [ ] initApp
- [ ] loadPreferences
- [ ] applyPreferences

## 🧪 Tests après migration

Après avoir migré un module, tester :

```javascript
// 1. Vérifier que le module existe
console.log(App.Views); // Doit afficher l'objet avec les fonctions

// 2. Vérifier que les fonctions sont accessibles
console.log(typeof App.Views.toggleViewMode); // "function"

// 3. Tester l'exécution
App.Views.toggleViewMode(); // Doit changer la vue

// 4. Tester via le wrapper
toggleViewMode(); // Doit fonctionner aussi

// 5. Vérifier qu'il n'y a pas d'erreur dans la console
```

## 📚 Ressources

- **Documentation complète** : ARCHITECTURE_MODULAIRE.md
- **Exemples pratiques** : EXEMPLES_ARCHITECTURE.md
- **Tests de vérification** : TEST_ARCHITECTURE.md
- **Code source** : InterfaceV2.html ligne 6243+

## 💡 Conseils

1. **Migrer un module à la fois** : Plus facile à tester et à déboguer
2. **Tester après chaque migration** : Ne pas attendre d'avoir tout migré
3. **Conserver les wrappers** : Ils assurent la compatibilité
4. **Documenter avec JSDoc** : Aide à la maintenance future
5. **Utiliser la console** : Pour vérifier que tout fonctionne

---

**Bonne migration !** 🚀

En cas de problème, consulter TEST_ARCHITECTURE.md pour le débogage.
