@echo off
echo ========================================
echo  Preparation JulesMotor pour Google Apps Script
echo ========================================
echo.

REM Créer un dossier temporaire pour les fichiers renommés
if not exist "google_apps_script_ready" mkdir "google_apps_script_ready"

echo Copie et renommage des fichiers JulesMotor...
echo.

REM Copier et renommer les fichiers JulesMotor
copy "julesmotor\utils\calculators.js" "google_apps_script_ready\JulesMotor_Utils_Calculators.gs"
copy "julesmotor\utils\validators.js" "google_apps_script_ready\JulesMotor_Utils_Validators.gs"
copy "julesmotor\core\JulesMotor.js" "google_apps_script_ready\JulesMotor_Core.gs"
copy "julesmotor\algorithms\ParityCorrector.js" "google_apps_script_ready\JulesMotor_Algorithm_ParityCorrector.gs"
copy "julesmotor\algorithms\ScoresBalancer.js" "google_apps_script_ready\JulesMotor_Algorithm_ScoresBalancer.gs"
copy "julesmotor\ui\Orchestrator.js" "google_apps_script_ready\JulesMotor_UI_Orchestrator.gs"

echo.
echo ========================================
echo  TERMINE !
echo ========================================
echo.
echo Les 6 fichiers JulesMotor ont ete prepares dans :
echo google_apps_script_ready\
echo.
echo Fichiers crees :
echo  - JulesMotor_Utils_Calculators.gs
echo  - JulesMotor_Utils_Validators.gs
echo  - JulesMotor_Core.gs
echo  - JulesMotor_Algorithm_ParityCorrector.gs
echo  - JulesMotor_Algorithm_ScoresBalancer.gs
echo  - JulesMotor_UI_Orchestrator.gs
echo.
echo Vous pouvez maintenant copier ces fichiers dans Google Apps Script
echo en respectant l'ordre d'insertion du guide.
echo.
pause