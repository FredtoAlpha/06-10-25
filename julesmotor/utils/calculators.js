/**
 * ═══════════════════════════════════════════════════════════════════════
 *                    JULESMOTOR - CALCULATORS MODULE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Gestion centralisée de tous les calculs (effectifs, écarts, scores)
 *
 * Version: 2.0.0
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

const JulesMotorCalculators = (function(global) {

  const CRITERES = ['COM', 'TRA', 'PART', 'ABS'];
  const SCORES = [1, 2, 3, 4];

  const POIDS_CRITERES = {
    COM: 0.35,
    TRA: 0.30,
    PART: 0.25,
    ABS: 0.10
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CALCUL DES EFFECTIFS CIBLES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Calcule les effectifs cibles basés sur la distribution globale
   */
  function calculateTargetDistribution(dataContext) {
    const classes = Object.keys(dataContext.classesState);
    const targets = {};

    // 1. Calculer la distribution globale réelle
    const globalDistribution = {};
    CRITERES.forEach(critere => {
      globalDistribution[critere] = { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 };
    });

    // Compter tous les élèves
    Object.values(dataContext.classesState).flat().forEach(eleve => {
      CRITERES.forEach(critere => {
        const score = parseInt(eleve[critere]) || 0;
        if (score >= 1 && score <= 4) {
          globalDistribution[critere][score]++;
          globalDistribution[critere].total++;
        }
      });
    });

    // 2. Calculer les cibles proportionnelles pour chaque classe
    classes.forEach(classe => {
      const eleves = dataContext.classesState[classe];
      const totalEleves = eleves.length;

      targets[classe] = {
        totalEleves,
        targets: {}
      };

      CRITERES.forEach(critere => {
        targets[classe].targets[critere] = {};

        SCORES.forEach(score => {
          const globalProportion = globalDistribution[critere][score] / globalDistribution[critere].total;
          const targetCount = Math.round(totalEleves * globalProportion);
          targets[classe].targets[critere][score] = targetCount;
        });

        // Ajuster pour que la somme soit exacte
        const sum = Object.values(targets[classe].targets[critere]).reduce((a, b) => a + b, 0);
        const diff = totalEleves - sum;

        if (diff !== 0) {
          // Ajuster sur le score le plus fréquent
          const mostFrequentScore = Object.entries(globalDistribution[critere])
            .filter(([score]) => score !== 'total')
            .sort((a, b) => b[1] - a[1])[0][0];

          targets[classe].targets[critere][mostFrequentScore] += diff;
        }
      });
    });

    return {
      targets,
      globalDistribution
    };
  }

  /**
   * Calcule les effectifs actuels par score pour chaque classe
   */
  function calculateCurrentDistribution(dataContext) {
    const classes = Object.keys(dataContext.classesState);
    const current = {};

    classes.forEach(classe => {
      const eleves = dataContext.classesState[classe];

      current[classe] = {};
      CRITERES.forEach(critere => {
        current[classe][critere] = { 1: 0, 2: 0, 3: 0, 4: 0 };
      });

      eleves.forEach(eleve => {
        CRITERES.forEach(critere => {
          const score = parseInt(eleve[critere]) || 0;
          if (score >= 1 && score <= 4) {
            current[classe][critere][score]++;
          }
        });
      });
    });

    return current;
  }

  /**
   * Calcule les écarts entre distribution actuelle et cible
   */
  function calculateGaps(current, targets) {
    const classes = Object.keys(current);
    const gaps = {};

    classes.forEach(classe => {
      gaps[classe] = {};

      CRITERES.forEach(critere => {
        gaps[classe][critere] = {};

        SCORES.forEach(score => {
          const currentCount = current[classe][critere][score];
          const targetCount = targets[classe].targets[critere][score];
          const gap = currentCount - targetCount;

          gaps[classe][critere][score] = {
            current: currentCount,
            target: targetCount,
            gap: gap,
            surplus: gap > 0 ? gap : 0,
            deficit: gap < 0 ? Math.abs(gap) : 0
          };
        });
      });
    });

    return gaps;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALCUL DES SCORES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Calcule le score d'équilibre global
   */
  function calculateBalanceScore(gaps) {
    const classes = Object.keys(gaps);
    let totalScore = 0;
    let evaluations = 0;

    classes.forEach(classe => {
      CRITERES.forEach(critere => {
        const poidsCritere = POIDS_CRITERES[critere];

        SCORES.forEach(score => {
          const gap = gaps[classe][critere][score];

          // Score basé sur l'écart relatif
          const relativeGap = Math.abs(gap.gap) / Math.max(gap.target, 1);
          const scoreComponent = Math.max(0, 100 - (relativeGap * 100));

          totalScore += scoreComponent * poidsCritere;
          evaluations++;
        });
      });
    });

    return evaluations > 0 ? totalScore / evaluations : 0;
  }

  /**
   * Calcule l'impact d'un échange sur le score
   */
  function calculateSwapImpact(eleve1, eleve2, critere, score1, score2) {
    // Impact basé sur la différence de scores
    const scoreDiff = Math.abs(score1 - score2);

    // Impact basé sur le poids du critère
    const criteriaWeight = POIDS_CRITERES[critere];

    // Facteur de mobilité (priorité aux échanges LIBRE)
    const mobility1 = String(eleve1.MOBILITE || '').toUpperCase();
    const mobility2 = String(eleve2.MOBILITE || '').toUpperCase();
    const mobilityFactor = (mobility1 === 'LIBRE' && mobility2 === 'LIBRE') ? 1.0 : 0.7;

    return scoreDiff * criteriaWeight * mobilityFactor;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALCUL DE PARITÉ
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Calcule la distribution F/M pour chaque classe
   */
  function calculateGenderDistribution(dataContext) {
    const classes = Object.keys(dataContext.classesState);
    const distribution = {};

    classes.forEach(classe => {
      const eleves = dataContext.classesState[classe];
      const nbF = eleves.filter(e => e.SEXE === 'F').length;
      const nbM = eleves.filter(e => e.SEXE === 'M').length;
      const total = eleves.length;

      distribution[classe] = {
        F: nbF,
        M: nbM,
        total: total,
        delta: nbM - nbF,
        absDelta: Math.abs(nbM - nbF),
        ratioF: total > 0 ? nbF / total : 0,
        ratioM: total > 0 ? nbM / total : 0,
        balanced: Math.abs(nbM - nbF) <= 1 // Tolérance ±1
      };
    });

    return distribution;
  }

  /**
   * Calcule le score de parité global
   */
  function calculateParityScore(genderDistribution) {
    const classes = Object.keys(genderDistribution);
    let totalScore = 0;

    classes.forEach(classe => {
      const dist = genderDistribution[classe];

      if (dist.total > 0) {
        const imbalanceRatio = dist.absDelta / dist.total;
        const classScore = Math.max(0, 100 - (imbalanceRatio * 100));
        totalScore += classScore;
      }
    });

    return classes.length > 0 ? totalScore / classes.length : 0;
  }

  /**
   * Identifie les classes avec déséquilibre de parité
   */
  function findParityImbalances(genderDistribution, tolerance = 1) {
    const imbalances = {
      surplus: [],  // Surplus de M (ou déficit de F)
      deficit: []   // Surplus de F (ou déficit de M)
    };

    Object.entries(genderDistribution).forEach(([classe, dist]) => {
      if (Math.abs(dist.delta) > tolerance) {
        if (dist.delta > 0) {
          // Plus de M que de F
          imbalances.surplus.push({
            classe,
            surplusM: dist.delta,
            deficitF: dist.delta,
            F: dist.F,
            M: dist.M
          });
        } else {
          // Plus de F que de M
          imbalances.deficit.push({
            classe,
            surplusF: Math.abs(dist.delta),
            deficitM: Math.abs(dist.delta),
            F: dist.F,
            M: dist.M
          });
        }
      }
    });

    // Trier par ampleur du déséquilibre
    imbalances.surplus.sort((a, b) => b.surplusM - a.surplusM);
    imbalances.deficit.sort((a, b) => b.surplusF - a.surplusF);

    return imbalances;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ANALYSE DES SURPLUS/DÉFICITS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Identifie les surplus et déficits pour un critère/score donné
   */
  function identifySurplusDeficit(gaps, critere, score) {
    const classes = Object.keys(gaps);
    const surplus = [];
    const deficit = [];

    classes.forEach(classe => {
      const gap = gaps[classe][critere][score];

      if (gap.surplus > 0) {
        surplus.push({
          classe,
          surplus: gap.surplus,
          current: gap.current,
          target: gap.target
        });
      }

      if (gap.deficit > 0) {
        deficit.push({
          classe,
          deficit: gap.deficit,
          current: gap.current,
          target: gap.target
        });
      }
    });

    // Trier par priorité (plus gros surplus/déficit en premier)
    surplus.sort((a, b) => b.surplus - a.surplus);
    deficit.sort((a, b) => b.deficit - a.deficit);

    return { surplus, deficit };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATISTIQUES GLOBALES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Calcule les statistiques globales du système
   */
  function calculateGlobalStats(dataContext) {
    const current = calculateCurrentDistribution(dataContext);
    const { targets, globalDistribution } = calculateTargetDistribution(dataContext);
    const gaps = calculateGaps(current, targets);
    const genderDist = calculateGenderDistribution(dataContext);

    const balanceScore = calculateBalanceScore(gaps);
    const parityScore = calculateParityScore(genderDist);

    // Score global pondéré
    const globalScore = (balanceScore * 0.7) + (parityScore * 0.3);

    return {
      balanceScore,
      parityScore,
      globalScore,
      current,
      targets,
      gaps,
      genderDistribution: genderDist,
      globalDistribution
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════════════════

  const API = {
    // Distribution et effectifs
    calculateTargetDistribution,
    calculateCurrentDistribution,
    calculateGaps,

    // Scores
    calculateBalanceScore,
    calculateSwapImpact,

    // Parité
    calculateGenderDistribution,
    calculateParityScore,
    findParityImbalances,

    // Analyse
    identifySurplusDeficit,

    // Statistiques globales
    calculateGlobalStats
  };

  global.JulesMotorCalculators = API;
  return API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
