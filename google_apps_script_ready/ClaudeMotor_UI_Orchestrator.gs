/**
 * ═══════════════════════════════════════════════════════════════════════
 *                    CLAUDEMOTOR - UI ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Point d'entrée unique pour l'interface utilisateur
 *
 * Version: 2.0.0
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

const ClaudeMotorUI = (function(global) {

  const Engine = global.ClaudeMotor;
  const Calculators = global.ClaudeMotorCalculators;
  const ScoresBalancer = global.ScoresBalancer;
  const ParityCorrector = global.ParityCorrector;

  // ═══════════════════════════════════════════════════════════════════════
  // INTERFACE GOOGLE SHEETS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Lance l'optimisation complète via l'interface UI
   */
  function runOptimization(criteresUI) {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    try {
      Logger.log('\n' + '═'.repeat(80));
      Logger.log('🚀 CLAUDEMOTOR - Lancement de l\'optimisation');
      Logger.log('═'.repeat(80));

      // Toast de démarrage
      ss.toast('Démarrage de l\'optimisation ClaudeMotor...', 'En cours', 5);

      // Préparation des données
      const config = typeof getConfig === 'function' ? getConfig(criteresUI) : {};
      const dataContext = typeof V2_Ameliore_PreparerDonnees === 'function'
        ? V2_Ameliore_PreparerDonnees(config, criteresUI)
        : null;

      if (!dataContext || !dataContext.classesState) {
        throw new Error('Impossible de préparer les données');
      }

      // Lancement de l'optimisation
      const engine = Engine.createEngine(config);
      const results = engine.run(dataContext, {
        enableMultiSwap: true
      });

      // Formatage du message de succès
      const message = formatSuccessMessage(results);

      // Affichage du résultat
      ui.alert('✅ Optimisation Terminée', message, ui.ButtonSet.OK);
      ss.toast(
        `Optimisation terminée: ${results.totalSwaps} échanges effectués`,
        'Succès',
        10
      );

      Logger.log('═'.repeat(80));
      Logger.log('✅ CLAUDEMOTOR - Optimisation terminée avec succès');
      Logger.log('═'.repeat(80) + '\n');

      return results;

    } catch (error) {
      Logger.log(`❌ Erreur: ${error.message}`);
      Logger.log(error.stack);

      ui.alert('❌ Erreur', `Une erreur est survenue:\n\n${error.message}`, ui.ButtonSet.OK);
      ss.toast('Erreur lors de l\'optimisation', 'Erreur', 5);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Formate le message de succès
   */
  function formatSuccessMessage(results) {
    const duration = (results.durationMs / 1000).toFixed(1);
    const improvement = results.improvement >= 0 ? `+${results.improvement.toFixed(2)}` : results.improvement.toFixed(2);

    let message = `🎯 CLAUDEMOTOR v${Engine.version}\n\n`;
    message += `📊 RÉSULTATS:\n`;
    message += `  • Score: ${results.scoreInitial.toFixed(2)} → ${results.scoreFinal.toFixed(2)} (${improvement})\n`;
    message += `  • Total échanges: ${results.totalSwaps}\n`;
    message += `  • Durée: ${duration}s\n\n`;

    if (results.phases.phase1.swaps) {
      message += `📈 Phase 1 (Scores): ${results.phases.phase1.swaps.length} échanges\n`;
    }
    if (results.phases.phase2.corrections) {
      message += `⚖️  Phase 2 (Parité): ${results.phases.phase2.corrections.length} corrections\n`;
    }
    if (results.phases.phase3 && results.phases.phase3.cycles) {
      message += `🔄 Phase 3 (MultiSwap): ${results.phases.phase3.cycles.length} cycles\n`;
    }

    message += `\n📋 Consultez les logs pour le détail complet.`;

    return message;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FONCTIONS SPÉCIALISÉES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Équilibrage des scores uniquement
   */
  function runScoresOnly(criteresUI) {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    try {
      Logger.log('📈 CLAUDEMOTOR - Équilibrage des scores uniquement');

      const config = typeof getConfig === 'function' ? getConfig(criteresUI) : {};
      const dataContext = typeof V2_Ameliore_PreparerDonnees === 'function'
        ? V2_Ameliore_PreparerDonnees(config, criteresUI)
        : null;

      if (!dataContext) {
        throw new Error('Impossible de préparer les données');
      }

      ss.toast('Équilibrage des scores en cours...', 'En cours', 5);

      const results = ScoresBalancer.balance(dataContext, {
        maxIterations: 50,
        maxSwapsPerIteration: 10
      });

      const message = `✅ Équilibrage des scores terminé!\n\n` +
                     `Score: ${results.scoreInitial.toFixed(2)} → ${results.scoreFinal.toFixed(2)}\n` +
                     `Échanges: ${results.swaps.length}\n` +
                     `Itérations: ${results.iterations}`;

      ui.alert('Équilibrage Scores', message, ui.ButtonSet.OK);
      ss.toast(`Équilibrage terminé: ${results.swaps.length} échanges`, 'Succès', 10);

      return results;

    } catch (error) {
      Logger.log(`❌ Erreur: ${error.message}`);
      ui.alert('Erreur', error.message, ui.ButtonSet.OK);
      return { success: false, error: error.message };
    }
  }

  /**
   * Correction de parité uniquement
   */
  function runParityOnly(criteresUI) {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    try {
      Logger.log('⚖️  CLAUDEMOTOR - Correction de parité uniquement');

      const config = typeof getConfig === 'function' ? getConfig(criteresUI) : {};
      const dataContext = typeof V2_Ameliore_PreparerDonnees === 'function'
        ? V2_Ameliore_PreparerDonnees(config, criteresUI)
        : null;

      if (!dataContext) {
        throw new Error('Impossible de préparer les données');
      }

      ss.toast('Correction de parité en cours...', 'En cours', 5);

      const results = ParityCorrector.correct(dataContext, {
        tolerance: 1,
        maxIterations: 20
      });

      const message = `✅ Correction de parité terminée!\n\n` +
                     `Score: ${results.scoreInitial.toFixed(2)} → ${results.scoreFinal.toFixed(2)}\n` +
                     `Corrections: ${results.corrections.length}\n` +
                     `Itérations: ${results.iterations}`;

      ui.alert('Correction Parité', message, ui.ButtonSet.OK);
      ss.toast(`Correction terminée: ${results.corrections.length} échanges`, 'Succès', 10);

      return results;

    } catch (error) {
      Logger.log(`❌ Erreur: ${error.message}`);
      ui.alert('Erreur', error.message, ui.ButtonSet.OK);
      return { success: false, error: error.message };
    }
  }

  /**
   * Diagnostic complet
   */
  function runDiagnostic(criteresUI) {
    const ui = SpreadsheetApp.getUi();

    try {
      Logger.log('📊 CLAUDEMOTOR - Diagnostic');

      const config = typeof getConfig === 'function' ? getConfig(criteresUI) : {};
      const dataContext = typeof V2_Ameliore_PreparerDonnees === 'function'
        ? V2_Ameliore_PreparerDonnees(config, criteresUI)
        : null;

      if (!dataContext) {
        throw new Error('Impossible de préparer les données');
      }

      // Calcul des statistiques
      const stats = Calculators.calculateGlobalStats(dataContext);
      const parityReport = ParityCorrector.diagnose(dataContext);

      // Rapport complet
      let report = '═══════════════════════════════════════════════════════════════════════\n';
      report += '                    CLAUDEMOTOR - DIAGNOSTIC COMPLET\n';
      report += '═══════════════════════════════════════════════════════════════════════\n\n';

      report += `📊 SCORES GLOBAUX:\n`;
      report += `  • Équilibrage scores: ${stats.balanceScore.toFixed(2)}/100\n`;
      report += `  • Parité F/M: ${stats.parityScore.toFixed(2)}/100\n`;
      report += `  • Score global: ${stats.globalScore.toFixed(2)}/100\n\n`;

      report += parityReport;

      Logger.log(report);

      // Affichage dans une boîte de dialogue HTML
      const html = HtmlService.createHtmlOutput(
        `<pre style="font-family: monospace; font-size: 11px; white-space: pre-wrap;">${report}</pre>`
      ).setWidth(800).setHeight(600);

      ui.showModalDialog(html, 'ClaudeMotor - Diagnostic');

      return { success: true, stats, report };

    } catch (error) {
      Logger.log(`❌ Erreur: ${error.message}`);
      ui.alert('Erreur', error.message, ui.ButtonSet.OK);
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MENU GOOGLE SHEETS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Crée le menu ClaudeMotor dans Google Sheets
   */
  function createMenu() {
    const ui = SpreadsheetApp.getUi();

    ui.createMenu('🚀 ClaudeMotor')
      .addItem('🎯 Optimisation Complète', 'claudeMotor_optimisationComplete')
      .addSeparator()
      .addItem('📈 Équilibrage Scores', 'claudeMotor_equilibrageScores')
      .addItem('⚖️  Correction Parité', 'claudeMotor_correctionParite')
      .addSeparator()
      .addItem('📊 Diagnostic', 'claudeMotor_diagnostic')
      .addItem('ℹ️  À propos', 'claudeMotor_apropos')
      .addToUi();

    Logger.log('✅ Menu ClaudeMotor créé');
  }

  /**
   * À propos de ClaudeMotor
   */
  function showAbout() {
    const ui = SpreadsheetApp.getUi();
    const info = Engine.info();

    const message = `🚀 CLAUDEMOTOR ENGINE\n\n` +
                   `Version: ${info.version}\n` +
                   `Algorithmes: ${info.algorithms.join(', ')}\n\n` +
                   `Moteur de répartition intelligent pour l'équilibrage des classes.\n\n` +
                   `Développé avec Claude Code`;

    ui.alert('À propos de ClaudeMotor', message, ui.ButtonSet.OK);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════════════════

  const API = {
    runOptimization,
    runScoresOnly,
    runParityOnly,
    runDiagnostic,
    createMenu,
    showAbout
  };

  global.ClaudeMotorUI = API;
  return API;

})(typeof globalThis !== 'undefined' ? globalThis : this);

// ═══════════════════════════════════════════════════════════════════════
// FONCTIONS GLOBALES POUR LE MENU GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════════════

function onOpen() {
  ClaudeMotorUI.createMenu();
}

function claudeMotor_optimisationComplete() {
  ClaudeMotorUI.runOptimization();
}

function claudeMotor_equilibrageScores() {
  ClaudeMotorUI.runScoresOnly();
}

function claudeMotor_correctionParite() {
  ClaudeMotorUI.runParityOnly();
}

function claudeMotor_diagnostic() {
  ClaudeMotorUI.runDiagnostic();
}

function claudeMotor_apropos() {
  ClaudeMotorUI.showAbout();
}
