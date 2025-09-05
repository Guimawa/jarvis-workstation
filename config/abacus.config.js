// ==============================================
// 🔗 CONFIGURATION ABACUS LLM
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Configuration pour l'intégration Abacus LLM
// ==============================================

export const abacusConfig = {
  // Configuration de base
  apiKey: process.env.ABACUS_API_KEY || 'your-api-key-here',
  baseUrl: 'https://routellm.abacus.ai/v1',
  model: 'route-llm',
  
  // Configuration des requêtes
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  
  // Configuration du cache
  enableCache: true,
  cacheTtl: 5 * 60 * 1000, // 5 minutes
  
  // Configuration des métriques
  enableMetrics: true,
  maxMetricsHistory: 1000,
  
  // Configuration de la qualité
  qualityThreshold: 0.7,
  enableQualityCheck: true,
  
  // Configuration des modèles
  models: {
    'route-llm': {
      name: 'Route LLM',
      description: 'Modèle principal Abacus',
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9
    }
  },
  
  // Configuration des prompts
  prompts: {
    system: {
      component: 'Tu es un expert développeur React/TypeScript. Tu génères du code de haute qualité, bien structuré et suivant les meilleures pratiques.',
      page: 'Tu es un expert développeur React/TypeScript. Tu crées des pages complètes et modernes.',
      hook: 'Tu es un expert développeur React/TypeScript. Tu crées des hooks personnalisés performants et réutilisables.',
      documentation: 'Tu es un expert en documentation de code. Tu génères une documentation claire et complète.',
      tests: 'Tu es un expert en tests unitaires. Tu génères des tests complets et robustes.',
      analysis: 'Tu es un expert en analyse de code. Tu fournis une analyse détaillée et constructive.'
    }
  },
  
  // Configuration des types de génération
  generationTypes: {
    component: {
      maxTokens: 2000,
      temperature: 0.7,
      topP: 0.9
    },
    page: {
      maxTokens: 3000,
      temperature: 0.7,
      topP: 0.9
    },
    hook: {
      maxTokens: 1500,
      temperature: 0.6,
      topP: 0.9
    },
    documentation: {
      maxTokens: 1000,
      temperature: 0.3,
      topP: 0.9
    },
    tests: {
      maxTokens: 1500,
      temperature: 0.4,
      topP: 0.9
    },
    analysis: {
      maxTokens: 1000,
      temperature: 0.2,
      topP: 0.9
    }
  }
};

export default abacusConfig;
