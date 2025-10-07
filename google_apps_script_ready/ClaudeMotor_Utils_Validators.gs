/**
 * ═══════════════════════════════════════════════════════════════════════
 *                    CLAUDEMOTOR - VALIDATORS MODULE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Gestion centralisée de toutes les validations et contraintes
 *
 * Version: 2.0.0
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

const ClaudeMotorValidators = (function(global) {

  // ═══════════════════════════════════════════════════════════════════════
  // MOBILITÉ
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Types de mobilité supportés
   */
  const MOBILITY_TYPES = {
    LIBRE: 'LIBRE',       // Mobilité totale
    FIXE: 'FIXE',         // Immobile
    PERMUT: 'PERMUT',     // Échange si LV2 et OPT identiques
    CONDI: 'CONDI',       // Échange si même code DISSO
    SPEC: 'SPEC'          // Échange de groupe associé
  };

  /**
   * Vérifie les conditions de mobilité d'un élève
   */
  function checkMobility(eleve, dataContext) {
    const mobilite = String(eleve.MOBILITE || '').toUpperCase();

    switch (mobilite) {
      case MOBILITY_TYPES.LIBRE:
        return {
          allowed: true,
          type: 'LIBRE',
          priority: 1.0,
          message: 'Mobilité totale'
        };

      case MOBILITY_TYPES.FIXE:
        return {
          allowed: false,
          type: 'FIXE',
          priority: 0.0,
          message: 'Élève fixe, aucun échange possible'
        };

      case MOBILITY_TYPES.PERMUT:
        return {
          allowed: true,
          type: 'PERMUT',
          priority: 0.8,
          condition: 'LV2_OPT_MATCH',
          message: 'Échange possible si LV2 et OPT identiques'
        };

      case MOBILITY_TYPES.CONDI:
        const codeDisso = eleve.DISSO;
        if (codeDisso && codeDisso.startsWith('D')) {
          return {
            allowed: true,
            type: 'CONDI',
            priority: 0.7,
            condition: `DISSO_${codeDisso}`,
            message: `Échange possible avec même code ${codeDisso}`
          };
        }
        return {
          allowed: false,
          type: 'CONDI',
          priority: 0.0,
          message: 'Code DISSO manquant ou invalide'
        };

      case MOBILITY_TYPES.SPEC:
        const codeAssoc = eleve.ASSO || eleve.DISSO;
        if (codeAssoc) {
          return {
            allowed: true,
            type: 'SPEC',
            priority: 0.6,
            condition: 'GROUP_EXCHANGE',
            codeAssoc,
            message: `Échange de groupe ${codeAssoc} requis`
          };
        }
        return {
          allowed: false,
          type: 'SPEC',
          priority: 0.0,
          message: 'Code d\'association manquant'
        };

      default:
        return {
          allowed: false,
          type: 'UNKNOWN',
          priority: 0.0,
          message: `Type de mobilité inconnu: ${mobilite}`
        };
    }
  }

  /**
   * Vérifie si un élève est mobile
   */
  function isMobile(eleve, dataContext) {
    const mobility = checkMobility(eleve, dataContext);
    return mobility.allowed;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // OPTIONS ET POOLS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Vérifie si l'option d'un élève est compatible avec une classe
   */
  function checkOption(eleve, targetClass, dataContext) {
    // Pas d'option ou option ESP = toujours valide
    if (!eleve.OPT || eleve.OPT === '' || eleve.OPT === 'ESP') {
      return {
        valid: true,
        message: 'Aucune contrainte d\'option'
      };
    }

    const optionPools = dataContext.optionPools || {};
    const pool = optionPools[eleve.OPT];

    // Si pas de pool défini pour cette option, on accepte
    if (!pool) {
      return {
        valid: true,
        message: `Option ${eleve.OPT} sans contrainte de pool`
      };
    }

    // Vérifier que la classe cible est dans le pool
    const classUpper = String(targetClass).toUpperCase();
    const isInPool = pool.includes(classUpper);

    return {
      valid: isInPool,
      message: isInPool
        ? `Option ${eleve.OPT} compatible avec ${targetClass}`
        : `Option ${eleve.OPT} incompatible avec ${targetClass} (pool: ${pool.join(', ')})`
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // DISSOCIATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Vérifie les contraintes de dissociation
   */
  function checkDissociation(eleve, targetClass, dataContext) {
    // Pas de code DISSO = pas de contrainte
    if (!eleve.DISSO) {
      return {
        valid: true,
        message: 'Aucune contrainte de dissociation'
      };
    }

    const dissocMap = dataContext.dissocMap || {};
    const dissocSet = dissocMap[targetClass];

    // Pas de dissociations définies pour cette classe
    if (!dissocSet) {
      return {
        valid: true,
        message: `Aucune dissociation définie pour ${targetClass}`
      };
    }

    // Vérifier que le code DISSO n'est pas dans la classe cible
    const isDissoc = dissocSet.has(eleve.DISSO);

    return {
      valid: !isDissoc,
      message: isDissoc
        ? `Code DISSO ${eleve.DISSO} interdit dans ${targetClass}`
        : `Code DISSO ${eleve.DISSO} compatible avec ${targetClass}`
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // VALIDATION COMPLÈTE D'ÉCHANGE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Valide un échange entre deux élèves
   */
  function validateSwap(eleve1, eleve2, class1, class2, dataContext) {
    const checks = [];
    let valid = true;

    // 1. Vérifier mobilité des deux élèves
    const mobility1 = checkMobility(eleve1, dataContext);
    const mobility2 = checkMobility(eleve2, dataContext);

    if (!mobility1.allowed) {
      valid = false;
      checks.push({
        type: 'MOBILITY',
        valid: false,
        message: `${eleve1.ID_ELEVE}: ${mobility1.message}`
      });
    }

    if (!mobility2.allowed) {
      valid = false;
      checks.push({
        type: 'MOBILITY',
        valid: false,
        message: `${eleve2.ID_ELEVE}: ${mobility2.message}`
      });
    }

    // 2. Vérifier contraintes spécifiques selon type de mobilité
    if (mobility1.allowed && mobility2.allowed) {
      // PERMUT: LV2 et OPT doivent correspondre
      if (mobility1.condition === 'LV2_OPT_MATCH' || mobility2.condition === 'LV2_OPT_MATCH') {
        if (eleve1.LV2 !== eleve2.LV2 || eleve1.OPT !== eleve2.OPT) {
          valid = false;
          checks.push({
            type: 'PERMUT',
            valid: false,
            message: `PERMUT: LV2 (${eleve1.LV2}≠${eleve2.LV2}) ou OPT (${eleve1.OPT}≠${eleve2.OPT})`
          });
        }
      }

      // CONDI: codes DISSO doivent correspondre
      if (mobility1.condition?.startsWith('DISSO_') || mobility2.condition?.startsWith('DISSO_')) {
        if (eleve1.DISSO !== eleve2.DISSO) {
          valid = false;
          checks.push({
            type: 'CONDI',
            valid: false,
            message: `CONDI: Codes DISSO différents (${eleve1.DISSO}≠${eleve2.DISSO})`
          });
        }
      }
    }

    // 3. Vérifier options
    const option1Check = checkOption(eleve1, class2, dataContext);
    const option2Check = checkOption(eleve2, class1, dataContext);

    if (!option1Check.valid) {
      valid = false;
      checks.push({
        type: 'OPTION',
        valid: false,
        message: `${eleve1.ID_ELEVE} → ${class2}: ${option1Check.message}`
      });
    }

    if (!option2Check.valid) {
      valid = false;
      checks.push({
        type: 'OPTION',
        valid: false,
        message: `${eleve2.ID_ELEVE} → ${class1}: ${option2Check.message}`
      });
    }

    // 4. Vérifier dissociations
    const dissoc1Check = checkDissociation(eleve1, class2, dataContext);
    const dissoc2Check = checkDissociation(eleve2, class1, dataContext);

    if (!dissoc1Check.valid) {
      valid = false;
      checks.push({
        type: 'DISSOCIATION',
        valid: false,
        message: `${eleve1.ID_ELEVE} → ${class2}: ${dissoc1Check.message}`
      });
    }

    if (!dissoc2Check.valid) {
      valid = false;
      checks.push({
        type: 'DISSOCIATION',
        valid: false,
        message: `${eleve2.ID_ELEVE} → ${class1}: ${dissoc2Check.message}`
      });
    }

    // Résultat
    return {
      valid,
      checks,
      mobility1,
      mobility2,
      canSwap: valid,
      priority: valid ? (mobility1.priority + mobility2.priority) / 2 : 0
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // GESTION DES GROUPES SPEC
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Trouve tous les élèves d'un groupe SPEC
   */
  function findSpecGroup(eleve, dataContext) {
    if (eleve.MOBILITE !== 'SPEC') {
      return [eleve];
    }

    const codeAssoc = eleve.ASSO || eleve.DISSO;
    if (!codeAssoc) {
      return [eleve];
    }

    // Chercher tous les élèves avec le même code
    const allStudents = Object.values(dataContext.classesState).flat();
    const group = allStudents.filter(e =>
      e.MOBILITE === 'SPEC' &&
      (e.ASSO === codeAssoc || e.DISSO === codeAssoc)
    );

    return group;
  }

  /**
   * Valide un échange de groupe SPEC
   */
  function validateGroupSwap(group1, group2, class1, class2, dataContext) {
    // Les groupes doivent avoir la même taille
    if (group1.length !== group2.length) {
      return {
        valid: false,
        message: `Groupes de tailles différentes (${group1.length} vs ${group2.length})`
      };
    }

    // Valider chaque paire d'élèves
    const pairValidations = [];
    let allValid = true;

    for (let i = 0; i < group1.length; i++) {
      const validation = validateSwap(group1[i], group2[i], class1, class2, dataContext);
      pairValidations.push(validation);

      if (!validation.valid) {
        allValid = false;
      }
    }

    return {
      valid: allValid,
      groupSize: group1.length,
      pairValidations,
      message: allValid
        ? `Échange de groupe valide (${group1.length} élèves)`
        : `Échange de groupe invalide`
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════════════════

  const API = {
    MOBILITY_TYPES,

    // Mobilité
    checkMobility,
    isMobile,

    // Options et dissociations
    checkOption,
    checkDissociation,

    // Validation d'échange
    validateSwap,

    // Groupes SPEC
    findSpecGroup,
    validateGroupSwap
  };

  global.ClaudeMotorValidators = API;
  return API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
