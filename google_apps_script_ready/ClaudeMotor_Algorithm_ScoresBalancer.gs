/**
 * ═══════════════════════════════════════════════════════════════════════
 *                  CLAUDEMOTOR - SCORES BALANCER ALGORITHM
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Algorithme d'équilibrage des effectifs par score (1-2-3-4)
 * pour les critères COM, TRA, PART, ABS
 *
 * Version: 2.0.0
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

const ScoresBalancer = (function(global) {

  const Validators = global.ClaudeMotorValidators;
  const Calculators = global.ClaudeMotorCalculators;

  const CRITERES = ['COM', 'TRA', 'PART', 'ABS'];
  const SCORES = [1, 2, 3, 4];

  // ═══════════════════════════════════════════════════════════════════════
  // RECHERCHE DE CANDIDATS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Trouve les candidats d'échange selon le type de mobilité
   */
  function findSwapCandidates(dataContext, sourceClass, targetClass, critere, sourceScore, targetScore, mobilityType) {
    const sourceStudents = dataContext.classesState[sourceClass].filter(e =>
      e.MOBILITE === mobilityType && parseInt(e[critere]) === sourceScore
    );

    const targetStudents = dataContext.classesState[targetClass].filter(e =>
      e.MOBILITE === mobilityType && parseInt(e[critere]) === targetScore
    );

    const candidates = [];

    sourceStudents.forEach(studentSource => {
      targetStudents.forEach(studentTarget => {
        const validation = Validators.validateSwap(
          studentSource,
          studentTarget,
          sourceClass,
          targetClass,
          dataContext
        );

        if (validation.valid) {
          const impact = Calculators.calculateSwapImpact(
            studentSource,
            studentTarget,
            critere,
            sourceScore,
            targetScore
          );

          candidates.push({
            studentSource,
            studentTarget,
            sourceClass,
            targetClass,
            critere,
            sourceScore,
            targetScore,
            impact,
            priority: validation.priority,
            mobilityType
          });
        }
      });
    });

    return candidates.sort((a, b) => b.impact - a.impact);
  }

  /**
   * Stratégie intelligente pour choisir le type d'échange optimal
   */
  function findBestSwapStrategy(dataContext, sourceClass, targetClass, critere, sourceScore, targetScore) {
    // Ordre de priorité: LIBRE > PERMUT > CONDI > SPEC
    const strategies = ['LIBRE', 'PERMUT', 'CONDI', 'SPEC'];

    for (const mobility of strategies) {
      const candidates = findSwapCandidates(
        dataContext,
        sourceClass,
        targetClass,
        critere,
        sourceScore,
        targetScore,
        mobility
      );

      if (candidates.length > 0) {
        return {
          strategy: mobility,
          candidates,
          best: candidates[0]
        };
      }
    }

    return {
      strategy: null,
      candidates: [],
      best: null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // APPLICATION DES ÉCHANGES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Applique un échange dans le contexte
   */
  function applySwap(swap, dataContext) {
    const { studentSource, studentTarget, sourceClass, targetClass } = swap;

    try {
      // Trouver les index
      const sourceIndex = dataContext.classesState[sourceClass].findIndex(
        e => e.ID_ELEVE === studentSource.ID_ELEVE
      );
      const targetIndex = dataContext.classesState[targetClass].findIndex(
        e => e.ID_ELEVE === studentTarget.ID_ELEVE
      );

      if (sourceIndex === -1 || targetIndex === -1) {
        return false;
      }

      // Échanger
      const temp = dataContext.classesState[sourceClass][sourceIndex];
      dataContext.classesState[sourceClass][sourceIndex] = dataContext.classesState[targetClass][targetIndex];
      dataContext.classesState[targetClass][targetIndex] = temp;

      return true;

    } catch (error) {
      return false;
    }
  }

  /**
   * Met à jour les statistiques après un échange
   */
  function updateStatsAfterSwap(swap, current, gaps, targets) {
    const { sourceClass, targetClass, critere, sourceScore, targetScore } = swap;

    // Mettre à jour les effectifs actuels
    current[sourceClass][critere][sourceScore]--;
    current[sourceClass][critere][targetScore]++;
    current[targetClass][critere][targetScore]--;
    current[targetClass][critere][sourceScore]++;

    // Recalculer les écarts
    [sourceClass, targetClass].forEach(classe => {
      [sourceScore, targetScore].forEach(score => {
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
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ALGORITHME PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Équilibre les scores selon les cibles calculées
   */
  function balance(dataContext, options = {}) {
    const maxIterations = options.maxIterations || 50;
    const maxSwapsPerIteration = options.maxSwapsPerIteration || 10;
    const minImprovement = options.minImprovement || 0.01;

    const Logger = global.Logger || console;

    Logger.log('📈 Démarrage équilibrage des scores...');

    // Initialisation
    const { targets } = Calculators.calculateTargetDistribution(dataContext);
    let current = Calculators.calculateCurrentDistribution(dataContext);
    let gaps = Calculators.calculateGaps(current, targets);

    let currentScore = Calculators.calculateBalanceScore(gaps);
    const initialScore = currentScore;

    Logger.log(`Score initial: ${initialScore.toFixed(2)}/100`);

    const allSwaps = [];
    let iteration = 0;
    let hasImprovement = true;

    // Boucle d'optimisation
    while (hasImprovement && iteration < maxIterations) {
      iteration++;
      hasImprovement = false;
      let swapsThisIteration = 0;

      Logger.log(`\n--- Itération ${iteration} ---`);

      // Parcourir les critères par priorité (poids décroissants)
      const prioritizedCriteria = CRITERES.slice().sort((a, b) => {
        const weights = { COM: 0.35, TRA: 0.30, PART: 0.25, ABS: 0.10 };
        return weights[b] - weights[a];
      });

      for (const critere of prioritizedCriteria) {
        if (swapsThisIteration >= maxSwapsPerIteration) break;

        // Parcourir les scores (priorité aux extrêmes: 4, 1, 3, 2)
        const prioritizedScores = [4, 1, 3, 2];

        for (const score of prioritizedScores) {
          if (swapsThisIteration >= maxSwapsPerIteration) break;

          // Identifier surplus et déficits
          const { surplus, deficit } = Calculators.identifySurplusDeficit(gaps, critere, score);

          if (surplus.length === 0 || deficit.length === 0) continue;

          // Chercher des échanges possibles
          for (const surplusClass of surplus) {
            if (swapsThisIteration >= maxSwapsPerIteration) break;

            for (const deficitClass of deficit) {
              if (swapsThisIteration >= maxSwapsPerIteration) break;

              // Score opposé pour l'échange (équilibrage)
              const oppositeScore = score === 4 ? 1 : (score === 1 ? 4 : (score === 3 ? 2 : 3));

              // Chercher la meilleure stratégie d'échange
              const strategy = findBestSwapStrategy(
                dataContext,
                surplusClass.classe,
                deficitClass.classe,
                critere,
                score,
                oppositeScore
              );

              if (strategy.best) {
                // Appliquer l'échange
                if (applySwap(strategy.best, dataContext)) {
                  allSwaps.push(strategy.best);
                  updateStatsAfterSwap(strategy.best, current, gaps, targets);
                  swapsThisIteration++;
                  hasImprovement = true;

                  Logger.log(
                    `✅ ${critere} (${strategy.strategy}): ` +
                    `${strategy.best.studentSource.ID_ELEVE}(${score}) ↔ ` +
                    `${strategy.best.studentTarget.ID_ELEVE}(${oppositeScore})`
                  );

                  break;
                }
              }
            }
          }
        }
      }

      // Vérifier l'amélioration du score
      const newScore = Calculators.calculateBalanceScore(gaps);
      const improvement = newScore - currentScore;

      Logger.log(`Score: ${currentScore.toFixed(2)} → ${newScore.toFixed(2)} (+${improvement.toFixed(2)})`);

      if (improvement > minImprovement) {
        currentScore = newScore;
      } else {
        hasImprovement = false;
        Logger.log('Amélioration insuffisante, arrêt.');
      }
    }

    const finalScore = Calculators.calculateBalanceScore(gaps);

    Logger.log('\n📊 Équilibrage des scores terminé:');
    Logger.log(`  • Itérations: ${iteration}`);
    Logger.log(`  • Échanges: ${allSwaps.length}`);
    Logger.log(`  • Score: ${initialScore.toFixed(2)} → ${finalScore.toFixed(2)}`);

    return {
      success: true,
      swaps: allSwaps,
      iterations: iteration,
      scoreInitial: initialScore,
      scoreFinal: finalScore,
      improvement: finalScore - initialScore
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════════════════

  const API = {
    balance,
    findSwapCandidates,
    findBestSwapStrategy,
    applySwap
  };

  global.ScoresBalancer = API;
  return API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
