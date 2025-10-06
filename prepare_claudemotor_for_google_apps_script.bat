@echo off
echo ========================================
echo  Preparation ClaudeMotor pour Google Apps Script
echo ========================================
echo.

REM Créer un dossier temporaire pour les fichiers renommés
if not exist "google_apps_script_ready" mkdir "google_apps_script_ready"

echo Copie et renommage des fichiers ClaudeMotor...
echo.

REM Copier et renommer les fichiers ClaudeMotor
copy "claudemotor\utils\calculators.js" "google_apps_script_ready\ClaudeMotor_Utils_Calculators.gs"
copy "claudemotor\utils\validators.js" "google_apps_script_ready\ClaudeMotor_Utils_Validators.gs"
copy "claudemotor\core\ClaudeMotor.js" "google_apps_script_ready\ClaudeMotor_Core.gs"
copy "claudemotor\algorithms\ParityCorrector.js" "google_apps_script_ready\ClaudeMotor_Algorithm_ParityCorrector.gs"
copy "claudemotor\algorithms\ScoresBalancer.js" "google_apps_script_ready\ClaudeMotor_Algorithm_ScoresBalancer.gs"
copy "claudemotor\ui\Orchestrator.js" "google_apps_script_ready\ClaudeMotor_UI_Orchestrator.gs"

echo.
echo ========================================
echo  TERMINE !
echo ========================================
echo.
echo Les 6 fichiers ClaudeMotor ont ete prepares dans :
echo google_apps_script_ready\
echo.
echo Fichiers crees :
echo  - ClaudeMotor_Utils_Calculators.gs
echo  - ClaudeMotor_Utils_Validators.gs
echo  - ClaudeMotor_Core.gs
echo  - ClaudeMotor_Algorithm_ParityCorrector.gs
echo  - ClaudeMotor_Algorithm_ScoresBalancer.gs
echo  - ClaudeMotor_UI_Orchestrator.gs
echo.
echo Vous pouvez maintenant copier ces fichiers dans Google Apps Script
echo en respectant l'ordre d'insertion du guide.
echo.
pause
