// ==============================================
// 🧠 MEMORY SYSTEM - Système de Mémoire
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
 * Système de mémoire persistante pour Jarvis
 */
export default class MemorySystem extends EventEmitter {
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
   * Enregistrement d'une génération
   */
  async recordGeneration(generation) {
    const id = this.generateId();
    const timestamp = Date.now();
    
    const entry = {
      id,
      timestamp,
      type: 'generation',
      data: generation,
      tags: this.extractTags(generation),
      context: generation.context || {},
      ttl: timestamp + this.config.ttl
    };
    
    this.memory.generations.set(id, entry);
    this.updateIndexes(entry);
    this.state.totalEntries++;
    
    this.logger.debug('Génération enregistrée', { id, type: generation.type });
    this.emit('entryAdded', { type: 'generation', entry });
    
    return id;
  }
  
  /**
   * Enregistrement d'un contexte de projet
   */
  async recordContext(context) {
    const id = this.generateId();
    const timestamp = Date.now();
    
    const entry = {
      id,
      timestamp,
      type: 'context',
      data: context,
      tags: this.extractTags(context),
      ttl: timestamp + this.config.ttl
    };
    
    this.memory.contexts.set(id, entry);
    this.updateIndexes(entry);
    this.state.totalEntries++;
    
    this.logger.debug('Contexte enregistré', { id, framework: context.framework });
    this.emit('entryAdded', { type: 'context', entry });
    
    return id;
  }
  
  /**
   * Enregistrement d'un pattern
   */
  async recordPattern(pattern) {
    const id = this.generateId();
    const timestamp = Date.now();
    
    const entry = {
      id,
      timestamp,
      type: 'pattern',
      data: pattern,
      tags: this.extractTags(pattern),
      ttl: timestamp + this.config.ttl
    };
    
    this.memory.patterns.set(id, entry);
    this.updateIndexes(entry);
    this.state.totalEntries++;
    
    this.logger.debug('Pattern enregistré', { id, category: pattern.category });
    this.emit('entryAdded', { type: 'pattern', entry });
    
    return id;
  }
  
  /**
   * Enregistrement de métriques de performance
   */
  async recordPerformance(metrics) {
    const id = this.generateId();
    const timestamp = Date.now();
    
    const entry = {
      id,
      timestamp,
      type: 'performance',
      data: metrics,
      tags: ['performance', 'metrics'],
      ttl: timestamp + this.config.ttl
    };
    
    this.memory.performance.set(id, entry);
    this.updateIndexes(entry);
    this.state.totalEntries++;
    
    this.emit('entryAdded', { type: 'performance', entry });
    
    return id;
  }
  
  /**
   * Recherche dans la mémoire
   */
  async search(query, options = {}) {
    const {
      type = null,
      tags = [],
      limit = 10,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = options;
    
    let results = [];
    
    // Recherche par type
    if (type) {
      const typeEntries = this.indexes.byType.get(type) || [];
      results = typeEntries.map(id => this.getEntryById(id)).filter(Boolean);
    } else {
      // Recherche dans toutes les entrées
      results = this.getAllEntries();
    }
    
    // Filtrage par tags
    if (tags.length > 0) {
      results = results.filter(entry => 
        tags.some(tag => entry.tags.includes(tag))
      );
    }
    
    // Recherche textuelle
    if (query) {
      results = results.filter(entry => 
        this.matchesQuery(entry, query)
      );
    }
    
    // Tri
    results.sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    // Limitation
    return results.slice(0, limit);
  }
  
  /**
   * Recherche de générations similaires
   */
  async findSimilar(request, limit = 5) {
    const generations = Array.from(this.memory.generations.values());
    
    const similarities = generations.map(entry => ({
      entry,
      similarity: this.calculateSimilarity(request, entry.data)
    }));
    
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    return similarities
      .slice(0, limit)
      .filter(item => item.similarity > 0.3)
      .map(item => item.entry);
  }
  
  /**
   * Obtention d'une entrée par ID
   */
  getEntryById(id) {
    for (const [, memoryMap] of Object.entries(this.memory)) {
      if (memoryMap instanceof Map && memoryMap.has(id)) {
        return memoryMap.get(id);
      }
    }
    return null;
  }
  
  /**
   * Obtention de toutes les entrées
   */
  getAllEntries() {
    const entries = [];
    
    for (const [, memoryMap] of Object.entries(this.memory)) {
      if (memoryMap instanceof Map) {
        entries.push(...Array.from(memoryMap.values()));
      }
    }
    
    return entries;
  }
  
  /**
   * Obtention des statistiques de performance
   */
  async getPerformanceMetrics() {
    const performanceEntries = Array.from(this.memory.performance.values());
    
    if (performanceEntries.length === 0) {
      return null;
    }
    
    // Calcul des métriques agrégées
    const latest = performanceEntries
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    return latest.data;
  }
  
  /**
   * Sauvegarde des métriques de performance
   */
  async savePerformanceMetrics(metrics) {
    return await this.recordPerformance(metrics);
  }
  
  /**
   * Obtention de l'expérience dans un domaine
   */
  async getDomainExperience(domain) {
    const generations = Array.from(this.memory.generations.values())
      .filter(entry => 
        entry.data.domain === domain || 
        entry.tags.includes(domain)
      );
    
    const totalTasks = generations.length;
    const successfulTasks = generations.filter(entry => 
      entry.data.success !== false
    ).length;
    
    const qualityScores = generations
      .map(entry => entry.data.quality || 0.8)
      .filter(score => score > 0);
    
    const averageQuality = qualityScores.length > 0 
      ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
      : 0;
    
    return {
      totalTasks,
      successfulTasks,
      averageQuality,
      lastActivity: totalTasks > 0 ? Math.max(...generations.map(g => g.timestamp)) : 0
    };
  }
  
  /**
   * Obtention des statistiques générales
   */
  async getStats() {
    return {
      totalEntries: this.state.totalEntries,
      memoryUsage: this.state.memoryUsage,
      lastSave: this.state.lastSave,
      breakdown: {
        generations: this.memory.generations.size,
        contexts: this.memory.contexts.size,
        patterns: this.memory.patterns.size,
        performance: this.memory.performance.size,
        feedback: this.memory.feedback.size
      },
      indexes: {
        byType: this.indexes.byType.size,
        byTimestamp: this.indexes.byTimestamp.size,
        byTags: this.indexes.byTags.size,
        byContext: this.indexes.byContext.size
      }
    };
  }
  
  /**
   * Nettoyage automatique des entrées expirées
   */
  async cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [type, memoryMap] of Object.entries(this.memory)) {
      if (!(memoryMap instanceof Map)) continue;
      
      const expiredIds = [];
      
      for (const [id, entry] of memoryMap.entries()) {
        if (entry.ttl && entry.ttl < now) {
          expiredIds.push(id);
        }
      }
      
      for (const id of expiredIds) {
        memoryMap.delete(id);
        this.removeFromIndexes(id);
        cleanedCount++;
      }
    }
    
