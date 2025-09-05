// ==============================================
// 🧠 MEMORY SYSTEM - Système de Mémoire Ultra Instinct
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Système de mémoire persistante pour Jarvis
// avec indexation, recherche et optimisation automatique
// ==============================================

import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';

/**
 * Système de mémoire persistante pour Jarvis Ultra Instinct
 */
class MemorySystem extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      dataPath: './data/memory',
      maxEntries: 10000,
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 jours
      compression: true,
      encryption: false,
      autoSave: true,
      saveInterval: 5 * 60 * 1000, // 5 minutes
      ...config
    };
    
    this.logger = new Logger('MemorySystem');
    
    // Structure de la mémoire
    this.memory = {
      generations: new Map(), // Générations de code
      contexts: new Map(), // Contextes de projet
      patterns: new Map(), // Patterns identifiés
      performance: new Map(), // Métriques de performance
      feedback: new Map(), // Retours utilisateur
      metadata: new Map() // Métadonnées diverses
    };
    
    // Index pour la recherche rapide
    this.indexes = {
      byType: new Map(),
      byTimestamp: new Map(),
      byTags: new Map(),
      byContext: new Map()
    };
    
    // État interne
    this.state = {
      isInitialized: false,
      lastSave: null,
      totalEntries: 0,
      memoryUsage: 0
    };
    
    this.isInitialized = false;
  }

  /**
   * Initialisation du système de mémoire
   */
  async initialize() {
    try {
      this.logger.info('🧠 Initialisation du système de mémoire...');
      
      // Création du répertoire de données
      await this.ensureDataDirectory();
      
      // Chargement des données existantes
      await this.loadMemoryData();
      
      // Reconstruction des index
      await this.rebuildIndexes();
      
      // Nettoyage automatique
      await this.cleanup();
      
      // Démarrage de la sauvegarde automatique
      if (this.config.autoSave) {
        this.startAutoSave();
      }
      
      this.state.isInitialized = true;
      this.isInitialized = true;
      
      this.logger.info('✅ Système de mémoire initialisé', {
        entries: this.state.totalEntries,
        memoryUsage: this.state.memoryUsage
      });
      
      this.emit('initialized');
      
    } catch (error) {
      this.logger.error('❌ Erreur initialisation mémoire:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde la mémoire
   */
  async saveMemory() {
    try {
      await fs.writeFile(this.memoryFile, JSON.stringify(this.memory, null, 2));
    } catch (error) {
      console.warn("Impossible de sauvegarder la mémoire:", error.message);
    }
  }

  /**
   * Enregistre une génération
   */
  async recordGeneration(generationData) {
    const generation = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...generationData,
    };

    this.memory.generations.push(generation);
    this.memory.stats.totalGenerations++;

    if (generationData.success !== false) {
      this.memory.stats.successfulGenerations++;
    } else {
      this.memory.stats.failedGenerations++;
    }

    await this.saveMemory();
    return generation;
  }

  /**
   * Enregistre une conversation
   */
  async recordConversation(userMessage, assistantResponse, metadata = {}) {
    const conversation = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      user: userMessage,
      assistant: assistantResponse,
      metadata,
    };

    this.memory.conversations.push(conversation);

    // Garder seulement les 100 dernières conversations
    if (this.memory.conversations.length > 100) {
      this.memory.conversations = this.memory.conversations.slice(-50);
    }

    await this.saveMemory();
    return conversation;
  }

  /**
   * Met à jour les préférences
   */
  async updatePreferences(preferences) {
    this.memory.preferences = {
      ...this.memory.preferences,
      ...preferences,
    };
    await this.saveMemory();
  }

  /**
   * Met à jour le contexte
   */
  async updateContext(context) {
    this.memory.context = {
      ...this.memory.context,
      ...context,
    };
    await this.saveMemory();
  }

  /**
   * Récupère l'historique des générations
   */
  getGenerationHistory(limit = 10) {
    return this.memory.generations.slice(-limit);
  }

  /**
   * Récupère l'historique des conversations
   */
  getConversationHistory(limit = 10) {
    return this.memory.conversations.slice(-limit);
  }

  /**
   * Récupère les statistiques
   */
  getStats() {
    return this.memory.stats;
  }

  /**
   * Récupère les préférences
   */
  getPreferences() {
    return this.memory.preferences;
  }

  /**
   * Récupère le contexte
   */
  getContext() {
    return this.memory.context;
  }

  /**
   * Met à jour les statistiques
   */
  async updateStats(stats) {
    this.memory.stats = {
      ...this.memory.stats,
      ...stats,
    };
    await this.saveMemory();
  }

  /**
   * Recherche dans la mémoire
   */
  searchMemory(query, type = "all") {
    const results = [];

    if (type === "all" || type === "conversations") {
      this.memory.conversations.forEach((conv) => {
        if (
          conv.user.toLowerCase().includes(query.toLowerCase()) ||
          conv.assistant.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({ type: "conversation", ...conv });
        }
      });
    }

    if (type === "all" || type === "generations") {
      this.memory.generations.forEach((gen) => {
        if (
          gen.name?.toLowerCase().includes(query.toLowerCase()) ||
          gen.type?.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({ type: "generation", ...gen });
        }
      });
    }

    return results.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
  }

  /**
   * Nettoie la mémoire
   */
  async cleanupMemory() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Nettoyer les conversations anciennes
    this.memory.conversations = this.memory.conversations.filter(
      (conv) => new Date(conv.timestamp) > thirtyDaysAgo,
    );

    // Nettoyer les générations anciennes
    this.memory.generations = this.memory.generations.filter(
      (gen) => new Date(gen.timestamp) > thirtyDaysAgo,
    );

    await this.saveMemory();
  }

  /**
   * Exporte la mémoire
   */
  async exportMemory() {
    const exportData = {
      ...this.memory,
      exportedAt: new Date().toISOString(),
      version: "2.0.0",
    };

    const fileName = `jarvis-memory-export-${Date.now()}.json`;
    await fs.writeFile(fileName, JSON.stringify(exportData, null, 2));

    return fileName;
  }

  /**
   * Importe la mémoire
   */
  async importMemory(filePath) {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const importedMemory = JSON.parse(data);

      this.memory = {
        ...this.memory,
        ...importedMemory,
      };

      await this.saveMemory();
      return true;
    } catch (error) {
      throw new Error(`Erreur import mémoire: ${error.message}`);
    }
  }

  /**
   * Génère un ID unique
   */
  generateId() {
    return createHash("md5")
      .update(Date.now().toString() + Math.random().toString())
      .digest("hex")
      .substring(0, 12);
  }

  /**
   * Enrichit l'analyse avec les générations passées
   */
  async enrichWithPastGenerations(analysis) {
    try {
      const similarGenerations = this.searchMemory(
        analysis.type || "component",
        "generations",
      );
      if (similarGenerations.length > 0) {
        analysis.similar = similarGenerations.slice(0, 3);
        analysis.confidence = Math.min(0.9, analysis.confidence + 0.1);
      }
      return analysis;
    } catch (error) {
      console.warn("Erreur enrichissement mémoire:", error.message);
      return analysis;
    }
  }

  /**
   * Vérifie si une dépendance est installée
   */
  async checkDependency(dependency) {
    try {
      const packageJson = await fs.readFile("./package.json", "utf8");
      const pkg = JSON.parse(packageJson);
      return !!(
        pkg.dependencies?.[dependency] || pkg.devDependencies?.[dependency]
      );
    } catch {
      return false;
    }
  }

  /**
   * Récupère l'état du projet
   */
  async getProjectState(projectType, techStack) {
    return {
      type: projectType,
      stack: techStack,
      components: [],
      dependencies: {},
      structure: {},
    };
  }

  /**
   * Cache une valeur
   */
  setCache(key, value, ttl = 300000) {
    // 5 minutes par défaut
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  /**
   * Récupère une valeur du cache
   */
  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Nettoie le cache expiré
   */
  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key);
      }
    }
  }
}

// Fonctions utilitaires pour l'API
const memoryStore = [];

export function saveToMemory({ prompt, code, title }) {
  const date = new Date().toISOString();
  memoryStore.unshift({ prompt, code, title, date });
}

export function getMemoryHistory() {
  return memoryStore;
}

export default MemorySystem;
