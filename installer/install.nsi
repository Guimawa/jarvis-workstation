; ==============================================
; 🚀 INSTALLATEUR JARVIS ULTRA INSTINCT
; ==============================================
; Version: 2.0.0 - Logiciel Complet
; Auteur: Jarvis Expert
; Description: Installateur Windows complet avec interface graphique
; ==============================================

!define APP_NAME "Jarvis Ultra Instinct"
!define APP_VERSION "2.0.0"
!define APP_PUBLISHER "Jarvis Expert"
!define APP_URL "https://jarvis-ultra-instinct.com"
!define APP_EXECUTABLE "jarvis-dashboard.exe"
!define APP_ICON "jarvis-icon.ico"

; Configuration de l'installateur
Name "${APP_NAME}"
OutFile "install.exe"
InstallDir "$PROGRAMFILES\${APP_NAME}"
InstallDirRegKey HKLM "Software\${APP_NAME}" "Install_Dir"
RequestExecutionLevel admin
ShowInstDetails show
ShowUnInstDetails show

; Interface graphique
!include "MUI2.nsh"
!include "FileFunc.nsh"

; Configuration de l'interface
!define MUI_ICON "jarvis-icon.ico"
!define MUI_UNICON "jarvis-icon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "welcome.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "welcome.bmp"

; Pages de l'installateur
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Pages de désinstallation
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Langues
!insertmacro MUI_LANGUAGE "French"

; ==============================================
; SECTIONS D'INSTALLATION
; ==============================================

Section "Installation Principale" SecMain
    SetOutPath "$INSTDIR"
    
    ; Créer le dossier d'installation
    CreateDirectory "$INSTDIR"
    
    ; Copier les fichiers principaux
    File /r "app\*"
    File /r "components\*"
    File /r "lib\*"
    File /r "config\*"
    File /r "public\*"
    File /r "styles\*"
    File /r "scripts\*"
    
    ; Copier les fichiers de configuration
    File "package.json"
    File "next.config.js"
    File "tailwind.config.js"
    File "tsconfig.json"
    File "postcss.config.js"
    File "eslint.config.js"
    File "jest.config.js"
    File "jest.setup.js"
    File "next-env.d.ts"
    File "Dockerfile"
    File "docker-compose.yml"
    File "env.example"
    
    ; Copier les scripts d'installation
    File "JARVIS.bat"
    File "JARVIS-ULTRA-INSTINCT.exe.bat"
    File "INTERFACE-JARVIS.bat"
    File "LANCER-JARVIS.bat"
    File "START.bat"
    File "start-light-complete.bat"
    File "start-light-complete.sh"
    
    ; Créer le fichier .env
    FileOpen $0 "$INSTDIR\.env" w
    FileWrite $0 "# Configuration Jarvis Ultra Instinct$\r$\n"
    FileWrite $0 "GROQ_API_KEY=your_groq_api_key_here$\r$\n"
    FileWrite $0 "PORT=3000$\r$\n"
    FileWrite $0 "NODE_ENV=production$\r$\n"
    FileWrite $0 "NEXT_PUBLIC_APP_URL=http://localhost:3000$\r$\n"
    FileWrite $0 "NEXT_PUBLIC_AI_ENABLED=true$\r$\n"
    FileWrite $0 "NEXT_PUBLIC_VERSION=2.0.0$\r$\n"
    FileClose $0
    
    ; Créer le launcher principal
    FileOpen $0 "$INSTDIR\jarvis-dashboard.bat" w
    FileWrite $0 "@echo off$\r$\n"
    FileWrite $0 "title ${APP_NAME} - Dashboard$\r$\n"
    FileWrite $0 "color 0A$\r$\n"
    FileWrite $0 "cd /d \"$INSTDIR\"$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "echo ╔══════════════════════════════════════════════════════════════╗$\r$\n"
    FileWrite $0 "echo ║                                                              ║$\r$\n"
    FileWrite $0 "echo ║        ██████╗  █████╗ ██████╗ ██╗   ██╗██╗███████╗        ║$\r$\n"
    FileWrite $0 "echo ║       ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║██╔════╝        ║$\r$\n"
    FileWrite $0 "echo ║       ██║  ███╗███████║██████╔╝██║   ██║██║███████╗        ║$\r$\n"
    FileWrite $0 "echo ║       ██║   ██║██╔══██║██╔══██╗╚██╗ ██╔╝██║╚════██║        ║$\r$\n"
    FileWrite $0 "echo ║       ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║███████║        ║$\r$\n"
    FileWrite $0 "echo ║        ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝        ║$\r$\n"
    FileWrite $0 "echo ║                                                              ║$\r$\n"
    FileWrite $0 "echo ║                    ULTRA INSTINCT DASHBOARD                  ║$\r$\n"
    FileWrite $0 "echo ║                      Version ${APP_VERSION}                    ║$\r$\n"
    FileWrite $0 "echo ║                                                              ║$\r$\n"
    FileWrite $0 "echo ╚══════════════════════════════════════════════════════════════╝$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "echo 🚀 Démarrage de ${APP_NAME}...$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 ":: Vérifier Node.js$\r$\n"
    FileWrite $0 "node --version >nul 2>&1$\r$\n"
    FileWrite $0 "if %errorlevel% neq 0 ($\r$\n"
    FileWrite $0 "    echo ❌ Node.js n'est pas installé!$\r$\n"
    FileWrite $0 "    echo.$\r$\n"
    FileWrite $0 "    echo 📥 Téléchargez Node.js depuis: https://nodejs.org/$\r$\n"
    FileWrite $0 "    echo    (Version LTS recommandée)$\r$\n"
    FileWrite $0 "    echo.$\r$\n"
    FileWrite $0 "    pause$\r$\n"
    FileWrite $0 "    exit /b 1$\r$\n"
    FileWrite $0 ") else ($\r$\n"
    FileWrite $0 "    for /f \"tokens=1\" %%i in ('node --version') do echo ✅ Node.js %%i détecté$\r$\n"
    FileWrite $0 ")$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 ":: Installer les dépendances si nécessaire$\r$\n"
    FileWrite $0 "if not exist \"node_modules\" ($\r$\n"
    FileWrite $0 "    echo 📦 Installation des dépendances...$\r$\n"
    FileWrite $0 "    call npm install --silent$\r$\n"
    FileWrite $0 "    if %errorlevel% neq 0 ($\r$\n"
    FileWrite $0 "        echo ❌ Erreur lors de l'installation$\r$\n"
    FileWrite $0 "        pause$\r$\n"
    FileWrite $0 "        exit /b 1$\r$\n"
    FileWrite $0 "    )$\r$\n"
    FileWrite $0 "    echo ✅ Dépendances installées$\r$\n"
    FileWrite $0 ") else ($\r$\n"
    FileWrite $0 "    echo ✅ Dépendances déjà installées$\r$\n"
    FileWrite $0 ")$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 ":: Lancer le dashboard$\r$\n"
    FileWrite $0 "echo 🌐 Ouverture du dashboard...$\r$\n"
    FileWrite $0 "echo    URL: http://localhost:3000$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "start http://localhost:3000$\r$\n"
    FileWrite $0 "call npm run dev$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "echo 👋 ${APP_NAME} fermé.$\r$\n"
    FileWrite $0 "pause$\r$\n"
    FileClose $0
    
    ; Créer le raccourci sur le bureau
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\jarvis-dashboard.bat" "" "$INSTDIR\${APP_ICON}" 0
    
    ; Créer le raccourci dans le menu Démarrer
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\jarvis-dashboard.bat" "" "$INSTDIR\${APP_ICON}" 0
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\Désinstaller.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
    
    ; Enregistrer dans le registre
    WriteRegStr HKLM "Software\${APP_NAME}" "Install_Dir" "$INSTDIR"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" "$INSTDIR\${APP_ICON}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${APP_PUBLISHER}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoRepair" 1
    
    ; Créer le désinstallateur
    WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

