// =================================================================
// FRAMEWORK DE TEST SIMPLE
// =================================================================

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function runTests() {
  console.log("🚀 Démarrage des tests pour JulesMotor Validators...");
  console.log("======================================================");

  tests.forEach(t => {
    try {
      t.fn();
      console.log(`✅ PASSED: ${t.name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAILED: ${t.name}`);
      console.error(`   ▶️  ${e.message}`);
      failed++;
    }
  });

  console.log("======================================================");
  console.log(`🏁 Tests terminés : ${passed} passés, ${failed} échoués.`);
  console.log("======================================================");

  // Terminer avec un code d'erreur si des tests ont échoué
  if (failed > 0) {
    // Dans un environnement de script, cela ne terminera pas le processus,
    // mais cela peut être utile pour l'intégration continue.
    // Pour notre cas, le log est suffisant.
  }
}

// =================================================================
// SIMULATION DE L'ENVIRONNEMENT GOOGLE APPS SCRIPT
// =================================================================

const global = this;

// =================================================================
// INJECTION DU CODE À TESTER (validators.js)
// =================================================================

(function() {
  // Contenu de julesmotor/utils/validators.js collé ici
  /**
   * ═══════════════════════════════════════════════════════════════════════
   *                    JULESMOTOR - VALIDATORS MODULE
   * ═══════════════════════════════════════════════════════════════════════
   */
  'use strict';
  const JulesMotorValidators = (function(global) {
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
    function isMobile(eleve, dataContext) { const mobility = checkMobility(eleve, dataContext); return mobility.allowed; }
    function checkOption(eleve, targetClass, dataContext) {
      if (!eleve.OPT || eleve.OPT === '' || eleve.OPT === 'ESP') { return { valid: true, message: 'Aucune contrainte d\'option' }; }
      const optionPools = dataContext.optionPools || {};
      const pool = optionPools[eleve.OPT];
      if (!pool) { return { valid: true, message: `Option ${eleve.OPT} sans contrainte de pool` }; }
      const classUpper = String(targetClass).toUpperCase();
      const isInPool = pool.includes(classUpper);
      return { valid: isInPool, message: isInPool ? `Option ${eleve.OPT} compatible avec ${targetClass}` : `Option ${eleve.OPT} incompatible avec ${targetClass} (pool: ${pool.join(', ')})` };
    }
    function checkDissociation(eleve, targetClass, dataContext) {
      if (!eleve.DISSO) { return { valid: true, message: 'Aucune contrainte de dissociation' }; }
      const dissocMap = dataContext.dissocMap || {};
      const dissocSet = dissocMap[targetClass];
      if (!dissocSet) { return { valid: true, message: `Aucune dissociation définie pour ${targetClass}` }; }
      const isDissoc = dissocSet.has(eleve.DISSO);
      return { valid: !isDissoc, message: isDissoc ? `Code DISSO ${eleve.DISSO} interdit dans ${targetClass}` : `Code DISSO ${eleve.DISSO} compatible avec ${targetClass}` };
    }
    function validateSwap(eleve1, eleve2, class1, class2, dataContext) {
      const checks = []; let valid = true;
      const mobility1 = checkMobility(eleve1, dataContext); const mobility2 = checkMobility(eleve2, dataContext);
      if (!mobility1.allowed) { valid = false; checks.push({ type: 'MOBILITY', valid: false, message: `${eleve1.ID_ELEVE}: ${mobility1.message}` }); }
      if (!mobility2.allowed) { valid = false; checks.push({ type: 'MOBILITY', valid: false, message: `${eleve2.ID_ELEVE}: ${mobility2.message}` }); }
      if (mobility1.allowed && mobility2.allowed) {
        if (mobility1.condition === 'LV2_OPT_MATCH' || mobility2.condition === 'LV2_OPT_MATCH') {
          if (eleve1.LV2 !== eleve2.LV2 || eleve1.OPT !== eleve2.OPT) { valid = false; checks.push({ type: 'PERMUT', valid: false, message: `PERMUT: LV2 (${eleve1.LV2}≠${eleve2.LV2}) ou OPT (${eleve1.OPT}≠${eleve2.OPT})` }); }
        }
        if (mobility1.condition?.startsWith('DISSO_') && mobility2.condition?.startsWith('DISSO_')) {
          if (eleve1.DISSO !== eleve2.DISSO) { valid = false; checks.push({ type: 'CONDI', valid: false, message: `CONDI: Codes DISSO différents (${eleve1.DISSO}≠${eleve2.DISSO})` }); }
        }
      }
      const option1Check = checkOption(eleve1, class2, dataContext); const option2Check = checkOption(eleve2, class1, dataContext);
      if (!option1Check.valid) { valid = false; checks.push({ type: 'OPTION', valid: false, message: `${eleve1.ID_ELEVE} → ${class2}: ${option1Check.message}` }); }
      if (!option2Check.valid) { valid = false; checks.push({ type: 'OPTION', valid: false, message: `${eleve2.ID_ELEVE} → ${class1}: ${option2Check.message}` }); }
      const dissoc1Check = checkDissociation(eleve1, class2, dataContext); const dissoc2Check = checkDissociation(eleve2, class1, dataContext);
      if (!dissoc1Check.valid) { valid = false; checks.push({ type: 'DISSOCIATION', valid: false, message: `${eleve1.ID_ELEVE} → ${class2}: ${dissoc1Check.message}` }); }
      if (!dissoc2Check.valid) { valid = false; checks.push({ type: 'DISSOCIATION', valid: false, message: `${eleve2.ID_ELEVE} → ${class1}: ${dissoc2Check.message}` }); }
      return { valid, checks, mobility1, mobility2, canSwap: valid, priority: valid ? (mobility1.priority + mobility2.priority) / 2 : 0 };
    }
    function findSpecGroup(eleve, dataContext) {
      if (eleve.MOBILITE !== 'SPEC') { return [eleve]; }
      const codeAssoc = eleve.ASSO || eleve.DISSO; if (!codeAssoc) { return [eleve]; }
      const allStudents = Object.values(dataContext.classesState).flat();
      const group = allStudents.filter(e => e.MOBILITE === 'SPEC' && (e.ASSO === codeAssoc || e.DISSO === codeAssoc));
      return group;
    }
    function validateGroupSwap(group1, group2, class1, class2, dataContext) {
      if (group1.length !== group2.length) { return { valid: false, message: `Groupes de tailles différentes (${group1.length} vs ${group2.length})` }; }
      const pairValidations = []; let allValid = true;
      for (let i = 0; i < group1.length; i++) {
        const validation = validateSwap(group1[i], group2[i], class1, class2, dataContext);
        pairValidations.push(validation);
        if (!validation.valid) { allValid = false; }
      }
      return { valid: allValid, groupSize: group1.length, pairValidations, message: allValid ? `Échange de groupe valide (${group1.length} élèves)` : `Échange de groupe invalide` };
    }
    const API = { MOBILITY_TYPES, checkMobility, isMobile, checkOption, checkDissociation, validateSwap, findSpecGroup, validateGroupSwap };
    global.JulesMotorValidators = API; return API;
  })(global);
})();