    this.state.totalEntries -= cleanedCount;
    
    if (cleanedCount > 0) {
      this.logger.info(`🧹 Nettoyage terminé: ${cleanedCount} entrées supprimées`);
      this.emit('cleaned', { count: cleanedCount });
    }
    
    return cleanedCount;
  }
  
  /**
   * Sauvegarde des données
   */
  async save() {
    try {
      this.logger.debug('💾 Sauvegarde de la mémoire...');
      
      const data = {
        memory: this.serializeMemory(),
        indexes: this.serializeIndexes(),
        state: this.state,
        timestamp: Date.now()
      };
      
      const filePath = path.join(this.config.dataPath, 'memory.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      
      this.state.lastSave = Date.now();
      
      this.logger.debug('✅ Mémoire sauvegardée');
      this.emit('saved');
      
    } catch (error) {
      this.logger.error('❌ Erreur sauvegarde mémoire:', error);
      throw error;
    }
  }
  
  /**
   * Chargement des données
   */
  async loadMemoryData() {
    try {
      const filePath = path.join(this.config.dataPath, 'memory.json');
      const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
      
      this.deserializeMemory(data.memory);
      this.deserializeIndexes(data.indexes);
      this.state = { ...this.state, ...data.state };
      
      this.logger.info('📥 Données de mémoire chargées', {
        entries: this.state.totalEntries
      });
      
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error('❌ Erreur chargement mémoire:', error);
      }
      // Fichier n'existe pas, démarrage à zéro
    }
  }
  
  /**
   * Sérialisation de la mémoire
   */
  serializeMemory() {
    const serialized = {};
    
    for (const [type, memoryMap] of Object.entries(this.memory)) {
      if (memoryMap instanceof Map) {
        serialized[type] = Array.from(memoryMap.entries());
      }
    }
    
    return serialized;
  }
  
  /**
   * Désérialisation de la mémoire
   */
  deserializeMemory(data) {
    for (const [type, entries] of Object.entries(data || {})) {
      if (this.memory[type] instanceof Map) {
        this.memory[type] = new Map(entries);
      }
    }
  }
  
  /**
   * Sérialisation des index
   */
  serializeIndexes() {
    const serialized = {};
    
    for (const [indexName, indexMap] of Object.entries(this.indexes)) {
      serialized[indexName] = Array.from(indexMap.entries());
    }
    
    return serialized;
  }
  
  /**
   * Désérialisation des index
   */
  deserializeIndexes(data) {
    for (const [indexName, entries] of Object.entries(data || {})) {
      if (this.indexes[indexName] instanceof Map) {
        this.indexes[indexName] = new Map(entries);
      }
    }
  }
  
  /**
   * Reconstruction des index
   */
  async rebuildIndexes() {
    // Réinitialisation des index
    for (const indexMap of Object.values(this.indexes)) {
      indexMap.clear();
    }
    
    // Reconstruction à partir des données
    const allEntries = this.getAllEntries();
    
    for (const entry of allEntries) {
      this.updateIndexes(entry);
    }
    
    this.logger.debug('🔄 Index reconstruits', {
      entries: allEntries.length
    });
  }
  
  /**
   * Mise à jour des index
   */
  updateIndexes(entry) {
    const { id, type, timestamp, tags, context } = entry;
    
    // Index par type
    if (!this.indexes.byType.has(type)) {
      this.indexes.byType.set(type, []);
    }
    this.indexes.byType.get(type).push(id);
    
    // Index par timestamp (par heure)
    const hour = Math.floor(timestamp / (60 * 60 * 1000));
    if (!this.indexes.byTimestamp.has(hour)) {
      this.indexes.byTimestamp.set(hour, []);
    }
    this.indexes.byTimestamp.get(hour).push(id);
    
    // Index par tags
    for (const tag of tags || []) {
      if (!this.indexes.byTags.has(tag)) {
        this.indexes.byTags.set(tag, []);
      }
      this.indexes.byTags.get(tag).push(id);
    }
    
    // Index par contexte
    if (context && context.framework) {
      if (!this.indexes.byContext.has(context.framework)) {
        this.indexes.byContext.set(context.framework, []);
      }
      this.indexes.byContext.get(context.framework).push(id);
    }
  }
  
  /**
   * Suppression des index
   */
  removeFromIndexes(id) {
    for (const indexMap of Object.values(this.indexes)) {
      for (const [key, ids] of indexMap.entries()) {
        const index = ids.indexOf(id);
        if (index > -1) {
          ids.splice(index, 1);
          if (ids.length === 0) {
            indexMap.delete(key);
          }
        }
      }
    }
  }
  
  /**
   * Démarrage de la sauvegarde automatique
   */
  startAutoSave() {
    setInterval(async () => {
      try {
        await this.save();
      } catch (error) {
        this.logger.error('❌ Erreur sauvegarde automatique:', error);
      }
    }, this.config.saveInterval);
  }
  
  /**
   * Génération d'un ID unique
   */
  generateId() {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Extraction des tags d'une entrée
   */
  extractTags(data) {
    const tags = [];
    
    if (data.type) tags.push(data.type);
    if (data.framework) tags.push(data.framework);
    if (data.category) tags.push(data.category);
    if (data.domain) tags.push(data.domain);
    if (data.language) tags.push(data.language);
    
    // Tags personnalisés
    if (data.tags && Array.isArray(data.tags)) {
      tags.push(...data.tags);
    }
    
    return [...new Set(tags)]; // Suppression des doublons
  }
  
  /**
   * Vérification de correspondance avec une requête
   */
  matchesQuery(entry, query) {
    const searchText = JSON.stringify(entry).toLowerCase();
    const queryLower = query.toLowerCase();
    
    return searchText.includes(queryLower);
  }
  
  /**
   * Calcul de similarité entre deux éléments
   */
  calculateSimilarity(request, generation) {
    let similarity = 0;
    
    // Similarité du type
    if (request.type === generation.type) {
      similarity += 0.3;
    }
    
    // Similarité du nom/description
    if (request.name && generation.name) {
      const nameDistance = this.levenshteinDistance(
        request.name.toLowerCase(),
        generation.name.toLowerCase()
      );
      const maxLength = Math.max(request.name.length, generation.name.length);
      similarity += (1 - nameDistance / maxLength) * 0.2;
    }
    
    // Similarité du contexte
    if (request.context && generation.context) {
      if (request.context.framework === generation.context.framework) {
        similarity += 0.2;
      }
      if (request.context.typescript === generation.context.typescript) {
        similarity += 0.1;
      }
    }
    
    // Similarité des tags
    const requestTags = this.extractTags(request);
    const generationTags = this.extractTags(generation);
    const commonTags = requestTags.filter(tag => generationTags.includes(tag));
    
    if (requestTags.length > 0) {
      similarity += (commonTags.length / requestTags.length) * 0.2;
    }
    
    return Math.min(1.0, similarity);
  }
  
  /**
   * Calcul de la distance de Levenshtein
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  /**
   * Assurance de l'existence du répertoire de données
   */
  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.config.dataPath, { recursive: true });
    } catch (error) {
      // Le répertoire existe déjà
    }
  }
  
  /**
   * Fermeture propre du système de mémoire
   */
  async close() {
    try {
      await this.save();
      this.logger.info('🔄 Système de mémoire fermé proprement');
      this.emit('closed');
    } catch (error) {
      this.logger.error('❌ Erreur fermeture mémoire:', error);
    }
  }
}

