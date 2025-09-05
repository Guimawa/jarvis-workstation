# Assets pour JARVIS Ultra Instinct

## Icônes nécessaires

Pour que l'application fonctionne correctement, vous devez ajouter les icônes suivantes dans ce dossier :

### Windows (.ico)
- **icon.ico** - 256x256px minimum, format ICO
  - Utilisé pour l'application et l'installateur Windows

### macOS (.icns) 
- **icon.icns** - Format ICNS avec multiples résolutions
  - Générable avec `iconutil` sur macOS ou des outils en ligne

### Linux (.png)
- **icon.png** - 512x512px minimum, format PNG
  - Utilisé pour AppImage et les raccourcis Linux

## Comment créer les icônes

### Option 1: Outils en ligne
- Utilisez https://convertico.com/ ou https://cloudconvert.com/
- Uploadez votre image source (PNG recommandé, 1024x1024px)
- Convertissez vers les formats requis

### Option 2: Commandes locales

#### Windows (avec ImageMagick)
```bash
convert icon.png -resize 256x256 icon.ico
```

#### macOS 
```bash
# Créer un dossier temporaire
mkdir icon.iconset
# Générer les différentes tailles
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
# Convertir en icns
iconutil -c icns icon.iconset
```

## Note
Sans ces icônes, l'application utilisera les icônes par défaut d'Electron, ce qui fonctionnera mais ne sera pas professionnel.