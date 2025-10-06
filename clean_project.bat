@echo off
chcp 65001 >nul
echo ========================================
echo   NETTOYAGE DU PROJET - Répartition Classes
echo ========================================
echo.
echo Ce script va supprimer :
echo  - 5 fichiers Nirvana (obsolètes)
echo  - 1 fichier backup dupliqué
echo  - Total : ~705 KB
echo.
echo Appuyez sur une touche pour continuer ou Ctrl+C pour annuler...
pause >nul
echo.

REM Créer un dossier de sauvegarde avant suppression
if not exist "_DELETED" mkdir "_DELETED"

echo ----------------------------------------
echo   SUPPRESSION DES FICHIERS NIRVANA
echo ----------------------------------------

if exist "Nirvana_Combined_Orchestrator.js" (
    move "Nirvana_Combined_Orchestrator.js" "_DELETED\" >nul 2>&1
    echo [OK] Nirvana_Combined_Orchestrator.js supprimé
) else (
    echo [--] Nirvana_Combined_Orchestrator.js déjà supprimé
)

if exist "nirvana_parity_combined.js" (
    move "nirvana_parity_combined.js" "_DELETED\" >nul 2>&1
    echo [OK] nirvana_parity_combined.js supprimé
) else (
    echo [--] nirvana_parity_combined.js déjà supprimé
)

if exist "NIRVANA_SCORES_EQUILIBRAGEV1.2.js" (
    move "NIRVANA_SCORES_EQUILIBRAGEV1.2.js" "_DELETED\" >nul 2>&1
    echo [OK] NIRVANA_SCORES_EQUILIBRAGEV1.2.js supprimé
) else (
    echo [--] NIRVANA_SCORES_EQUILIBRAGEV1.2.js déjà supprimé
)

if exist "Nirvana_V2_Amelioree.js" (
    move "Nirvana_V2_Amelioree.js" "_DELETED\" >nul 2>&1
    echo [OK] Nirvana_V2_Amelioree.js supprimé
) else (
    echo [--] Nirvana_V2_Amelioree.js déjà supprimé
)

if exist "NIRVANATESTV2.js" (
    move "NIRVANATESTV2.js" "_DELETED\" >nul 2>&1
    echo [OK] NIRVANATESTV2.js supprimé
) else (
    echo [--] NIRVANATESTV2.js déjà supprimé
)

echo.
echo ----------------------------------------
echo   SUPPRESSION DU BACKUP DUPLIQUÉ
echo ----------------------------------------

if exist "InterfaceV2_BACKUP_DUPLIQUE.html" (
    move "InterfaceV2_BACKUP_DUPLIQUE.html" "_DELETED\" >nul 2>&1
    echo [OK] InterfaceV2_BACKUP_DUPLIQUE.html supprimé
) else (
    echo [--] InterfaceV2_BACKUP_DUPLIQUE.html déjà supprimé
)

echo.
echo ----------------------------------------
echo   SUPPRESSION OPTIONNELLE : TESTS
echo ----------------------------------------
echo.
echo Voulez-vous supprimer les fichiers de test (~109 KB) ?
echo (Recommandé si vous n'avez pas besoin de debug)
echo.
choice /C ON /M "Supprimer les tests"

if errorlevel 2 goto :KeepTests

echo.
echo Suppression des fichiers de test...

if exist "DIAGNOSTIC.js" (
    move "DIAGNOSTIC.js" "_DELETED\" >nul 2>&1
    echo [OK] DIAGNOSTIC.js supprimé
)

if exist "Tests.js" (
    move "Tests.js" "_DELETED\" >nul 2>&1
    echo [OK] Tests.js supprimé
)

if exist "test_Utils.js" (
    move "test_Utils.js" "_DELETED\" >nul 2>&1
    echo [OK] test_Utils.js supprimé
)

if exist "TestEvelesModule.js" (
    move "TestEvelesModule.js" "_DELETED\" >nul 2>&1
    echo [OK] TestEvelesModule.js supprimé
)

if exist "TestInterfaceV2.js" (
    move "TestInterfaceV2.js" "_DELETED\" >nul 2>&1
    echo [OK] TestInterfaceV2.js supprimé
)

if exist "DIVERS.TEST.js" (
    move "DIVERS.TEST.js" "_DELETED\" >nul 2>&1
    echo [OK] DIVERS.TEST.js supprimé
)

goto :AfterTests

:KeepTests
echo.
echo [--] Fichiers de test conservés

:AfterTests
echo.
echo ========================================
echo   NETTOYAGE TERMINÉ !
echo ========================================
echo.
echo Fichiers déplacés dans : _DELETED\
echo (Vous pouvez supprimer ce dossier après vérification)
echo.
echo Prochaines étapes :
echo  1. Exécuter prepare_claudemotor_for_google_apps_script.bat
echo  2. Consulter AUDIT_FINAL.md pour les détails
echo  3. Uploader dans Google Apps Script
echo.
pause
