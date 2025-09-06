/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Electron - export statique
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Désactiver les optimisations qui ne fonctionnent pas avec Electron
  swcMinify: true,
  
  // Configuration webpack pour Electron
  webpack: (config, { dev, isServer }) => {
    // Fallback pour Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  
  // Configuration TypeScript moins stricte pour Electron
  typescript: {
    // Ignore les erreurs TypeScript lors du build Electron
    ignoreBuildErrors: true,
  },
  
  // Configuration pour l'export statique
  experimental: {
    // Désactiver les fonctionnalités qui ne marchent pas avec l'export statique
  },
  
  // Optimisation des performances
  poweredByHeader: false,
  compress: true,
}

export default nextConfig