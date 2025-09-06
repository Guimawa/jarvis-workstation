@echo off
setlocal ENABLEDELAYEDEXPANSION

REM ===============================================
REM  collect-project-info.bat
REM  Produit project-info.zip (structure, deps, git, 3D report)
REM  À lancer à la racine du repo.
REM ===============================================

set OUTDIR=project-info
set ZIP=project-info.zip

REM Nettoyage ancien dossier/zip
if exist "%OUTDIR%" rmdir /s /q "%OUTDIR%"
if exist "%ZIP%" del "%ZIP%"
mkdir "%OUTDIR%"

REM ---- SUMMARY ----
echo === SUMMARY === > "%OUTDIR%\summary.txt"
echo Timestamp: %date% %time% >> "%OUTDIR%\summary.txt"
for /f "delims=" %%v in ('node -v 2^>NUL') do set NODEV=%%v
for /f "delims=" %%v in ('npm -v 2^>NUL') do set NPMV=%%v
echo Root: %cd% >> "%OUTDIR%\summary.txt"
echo Node: %NODEV% >> "%OUTDIR%\summary.txt"
echo NPM : %NPMV% >> "%OUTDIR%\summary.txt"

REM ---- TREE (profondeur 3 via PowerShell) ----
powershell -NoProfile -Command ^
  "Get-ChildItem -Recurse -Depth 3 ^| Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.next\\|\\dist\\|\\build\\|\\coverage\\|\\\.git\\' } ^| Select-Object FullName,Length,LastWriteTime ^| Sort-Object FullName ^| Format-Table -AutoSize ^| Out-String ^| Set-Content -Encoding UTF8 '%OUTDIR%\tree-depth3.txt'"

REM ---- Copier configs utiles (si existent) ----
call :copyIfExist package.json
call :copyIfExist package-lock.json
call :copyIfExist yarn.lock
call :copyIfExist pnpm-lock.yaml
call :copyIfExist next.config.js
call :copyIfExist next.config.mjs
call :copyIfExist tsconfig.json
call :copyIfExist jsconfig.json
call :copyIfExist tailwind.config.js
call :copyIfExist postcss.config.js
call :copyIfExist .eslintrc
call :copyIfExist .eslintrc.js
call :copyIfExist .eslintrc.cjs
call :copyIfExist .eslintrc.json
call :copyIfExist .prettierrc
call :copyIfExist .prettierrc.json
call :copyIfExist .prettierrc.js
call :copyIfExist .gitignore
call :copyIfExist .npmrc

REM ---- Liste des pages (App Router) ----
if exist app (
  powershell -NoProfile -Command "Get-ChildItem 'app' -Recurse -Depth 3 ^| Select-Object FullName ^| Sort-Object FullName ^| Out-File -Encoding UTF8 '%OUTDIR%\app-structure.txt'"
)
if exist src\app (
  powershell -NoProfile -Command "Get-ChildItem 'src/app' -Recurse -Depth 3 ^| Select-Object FullName ^| Sort-Object FullName ^| Out-File -Encoding UTF8 '%OUTDIR%\src-app-structure.txt'"
)

REM ---- Dépendances NPM (sans node_modules) ----
call npm list --depth=0 > "%OUTDIR%\npm-list.txt" 2>&1
call npm list --depth=0 --json > "%OUTDIR%\npm-list.json" 2>&1

REM ---- Rapport 3D (détection simple via findstr dans package.json) ----
echo 3D Dependencies Report> "%OUTDIR%\3d-dependencies.txt"
if exist package.json (
  call :checkDep "three" 
  call :checkDep "@react-three/fiber"
  call :checkDep "@react-three/drei"
  call :checkDep "react-force-graph-2d"
  call :checkDep "react-force-graph-3d"
) else (
  echo package.json introuvable >> "%OUTDIR%\3d-dependencies.txt"
)

REM ---- Infos Git ----
echo Git Info > "%OUTDIR%\git-info.txt"
git rev-parse --is-inside-work-tree >NUL 2>&1
if %errorlevel%==0 (
  for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>NUL') do echo Branch: %%b>> "%OUTDIR%\git-info.txt"
  echo.>> "%OUTDIR%\git-info.txt"
  echo == Remote ==>> "%OUTDIR%\git-info.txt"
  git remote -v 2>>"%OUTDIR%\git-info.txt" 1>>"%OUTDIR%\git-info.txt"
  echo.>> "%OUTDIR%\git-info.txt"
  echo == Status ==>> "%OUTDIR%\git-info.txt"
  git status -sb 2>>"%OUTDIR%\git-info.txt" 1>>"%OUTDIR%\git-info.txt"
  echo.>> "%OUTDIR%\git-info.txt"
  echo == Derniers commits (30) ==>> "%OUTDIR%\git-info.txt"
  git log --oneline -n 30 2>>"%OUTDIR%\git-info.txt" 1>>"%OUTDIR%\git-info.txt"
  echo.>> "%OUTDIR%\git-info.txt"
  echo == Fichiers en conflit ==>> "%OUTDIR%\git-info.txt"
  git diff --name-only --diff-filter=U 2>>"%OUTDIR%\git-info.txt" 1>>"%OUTDIR%\git-info.txt"
) else (
  echo Pas un repo Git.>> "%OUTDIR%\git-info.txt"
)

REM ---- Env files présents (noms uniquement) ----
dir /b .env* > "%OUTDIR%\env-files-present.txt" 2>NUL

REM ---- ZIP final (via PowerShell Compress-Archive) ----
powershell -NoProfile -Command "Compress-Archive -Path '%OUTDIR%\*' -DestinationPath '%ZIP%' -Force"

echo.
echo ✅ Terminé. Fichier généré : %ZIP%
goto :eof

:copyIfExist
if exist %1 (
  copy /y %1 "%OUTDIR%\%~nx1" >NUL
)
goto :eof

:checkDep
set "DEP=%~1"
for /f "delims=" %%L in ('findstr /I "\"%DEP%\"" package.json ^| findstr /V /I "types"') do set FOUND=1
if defined FOUND (
  echo ✅ %DEP% : PRESENT >> "%OUTDIR%\3d-dependencies.txt"
) else (
  echo ❌ %DEP% : MANQUANT >> "%OUTDIR%\3d-dependencies.txt"
)
set FOUND=
goto :eof
