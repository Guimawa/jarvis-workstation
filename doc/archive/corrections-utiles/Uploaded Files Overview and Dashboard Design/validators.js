// ==============================================
// ✅ VALIDATORS - Utilitaires de Validation
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Utilitaires pour valider le code généré,
// les requêtes utilisateur et les configurations
// ==============================================

import Logger from './logger.js';

/**
 * Validateur de code généré
 */
export class CodeValidator {
  constructor() {
    this.logger = new Logger('CodeValidator');
    
    // Règles de validation par langage
    this.rules = {
      javascript: {
        syntax: [
          { pattern: /function\s+\w+\s*\([^)]*\)\s*{/, message: 'Syntaxe de fonction valide' },
          { pattern: /const\s+\w+\s*=/, message: 'Déclaration const valide' },
          { pattern: /import\s+.*\s+from\s+['"].*['"]/, message: 'Import ES6 valide' }
        ],
        quality: [
          { pattern: /console\.log/, message: 'Éviter console.log en production', level: 'warning' },
          { pattern: /var\s+/, message: 'Préférer const/let à var', level: 'warning' },
          { pattern: /==\s*[^=]/, message: 'Utiliser === au lieu de ==', level: 'warning' }
        ],
        security: [
          { pattern: /eval\s*\(/, message: 'Éviter eval() pour des raisons de sécurité', level: 'error' },
          { pattern: /innerHTML\s*=/, message: 'Attention aux injections XSS avec innerHTML', level: 'warning' }
        ]
      },
      typescript: {
        syntax: [
          { pattern: /interface\s+\w+\s*{/, message: 'Interface TypeScript valide' },
          { pattern: /:\s*\w+(\[\])?(\s*\|\s*\w+)*/, message: 'Annotation de type valide' }
        ],
        quality: [
          { pattern: /any/, message: 'Éviter le type any', level: 'warning' },
          { pattern: /as\s+any/, message: 'Éviter les assertions any', level: 'warning' }
        ]
      },
      react: {
        syntax: [
          { pattern: /import\s+React/, message: 'Import React présent' },
          { pattern: /export\s+default\s+/, message: 'Export par défaut présent' }
        ],
        quality: [
          { pattern: /key=/, message: 'Propriété key présente dans les listes' },
          { pattern: /useState|useEffect|useContext/, message: 'Utilisation des hooks React' }
        ],
        accessibility: [
          { pattern: /alt=/, message: 'Attribut alt pour les images', level: 'warning' },
          { pattern: /aria-/, message: 'Attributs ARIA pour l\'accessibilité', level: 'info' }
        ]
      }
    };
    
    // Métriques de qualité
    this.qualityMetrics = {
      complexity: { max: 10, weight: 0.3 },
      maintainability: { min: 70, weight: 0.3 },
      readability: { min: 80, weight: 0.2 },
      testability: { min: 70, weight: 0.2 }
    };
  }
  
  /**
   * Validation principale du code
   */
  async validateCode(code, language = 'javascript', options = {}) {
    try {
      this.logger.debug(`✅ Validation du code ${language}...`);
      
      const results = {
        isValid: true,
        score: 0,
        issues: [],
        metrics: {},
        suggestions: [],
        timestamp: Date.now()
      };
      
      // Validation syntaxique
      const syntaxResults = await this.validateSyntax(code, language);
      results.issues.push(...syntaxResults.issues);
      
      // Validation de la qualité
      const qualityResults = await this.validateQuality(code, language);
      results.issues.push(...qualityResults.issues);
      results.metrics = qualityResults.metrics;
      
      // Validation de la sécurité
      const securityResults = await this.validateSecurity(code, language);
      results.issues.push(...securityResults.issues);
      
      // Validation spécifique au framework
      if (language === 'react' || this.containsReact(code)) {
        const reactResults = await this.validateReact(code);
        results.issues.push(...reactResults.issues);
      }
      
      // Calcul du score global
      results.score = this.calculateScore(results);
      results.isValid = results.score >= 70; // Seuil de validation
      
      // Génération de suggestions
      results.suggestions = this.generateSuggestions(results);
      
      this.logger.debug(`✅ Validation terminée - Score: ${results.score}%`);
      
      return results;
      
    } catch (error) {
      this.logger.error('❌ Erreur validation code:', error);
      return {
        isValid: false,
        score: 0,
        issues: [{ type: 'error', message: `Erreur de validation: ${error.message}` }],
        metrics: {},
        suggestions: []
      };
    }
  }
  
  /**
   * Validation syntaxique
   */
  async validateSyntax(code, language) {
    const issues = [];
    const rules = this.rules[language]?.syntax || [];
    
    // Vérifications basiques
    if (!code || code.trim().length === 0) {
      issues.push({
        type: 'error',
        category: 'syntax',
        message: 'Code vide ou invalide',
        line: 0
      });
      return { issues };
    }
    
    // Vérification des accolades équilibrées
    const braceBalance = this.checkBraceBalance(code);
    if (!braceBalance.balanced) {
      issues.push({
        type: 'error',
        category: 'syntax',
        message: `Accolades non équilibrées: ${braceBalance.message}`,
        line: braceBalance.line
      });
    }
    
    // Vérification des parenthèses équilibrées
    const parenBalance = this.checkParenBalance(code);
    if (!parenBalance.balanced) {
      issues.push({
        type: 'error',
        category: 'syntax',
        message: `Parenthèses non équilibrées: ${parenBalance.message}`,
        line: parenBalance.line
      });
    }
    
    // Application des règles spécifiques au langage
    for (const rule of rules) {
      if (!rule.pattern.test(code) && rule.required !== false) {
        issues.push({
          type: rule.level || 'info',
          category: 'syntax',
          message: rule.message,
          rule: rule.name
        });
      }
    }
    
    return { issues };
  }
  
  /**
   * Validation de la qualité
   */
  async validateQuality(code, language) {
    const issues = [];
    const metrics = {};
    
    // Calcul de la complexité cyclomatique
    metrics.complexity = this.calculateComplexity(code);
    if (metrics.complexity > this.qualityMetrics.complexity.max) {
      issues.push({
        type: 'warning',
        category: 'quality',
        message: `Complexité élevée: ${metrics.complexity} (max recommandé: ${this.qualityMetrics.complexity.max})`,
        metric: 'complexity'
      });
    }
    
    // Calcul de la maintenabilité
    metrics.maintainability = this.calculateMaintainability(code);
    if (metrics.maintainability < this.qualityMetrics.maintainability.min) {
      issues.push({
        type: 'warning',
        category: 'quality',
        message: `Maintenabilité faible: ${metrics.maintainability}% (min recommandé: ${this.qualityMetrics.maintainability.min}%)`,
        metric: 'maintainability'
      });
    }
    
    // Calcul de la lisibilité
    metrics.readability = this.calculateReadability(code);
    if (metrics.readability < this.qualityMetrics.readability.min) {
      issues.push({
        type: 'info',
        category: 'quality',
        message: `Lisibilité à améliorer: ${metrics.readability}% (min recommandé: ${this.qualityMetrics.readability.min}%)`,
        metric: 'readability'
      });
    }
    
    // Calcul de la testabilité
    metrics.testability = this.calculateTestability(code);
    if (metrics.testability < this.qualityMetrics.testability.min) {
      issues.push({
        type: 'info',
        category: 'quality',
        message: `Testabilité à améliorer: ${metrics.testability}% (min recommandé: ${this.qualityMetrics.testability.min}%)`,
        metric: 'testability'
      });
    }
    
    // Application des règles de qualité spécifiques
    const qualityRules = this.rules[language]?.quality || [];
    for (const rule of qualityRules) {
      if (rule.pattern.test(code)) {
        issues.push({
          type: rule.level || 'warning',
          category: 'quality',
          message: rule.message,
          rule: rule.name
        });
      }
    }
    
    return { issues, metrics };
  }
  
  /**
   * Validation de la sécurité
   */
  async validateSecurity(code, language) {
    const issues = [];
    const securityRules = this.rules[language]?.security || [];
    
    for (const rule of securityRules) {
      if (rule.pattern.test(code)) {
        issues.push({
          type: rule.level || 'error',
          category: 'security',
          message: rule.message,
          rule: rule.name
        });
      }
    }
    
    // Vérifications de sécurité génériques
    const securityChecks = [
      {
        pattern: /password|secret|key/i,
        message: 'Possible exposition de données sensibles',
        level: 'warning'
      },
      {
        pattern: /http:\/\//,
        message: 'Utilisation de HTTP non sécurisé',
        level: 'warning'
      },
      {
        pattern: /document\.write/,
        message: 'document.write peut être dangereux',
        level: 'warning'
      }
    ];
    
    for (const check of securityChecks) {
      if (check.pattern.test(code)) {
        issues.push({
          type: check.level,
          category: 'security',
          message: check.message
        });
      }
    }
    
    return { issues };
  }
  
  /**
   * Validation spécifique React
   */
  async validateReact(code) {
    const issues = [];
    const reactRules = this.rules.react || {};
    
    // Vérifications syntaxiques React
    if (reactRules.syntax) {
      for (const rule of reactRules.syntax) {
        if (!rule.pattern.test(code)) {
          issues.push({
            type: 'warning',
            category: 'react',
            message: rule.message
          });
        }
      }
    }
    
    // Vérifications d'accessibilité
    if (reactRules.accessibility) {
      for (const rule of reactRules.accessibility) {
        if (!rule.pattern.test(code)) {
          issues.push({
            type: rule.level || 'info',
            category: 'accessibility',
            message: rule.message
          });
        }
      }
    }
    
    // Vérifications spécifiques JSX
    if (this.containsJSX(code)) {
      // Vérification des clés dans les listes
      if (code.includes('.map(') && !code.includes('key=')) {
        issues.push({
          type: 'warning',
          category: 'react',
          message: 'Propriété key manquante dans la liste'
        });
      }
      
      // Vérification des fragments
      if (code.includes('<>') && !code.includes('React.Fragment')) {
        issues.push({
          type: 'info',
          category: 'react',
          message: 'Utilisation de fragments courts détectée'
        });
      }
    }
    
    return { issues };
  }
  
  /**
   * Vérification de l'équilibre des accolades
   */
  checkBraceBalance(code) {
    let balance = 0;
    let line = 1;
    
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '\n') line++;
      if (code[i] === '{') balance++;
      if (code[i] === '}') balance--;
      
      if (balance < 0) {
        return {
          balanced: false,
          message: 'Accolade fermante sans ouverture',
          line
        };
      }
    }
    
    return {
      balanced: balance === 0,
      message: balance > 0 ? 'Accolades ouvrantes non fermées' : 'OK',
      line
    };
  }
  
  /**
   * Vérification de l'équilibre des parenthèses
   */
  checkParenBalance(code) {
    let balance = 0;
    let line = 1;
    
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '\n') line++;
      if (code[i] === '(') balance++;
      if (code[i] === ')') balance--;
      
      if (balance < 0) {
        return {
          balanced: false,
          message: 'Parenthèse fermante sans ouverture',
          line
        };
      }
    }
    
    return {
      balanced: balance === 0,
      message: balance > 0 ? 'Parenthèses ouvrantes non fermées' : 'OK',
      line
    };
  }
  
