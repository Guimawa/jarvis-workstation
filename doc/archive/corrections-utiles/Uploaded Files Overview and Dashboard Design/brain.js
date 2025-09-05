// ==============================================
// 🧠 JARVIS BRAIN - Intelligence Centrale
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Système d'intelligence centrale avec capacités
// d'apprentissage, de raisonnement et de prise de décision
// ==============================================

import { EventEmitter } from 'events';
import GroqClient from '../utils/groq-client.js';
import MemorySystem from './memory.js';
import LearningSystem from './learning.js';
import Logger from '../utils/logger.js';

/**
 * Classe principale du cerveau de Jarvis
 * Gère l'intelligence centrale, la prise de décision et l'orchestration
 */
export default class JarvisBrain extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      maxConcurrentTasks: 5,
      learningEnabled: true,
      memoryRetention: 30, // jours
      confidenceThreshold: 0.7,
      ...config
    };
    
    // Systèmes internes
    this.groqClient = new GroqClient();
    this.memory = new MemorySystem();
    this.learning = new LearningSystem();
    this.logger = new Logger('JarvisBrain');
    
    // État interne
    this.state = {
      isActive: false,
      currentTasks: new Map(),
      performance: {
        successRate: 0,
        averageResponseTime: 0,
        totalRequests: 0
      },
      mood: 'neutral', // neutral, focused, creative, analytical
      expertise: new Map() // domaine -> niveau d'expertise
    };
    
    this.initialize();
  }
  
  /**
   * Initialisation du cerveau
   */
  async initialize() {
    try {
      this.logger.info('🧠 Initialisation du cerveau Jarvis...');
      
      // Chargement de la mémoire
      await this.memory.initialize();
      
      // Chargement du système d'apprentissage
      await this.learning.initialize();
      
      // Récupération des performances passées
      await this.loadPerformanceMetrics();
      
      // Évaluation de l'expertise actuelle
      await this.evaluateExpertise();
      
      this.state.isActive = true;
      this.logger.info('✅ Cerveau Jarvis initialisé avec succès');
      
      this.emit('initialized');
      
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'initialisation:', error);
      throw error;
    }
  }
  
  /**
   * Traitement principal d'une requête
   */
  async processRequest(request) {
    const startTime = Date.now();
    const taskId = this.generateTaskId();
    
    try {
      this.logger.info(`🎯 Traitement de la requête: ${request.type}`, { taskId });
      
      // Ajout à la liste des tâches courantes
      this.state.currentTasks.set(taskId, {
        request,
        startTime,
        status: 'processing'
      });
      
      // Analyse de la requête
      const analysis = await this.analyzeRequest(request);
      
      // Sélection de la stratégie optimale
      const strategy = await this.selectStrategy(analysis);
      
      // Adaptation du mood en fonction de la tâche
      this.adaptMood(analysis.complexity, analysis.domain);
      
      // Exécution de la stratégie
      const result = await this.executeStrategy(strategy, request, analysis);
      
      // Apprentissage à partir du résultat
      if (this.config.learningEnabled) {
        await this.learning.learnFromExecution(request, result, analysis);
      }
      
      // Mise à jour des métriques
      const responseTime = Date.now() - startTime;
      await this.updatePerformanceMetrics(true, responseTime);
      
      // Nettoyage
      this.state.currentTasks.delete(taskId);
      
      this.logger.info(`✅ Requête traitée avec succès en ${responseTime}ms`, { taskId });
      
      return {
        success: true,
        result,
        metadata: {
          taskId,
          responseTime,
          strategy: strategy.name,
          confidence: result.confidence || 1.0
        }
      };
      
    } catch (error) {
      this.logger.error(`❌ Erreur lors du traitement:`, error, { taskId });
      
      // Mise à jour des métriques d'échec
      const responseTime = Date.now() - startTime;
      await this.updatePerformanceMetrics(false, responseTime);
      
      // Nettoyage
      this.state.currentTasks.delete(taskId);
      
      // Apprentissage à partir de l'échec
      if (this.config.learningEnabled) {
        await this.learning.learnFromFailure(request, error);
      }
      
      return {
        success: false,
        error: error.message,
        metadata: {
          taskId,
          responseTime
        }
      };
    }
  }
  
  /**
   * Analyse approfondie d'une requête
   */
  async analyzeRequest(request) {
    this.logger.debug('🔍 Analyse de la requête en cours...');
    
    // Analyse contextuelle via Groq
    const contextAnalysis = await this.groqClient.analyzeContext(request);
    
    // Recherche dans la mémoire de requêtes similaires
    const similarRequests = await this.memory.findSimilar(request);
    
    // Évaluation de la complexité
    const complexity = this.evaluateComplexity(request, contextAnalysis);
    
    // Identification du domaine
    const domain = this.identifyDomain(request, contextAnalysis);
    
    // Estimation du temps requis
    const estimatedTime = this.estimateExecutionTime(complexity, domain);
    
    return {
      context: contextAnalysis,
      similar: similarRequests,
      complexity,
      domain,
      estimatedTime,
      confidence: contextAnalysis.confidence || 0.8
    };
  }
  
  /**
   * Sélection de la stratégie optimale
   */
  async selectStrategy(analysis) {
    const strategies = [
      {
        name: 'direct_generation',
        condition: analysis.complexity < 0.3,
        executor: this.executeDirectGeneration.bind(this)
      },
      {
        name: 'iterative_refinement',
        condition: analysis.complexity >= 0.3 && analysis.complexity < 0.7,
        executor: this.executeIterativeRefinement.bind(this)
      },
      {
        name: 'collaborative_approach',
        condition: analysis.complexity >= 0.7,
        executor: this.executeCollaborativeApproach.bind(this)
      },
      {
        name: 'memory_based',
        condition: analysis.similar.length > 0,
        executor: this.executeMemoryBased.bind(this)
      }
    ];
    
    // Sélection de la meilleure stratégie
    const applicableStrategies = strategies.filter(s => s.condition);
    
    if (applicableStrategies.length === 0) {
      return strategies[1]; // Stratégie par défaut
    }
    
    // Sélection basée sur l'expertise et l'historique
    const bestStrategy = await this.learning.selectBestStrategy(
      applicableStrategies,
      analysis
    );
    
    return bestStrategy || applicableStrategies[0];
  }
  
  /**
   * Exécution d'une stratégie
   */
  async executeStrategy(strategy, request, analysis) {
    this.logger.info(`⚡ Exécution de la stratégie: ${strategy.name}`);
    
    const result = await strategy.executor(request, analysis);
    
    // Validation du résultat
    const validation = await this.validateResult(result, request);
    
    if (!validation.isValid && validation.canRetry) {
      this.logger.warn('⚠️ Résultat invalide, nouvelle tentative...');
      return await strategy.executor(request, analysis);
    }
    
    return {
      ...result,
      validation,
      strategy: strategy.name
    };
  }
  
  /**
   * Stratégie de génération directe
   */
  async executeDirectGeneration(request, analysis) {
    return await this.groqClient.generateCode(request, {
      context: analysis.context,
      mood: this.state.mood
    });
  }
  
  /**
   * Stratégie de raffinement itératif
   */
  async executeIterativeRefinement(request, analysis) {
    let result = await this.executeDirectGeneration(request, analysis);
    
    // Raffinements successifs
    for (let i = 0; i < 3; i++) {
      const feedback = await this.analyzeResult(result, request);
      if (feedback.quality > this.config.confidenceThreshold) {
        break;
      }
      
      result = await this.groqClient.refineCode(result, feedback, request);
    }
    
    return result;
  }
  
  /**
   * Stratégie collaborative
   */
  async executeCollaborativeApproach(request, analysis) {
    // Décomposition en sous-tâches
    const subtasks = await this.decomposeTask(request, analysis);
    
    // Exécution parallèle des sous-tâches
    const subtaskResults = await Promise.all(
      subtasks.map(subtask => this.processRequest(subtask))
    );
    
    // Assemblage des résultats
    return await this.assembleResults(subtaskResults, request);
  }
  
  /**
   * Stratégie basée sur la mémoire
   */
  async executeMemoryBased(request, analysis) {
    const similarRequest = analysis.similar[0];
    const baseResult = await this.memory.getResult(similarRequest.id);
    
    // Adaptation du résultat existant
    return await this.groqClient.adaptCode(baseResult, request, {
      originalRequest: similarRequest,
      context: analysis.context
    });
  }
  
  /**
   * Adaptation du mood en fonction de la tâche
   */
  adaptMood(complexity, domain) {
    if (complexity > 0.8) {
      this.state.mood = 'analytical';
    } else if (domain === 'ui' || domain === 'design') {
      this.state.mood = 'creative';
    } else if (complexity < 0.3) {
      this.state.mood = 'focused';
    } else {
      this.state.mood = 'neutral';
    }
    
    this.logger.debug(`🎭 Mood adapté: ${this.state.mood}`);
  }
  
  /**
   * Évaluation de la complexité
   */
  evaluateComplexity(request, contextAnalysis) {
    let complexity = 0;
    
    // Facteurs de complexité
    if (request.dependencies?.length > 5) complexity += 0.2;
    if (request.features?.length > 3) complexity += 0.3;
    if (contextAnalysis.technicalDepth > 0.7) complexity += 0.3;
    if (request.customRequirements?.length > 0) complexity += 0.2;
    
    return Math.min(complexity, 1.0);
  }
  
  /**
   * Identification du domaine
   */
  identifyDomain(request, contextAnalysis) {
    const keywords = request.description?.toLowerCase() || '';
    
    if (keywords.includes('component') || keywords.includes('ui')) return 'ui';
    if (keywords.includes('api') || keywords.includes('backend')) return 'backend';
    if (keywords.includes('test') || keywords.includes('testing')) return 'testing';
    if (keywords.includes('hook') || keywords.includes('state')) return 'logic';
    
    return contextAnalysis.domain || 'general';
  }
  
  /**
   * Estimation du temps d'exécution
   */
  estimateExecutionTime(complexity, domain) {
    const baseTime = 2000; // 2 secondes de base
    const complexityMultiplier = 1 + (complexity * 3);
    
    const domainMultipliers = {
      'ui': 1.2,
      'backend': 1.5,
      'testing': 1.1,
      'logic': 1.3,
      'general': 1.0
    };
    
    return baseTime * complexityMultiplier * (domainMultipliers[domain] || 1.0);
  }
  
  /**
   * Validation du résultat
   */
  async validateResult(result, request) {
    // Validation syntaxique
    const syntaxValid = await this.validateSyntax(result);
    
    // Validation sémantique
    const semanticValid = await this.validateSemantics(result, request);
    
    // Validation des bonnes pratiques
    const practicesValid = await this.validateBestPractices(result);
    
    const isValid = syntaxValid && semanticValid && practicesValid;
    
    return {
      isValid,
      canRetry: !syntaxValid || !semanticValid,
      details: {
        syntax: syntaxValid,
        semantic: semanticValid,
        practices: practicesValid
      }
    };
  }
  
  /**
   * Validation syntaxique
   */
  async validateSyntax(result) {
    // Implémentation de validation syntaxique
    return true; // Simplifié pour l'exemple
  }
  
  /**
   * Validation sémantique
   */
  async validateSemantics(result, request) {
    // Implémentation de validation sémantique
    return true; // Simplifié pour l'exemple
  }
  
  /**
   * Validation des bonnes pratiques
   */
  async validateBestPractices(result) {
    // Implémentation de validation des bonnes pratiques
    return true; // Simplifié pour l'exemple
  }
  
  /**
   * Génération d'un ID de tâche unique
   */
  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Chargement des métriques de performance
   */
  async loadPerformanceMetrics() {
    const metrics = await this.memory.getPerformanceMetrics();
    if (metrics) {
      this.state.performance = { ...this.state.performance, ...metrics };
    }
  }
  
  /**
   * Mise à jour des métriques de performance
   */
  async updatePerformanceMetrics(success, responseTime) {
    const perf = this.state.performance;
    
    perf.totalRequests++;
    
    if (success) {
      perf.successRate = ((perf.successRate * (perf.totalRequests - 1)) + 1) / perf.totalRequests;
    } else {
      perf.successRate = (perf.successRate * (perf.totalRequests - 1)) / perf.totalRequests;
    }
    
    perf.averageResponseTime = ((perf.averageResponseTime * (perf.totalRequests - 1)) + responseTime) / perf.totalRequests;
    
    // Sauvegarde périodique
    if (perf.totalRequests % 10 === 0) {
      await this.memory.savePerformanceMetrics(perf);
    }
  }
  
  /**
   * Évaluation de l'expertise
   */
  async evaluateExpertise() {
    const domains = ['ui', 'backend', 'testing', 'logic', 'general'];
    
    for (const domain of domains) {
      const experience = await this.memory.getDomainExperience(domain);
      const level = this.calculateExpertiseLevel(experience);
      this.state.expertise.set(domain, level);
    }
  }
  
  /**
   * Calcul du niveau d'expertise
   */
  calculateExpertiseLevel(experience) {
    const { successfulTasks = 0, totalTasks = 0, averageQuality = 0 } = experience;
    
    if (totalTasks === 0) return 0;
    
    const successRate = successfulTasks / totalTasks;
    return (successRate * 0.6) + (averageQuality * 0.4);
  }
  
  /**
   * Obtention du statut actuel
   */
  getStatus() {
    return {
      isActive: this.state.isActive,
      currentTasks: this.state.currentTasks.size,
      performance: this.state.performance,
      mood: this.state.mood,
      expertise: Object.fromEntries(this.state.expertise),
      uptime: Date.now() - (this.startTime || Date.now())
    };
  }
  
  /**
   * Arrêt propre du cerveau
   */
  async shutdown() {
    this.logger.info('🔄 Arrêt du cerveau Jarvis...');
    
    // Attendre la fin des tâches en cours
    while (this.state.currentTasks.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Sauvegarde finale
    await this.memory.savePerformanceMetrics(this.state.performance);
    await this.learning.saveState();
    
    this.state.isActive = false;
    this.logger.info('✅ Cerveau Jarvis arrêté proprement');
    
    this.emit('shutdown');
  }
}

