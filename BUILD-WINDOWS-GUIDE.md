# 🪟 Guide de Build Windows pour JARVIS Ultra Instinct

## ⚠️ Information Importante

Le build pour Windows (.exe) doit être effectué sur un **système Windows** ou avec Wine installé sur Linux.

## 🖥️ Sur Windows

### 1. Prérequis
```bash
# Avoir Node.js installé (v18+)
# Télécharger le projet sur votre machine Windows
```

### 2. Installation
```bash
cd votre-projet
npm install
```

### 3. Créer l'installateur Windows
```bash
# Build et création de l'installateur .exe
npm run dist:win
```

**Résultat :** Le fichier `.exe` sera dans `dist/JARVIS Ultra Instinct Setup 2.0.0.exe`

## 🐧 Sur Linux (avec Wine)

### 1. Installer Wine
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install wine

# Arch Linux
sudo pacman -S wine

# CentOS/RHEL
sudo yum install wine
```

### 2. Build Windows
```bash
npm run dist:win
```

## 📦 Alternative : Build Multi-Plateforme

```bash
# Pour toutes les plateformes disponibles
npm run dist

# Spécifique à chaque OS
npm run dist:win    # Windows
npm run dist:mac    # macOS  
npm run dist:linux  # Linux
```

## 🎯 Fichiers de Sortie

Après le build, vous trouverez dans `dist/` :

### Windows
- `JARVIS Ultra Instinct Setup 2.0.0.exe` - Installateur NSIS
- `win-unpacked/` - Version portable

### Linux  
- `jarvis-ultra-instinct-2.0.0.AppImage` - Application portable
- `linux-unpacked/` - Version non empaquetée

### macOS
- `JARVIS Ultra Instinct-2.0.0.dmg` - Image disque macOS

## 🚀 Test en Mode Développement

Sur n'importe quel système :
```bash
npm run electron
```

Cette commande lance l'application Electron en mode développement avec hot-reload.

## 🔧 Configuration Avancée

### Icônes Personnalisées
Placez vos icônes dans `assets/` :
- `icon.ico` (Windows) - 256x256px
- `icon.icns` (macOS) - Multi-résolutions
- `icon.png` (Linux) - 512x512px

### Signature de Code (Production)
Pour une distribution professionnelle, configurez la signature :

```json
// package.json - section "build"
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "your-password"
}
```

## ✅ Application Prête !

Votre application **JARVIS Ultra Instinct** est maintenant prête pour la distribution en tant qu'application desktop Windows !