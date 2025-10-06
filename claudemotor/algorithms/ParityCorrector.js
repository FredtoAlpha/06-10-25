/**
 * ═══════════════════════════════════════════════════════════════════════
 *                  CLAUDEMOTOR - PARITY CORRECTOR ALGORITHM
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Algorithme de correction de la parité Filles/Garçons
 *
 * Version: 2.0.0
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

const ParityCorrector = (function(global) {

  const Validators = global.ClaudeMotorValidators;
  const Calculators = global.ClaudeMotorCalculators;

  // ═══════════════════════════════════════════════════════════════════════
  // RECHERCHE DE CANDIDATS POUR CORRECTION DE PARITÉ
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Trouve les candidats d'échange pour corriger la parité
   */
  function findParityCandidates(dataContext, surplusClass, deficitClass, surplusGender, deficitGender) {
    const surplusStudents = dataContext.classesState[surplusClass].filter(e =>
      e.SEXE === surplusGender && Validators.isMobile(e, dataContext)
    );

    const deficitStudents = dataContext.classesState[deficitClass].filter(e =>
      e.SEXE === deficitGender && Validators.isMobile(e, dataContext)
    );

    const candidates = [];

    surplusStudents.forEach(studentSurplus => {
      deficitStudents.forEach(studentDeficit => {
        const validation = Validators.validateSwap(
          studentSurplus,
          studentDeficit,
          surplusClass,
          deficitClass,
          dataContext
        );

        if (validation.valid) {
          // Calculer l'impact sur la parité
          const impact = calculateParityImpact(studentSurplus, studentDeficit);

          candidates.push({
            studentSurplus,
            studentDeficit,
            surplusClass,
            deficitClass,
            surplusGender,
            deficitGender,
            impact,
            priority: validation.priority
          });
        }
      });
    });

    return candidates.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calcule l'impact d'un échange sur la parité
   */
  function calculateParityImpact(student1, student2) {
    // Impact de base: 1 si échange entre F et M
    let impact = 1.0;

    // Bonus si mobilité LIBRE
    if (student1.MOBILITE === 'LIBRE' && student2.MOBILITE === 'LIBRE') {
      impact *= 1.5;
    }

    return impact;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STRATÉGIE DE CORRECTION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Détermine la meilleure stratégie de correction pour deux classes
   */
  function findBestParityStrategy(dataContext, class1Data, class2Data) {
    const { classe: class1, delta: delta1 } = class1Data;
    const { classe: class2, delta: delta2 } = class2Data;

    // Cas 1: class1 a surplus de M, class2 a surplus de F
    if (delta1 > 0 && delta2 < 0) {
      const candidates = findParityCandidates(dataContext, class1, class2, 'M', 'F');
      if (candidates.length > 0) {
        return {
          type: 'M_F_SWAP',
          class1,
          class2,
          candidates,
          best: candidates[0]
        };
      }
    }

    // Cas 2: class1 a surplus de F, class2 a surplus de M
    if (delta1 < 0 && delta2 > 0) {
      const candidates = findParityCandidates(dataContext, class1, class2, 'F', 'M');
      if (candidates.length > 0) {
        return {
          type: 'F_M_SWAP',
          class1,
          class2,
          candidates,
          best: candidates[0]
        };
      }
    }

    return {
      type: null,
      candidates: [],
      best: null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // APPLICATION DES CORRECTIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Applique une correction de parité
   */
  function applyParityCorrection(correction, dataContext) {
    const { studentSurplus, studentDeficit, surplusClass, deficitClass } = correction;

    try {
      // Trouver les index
      const surplusIndex = dataContext.classesState[surplusClass].findIndex(
        e => e.ID_ELEVE === studentSurplus.ID_ELEVE
      );
      const deficitIndex = dataContext.classesState[deficitClass].findIndex(
        e => e.ID_ELEVE === studentDeficit.ID_ELEVE
      );

      if (surplusIndex === -1 || deficitIndex === -1) {
        return false;
      }

      // Échanger
      const temp = dataContext.classesState[surplusClass][surplusIndex];
      dataContext.classesState[surplusClass][surplusIndex] = dataContext.classesState[deficitClass][deficitIndex];
      dataContext.classesState[deficitClass][deficitIndex] = temp;

      return true;

    } catch (error) {
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ALGORITHME PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Corrige la parité F/M dans toutes les classes
   */
  function correct(dataContext, options = {}) {
    const tolerance = options.tolerance || 1;
    const maxIterations = options.maxIterations || 20;
    const maxCorrections = options.maxCorrections || 50;

    const Logger = global.Logger || console;

    Logger.log('⚖️  Démarrage correction de parité...');

    // Calcul initial
    let genderDist = Calculators.calculateGenderDistribution(dataContext);
    let parityScore = Calculators.calculateParityScore(genderDist);
    const initialScore = parityScore;

    Logger.log(`Score parité initial: ${initialScore.toFixed(2)}/100`);

    const allCorrections = [];
    let iteration = 0;
    let hasImprovement = true;

    // Boucle de correction
    while (hasImprovement && iteration < maxIterations && allCorrections.length < maxCorrections) {
      iteration++;
      hasImprovement = false;

      Logger.log(`\n--- Itération ${iteration} ---`);

      // Identifier les déséquilibres
      const imbalances = Calculators.findParityImbalances(genderDist, tolerance);

      if (imbalances.surplus.length === 0 || imbalances.deficit.length === 0) {
        Logger.log('Aucun déséquilibre détecté.');
        break;
      }

      Logger.log(`Déséquilibres: ${imbalances.surplus.length} surplus, ${imbalances.deficit.length} déficits`);

      // Chercher des corrections possibles
      for (const surplus of imbalances.surplus) {
        if (allCorrections.length >= maxCorrections) break;

        for (const deficit of imbalances.deficit) {
          if (allCorrections.length >= maxCorrections) break;

          // Surplus de M dans surplus.classe, déficit de M dans deficit.classe
          // → Échanger M(surplus) avec F(deficit)
          const candidates = findParityCandidates(
            dataContext,
            surplus.classe,
            deficit.classe,
            'M',
            'F'
          );

          if (candidates.length > 0) {
            const best = candidates[0];

            if (applyParityCorrection(best, dataContext)) {
              allCorrections.push(best);
              hasImprovement = true;

              Logger.log(
                `✅ Parité: ${best.studentSurplus.ID_ELEVE}(M) ↔ ${best.studentDeficit.ID_ELEVE}(F) ` +
                `[${surplus.classe} ↔ ${deficit.classe}]`
              );

              // Recalculer la distribution
              genderDist = Calculators.calculateGenderDistribution(dataContext);
              break;
            }
          }
        }

        if (hasImprovement) break;
      }

      // Vérifier l'amélioration
      const newScore = Calculators.calculateParityScore(genderDist);
      const improvement = newScore - parityScore;

      Logger.log(`Score parité: ${parityScore.toFixed(2)} → ${newScore.toFixed(2)} (+${improvement.toFixed(2)})`);

      parityScore = newScore;
    }

    const finalScore = Calculators.calculateParityScore(genderDist);
    const finalDist = Calculators.calculateGenderDistribution(dataContext);

    // Rapport final
    Logger.log('\n⚖️  Correction de parité terminée:');
    Logger.log(`  • Itérations: ${iteration}`);
    Logger.log(`  • Corrections: ${allCorrections.length}`);
    Logger.log(`  • Score: ${initialScore.toFixed(2)} → ${finalScore.toFixed(2)}`);

    // Détails par classe
    Object.entries(finalDist).forEach(([classe, dist]) => {
      const status = dist.balanced ? '✅' : '⚠️';
      Logger.log(`  ${status} ${classe}: ${dist.F}F / ${dist.M}M (Δ${dist.delta})`);
    });

    return {
      success: true,
      corrections: allCorrections,
      iterations: iteration,
      scoreInitial: initialScore,
      scoreFinal: finalScore,
      improvement: finalScore - initialScore,
      finalDistribution: finalDist
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // DIAGNOSTIC
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Génère un rapport de diagnostic de parité
   */
  function diagnose(dataContext) {
    const genderDist = Calculators.calculateGenderDistribution(dataContext);
    const parityScore = Calculators.calculateParityScore(genderDist);
    const imbalances = Calculators.findParityImbalances(genderDist, 1);

    let report = '═══════════════════════════════════════════════════════════════════════\n';
    report += '                    DIAGNOSTIC DE PARITÉ F/M\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';

    report += `📊 Score global de parité: ${parityScore.toFixed(2)}/100\n\n`;

    report += '📋 Distribution par classe:\n';
    Object.entries(genderDist).forEach(([classe, dist]) => {
      const status = dist.balanced ? '✅' : '⚠️';
      const percentage = (dist.ratioF * 100).toFixed(1);
      report += `  ${status} ${classe}: ${dist.F}F / ${dist.M}M (${percentage}% F, Δ${dist.delta})\n`;
    });

    if (imbalances.surplus.length > 0 || imbalances.deficit.length > 0) {
      report += '\n🚨 Déséquilibres détectés:\n';

      imbalances.surplus.forEach(s => {
        report += `  • ${s.classe}: Surplus de ${s.surplusM} garçons\n`;
      });

      imbalances.deficit.forEach(d => {
        report += `  • ${d.classe}: Surplus de ${d.surplusF} filles\n`;
      });
    } else {
      report += '\n✅ Toutes les classes sont équilibrées !\n';
    }

    return report;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════════════════

  const API = {
    correct,
    diagnose,
    findParityCandidates,
    findBestParityStrategy
  };

  global.ParityCorrector = API;
  return API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
