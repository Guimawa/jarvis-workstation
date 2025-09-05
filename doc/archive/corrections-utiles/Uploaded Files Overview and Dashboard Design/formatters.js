// ==============================================
// 🎨 FORMATTERS - Utilitaires de Formatage
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Utilitaires pour formater et beautifier le code
// généré avec support multi-langages et optimisations
// ==============================================

import Logger from './logger.js';

/**
 * Utilitaires de formatage de code
 */
export class CodeFormatter {
  constructor() {
    this.logger = new Logger('CodeFormatter');
    
    // Configuration par défaut
    this.config = {
      indentSize: 2,
      indentType: 'spaces', // 'spaces' ou 'tabs'
      maxLineLength: 100,
      insertFinalNewline: true,
      trimTrailingWhitespace: true
    };
    
    // Patterns de formatage par langage
    this.languagePatterns = {
      javascript: {
        extensions: ['.js', '.jsx', '.mjs'],
        semicolons: true,
        quotes: 'single',
        trailingCommas: 'es5'
      },
      typescript: {
        extensions: ['.ts', '.tsx'],
        semicolons: true,
        quotes: 'single',
        trailingCommas: 'all'
      },
      css: {
        extensions: ['.css', '.scss', '.sass'],
        semicolons: true,
        quotes: 'double'
      },
      html: {
        extensions: ['.html', '.htm'],
        quotes: 'double',
        selfClosing: true
      },
      json: {
        extensions: ['.json'],
        quotes: 'double',
        trailingCommas: false
      }
    };
  }
  
