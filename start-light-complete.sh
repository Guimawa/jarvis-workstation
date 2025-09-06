#!/bin/bash

# ==============================================
# 🚀 SCRIPT DE DÉMARRAGE RAPIDE - Linux/Mac
# ==============================================
# Version: 2.0.0 Light Complete
# Auteur: Jarvis Expert
# Description: Démarrage rapide pour Linux/Mac
# ==============================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction d'affichage avec couleurs
print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║  🚀 JARVIS ULTRA INSTINCT - DÉMARRAGE RAPIDE 🚀            ║"
    echo "║                                                              ║"
    echo "║  Version Light Complète - Interface + Cerveau IA            ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Fonction de vérification des prérequis
check_prerequisites() {
    print_info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js non trouvé. Veuillez installer Node.js 18+"
        exit 1
    fi
    
    local node_version=$(node --version)
    local major_version=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$major_version" -lt 18 ]; then
        print_error "Node.js 18+ requis. Version actuelle: $node_version"
        exit 1
    fi
    
    print_success "Node.js $node_version détecté"
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm non trouvé"
        exit 1
    fi
    
    print_success "npm détecté"
    
    # Vérifier les fichiers requis
    local required_files=(
        "app/page-light-complete.tsx"
        "package-light-complete.json"
        "lib/groq-client-light.js"
        "config/light-complete.json"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Fichier manquant: $file"
            exit 1
        fi
    done
    
    print_success "Fichiers requis trouvés"
}

# Fonction de configuration de l'environnement
setup_environment() {
    print_info "Configuration de l'environnement..."
    
    # Copier le package.json light
    if [ -f "package-light-complete.json" ]; then
        cp "package-light-complete.json" "package.json"
        print_success "Configuration package.json"
    fi
    
    # Créer .env.local si nécessaire
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
# Configuration Jarvis Ultra Instinct Light Complete
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
NEXT_PUBLIC_APP_MODE=light-complete
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_VERSION=2.0.0-light-complete
EOF
        print_success "Fichier .env.local créé"
    else
        print_info "Fichier .env.local existe déjà"
    fi
}

# Fonction d'installation des dépendances
install_dependencies() {
    print_info "Installation des dépendances..."
    
    if npm install; then
        print_success "Dépendances installées"
    else
        print_error "Erreur lors de l'installation des dépendances"
        exit 1
    fi
}

# Fonction de vérification de la configuration IA
check_ai_config() {
    print_info "Vérification de la configuration IA..."
    
    if grep -q "your_groq_api_key_here" .env.local; then
        print_warning "Clé API Groq non configurée"
        print_info "Configurez GROQ_API_KEY dans .env.local pour activer l'IA"
    else
        print_success "Configuration IA détectée"
    fi
}

# Fonction de démarrage du serveur
start_server() {
    print_info "Démarrage du serveur..."
    
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║  🎯 SERVEUR DÉMARRÉ ! 🎯                                   ║"
    echo "║                                                              ║"
    echo "║  URL: http://localhost:3002                                 ║"
    echo "║  Mode: Light Complete                                       ║"
    echo "║  IA: Vérifiez votre clé API Groq dans .env.local           ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${GREEN}✨ Jarvis Ultra Instinct Light Complete est prêt !${NC}"
    echo -e "${CYAN}🌐 Ouvrez http://localhost:3002 dans votre navigateur${NC}"
    echo -e "${PURPLE}💡 Appuyez sur Ctrl+C pour arrêter le serveur${NC}"
    echo
    
    # Démarrer Next.js
    npm run dev -- --port 3002
}

# Fonction principale
main() {
    print_banner
    
    # Vérification des prérequis
    check_prerequisites
    
    # Configuration de l'environnement
    setup_environment
    
    # Installation des dépendances
    install_dependencies
    
    # Vérification de la configuration IA
    check_ai_config
    
    # Démarrage du serveur
    start_server
}

# Gestion des signaux
trap 'echo -e "\n${YELLOW}🛑 Arrêt du serveur...${NC}"; exit 0' INT TERM

# Exécution
main "$@"
