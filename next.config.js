/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Electron (static export)
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  
  // Désactiver l'optimisation des images pour l'export statique
  images: {
    unoptimized: true,
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuration spécifique pour Electron - désactivé pour éviter les erreurs
  // assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
  
  // Optimisation du build
  swcMinify: true,
  
  // Configuration webpack optimisée
  webpack: (config, { dev, isServer }) => {
    // Fallback pour Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Optimisation pour le développement
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    return config;
  },
  
  // Optimisation des performances
  poweredByHeader: false,
  compress: true,
  
  // Configuration pour le développement rapide
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
