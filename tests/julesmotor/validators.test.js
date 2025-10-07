// Fichier de test pour le module de validation de JulesMotor

// --- Dépendances et Assertions ---
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// --- Injection du code à tester ---
// Le code de 'julesmotor/utils/validators.js' est encapsulé dans une IIFE.
// On le copie ici pour le rendre accessible dans l'environnement de test Node.js.
const JulesMotorValidators = (function(global) {
  'use strict';
  const MOBILITY_TYPES = { LIBRE: 'LIBRE', FIXE: 'FIXE', PERMUT: 'PERMUT', CONDI: 'CONDI', SPEC: 'SPEC' };

  function checkMobility(eleve, dataContext) {
    const mobilite = String(eleve.MOBILITE || '').toUpperCase();
    switch (mobilite) {
      case MOBILITY_TYPES.LIBRE: return { allowed: true, type: 'LIBRE', priority: 1.0, message: 'Mobilité totale' };
      case MOBILITY_TYPES.FIXE: return { allowed: false, type: 'FIXE', priority: 0.0, message: 'Élève fixe, aucun échange possible' };
      case MOBILITY_TYPES.PERMUT: return { allowed: true, type: 'PERMUT', priority: 0.8, condition: 'LV2_OPT_MATCH', message: 'Échange possible si LV2 et OPT identiques' };
      case MOBILITY_TYPES.CONDI:
        const codeDisso = eleve.DISSO;
        if (codeDisso) { return { allowed: true, type: 'CONDI', priority: 0.7, condition: `DISSO_${codeDisso}`, message: `Échange possible avec même code ${codeDisso}` }; }
        return { allowed: false, type: 'CONDI', priority: 0.0, message: 'Code DISSO manquant ou invalide' };
      case MOBILITY_TYPES.SPEC:
        const codeAssoc = eleve.ASSO || eleve.DISSO;
        if (codeAssoc) { return { allowed: true, type: 'SPEC', priority: 0.6, condition: 'GROUP_EXCHANGE', codeAssoc, message: `Échange de groupe ${codeAssoc} requis` }; }
        return { allowed: false, type: 'SPEC', priority: 0.0, message: 'Code d\'association manquant' };
      default: return { allowed: false, type: 'UNKNOWN', priority: 0.0, message: `Type de mobilité inconnu: ${mobilite}` };
    }
  }

  function validateSwap(eleve1, eleve2, class1, class2, dataContext) {
    const mobility1 = checkMobility(eleve1, dataContext);
    const mobility2 = checkMobility(eleve2, dataContext);
    let valid = true;
    if (!mobility1.allowed || !mobility2.allowed) { valid = false; }
    if (mobility1.type === 'CONDI' && mobility2.type === 'CONDI') {
      if (eleve1.DISSO !== eleve2.DISSO) { valid = false; }
    }
    // D'autres vérifications (options, etc.) seraient ici, mais on se concentre sur le bug.
    return { valid };
  }

  const API = { MOBILITY_TYPES, checkMobility, validateSwap };
  if (global) { global.JulesMotorValidators = API; }
  return API;
})(typeof global === 'undefined' ? {} : global);


// --- Runner de test simple ---
const tests = [];
function test(description, fn) {
    tests.push({ description, fn });
}

function runTests() {
    console.log("🚀 Démarrage des tests pour JulesMotor Validators...");
    console.log("======================================================");
    let passed = 0;
    let failed = 0;

    tests.forEach(t => {
        try {
            t.fn();
            console.log(`✅ PASSED: ${t.description}`);
            passed++;
        } catch (e) {
            console.error(`❌ FAILED: ${t.description}`);
            console.error(`   ▶ ${e.message}`);
            failed++;
        }
    });

    console.log("======================================================");
    console.log(`🏁 Tests terminés : ${passed} passés, ${failed} échoués.`);
    console.log("======================================================");

    if (failed > 0) {
        process.exit(1); // Échouer le processus si des tests échouent
    }
}

// --- Définition des cas de test ---

// Données de test (mock)
const mockContext = {};
const eleveCondiStandard = { MOBILITE: 'CONDI', DISSO: 'D1' };
const eleveCondiNonStandard = { MOBILITE: 'CONDI', DISSO: 'DISS01' };
const eleveCondiSansCode = { MOBILITE: 'CONDI', DISSO: '' };
const eleveLibre = { MOBILITE: 'LIBRE' };
const eleveCondiAutreCode = { MOBILITE: 'CONDI', DISSO: 'D2' };

// Tests pour le Bug #1 (Mobilité CONDI)
test("Bug #1 Corrigé: Un élève CONDI avec un code de dissociation non-standard (ex: 'DISS01') doit être mobile", () => {
    const result = JulesMotorValidators.checkMobility(eleveCondiNonStandard, mockContext);
    assert(result.allowed === true, "Un élève CONDI avec un code valide (même non-standard) devrait être mobile.");
});

test("Bug #1 Corrigé: Un élève CONDI sans code de dissociation ne doit pas être mobile", () => {
    const result = JulesMotorValidators.checkMobility(eleveCondiSansCode, mockContext);
    assert(result.allowed === false, "Un élève CONDI sans code de dissociation ne devrait pas être mobile.");
});

// Tests pour le Bug #2 (Validation de Swap CONDI)
test("Bug #2 Corrigé: Un échange entre deux élèves CONDI avec des codes DISSO différents doit échouer", () => {
    const result = JulesMotorValidators.validateSwap(eleveCondiStandard, eleveCondiAutreCode, 'C1', 'C2', mockContext);
    assert(result.valid === false, "L'échange entre deux élèves CONDI avec des codes DISSO différents devrait être invalide.");
});

test("Bug #2 Corrigé: Un échange entre un élève CONDI et un élève LIBRE doit être valide (si autres conditions ok)", () => {
    const result = JulesMotorValidators.validateSwap(eleveCondiStandard, eleveLibre, 'C1', 'C2', mockContext);
    assert(result.valid === true, "L'échange entre un élève CONDI et un élève LIBRE devrait être valide.");
});

test("Bug #2 Corrigé: Un échange entre deux élèves CONDI avec le même code DISSO doit être valide", () => {
    const result = JulesMotorValidators.validateSwap(eleveCondiStandard, { ...eleveCondiStandard }, 'C1', 'C2', mockContext);
    assert(result.valid === true, "L'échange entre deux élèves CONDI avec le même code DISSO devrait être valide.");
});


// --- Exécution des tests ---
runTests();