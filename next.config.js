import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Electron
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  
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

    // Alias pour éviter l'import WebGPU cassé dans three-render-objects
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'three/webgpu': path.resolve(__dirname, 'stubs/three-webgpu.js'),
      components: path.resolve(__dirname, 'src/components'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      siteConfig: path.resolve(__dirname, 'src/siteConfig.js')
    };
    
    // Exclure le dossier doc/archive du build
    config.module.rules.push({
      test: /doc\/archive\/.*\.(tsx?|jsx?)$/,
      use: 'ignore-loader',
    });
    
    // Optimisation pour le développement
    if (dev) {
      // Éviter les erreurs EPERM sur Windows en cache fichier
      config.cache = { type: 'memory' };
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
