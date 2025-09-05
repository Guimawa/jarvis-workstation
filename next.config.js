/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Electron
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  
  // Optimisations pour le lancement rapide
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Optimisation des images (compatible avec export statique)
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NODE_ENV === 'production'
  },
  
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

export default nextConfig
