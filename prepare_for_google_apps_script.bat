@echo off
chcp 65001 >nul
color 0A
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     PRÉPARATION COMPLÈTE POUR GOOGLE APPS SCRIPT               ║
echo ║     Répartition Classes - Version JulesMotor                   ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Ce script va :
echo   1. Nettoyer le projet (supprimer les anciens fichiers si présents)
echo   2. Préparer les fichiers JulesMotor (renommage)
echo   3. Afficher un rapport final
echo.
echo Nouveaux fichiers créés : 6 (JulesMotor)
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
echo ║  ÉTAPE 2/2 : PRÉPARATION JULESMOTOR                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
call prepare_julesmotor_for_google_apps_script.bat
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
echo ✓ Fichiers JulesMotor créés        : 6 fichiers
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  FICHIERS PRÊTS POUR GOOGLE APPS SCRIPT                        │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo Dossier : google_apps_script_ready\
echo.
echo   JulesMotor_Utils_Calculators.gs
echo   JulesMotor_Utils_Validators.gs
echo   JulesMotor_Core.gs
echo   JulesMotor_Algorithm_ParityCorrector.gs
echo   JulesMotor_Algorithm_ScoresBalancer.gs
echo   JulesMotor_UI_Orchestrator.gs
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  PROCHAINES ÉTAPES                                             │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo 1. Consulter AUDIT_JULES.md pour les détails complets
echo 2. Lire docs\GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md
echo 3. Uploader les fichiers dans Google Apps Script :
echo    a) Ajouter les 6 fichiers JulesMotor depuis google_apps_script_ready\
echo    b) Vérifier ui\InterfaceV2.html
echo    c) Vérifier core\Menu.js
echo.
echo 4. Déployer en production !
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  DOCUMENTATION DISPONIBLE                                      │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo   AUDIT_JULES.md                             (Audit complet)
echo   docs\GUIDE_INSERTION_GOOGLE_APPS_SCRIPT.md (Guide upload)
echo   ARCHITECTURE_MODULAIRE.md                  (Architecture)
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Appuyez sur une touche pour ouvrir l'audit...
pause >nul

REM Ouvrir l'audit final dans l'éditeur par défaut
start "" "AUDIT_JULES.md"

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