  /**
   * Calcul de la complexité cyclomatique
   */
  calculateComplexity(code) {
    let complexity = 1; // Base complexity
    
    // Mots-clés qui augmentent la complexité
    const complexityKeywords = [
      /\bif\b/g,
      /\belse\b/g,
      /\bwhile\b/g,
      /\bfor\b/g,
      /\bswitch\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\b&&\b/g,
      /\b\|\|\b/g,
      /\?\s*:/g // Opérateur ternaire
    ];
    
    for (const keyword of complexityKeywords) {
      const matches = code.match(keyword);
      if (matches) {
        complexity += matches.length;
      }
    }
    
    return complexity;
  }
  
  /**
   * Calcul de la maintenabilité
   */
  calculateMaintainability(code) {
    const lines = code.split('\n').filter(line => line.trim());
    const totalLines = lines.length;
    
    if (totalLines === 0) return 0;
    
    // Facteurs de maintenabilité
    let score = 100;
    
    // Pénalité pour les lignes trop longues
    const longLines = lines.filter(line => line.length > 100).length;
    score -= (longLines / totalLines) * 20;
    
    // Pénalité pour le manque de commentaires
    const commentLines = lines.filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') || 
      line.trim().startsWith('*')
    ).length;
    const commentRatio = commentLines / totalLines;
    if (commentRatio < 0.1) {
      score -= 15;
    }
    