; ==============================================
; SECTION DE DÉSINSTALLATION
; ==============================================

Section "Uninstall"
    ; Supprimer les fichiers
    RMDir /r "$INSTDIR\app"
    RMDir /r "$INSTDIR\components"
    RMDir /r "$INSTDIR\lib"
    RMDir /r "$INSTDIR\config"
    RMDir /r "$INSTDIR\public"
    RMDir /r "$INSTDIR\styles"
    RMDir /r "$INSTDIR\scripts"
    RMDir /r "$INSTDIR\node_modules"
    
    ; Supprimer les fichiers individuels
    Delete "$INSTDIR\package.json"
    Delete "$INSTDIR\next.config.js"
    Delete "$INSTDIR\tailwind.config.js"
    Delete "$INSTDIR\tsconfig.json"
    Delete "$INSTDIR\postcss.config.js"
    Delete "$INSTDIR\eslint.config.js"
    Delete "$INSTDIR\jest.config.js"
    Delete "$INSTDIR\jest.setup.js"
    Delete "$INSTDIR\next-env.d.ts"
    Delete "$INSTDIR\Dockerfile"
    Delete "$INSTDIR\docker-compose.yml"
    Delete "$INSTDIR\env.example"
    Delete "$INSTDIR\.env"
    Delete "$INSTDIR\jarvis-dashboard.bat"
    Delete "$INSTDIR\JARVIS.bat"
    Delete "$INSTDIR\JARVIS-ULTRA-INSTINCT.exe.bat"
    Delete "$INSTDIR\INTERFACE-JARVIS.bat"
    Delete "$INSTDIR\LANCER-JARVIS.bat"
    Delete "$INSTDIR\START.bat"
    Delete "$INSTDIR\start-light-complete.bat"
    Delete "$INSTDIR\start-light-complete.sh"
    Delete "$INSTDIR\${APP_ICON}"
    Delete "$INSTDIR\uninstall.exe"
    
    ; Supprimer les raccourcis
    Delete "$DESKTOP\${APP_NAME}.lnk"
    RMDir /r "$SMPROGRAMS\${APP_NAME}"
    
    ; Supprimer le dossier d'installation
    RMDir "$INSTDIR"
    
    ; Supprimer les entrées du registre
    DeleteRegKey HKLM "Software\${APP_NAME}"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
SectionEnd

; ==============================================
; FONCTIONS PERSONNALISÉES
; ==============================================

Function .onInit
    ; Vérifier si l'application est déjà installée
    ReadRegStr $R0 HKLM "Software\${APP_NAME}" "Install_Dir"
    StrCmp $R0 "" done
    
    MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
        "${APP_NAME} est déjà installé. $\n$\nCliquez sur OK pour désinstaller la version précédente ou sur Annuler pour annuler cette mise à jour." \
        IDOK uninst
    Abort
    
    uninst:
        ClearErrors
        ExecWait '$R0\uninstall.exe _?=$R0'
        
        IfErrors no_remove_uninstaller done
        no_remove_uninstaller:
    
    done:
FunctionEnd

Function .onInstSuccess
    ; Afficher un message de succès
    MessageBox MB_YESNO|MB_ICONQUESTION \
        "${APP_NAME} a été installé avec succès ! $\n$\nVoulez-vous lancer l'application maintenant ?" \
        IDYES launch IDNO done
    
    launch:
        Exec "$INSTDIR\jarvis-dashboard.bat"
    
    done:
FunctionEnd