  /**
   * Formatage principal de code
   */
  async formatCode(code, language = 'javascript', options = {}) {
    try {
      const config = { ...this.config, ...options };
      
      this.logger.debug(`🎨 Formatage du code ${language}...`);
      
      // Détection automatique du langage si non spécifié
      if (language === 'auto') {
        language = this.detectLanguage(code);
      }
      
      // Nettoyage initial
      let formattedCode = this.cleanCode(code);
      
      // Formatage spécifique au langage
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'jsx':
          formattedCode = await this.formatJavaScript(formattedCode, config);
          break;
        case 'typescript':
        case 'tsx':
          formattedCode = await this.formatTypeScript(formattedCode, config);
          break;
        case 'css':
        case 'scss':
        case 'sass':
          formattedCode = await this.formatCSS(formattedCode, config);
          break;
        case 'html':
          formattedCode = await this.formatHTML(formattedCode, config);
          break;
        case 'json':
          formattedCode = await this.formatJSON(formattedCode, config);
          break;
        case 'markdown':
        case 'md':
          formattedCode = await this.formatMarkdown(formattedCode, config);
          break;
        default:
          formattedCode = await this.formatGeneric(formattedCode, config);
      }
      
      // Post-traitement
      formattedCode = this.postProcess(formattedCode, config);
      
      this.logger.debug('✅ Code formaté avec succès');
      
      return formattedCode;
      
    } catch (error) {
      this.logger.error('❌ Erreur formatage code:', error);
      return code; // Retourner le code original en cas d'erreur
    }
  }
  
  /**
   * Formatage JavaScript/JSX
   */
  async formatJavaScript(code, config) {
    // Formatage des imports
    code = this.formatImports(code);
    
    // Formatage des fonctions
    code = this.formatFunctions(code);
    
    // Formatage des objets
    code = this.formatObjects(code);
    
    // Formatage des arrays
    code = this.formatArrays(code);
    
    // Formatage JSX si présent
    if (this.containsJSX(code)) {
      code = this.formatJSX(code);
    }
    
    // Indentation
    code = this.applyIndentation(code, config);
    
    return code;
  }
  
  /**
   * Formatage TypeScript/TSX
   */
  async formatTypeScript(code, config) {
    // Formatage des types
    code = this.formatTypes(code);
    
    // Formatage des interfaces
    code = this.formatInterfaces(code);
    
    // Formatage des génériques
    code = this.formatGenerics(code);
    
    // Appliquer le formatage JavaScript de base
    code = await this.formatJavaScript(code, config);
    
    return code;
  }
  
  /**
   * Formatage CSS/SCSS
   */
  async formatCSS(code, config) {
    // Formatage des sélecteurs
    code = this.formatCSSSelectors(code);
    
    // Formatage des propriétés
    code = this.formatCSSProperties(code);
    
    // Formatage des media queries
    code = this.formatMediaQueries(code);
    
    // Indentation CSS
    code = this.applyCSSIndentation(code, config);
    
    return code;
  }
  
  /**
   * Formatage HTML
   */
  async formatHTML(code, config) {
    // Formatage des balises
    code = this.formatHTMLTags(code);
    
    // Formatage des attributs
    code = this.formatHTMLAttributes(code);
    
    // Indentation HTML
    code = this.applyHTMLIndentation(code, config);
    
    return code;
  }
  
  /**
   * Formatage JSON
   */
  async formatJSON(code, config) {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, config.indentSize);
    } catch (error) {
      this.logger.warn('JSON invalide, formatage basique appliqué');
      return this.formatGeneric(code, config);
    }
  }
  
  /**
   * Formatage Markdown
   */
  async formatMarkdown(code, config) {
    // Formatage des titres
    code = this.formatMarkdownHeaders(code);
    
    // Formatage des listes
    code = this.formatMarkdownLists(code);
    
    // Formatage des blocs de code
    code = this.formatMarkdownCodeBlocks(code);
    
    // Formatage des liens
    code = this.formatMarkdownLinks(code);
    
    return code;
  }
  
  /**
   * Formatage générique
   */
  async formatGeneric(code, config) {
    // Indentation basique
    code = this.applyIndentation(code, config);
    
    // Nettoyage des espaces
    code = this.cleanWhitespace(code);
    
    return code;
  }
  
  /**
   * Détection automatique du langage
   */
  detectLanguage(code) {
    // Détection par mots-clés et patterns
    if (code.includes('import ') && code.includes('from ')) {
      if (code.includes(': ') && (code.includes('interface ') || code.includes('type '))) {
        return 'typescript';
      }
      return 'javascript';
    }
    
    if (code.includes('<!DOCTYPE') || code.includes('<html')) {
      return 'html';
    }
    
    if (code.includes('{') && code.includes('"') && !code.includes('function')) {
      try {
        JSON.parse(code);
        return 'json';
      } catch {
        // Pas du JSON valide
      }
    }
    
    if (code.includes('# ') || code.includes('## ')) {
      return 'markdown';
    }
    
    if (code.includes('{') && (code.includes('color:') || code.includes('margin:'))) {
      return 'css';
    }
    
    return 'javascript'; // Par défaut
  }
  
  /**
   * Nettoyage initial du code
   */
  cleanCode(code) {
    // Suppression des espaces en début/fin
    code = code.trim();
    
    // Normalisation des retours à la ligne
    code = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Suppression des lignes vides multiples
    code = code.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return code;
  }
  
  /**
   * Formatage des imports
   */
  formatImports(code) {
    // Tri et groupement des imports
    const lines = code.split('\n');
    const imports = [];
    const otherLines = [];
    
    let inImportSection = true;
    
    for (const line of lines) {
      if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
        imports.push(line);
      } else if (line.trim() === '' && inImportSection) {
        // Ligne vide dans la section imports
        continue;
      } else {
        inImportSection = false;
        otherLines.push(line);
      }
    }
    
    // Tri des imports
    imports.sort((a, b) => {
      // Imports de bibliothèques externes en premier
      const aIsExternal = !a.includes('./') && !a.includes('../');
      const bIsExternal = !b.includes('./') && !b.includes('../');
      
      if (aIsExternal && !bIsExternal) return -1;
      if (!aIsExternal && bIsExternal) return 1;
      
      return a.localeCompare(b);
    });
    
    // Reconstruction
    const result = [];
    if (imports.length > 0) {
      result.push(...imports);
      result.push(''); // Ligne vide après les imports
    }
    result.push(...otherLines);
    
    return result.join('\n');
  }
  
  /**
   * Formatage des fonctions
   */
  formatFunctions(code) {
    // Formatage des déclarations de fonction
    code = code.replace(/function\s+(\w+)\s*\(/g, 'function $1(');
    
    // Formatage des fonctions fléchées
    code = code.replace(/=>\s*{/g, ' => {');
    code = code.replace(/\)\s*=>/g, ') =>');
    
    return code;
  }
  
  /**
   * Formatage des objets
   */
  formatObjects(code) {
    // Espaces autour des accolades
    code = code.replace(/{\s*/g, '{ ');
    code = code.replace(/\s*}/g, ' }');
    
    // Espaces après les virgules
    code = code.replace(/,(?!\s)/g, ', ');
    
    return code;
  }
  
  /**
   * Formatage des arrays
   */
  formatArrays(code) {
    // Espaces autour des crochets pour les arrays courts
    code = code.replace(/\[\s*/g, '[');
    code = code.replace(/\s*\]/g, ']');
    
    return code;
  }
  
  /**
   * Vérification de la présence de JSX
   */
  containsJSX(code) {
    return /<[A-Z]/.test(code) || /<[a-z]+[^>]*>/.test(code);
  }
  
  /**
   * Formatage JSX
   */
  formatJSX(code) {
    // Formatage des balises JSX
    code = code.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
      if (attrs.trim()) {
        return `<${tag}${attrs}>`;
      }
      return `<${tag}>`;
    });
    
    // Formatage des props
    code = code.replace(/(\w+)=\{([^}]+)\}/g, '$1={$2}');
    
    return code;
  }
  
  /**
   * Formatage des types TypeScript
   */
  formatTypes(code) {
    // Espaces autour des deux-points de type
    code = code.replace(/:\s*([^,\s}]+)/g, ': $1');
    
    // Formatage des unions de types
    code = code.replace(/\|\s*/g, ' | ');
    
    return code;
  }
  
  /**
   * Formatage des interfaces
   */
  formatInterfaces(code) {
    // Formatage des déclarations d'interface
    code = code.replace(/interface\s+(\w+)\s*{/g, 'interface $1 {');
    
    return code;
  }
  
  /**
   * Formatage des génériques
   */
  formatGenerics(code) {
    // Espaces dans les génériques
    code = code.replace(/<([^>]+)>/g, (match, content) => {
      const formatted = content.replace(/,\s*/g, ', ');
      return `<${formatted}>`;
    });
    
    return code;
  }
  
  /**
   * Application de l'indentation
   */
  applyIndentation(code, config) {
    const lines = code.split('\n');
    const indentChar = config.indentType === 'tabs' ? '\t' : ' '.repeat(config.indentSize);
    let indentLevel = 0;
    
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return '';
      
      // Diminuer l'indentation pour les fermetures
      if (trimmedLine.startsWith('}') || trimmedLine.startsWith(']') || trimmedLine.startsWith(')'))) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
      
      // Augmenter l'indentation pour les ouvertures
      if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[') || trimmedLine.endsWith('(')) {
        indentLevel++;
      }
      
      return formattedLine;
    });
    
    return formattedLines.join('\n');
  }
  
  /**
   * Formatage CSS spécifique
   */
  formatCSSSelectors(code) {
    // Espaces autour des sélecteurs
    code = code.replace(/([^,\s])\s*,\s*/g, '$1, ');
    
    return code;
  }
  
  formatCSSProperties(code) {
    // Espaces après les deux-points
    code = code.replace(/:\s*/g, ': ');
    
    // Point-virgule en fin de propriété
    code = code.replace(/([^;{}])\s*\n/g, '$1;\n');
    
    return code;
  }
  
  formatMediaQueries(code) {
    // Formatage des media queries
    code = code.replace(/@media\s*\(/g, '@media (');
    
    return code;
  }
  
  /**
   * Indentation CSS
   */
  applyCSSIndentation(code, config) {
    const lines = code.split('\n');
    const indentChar = config.indentType === 'tabs' ? '\t' : ' '.repeat(config.indentSize);
    let indentLevel = 0;
    
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return '';
      
      if (trimmedLine === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
      
      if (trimmedLine.endsWith('{')) {
        indentLevel++;
      }
      
      return formattedLine;
    });
    
    return formattedLines.join('\n');
  }
  
  /**
   * Formatage HTML
   */
  formatHTMLTags(code) {
    // Formatage des balises auto-fermantes
    code = code.replace(/<(\w+)([^>]*)\s*\/>/g, '<$1$2 />');
    
    return code;
  }
  
  formatHTMLAttributes(code) {
    // Espaces autour des attributs
    code = code.replace(/(\w+)=("[^"]*"|'[^']*')/g, '$1=$2');
    
    return code;
  }
  
  /**
   * Indentation HTML
   */
  applyHTMLIndentation(code, config) {
    const lines = code.split('\n');
    const indentChar = config.indentType === 'tabs' ? '\t' : ' '.repeat(config.indentSize);
    let indentLevel = 0;
    
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return '';
      
      // Balises fermantes
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
      
      // Balises ouvrantes (sauf auto-fermantes)
      if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.endsWith('/>')) {
        indentLevel++;
      }
      
      return formattedLine;
    });
    
    return formattedLines.join('\n');
  }
  
  /**
   * Formatage Markdown
   */
  formatMarkdownHeaders(code) {
    // Espaces après les #
    code = code.replace(/^(#+)([^\s])/gm, '$1 $2');
    
    return code;
  }
  
  formatMarkdownLists(code) {
    // Formatage des listes
    code = code.replace(/^(\s*)-([^\s])/gm, '$1- $2');
    code = code.replace(/^(\s*)\*([^\s])/gm, '$1* $2');
    code = code.replace(/^(\s*)\d+\.([^\s])/gm, '$1$&');
    
    return code;
  }
  
  formatMarkdownCodeBlocks(code) {
    // Formatage des blocs de code
    code = code.replace(/```(\w+)?\n/g, '```$1\n');
    
    return code;
  }
  
  formatMarkdownLinks(code) {
    // Formatage des liens
    code = code.replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '[$1]($2)');
    
    return code;
  }
  
  /**
   * Nettoyage des espaces
   */
  cleanWhitespace(code) {
    // Suppression des espaces en fin de ligne
    code = code.replace(/[ \t]+$/gm, '');
    
    // Suppression des lignes vides multiples
    code = code.replace(/\n{3,}/g, '\n\n');
    
    return code;
  }
  
  /**
   * Post-traitement
   */
  postProcess(code, config) {
    // Nettoyage final des espaces
    if (config.trimTrailingWhitespace) {
      code = this.cleanWhitespace(code);
    }
    
    // Ajout d'une nouvelle ligne finale
    if (config.insertFinalNewline && !code.endsWith('\n')) {
      code += '\n';
    }
    
    return code;
  }
  
  /**
   * Validation de la longueur des lignes
   */
  validateLineLength(code, maxLength = 100) {
    const lines = code.split('\n');
    const longLines = [];
    
    lines.forEach((line, index) => {
      if (line.length > maxLength) {
        longLines.push({
          line: index + 1,
          length: line.length,
          content: line.substring(0, 50) + '...'
        });
      }
    });
    
    return {
      isValid: longLines.length === 0,
      longLines
    };
  }
  
  /**
   * Statistiques de formatage
   */
  getFormattingStats(originalCode, formattedCode) {
    const originalLines = originalCode.split('\n');
    const formattedLines = formattedCode.split('\n');
    
    return {
      originalLines: originalLines.length,
      formattedLines: formattedLines.length,
      originalSize: originalCode.length,
      formattedSize: formattedCode.length,
      compressionRatio: formattedCode.length / originalCode.length,
      changes: {
        linesAdded: Math.max(0, formattedLines.length - originalLines.length),
        linesRemoved: Math.max(0, originalLines.length - formattedLines.length),
        charactersChanged: Math.abs(formattedCode.length - originalCode.length)
      }
    };
  }
}

/**
 * Utilitaires de formatage de texte
 */
export class TextFormatter {
  /**
   * Formatage de noms en différentes conventions
   */
  static toCamelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
  }
  
  static toPascalCase(str) {
    const camelCase = this.toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
  
  static toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/[\s_]+/g, '-')
              .toLowerCase();
  }
  
  static toSnakeCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2')
              .replace(/[\s-]+/g, '_')
              .toLowerCase();
  }
  
  static toConstantCase(str) {
    return this.toSnakeCase(str).toUpperCase();
  }
  
  /**
   * Formatage de commentaires
   */
  static formatComment(text, style = 'line', maxWidth = 80) {
    const lines = text.split('\n');
    
    switch (style) {
      case 'line':
        return lines.map(line => `// ${line}`).join('\n');
      
      case 'block':
        const border = '*'.repeat(maxWidth - 4);
        const formatted = lines.map(line => ` * ${line}`);
        return `/*${border}\n${formatted.join('\n')}\n ${border}*/`;
      
      case 'jsdoc':
        const jsdocLines = lines.map(line => ` * ${line}`);
        return `/**\n${jsdocLines.join('\n')}\n */`;
      
      default:
        return text;
    }
  }
  
  /**
   * Formatage de templates de chaînes
   */
  static formatTemplate(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }
  
  /**
   * Formatage de listes
   */
  static formatList(items, style = 'bullet', indent = 0) {
    const indentStr = ' '.repeat(indent);
    
    switch (style) {
      case 'bullet':
        return items.map(item => `${indentStr}• ${item}`).join('\n');
      
      case 'numbered':
        return items.map((item, index) => `${indentStr}${index + 1}. ${item}`).join('\n');
      
      case 'dashed':
        return items.map(item => `${indentStr}- ${item}`).join('\n');
      
      default:
        return items.join('\n');
    }
  }
}

/**
 * Fonction principale de formatage (export par défaut)
 */
export async function formatCode(code, language = 'javascript', options = {}) {
  const formatter = new CodeFormatter();
  return await formatter.formatCode(code, language, options);
}

// Exports nommés pour compatibilité
export { CodeFormatter as default };