    // Pénalité pour la complexité
    const complexity = this.calculateComplexity(code);
    if (complexity > 10) {
      score -= (complexity - 10) * 2;
    }
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Calcul de la lisibilité
   */
  calculateReadability(code) {
    const lines = code.split('\n');
    const totalLines = lines.length;
    
    if (totalLines === 0) return 0;
    
    let score = 100;
    
    // Facteurs de lisibilité
    const emptyLines = lines.filter(line => line.trim() === '').length;
    const emptyLineRatio = emptyLines / totalLines;
    
    // Bonus pour les lignes vides (aération)
    if (emptyLineRatio > 0.1 && emptyLineRatio < 0.3) {
      score += 5;
    }
    
    // Pénalité pour les noms de variables courts
    const shortVarNames = (code.match(/\b[a-z]\b/g) || []).length;
    score -= shortVarNames * 2;
    
    // Bonus pour les noms descriptifs
    const descriptiveNames = (code.match(/\b[a-zA-Z]{6,}\b/g) || []).length;
    score += Math.min(descriptiveNames * 0.5, 10);
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Calcul de la testabilité
   */
  calculateTestability(code) {
    let score = 100;
    
    // Pénalité pour les fonctions trop longues
    const functionMatches = code.match(/function\s+\w+[^{]*{[^}]*}/g) || [];
    const longFunctions = functionMatches.filter(func => func.split('\n').length > 20).length;
    score -= longFunctions * 15;
    
    // Pénalité pour les dépendances globales
    const globalRefs = (code.match(/window\.|document\.|global\./g) || []).length;
    score -= globalRefs * 5;
    
    // Bonus pour les fonctions pures (pas d'effets de bord évidents)
    const pureFunctions = functionMatches.filter(func => 
      !func.includes('console.') && 
      !func.includes('document.') && 
      !func.includes('window.')
    ).length;
    score += pureFunctions * 2;
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Calcul du score global
   */
  calculateScore(results) {
    const { issues, metrics } = results;
    
    let score = 100;
    
    // Pénalités par type d'issue
    for (const issue of issues) {
      switch (issue.type) {
        case 'error':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    }
    
    // Bonus/malus basés sur les métriques
    if (metrics.maintainability) {
      score = (score + metrics.maintainability) / 2;
    }
    
    if (metrics.readability) {
      score = (score + metrics.readability) / 2;
    }
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Génération de suggestions d'amélioration
   */
  generateSuggestions(results) {
    const suggestions = [];
    const { issues, metrics } = results;
    
    // Suggestions basées sur les issues
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    
    if (errorCount > 0) {
      suggestions.push({
        type: 'critical',
        message: `Corriger ${errorCount} erreur(s) critique(s)`,
        priority: 1
      });
    }
    
    if (warningCount > 3) {
      suggestions.push({
        type: 'improvement',
        message: `Résoudre ${warningCount} avertissement(s) pour améliorer la qualité`,
        priority: 2
      });
    }
    
    // Suggestions basées sur les métriques
    if (metrics.complexity > 10) {
      suggestions.push({
        type: 'refactor',
        message: 'Refactoriser pour réduire la complexité',
        priority: 2
      });
    }
    
    if (metrics.maintainability < 70) {
      suggestions.push({
        type: 'improvement',
        message: 'Améliorer la maintenabilité avec plus de commentaires et une meilleure structure',
        priority: 3
      });
    }
    
    if (metrics.testability < 70) {
      suggestions.push({
        type: 'improvement',
        message: 'Améliorer la testabilité en réduisant les dépendances externes',
        priority: 3
      });
    }
    
    return suggestions.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * Vérification de la présence de React
   */
  containsReact(code) {
    return code.includes('import React') || 
           code.includes('from \'react\'') || 
           code.includes('from "react"') ||
           this.containsJSX(code);
  }
  
  /**
   * Vérification de la présence de JSX
   */
  containsJSX(code) {
    return /<[A-Z]/.test(code) || /<[a-z]+[^>]*>/.test(code);
  }
}

/**
 * Validateur de requêtes utilisateur
 */
export class RequestValidator {
  constructor() {
    this.logger = new Logger('RequestValidator');
  }
  
  /**
   * Validation d'une requête de génération
   */
  validateGenerationRequest(request) {
    const errors = [];
    const warnings = [];
    
    // Validation des champs obligatoires
    if (!request.type) {
      errors.push('Le type de génération est obligatoire');
    }
    
    if (!request.name) {
      errors.push('Le nom de l\'élément est obligatoire');
    }
    
    // Validation du nom
    if (request.name) {
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(request.name)) {
        errors.push('Le nom doit commencer par une lettre et ne contenir que des lettres, chiffres et underscores');
      }
      
      if (request.name.length > 50) {
        warnings.push('Le nom est très long, considérez un nom plus court');
      }
    }
    
    // Validation du type
    const validTypes = ['component', 'hook', 'page', 'api', 'database', 'test', 'story'];
    if (request.type && !validTypes.includes(request.type)) {
      errors.push(`Type invalide. Types supportés: ${validTypes.join(', ')}`);
    }
    
    // Validation du répertoire
    if (request.directory && !/^[a-zA-Z0-9_/.-]+$/.test(request.directory)) {
      errors.push('Le répertoire contient des caractères invalides');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validation de configuration
   */
  validateConfig(config) {
    const errors = [];
    const warnings = [];
    
    // Validation des clés API
    if (config.groq && !config.groq.apiKey) {
      errors.push('Clé API Groq manquante');
    }
    
    // Validation des ports
    if (config.server && config.server.port) {
      const port = parseInt(config.server.port);
      if (isNaN(port) || port < 1 || port > 65535) {
        errors.push('Port serveur invalide (doit être entre 1 et 65535)');
      }
    }
    
    // Validation des répertoires
    const directories = ['dataPath', 'outputPath', 'templatesPath'];
    for (const dir of directories) {
      if (config[dir] && !/^[a-zA-Z0-9_/.-]+$/.test(config[dir])) {
        warnings.push(`Répertoire ${dir} contient des caractères potentiellement problématiques`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Validateur de performance
 */
export class PerformanceValidator {
  constructor() {
    this.logger = new Logger('PerformanceValidator');
  }
  
  /**
   * Validation des performances du code
   */
  validatePerformance(code, language = 'javascript') {
    const issues = [];
    const metrics = {};
    
    // Détection de patterns de performance
    const performancePatterns = [
      {
        pattern: /for\s*\([^)]*\)\s*{\s*for\s*\([^)]*\)/,
        message: 'Boucles imbriquées détectées - complexité O(n²)',
        severity: 'warning'
      },
      {
        pattern: /\.forEach\s*\([^)]*\)\s*{\s*.*\.forEach/,
        message: 'forEach imbriqués détectés - considérer une approche plus efficace',
        severity: 'info'
      },
      {
        pattern: /new\s+RegExp\s*\(/,
        message: 'Compilation de regex à l\'exécution - considérer une regex littérale',
        severity: 'info'
      },
      {
        pattern: /JSON\.parse\s*\(\s*JSON\.stringify/,
        message: 'Sérialisation/désérialisation inutile détectée',
        severity: 'warning'
      }
    ];
    
    for (const pattern of performancePatterns) {
      if (pattern.pattern.test(code)) {
        issues.push({
          type: pattern.severity,
          category: 'performance',
          message: pattern.message
        });
      }
    }
    
    // Calcul de métriques
    metrics.codeSize = code.length;
    metrics.lineCount = code.split('\n').length;
    metrics.functionCount = (code.match(/function\s+\w+/g) || []).length;
    metrics.loopCount = (code.match(/for\s*\(|while\s*\(|\.forEach\s*\(/g) || []).length;
    
    return {
      issues,
      metrics,
      score: this.calculatePerformanceScore(issues, metrics)
    };
  }
  
  /**
   * Calcul du score de performance
   */
  calculatePerformanceScore(issues, metrics) {
    let score = 100;
    
    // Pénalités par issue
    for (const issue of issues) {
      switch (issue.type) {
        case 'error':
          score -= 25;
          break;
        case 'warning':
          score -= 15;
          break;
        case 'info':
          score -= 5;
          break;
      }
    }
    
    // Pénalités basées sur les métriques
    if (metrics.codeSize > 10000) {
      score -= 10; // Code très long
    }
    
    if (metrics.loopCount > 5) {
      score -= metrics.loopCount * 2; // Beaucoup de boucles
    }
    
    return Math.max(0, Math.round(score));
  }
}

// Exports principaux
export { CodeValidator as default };
export const validateCode = async (code, language, options) => {
  const validator = new CodeValidator();
  return await validator.validateCode(code, language, options);
};

export const validateRequest = (request) => {
  const validator = new RequestValidator();
  return validator.validateGenerationRequest(request);
};

export const validatePerformance = (code, language) => {
  const validator = new PerformanceValidator();
  return validator.validatePerformance(code, language);
};

