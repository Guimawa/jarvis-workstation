// ==============================================
// 🤖 GROQ CLIENT - Client API Groq
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Client intelligent pour l'API Groq avec
// gestion d'erreurs, retry, cache et optimisations
// ==============================================

import fetch from 'node-fetch';
import Logger from './logger.js';

/**
 * Client intelligent pour l'API Groq
 */
export default class GroqClient {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.GROQ_API_KEY,
      baseURL: process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1',
      model: process.env.GROQ_MODEL || 'llama3-8b-8192',
      timeout: parseInt(process.env.GROQ_TIMEOUT) || 30000,
      maxRetries: parseInt(process.env.GROQ_MAX_RETRIES) || 3,
      retryDelay: 1000,
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
      ...config
    };
    
    this.logger = new Logger('GroqClient');
    
    // Validation de la configuration
    if (!this.config.apiKey) {
      throw new Error('Clé API Groq manquante. Configurez GROQ_API_KEY dans votre environnement.');
    }
    
    // Cache des réponses
    this.cache = new Map();
    this.cacheMaxSize = 100;
    this.cacheTTL = 60 * 60 * 1000; // 1 heure
    
    // Statistiques
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      averageResponseTime: 0,
      totalTokensUsed: 0
    };
  }
  
  /**
   * Génération de code principal
   */
  async generateCode(request, options = {}) {
    const startTime = Date.now();
    
    try {
      this.logger.debug('🤖 Génération de code demandée', { 
        type: request.type,
        model: this.config.model 
      });
      
      // Construction du prompt optimisé
      const prompt = this.buildPrompt(request, options);
      
      // Vérification du cache
      const cacheKey = this.getCacheKey(prompt, options);
      const cachedResponse = this.getFromCache(cacheKey);
      
      if (cachedResponse) {
        this.stats.cacheHits++;
        this.logger.debug('📦 Réponse trouvée dans le cache');
        return cachedResponse;
      }
      
      // Appel à l'API Groq
      const response = await this.callGroqAPI(prompt, options);
      
      // Mise en cache
      this.setCache(cacheKey, response);
      
      // Mise à jour des statistiques
      const responseTime = Date.now() - startTime;
      this.updateStats(true, responseTime, response.usage?.total_tokens || 0);
      
      this.logger.debug('✅ Code généré avec succès', {
        responseTime,
        tokens: response.usage?.total_tokens
      });
      
      return this.processResponse(response, request);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateStats(false, responseTime, 0);
      
      this.logger.error('❌ Erreur génération code:', error);
      throw error;
    }
  }
  
  /**
   * Analyse contextuelle
   */
  async analyzeContext(request) {
    const prompt = `
Analyse ce contexte de développement et fournis des insights:

Requête: ${JSON.stringify(request, null, 2)}

Analyse et retourne:
- Complexité technique (0-1)
- Domaine principal
- Technologies recommandées
- Patterns applicables
- Niveau de confiance
- Recommandations

Format de réponse: JSON structuré
`;
    
    const response = await this.callGroqAPI(prompt, {
      temperature: 0.3, // Plus déterministe pour l'analyse
      maxTokens: 1024
    });
    
    return this.parseJSONResponse(response.choices[0].message.content);
  }
  
  /**
   * Explication de concepts
   */
  async explainConcept(question) {
    const prompt = `
Tu es Jarvis, un expert en développement. Explique ce concept de manière claire et pédagogique:

Question: ${question}

Fournis:
1. Explication simple et claire
2. Exemples pratiques
3. Cas d'usage courants
4. Bonnes pratiques
5. Ressources pour approfondir

Réponds en français de manière structurée et accessible.
`;
    
    const response = await this.callGroqAPI(prompt, {
      temperature: 0.8, // Plus créatif pour les explications
      maxTokens: 2048
    });
    
    return response.choices[0].message.content;
  }
  
  /**
   * Raffinement de code
   */
  async refineCode(code, feedback, originalRequest) {
    const prompt = `
Améliore ce code en tenant compte des retours:

Code original:
${code}

Retours/Feedback:
${JSON.stringify(feedback, null, 2)}

Requête originale:
${JSON.stringify(originalRequest, null, 2)}

Génère une version améliorée qui:
- Corrige les problèmes identifiés
- Améliore la qualité et les performances
- Respecte les bonnes pratiques
- Maintient la fonctionnalité originale

Retourne uniquement le code amélioré.
`;
    
    const response = await this.callGroqAPI(prompt, {
      temperature: 0.5,
      maxTokens: 3072
    });
    
    return response.choices[0].message.content;
  }
  
  /**
   * Adaptation de code existant
   */
  async adaptCode(baseCode, newRequest, context) {
    const prompt = `
Adapte ce code existant pour une nouvelle utilisation:

Code de base:
${baseCode}

Nouvelle requête:
${JSON.stringify(newRequest, null, 2)}

Contexte:
${JSON.stringify(context, null, 2)}

Adapte le code en:
- Conservant la structure et les patterns qui fonctionnent
- Modifiant les parties nécessaires pour la nouvelle utilisation
- Ajoutant les nouvelles fonctionnalités requises
- Maintenant la cohérence et la qualité

Retourne le code adapté.
`;
    
    const response = await this.callGroqAPI(prompt, {
      temperature: 0.6,
      maxTokens: 3072
    });
    
    return response.choices[0].message.content;
  }
  
  /**
   * Construction du prompt optimisé
   */
  buildPrompt(request, options = {}) {
    const { mood = 'neutral', context = {} } = options;
    
    let prompt = `Tu es Jarvis Ultra Instinct, un assistant de développement expert avec une intelligence artificielle avancée.\n\n`;
    
    // Adaptation du mood
    switch (mood) {
      case 'creative':
        prompt += `Mode créatif activé: Sois innovant et propose des solutions originales.\n`;
        break;
      case 'analytical':
        prompt += `Mode analytique activé: Focus sur la précision et l'optimisation.\n`;
        break;
      case 'focused':
        prompt += `Mode focus activé: Génère rapidement et efficacement.\n`;
        break;
    }
    
    // Contexte du projet
    if (context.framework) {
      prompt += `Framework: ${context.framework}\n`;
    }
    if (context.typescript) {
      prompt += `TypeScript: Activé\n`;
    }
    if (context.designSystem) {
      prompt += `Design System: ${context.designSystem}\n`;
    }
    
    // Requête spécifique
    prompt += `\nTâche: ${this.getTaskDescription(request)}\n`;
    
    // Instructions spécifiques par type
    prompt += this.getTypeSpecificInstructions(request);
    
    // Instructions générales
    prompt += `\nInstructions générales:
- Génère du code de haute qualité, propre et bien structuré
- Respecte les bonnes pratiques et conventions
- Inclus des commentaires explicatifs
- Assure-toi que le code est fonctionnel et testé
- Utilise les patterns modernes appropriés
- Optimise pour la performance et la maintenabilité

Réponds uniquement avec le code demandé, sans explications supplémentaires.`;
    
    return prompt;
  }
  
  /**
   * Description de la tâche selon le type
   */
  getTaskDescription(request) {
    switch (request.type) {
      case 'component':
        return `Génère un composant React nommé "${request.name}"`;
      case 'hook':
        return `Génère un hook React personnalisé "${request.name}"`;
      case 'api-route':
        return `Génère une route API pour "${request.name}"`;
      case 'database-schema':
        return `Génère un schéma de base de données pour "${request.name}"`;
      case 'test':
        return `Génère des tests pour "${request.name}"`;
      default:
        return `Génère du code pour "${request.name}" de type "${request.type}"`;
    }
  }
  
  /**
   * Instructions spécifiques par type
   */
  getTypeSpecificInstructions(request) {
    switch (request.type) {
      case 'component':
        return `\nPour ce composant React:
- Utilise les hooks modernes (useState, useEffect, etc.)
- Implémente PropTypes ou TypeScript selon le contexte
- Assure-toi que le composant est réutilisable
- Inclus la gestion d'état si nécessaire
- Respecte les patterns de composition React`;
        
      case 'hook':
        return `\nPour ce hook personnalisé:
- Commence par "use" (convention React)
- Retourne un objet ou un tableau selon l'usage
- Gère les effets de bord appropriés
- Inclus la logique de nettoyage si nécessaire
- Documente les paramètres et valeurs de retour`;
        
      case 'api-route':
        return `\nPour cette route API:
- Implémente les méthodes HTTP appropriées
- Inclus la validation des données
- Gère les erreurs proprement
- Retourne des réponses JSON structurées
- Inclus l'authentification si nécessaire`;
        
      default:
        return '';
    }
  }
  
  /**
   * Appel à l'API Groq avec retry
   */
  async callGroqAPI(prompt, options = {}) {
    const requestOptions = {
      model: this.config.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || this.config.temperature,
      max_tokens: options.maxTokens || this.config.maxTokens,
      top_p: options.topP || this.config.topP,
      ...options
    };
    
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        this.stats.totalRequests++;
        
        const response = await fetch(`${this.config.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestOptions),
          timeout: this.config.timeout
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
          throw new Error('Réponse API invalide: aucun choix retourné');
        }
        
        return data;
        
      } catch (error) {
        lastError = error;
        
        this.logger.warn(`Tentative ${attempt}/${this.config.maxRetries} échouée:`, error.message);
        
        if (attempt < this.config.maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1); // Backoff exponentiel
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`Échec après ${this.config.maxRetries} tentatives: ${lastError.message}`);
  }
  
  /**
   * Traitement de la réponse
   */
  processResponse(response, request) {
    const content = response.choices[0].message.content;
    
    return {
      code: content,
      usage: response.usage,
      model: response.model,
      metadata: {
        type: request.type,
        name: request.name,
        timestamp: Date.now()
      }
    };
  }
  
  /**
   * Parsing de réponse JSON
   */
  parseJSONResponse(content) {
    try {
      // Extraction du JSON si entouré de markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) ||
                       [null, content];
      
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      this.logger.warn('Impossible de parser la réponse JSON:', content);
      return { error: 'Format de réponse invalide', content };
    }
  }
  
  /**
   * Gestion du cache
   */
  getCacheKey(prompt, options) {
    const key = JSON.stringify({ prompt, options });
    return Buffer.from(key).toString('base64').slice(0, 32);
  }
  
  getFromCache(key) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }
  
  setCache(key, data) {
    // Limitation de la taille du cache
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Mise à jour des statistiques
   */
  updateStats(success, responseTime, tokens) {
    if (success) {
      this.stats.successfulRequests++;
    } else {
      this.stats.failedRequests++;
    }
    
    this.stats.totalTokensUsed += tokens;
    
    // Calcul de la moyenne mobile du temps de réponse
    const totalRequests = this.stats.successfulRequests + this.stats.failedRequests;
    this.stats.averageResponseTime = 
      ((this.stats.averageResponseTime * (totalRequests - 1)) + responseTime) / totalRequests;
  }
  
  /**
   * Obtention des statistiques
   */
  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.totalRequests > 0 
        ? this.stats.successfulRequests / this.stats.totalRequests 
        : 0,
      cacheHitRate: this.stats.totalRequests > 0
        ? this.stats.cacheHits / this.stats.totalRequests
        : 0,
      cacheSize: this.cache.size
    };
  }
  
  /**
   * Nettoyage du cache
   */
  clearCache() {
    this.cache.clear();
    this.logger.info('🧹 Cache Groq nettoyé');
  }
  
  /**
   * Configuration à chaud
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('⚙️ Configuration Groq mise à jour', newConfig);
  }
  
  /**
   * Utilitaire de pause
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Test de connectivité
   */
  async testConnection() {
    try {
      const response = await this.callGroqAPI('Test de connectivité', {
        maxTokens: 10,
        temperature: 0
      });
      
      return {
        success: true,
        model: response.model,
        usage: response.usage
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

