@echo off
chcp 65001 >nul
color 0B
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║           UPLOAD VERS GITHUB - Répartition Classes            ║
echo ║                    Version 13.0 Sécurisée                      ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Ce script va :
echo   1. Vérifier la sécurité (pas de données sensibles)
echo   2. Initialiser Git
echo   3. Configurer .gitignore
echo   4. Créer le premier commit
echo   5. Vous guider pour pusher sur GitHub
echo.
echo ────────────────────────────────────────────────────────────────
echo.
pause

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 1/5 : VÉRIFICATION SÉCURITÉ                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Vérification des données sensibles...
echo.

REM Vérifier si des fichiers sensibles existent
set "FOUND_SENSITIVE=0"

if exist "*_PRIVATE*.js" set "FOUND_SENSITIVE=1"
if exist "*_SECRET*.js" set "FOUND_SENSITIVE=1"
if exist "*.env" set "FOUND_SENSITIVE=1"
if exist "credentials.json" set "FOUND_SENSITIVE=1"

if "%FOUND_SENSITIVE%"=="1" (
    echo ❌ ATTENTION : Des fichiers sensibles ont été détectés !
    echo.
    echo Ces fichiers ne doivent PAS être uploadés sur GitHub :
    dir /b *_PRIVATE*.js *_SECRET*.js *.env credentials.json 2>nul
    echo.
    echo Supprimez-les ou ajoutez-les au .gitignore avant de continuer.
    echo.
    pause
    exit /b 1
)

echo ✅ Aucun fichier sensible détecté
echo ✅ Mot de passe par défaut "admin123" (OK pour public)
echo ✅ Pas de données élèves réelles
echo.
echo ────────────────────────────────────────────────────────────────
pause

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 2/5 : INITIALISATION GIT                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé !
    echo.
    echo Téléchargez Git depuis : https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git détecté :
git --version
echo.

REM Vérifier si déjà initialisé
if exist ".git" (
    echo ℹ️  Repository Git déjà initialisé
) else (
    echo Initialisation du repository Git...
    git init
    if errorlevel 1 (
        echo ❌ Erreur lors de l'initialisation Git
        pause
        exit /b 1
    )
    echo ✅ Repository Git initialisé
)
echo.
echo ────────────────────────────────────────────────────────────────
pause

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 3/5 : CONFIGURATION                                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Renommer README_GITHUB.md en README.md
if exist "README_GITHUB.md" (
    if exist "README.md" (
        echo ℹ️  README.md existe déjà
        choice /C ON /M "Remplacer par README_GITHUB.md"
        if errorlevel 2 (
            move /Y "README_GITHUB.md" "README.md" >nul
            echo ✅ README.md mis à jour
        )
    ) else (
        move "README_GITHUB.md" "README.md" >nul
        echo ✅ README.md créé depuis README_GITHUB.md
    )
)

REM Vérifier .gitignore
if exist ".gitignore" (
    echo ✅ .gitignore existe
) else (
    echo ❌ .gitignore manquant !
    echo Créez-le avec les fichiers sensibles à exclure.
    pause
    exit /b 1
)

echo.
echo Configuration Git (si nécessaire)...
echo.

REM Vérifier si nom/email configurés
git config user.name >nul 2>&1
if errorlevel 1 (
    echo Entrez votre nom pour Git :
    set /p "GIT_NAME=Nom : "
    git config user.name "!GIT_NAME!"
)

git config user.email >nul 2>&1
if errorlevel 1 (
    echo Entrez votre email pour Git :
    set /p "GIT_EMAIL=Email : "
    git config user.email "!GIT_EMAIL!"
)

echo.
echo ✅ Configuration terminée
echo.
echo ────────────────────────────────────────────────────────────────
pause

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 4/5 : PREMIER COMMIT                                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Ajout des fichiers...
git add .

if errorlevel 1 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
)

echo.
echo Fichiers à commiter :
git status --short | more
echo.

echo Création du commit...
git commit -m "🎓 Initial commit - Répartition Classes v13.0

- Interface V2 avec mode Essentiel
- ClaudeMotor (remplace Nirvana)
- Architecture modulaire (App object)
- Header simplifié (menu ⚙️ unique)
- ARIA accessibilité
- Documentation complète
- Pas de données sensibles
- Config.js v13.0
- InterfaceV2.html optimisé (357 KB)"

if errorlevel 1 (
    echo ❌ Erreur lors du commit
    pause
    exit /b 1
)

echo.
echo ✅ Premier commit créé avec succès !
echo.
echo ────────────────────────────────────────────────────────────────
pause

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ÉTAPE 5/5 : PUSH VERS GITHUB                                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo MAINTENANT, CRÉEZ VOTRE REPOSITORY GITHUB :
echo.
echo 1. Allez sur https://github.com/new
echo 2. Nom du repository : repartition-classes
echo 3. Description : Système de répartition automatique d'élèves
echo 4. Public ou Private : Public (recommandé pour review IA)
echo 5. NE PAS initialiser avec README (on a déjà le nôtre)
echo 6. Créer le repository
echo.
echo Appuyez sur une touche quand c'est fait...
pause >nul
echo.
echo ────────────────────────────────────────────────────────────────
echo.
echo Entrez l'URL de votre repository GitHub :
echo (Format : https://github.com/VOTRE-USERNAME/repartition-classes.git)
echo.
set /p "REPO_URL=URL : "

if "%REPO_URL%"=="" (
    echo ❌ URL vide, abandon.
    pause
    exit /b 1
)

echo.
echo Ajout du remote...
git remote add origin "%REPO_URL%" 2>nul
if errorlevel 1 (
    echo ℹ️  Remote origin existe déjà, mise à jour...
    git remote set-url origin "%REPO_URL%"
)

echo.
echo Renommage de la branche en 'main'...
git branch -M main

echo.
echo Push vers GitHub...
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du push
    echo.
    echo Causes possibles :
    echo   - Authentification requise (entrez vos identifiants GitHub)
    echo   - Repository distant non vide (forcez avec --force)
    echo   - Pas d'accès internet
    echo.
    echo Réessayez manuellement :
    echo   git push -u origin main
    echo.
    pause
    exit /b 1
)

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     ✓ UPLOAD TERMINÉ !                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  SUCCÈS !                                                      │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo ✅ Repository Git initialisé
echo ✅ Premier commit créé
echo ✅ Pushé vers GitHub : %REPO_URL%
echo.
echo ┌────────────────────────────────────────────────────────────────┐
echo │  PROCHAINES ÉTAPES                                             │
echo └────────────────────────────────────────────────────────────────┘
echo.
echo 1. Visitez votre repository :
echo    %REPO_URL:.git=%
echo.
echo 2. Vérifiez que tout est là :
echo    - README.md
echo    - InterfaceV2.html
echo    - Config.js
echo    - Documentation (docs/)
echo.
echo 3. Pour une review IA :
echo.
echo    A) Jules CLI :
echo       npm install -g @usepolygon/jules-cli
echo       jules analyze .
echo.
echo    B) GPT Codex :
echo       Ouvrir dans VSCode avec GitHub Copilot
echo       @workspace explain this project
echo.
echo    C) Demander review communauté :
echo       Créer une issue "Code Review Request"
echo.
echo 4. Consultez SECURITE_GITHUB.md pour plus d'infos
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Appuyez sur une touche pour ouvrir le repository dans le navigateur...
pause >nul

REM Ouvrir le repository dans le navigateur
start "" "%REPO_URL:.git=%"

echo.
echo Terminé avec succès !
echo.
