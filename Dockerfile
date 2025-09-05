# 🚀 JARVIS ULTRA INSTINCT - Dockerfile Optimisé
# Version: 2.0.0 Ultra Instinct
# Optimisé pour le lancement rapide et la production

# Utiliser Node.js 18 Alpine pour un démarrage ultra rapide
FROM node:18-alpine AS base

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Étape de construction
FROM base AS deps
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
COPY package-light.json ./

# Installer les dépendances de production uniquement
RUN npm ci --only=production --silent

# Étape de build
FROM base AS builder
WORKDIR /app

# Copier les dépendances
COPY --from=deps /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build optimisé
RUN npm run build

# Étape de production
FROM base AS runner
WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Changer vers l'utilisateur nextjs
USER nextjs

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED 1

# Commande de démarrage optimisée
CMD ["node", "server.js"]

# Métadonnées
LABEL maintainer="Jarvis Expert"
LABEL version="2.0.0"
LABEL description="Jarvis Ultra Instinct - Dashboard IA optimisé"