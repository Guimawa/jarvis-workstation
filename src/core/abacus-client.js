// ==============================================
// 🔗 ABACUS LLM CLIENT - Client Abacus LLM Ultra Instinct
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Client intelligent pour Abacus LLM avec gestion avancée
// des requêtes, cache, retry et métriques de performance
// ==============================================

import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';

/**
 * Client intelligent pour Abacus LLM
 */
export default class AbacusClient extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      // Configuration Abacus
      apiKey: process.env.ABACUS_API_KEY || config.apiKey,
      baseUrl: 'https://routellm.abacus.ai/v1',
      model: 'route-llm', // Modèle par défaut
      
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
      
      ...config
    };
    
    this.logger = new Logger('AbacusClient');
    
    // Cache des réponses
    this.cache = new Map();
    
    // Métriques de performance
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      averageQuality: 0,
      totalTokens: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    
    // Historique des requêtes
    this.requestHistory = [];
    
    this.isInitialized = false;
  }
  
  /**
   * Initialisation du client Abacus
   */
  async initialize() {
    try {
      this.logger.info('🔗 Initialisation du client Abacus LLM...');
      
      // Vérification de la clé API
      if (!this.config.apiKey) {
        throw new Error('Clé API Abacus manquante. Définissez ABACUS_API_KEY ou passez apiKey dans la config.');
      }
      
      // Test de connexion
      await this.testConnection();
      
      this.isInitialized = true;
      this.logger.info('✅ Client Abacus LLM initialisé');
      
      this.emit('initialized');
      
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'initialisation du client Abacus:', error);
      throw error;
    }
  }
  
  /**
   * Test de connexion à l'API Abacus
   */
  async testConnection() {
    try {
      const response = await this.makeRequest({
        model: this.config.model,
        messages: [{ role: 'user', content: 'Test de connexion' }],
        max_tokens: 10
      });
      
      this.logger.debug('✅ Connexion Abacus testée avec succès');
      return response;
      
    } catch (error) {
      this.logger.error('❌ Échec du test de connexion Abacus:', error);
      throw error;
    }
  }
  
  /**
   * Génération de code avec Abacus LLM
   */
  async generateCode(prompt, options = {}) {
    const startTime = Date.now();
    
    try {
      this.logger.debug('🚀 Génération de code avec Abacus LLM...');
      
      const request = {
        type: 'code_generation',
        prompt,
        options: {
          model: options.model || this.config.model,
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.9,
          ...options
        },
        timestamp: Date.now()
      };
      
      // Vérification du cache
      if (this.config.enableCache) {
        const cached = this.getCachedResponse(request);
        if (cached) {
          this.metrics.cacheHits++;
          this.logger.debug('💾 Réponse trouvée dans le cache');
          return cached;
        }
      }
      
      // Génération du prompt optimisé
      const optimizedPrompt = this.optimizePromptForCodeGeneration(prompt, options);
      
      // Appel à l'API Abacus
      const response = await this.makeRequest({
        model: request.options.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(options)
          },
          {
            role: 'user',
            content: optimizedPrompt
          }
        ],
        max_tokens: request.options.max_tokens,
        temperature: request.options.temperature,
        top_p: request.options.top_p
      });
      
      // Traitement de la réponse
      const result = this.processCodeResponse(response, options);
      
      // Mise à jour des métriques
      this.updateMetrics(startTime, true, result.quality);
      
      // Mise en cache
      if (this.config.enableCache) {
        this.cacheResponse(request, result);
      }
      
      // Enregistrement dans l'historique
      this.recordRequest(request, result, Date.now() - startTime);
      
      this.logger.debug(`✅ Code généré avec succès en ${Date.now() - startTime}ms`);
      
      return result;
      
    } catch (error) {
      this.logger.error('❌ Erreur lors de la génération de code:', error);
      
      // Mise à jour des métriques
      this.updateMetrics(startTime, false, 0);
      
      throw error;
    }
  }
  
  /**
   * Génération de documentation avec Abacus LLM
   */
  async generateDocumentation(code, options = {}) {
    const startTime = Date.now();
    
    try {
      this.logger.debug('📚 Génération de documentation avec Abacus LLM...');
      
      const prompt = `Génère une documentation complète pour ce code:\n\n${code}`;
      
      const response = await this.makeRequest({
        model: options.model || this.config.model,
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en documentation de code. Génère une documentation claire et complète.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1500,
        temperature: 0.3
      });
      
      const result = {
        type: 'documentation',
        content: response.choices[0].message.content,
        quality: this.assessQuality(response.choices[0].message.content),
        metadata: {
          model: options.model || this.config.model,
          tokens: response.usage?.total_tokens || 0,
          responseTime: Date.now() - startTime
        }
      };
      
      this.updateMetrics(startTime, true, result.quality);
      
      return result;
      
    } catch (error) {
      this.logger.error('❌ Erreur lors de la génération de documentation:', error);
      this.updateMetrics(startTime, false, 0);
      throw error;
    }
  }
  
  /**
   * Analyse de code avec Abacus LLM
   */
  async analyzeCode(code, options = {}) {
    const startTime = Date.now();
    
    try {
      this.logger.debug('🔍 Analyse de code avec Abacus LLM...');
      
      const prompt = `Analyse ce code et fournis:\n1. Une évaluation de la qualité\n2. Les problèmes potentiels\n3. Des suggestions d'amélioration\n\nCode:\n${code}`;
      
      const response = await this.makeRequest({
        model: options.model || this.config.model,
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse de code. Fournis une analyse détaillée et constructive.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: 0.2
      });
      
      const result = {
        type: 'analysis',
        content: response.choices[0].message.content,
        quality: this.assessQuality(response.choices[0].message.content),
        metadata: {
          model: options.model || this.config.model,
          tokens: response.usage?.total_tokens || 0,
          responseTime: Date.now() - startTime
        }
      };
      
      this.updateMetrics(startTime, true, result.quality);
      
      return result;
      
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'analyse de code:', error);
      this.updateMetrics(startTime, false, 0);
      throw error;
    }
  }
  
  /**
   * Génération de tests avec Abacus LLM
   */
  async generateTests(code, options = {}) {
    const startTime = Date.now();
    
    try {
      this.logger.debug('🧪 Génération de tests avec Abacus LLM...');
      
      const prompt = `Génère des tests unitaires complets pour ce code:\n\n${code}`;
      
      const response = await this.makeRequest({
        model: options.model || this.config.model,
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en tests unitaires. Génère des tests complets et robustes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 2000,
        temperature: 0.4
      });
      
      const result = {
        type: 'tests',
        content: response.choices[0].message.content,
        quality: this.assessQuality(response.choices[0].message.content),
        metadata: {
          model: options.model || this.config.model,
          tokens: response.usage?.total_tokens || 0,
          responseTime: Date.now() - startTime
        }
      };
      
      this.updateMetrics(startTime, true, result.quality);
      
      return result;
      
    } catch (error) {
      this.logger.error('❌ Erreur lors de la génération de tests:', error);
      this.updateMetrics(startTime, false, 0);
      throw error;
    }
  }
  
  /**
   * Appel principal à l'API Abacus
   */
  async makeRequest(requestData) {
    const url = `${this.config.baseUrl}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur API Abacus: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Optimisation du prompt pour la génération de code
   */
  optimizePromptForCodeGeneration(prompt, options) {
    let optimizedPrompt = prompt;
    
    // Ajout de contexte selon le type de génération
    if (options.type === 'component') {
      optimizedPrompt = `Crée un composant React moderne et bien structuré:\n\n${prompt}`;
    } else if (options.type === 'hook') {
      optimizedPrompt = `Crée un hook React personnalisé:\n\n${prompt}`;
    } else if (options.type === 'page') {
      optimizedPrompt = `Crée une page React complète:\n\n${prompt}`;
    }
    
    // Ajout d'instructions de qualité
    optimizedPrompt += '\n\nInstructions:\n- Utilise TypeScript si possible\n- Ajoute des commentaires JSDoc\n- Suis les meilleures pratiques React\n- Code propre et lisible';
    
    return optimizedPrompt;
  }
  
  /**
   * Obtention du prompt système
   */
  getSystemPrompt(options) {
    const basePrompt = 'Tu es un expert développeur React/TypeScript. Tu génères du code de haute qualité, bien structuré et suivant les meilleures pratiques.';
    
    if (options.type === 'component') {
      return `${basePrompt} Tu te spécialises dans la création de composants React réutilisables et performants.`;
    } else if (options.type === 'hook') {
      return `${basePrompt} Tu te spécialises dans la création de hooks React personnalisés.`;
    } else if (options.type === 'page') {
      return `${basePrompt} Tu te spécialises dans la création de pages React complètes.`;
    }
    
    return basePrompt;
  }
  
  /**
   * Traitement de la réponse de génération de code
   */
  processCodeResponse(response, options) {
    const content = response.choices[0].message.content;
    
    // Extraction du code (suppression des markdown si présent)
    const codeMatch = content.match(/```(?:javascript|typescript|jsx|tsx)?\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1] : content;
    
    // Évaluation de la qualité
    const quality = this.assessCodeQuality(code, options);
    
    return {
      type: 'code_generation',
      content: code,
      originalResponse: content,
      quality,
      metadata: {
        model: options.model || this.config.model,
        tokens: response.usage?.total_tokens || 0,
        finishReason: response.choices[0].finish_reason
      }
    };
  }
  
  /**
   * Évaluation de la qualité du code généré
   */
  assessCodeQuality(code, options) {
    let quality = 0.5; // Base
    
    // Vérification de la syntaxe basique
    if (code.includes('export') || code.includes('function') || code.includes('const')) {
      quality += 0.2;
    }
    
    // Vérification des bonnes pratiques React
    if (code.includes('useState') || code.includes('useEffect')) {
      quality += 0.1;
    }
    
    if (code.includes('className') || code.includes('onClick')) {
      quality += 0.1;
    }
    
    // Vérification TypeScript
    if (options.typescript && (code.includes(': string') || code.includes(': number') || code.includes('interface'))) {
      quality += 0.1;
    }
    
    // Vérification de la longueur (ni trop court ni trop long)
    const lines = code.split('\n').length;
    if (lines >= 5 && lines <= 50) {
      quality += 0.1;
    }
    
    return Math.min(1.0, quality);
  }
  
  /**
   * Évaluation de la qualité générale
   */
  assessQuality(content) {
    let quality = 0.5; // Base
    
    // Longueur du contenu
    if (content.length > 100) quality += 0.1;
    if (content.length > 500) quality += 0.1;
    
    // Structure (présence de listes, sections, etc.)
    if (content.includes('\n-') || content.includes('\n1.') || content.includes('##')) {
      quality += 0.1;
    }
    
    // Présence de code
    if (content.includes('```') || content.includes('function') || content.includes('const')) {
      quality += 0.1;
    }
    
    return Math.min(1.0, quality);
  }
  
  /**
   * Gestion du cache
   */
  getCachedResponse(request) {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.config.cacheTtl) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(cacheKey);
    }
    
    this.metrics.cacheMisses++;
    return null;
  }
  
  /**
   * Mise en cache d'une réponse
   */
  cacheResponse(request, response) {
    const cacheKey = this.generateCacheKey(request);
    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
  }
  
  /**
   * Génération d'une clé de cache
   */
  generateCacheKey(request) {
    return `${request.type}_${request.prompt.substring(0, 100)}_${JSON.stringify(request.options)}`;
  }
  
  /**
   * Mise à jour des métriques
   */
  updateMetrics(startTime, success, quality) {
    const responseTime = Date.now() - startTime;
    
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    
    // Mise à jour de la moyenne des temps de réponse
    const totalTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime;
    this.metrics.averageResponseTime = totalTime / this.metrics.totalRequests;
    
    // Mise à jour de la qualité moyenne
    if (success) {
      const totalQuality = this.metrics.averageQuality * (this.metrics.successfulRequests - 1) + quality;
      this.metrics.averageQuality = totalQuality / this.metrics.successfulRequests;
    }
  }
  
  /**
   * Enregistrement d'une requête dans l'historique
   */
  recordRequest(request, response, responseTime) {
    this.requestHistory.push({
      request,
      response,
      responseTime,
      timestamp: Date.now()
    });
    
    // Limitation de l'historique
    if (this.requestHistory.length > this.config.maxMetricsHistory) {
      this.requestHistory = this.requestHistory.slice(-this.config.maxMetricsHistory);
    }
  }
  
  /**
   * Obtention des métriques
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
      successRate: this.metrics.successfulRequests / this.metrics.totalRequests || 0
    };
  }
  
  /**
   * Obtention de l'historique des requêtes
   */
  getRequestHistory(limit = 10) {
    return this.requestHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
  
  /**
   * Nettoyage du cache
   */
  clearCache() {
    this.cache.clear();
    this.logger.info('🧹 Cache Abacus nettoyé');
  }
  
  /**
   * Réinitialisation des métriques
   */
  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      averageQuality: 0,
      totalTokens: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.requestHistory = [];
    this.logger.info('🔄 Métriques Abacus réinitialisées');
  }
  
  /**
   * Fermeture du client
   */
  async close() {
    this.logger.info('🔄 Fermeture du client Abacus LLM...');
    this.emit('closed');
  }
}