// =================================================================
// DONNÉES DE TEST
// =================================================================

const mockDataContext = {
  optionPools: {},
  dissocMap: {}
};

// =================================================================
// SUITE DE TESTS
// =================================================================

test("Bug #1 Corrigé: Un élève CONDI avec un code de dissociation non-standard (ex: 'DISS01') doit être mobile", () => {
  const eleve = { ID_ELEVE: "1", MOBILITE: "CONDI", DISSO: "DISS01" };
  const result = global.JulesMotorValidators.checkMobility(eleve, mockDataContext);
  assert(result.allowed === true, "L'élève avec un code DISSO non-standard devrait être mobile.");
  assert(result.condition === "DISSO_DISS01", "La condition de mobilité est incorrecte.");
});

test("Bug #1 Corrigé: Un élève CONDI sans code de dissociation ne doit pas être mobile", () => {
  const eleve = { ID_ELEVE: "1", MOBILITE: "CONDI", DISSO: "" };
  const result = global.JulesMotorValidators.checkMobility(eleve, mockDataContext);
  assert(result.allowed === false, "L'élève CONDI sans code DISSO ne devrait pas être mobile.");
});

test("Bug #2 Corrigé: Un échange entre deux élèves CONDI avec des codes DISSO différents doit échouer", () => {
  const eleve1 = { ID_ELEVE: "1", MOBILITE: "CONDI", DISSO: "D1" };
  const eleve2 = { ID_ELEVE: "2", MOBILITE: "CONDI", DISSO: "D2" };
  const result = global.JulesMotorValidators.validateSwap(eleve1, eleve2, "6A", "6B", mockDataContext);
  assert(result.valid === false, "L'échange entre deux CONDI avec des codes DISSO différents devrait être invalide.");
  assert(result.checks.some(c => c.type === 'CONDI'), "L'échec doit être de type CONDI.");
});

test("Bug #2 Corrigé: Un échange entre un élève CONDI et un élève LIBRE doit être valide (si autres conditions ok)", () => {
  const eleve1 = { ID_ELEVE: "1", MOBILITE: "CONDI", DISSO: "D1" };
  const eleve2 = { ID_ELEVE: "2", MOBILITE: "LIBRE", DISSO: "" };
  const result = global.JulesMotorValidators.validateSwap(eleve1, eleve2, "6A", "6B", mockDataContext);
  // La validation ne doit PAS échouer à cause de la condition CONDI
  const condiCheckFailed = result.checks.some(c => c.type === 'CONDI');
  assert(condiCheckFailed === false, "L'échange entre un CONDI et un LIBRE ne doit pas échouer à cause de la règle CONDI.");
  assert(result.valid === true, "L'échange entre un CONDI et un LIBRE devrait être valide par défaut.");
});

test("Bug #2 Corrigé: Un échange entre deux élèves CONDI avec le même code DISSO doit être valide", () => {
  const eleve1 = { ID_ELEVE: "1", MOBILITE: "CONDI", DISSO: "D1" };
  const eleve2 = { ID_ELEVE: "2", MOBILITE: "CONDI", DISSO: "D1" };
  const result = global.JulesMotorValidators.validateSwap(eleve1, eleve2, "6A", "6B", mockDataContext);
  assert(result.valid === true, "L'échange entre deux CONDI avec le même code DISSO devrait être valide.");
});


// =================================================================
// EXÉCUTION DES TESTS
// =================================================================

runTests();