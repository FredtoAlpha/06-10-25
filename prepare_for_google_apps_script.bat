@echo off
chcp 65001 >nul
color 0A
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     PRÉPARATION COMPLÈTE POUR GOOGLE APPS SCRIPT               ║
echo ║     Répartition Classes - Version Production 1.0               ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Ce script va :
echo   1. Nettoyer le projet (supprimer Nirvana + backups)
echo   2. Préparer les fichiers ClaudeMotor (renommage)
echo   3. Afficher un rapport final
echo.
echo Total espace libéré : ~705 KB
echo Nouveaux fichiers créés : 6 (ClaudeMotor)
echo.
echo ────────────────────────────────────────────────────────────────
echo.
pause

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 1/2 : NETTOYAGE DU PROJET                              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
call clean_project.bat
if errorlevel 1 goto :Error

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 2/2 : PRÉPARATION CLAUDEMOTOR                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
call prepare_claudemotor_for_google_apps_script.bat
if errorlevel 1 goto :Error

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     ✓ PRÉPARATION TERMINÉE                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  RAPPORT FINAL                                                 │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo ✓ Fichiers Nirvana supprimés        : 5 fichiers (-286 KB)
echo ✓ Backup dupliqué supprimé          : 1 fichier  (-419 KB)
echo ✓ Fichiers ClaudeMotor créés        : 6 fichiers
echo ✓ Projet nettoyé et optimisé        : -705 KB
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  FICHIERS PRÊTS POUR GOOGLE APPS SCRIPT                        │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo Dossier : google_apps_script_ready\
echo.
echo   ClaudeMotor_Utils_Calculators.gs
echo   ClaudeMotor_Utils_Validators.gs
echo   ClaudeMotor_Core.gs
echo   ClaudeMotor_Algorithm_ParityCorrector.gs
echo   ClaudeMotor_Algorithm_ScoresBalancer.gs
echo   ClaudeMotor_UI_Orchestrator.gs
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  PROCHAINES ÉTAPES                                             │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo 1. Consulter AUDIT_FINAL.md pour les détails complets
echo 2. Lire GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md
echo 3. Uploader les fichiers dans Google Apps Script :
echo    a) Supprimer les 5 fichiers Nirvana dans Google Apps Script
echo    b) Ajouter les 6 fichiers ClaudeMotor depuis google_apps_script_ready\
echo    c) Vérifier InterfaceV2.html (357 KB)
echo    d) Tester Menu.js
echo.
echo 4. Déployer en production !
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  DOCUMENTATION DISPONIBLE                                      │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   docs\AUDIT_FINAL.md                        (Audit complet)
echo   docs\GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md (Guide upload)
echo   docs\LISTE_FICHIERS_GOOGLE_APPS_SCRIPT.txt (Liste complète)
echo   docs\RAPPORT_NETTOYAGE_INTERFACEV2.md      (Rapport nettoyage)
echo   docs\ARCHITECTURE_MODULAIRE.md             (Architecture)
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Appuyez sur une touche pour ouvrir l'audit final...
pause >nul

REM Ouvrir l'audit final dans l'éditeur par défaut
start "" "AUDIT_FINAL.md"

goto :End

:Error
echo.
echo ════════════════════════════════════════════════════════════════
echo   ERREUR : La préparation a échoué
echo ════════════════════════════════════════════════════════════════
echo.
echo Consultez les messages d'erreur ci-dessus.
echo.
pause
exit /b 1

:End
echo.
echo Terminé avec succès !
echo.
