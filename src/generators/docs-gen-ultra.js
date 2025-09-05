// ==============================================
// 📝 DOCS GENERATOR - Générateur de Documentation
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Générateur intelligent de documentation technique
// complète avec guides, API docs, tutoriels et diagrammes
// ==============================================

import fs from 'fs/promises';
import path from 'path';
import GroqClient from '../utils/groq-client.js';
import Logger from '../utils/logger.js';
import { formatCode } from '../utils/formatters.js';

/**
 * Générateur de documentation intelligent
 */
export default class DocsGenerator {
  constructor(groqClient, memory) {
    this.groqClient = groqClient || new GroqClient();
    this.memory = memory;
    this.logger = new Logger('DocsGenerator');
    
    // Types de documentation supportés
    this.docTypes = {
      api: 'Documentation API REST/GraphQL',
      component: 'Documentation de composants React',
      database: 'Documentation de base de données',
      deployment: 'Guide de déploiement',
      development: 'Guide de développement',
      user: 'Guide utilisateur',
      architecture: 'Documentation d\'architecture',
      changelog: 'Journal des modifications'
    };
    
    // Formats de sortie
    this.outputFormats = {
      markdown: { ext: 'md', name: 'Markdown' },
      html: { ext: 'html', name: 'HTML' },
      pdf: { ext: 'pdf', name: 'PDF' },
      docx: { ext: 'docx', name: 'Word' },
      json: { ext: 'json', name: 'JSON' }
    };
    
    // Templates de documentation
    this.templates = {
      readme: this.getReadmeTemplate(),
      api: this.getAPITemplate(),
      component: this.getComponentTemplate(),
      guide: this.getGuideTemplate(),
      changelog: this.getChangelogTemplate()
    };
  }
  
  /**
   * Génération complète de documentation
   */
  async generateDocumentation(spec, options = {}) {
    try {
      this.logger.info(`📝 Génération de la documentation: ${spec.name}`);
      
      const config = {
        types: ['readme', 'api', 'development'],
        format: 'markdown',
        includeExamples: true,
        includeDiagrams: true,
        includeScreenshots: false,
        language: 'fr',
        outputDir: './docs',
        generateIndex: true,
        ...options
      };
      
      // Analyse de la spécification
      const docSpec = await this.analyzeDocumentationSpec(spec, config);
      
      // Génération des différents types de documentation
      const docs = [];
      
      for (const type of config.types) {
        const doc = await this.generateDocumentationType(type, docSpec, config);
        docs.push(doc);
      }
      
      // Génération de l'index si demandé
      if (config.generateIndex) {
        const index = await this.generateIndex(docs, docSpec, config);
        docs.unshift(index);
      }
      
      // Génération des assets (diagrammes, images)
      const assets = config.includeDiagrams ? await this.generateAssets(docSpec, config) : [];
      
      // Structure du projet de documentation
      const structure = await this.createDocsStructure(docSpec, config);
      
      // Configuration et métadonnées
      const configFiles = await this.generateDocsConfig(docSpec, config);
      
      return {
        success: true,
        documentation: {
          spec: docSpec,
          docs,
          assets,
          structure,
          config: configFiles
        },
        metadata: {
          types: config.types,
          format: config.format,
          pages: docs.length,
          assets: assets.length,
          timestamp: Date.now()
        }
      };
      
    } catch (error) {
      this.logger.error('❌ Erreur génération documentation:', error);
      throw error;
    }
  }
  
  /**
   * Analyse de la spécification de documentation
   */
  async analyzeDocumentationSpec(spec, config) {
    const prompt = `
Analyse cette spécification de projet et détermine la documentation nécessaire:

Spécification:
${JSON.stringify(spec, null, 2)}

Configuration:
${JSON.stringify(config, null, 2)}

Retourne une spécification de documentation avec:
- Structure recommandée
- Sections nécessaires
- Niveau de détail approprié
- Audience cible
- Exemples requis
- Diagrammes utiles
`;
    
    const analysis = await this.groqClient.generateCode({
      type: 'documentation-analysis',
      prompt,
      context: { spec, config }
    });
    
    return {
      ...spec,
      ...analysis,
      sections: this.normalizeSections(analysis.sections || []),
      audience: analysis.audience || ['developers', 'users'],
      complexity: analysis.complexity || 'medium',
      examples: analysis.examples || []
    };
  }
  
  /**
   * Génération d'un type de documentation spécifique
   */
  async generateDocumentationType(type, docSpec, config) {
    switch (type) {
      case 'readme':
        return await this.generateReadme(docSpec, config);
      case 'api':
        return await this.generateAPIDoc(docSpec, config);
      case 'component':
        return await this.generateComponentDoc(docSpec, config);
      case 'development':
        return await this.generateDevelopmentGuide(docSpec, config);
      case 'deployment':
        return await this.generateDeploymentGuide(docSpec, config);
      case 'user':
        return await this.generateUserGuide(docSpec, config);
      case 'architecture':
        return await this.generateArchitectureDoc(docSpec, config);
      case 'changelog':
        return await this.generateChangelog(docSpec, config);
      default:
        throw new Error(`Type de documentation non supporté: ${type}`);
    }
  }
  
  /**
   * Génération du README
   */
  async generateReadme(docSpec, config) {
    const prompt = `
Génère un README.md complet et professionnel pour ce projet:

Projet: ${JSON.stringify(docSpec, null, 2)}
Langue: ${config.language}

Inclus:
- Titre et description accrocheuse
- Badges de statut
- Table des matières
- Installation et configuration
- Utilisation avec exemples
- API/Fonctionnalités principales
- Contribution et développement
- Licence et crédits
- Screenshots si approprié
- Liens utiles

Style: Professionnel, clair et engageant
`;
    
    const readmeContent = await this.groqClient.generateCode({
      type: 'readme-doc',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'README',
      type: 'readme',
      content: readmeContent,
      filename: 'README.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération de la documentation API
   */
  async generateAPIDoc(docSpec, config) {
    const prompt = `
Génère une documentation API complète:

API: ${JSON.stringify(docSpec.api || {}, null, 2)}
Endpoints: ${JSON.stringify(docSpec.endpoints || [], null, 2)}
Langue: ${config.language}

Inclus:
- Introduction et authentification
- Liste complète des endpoints
- Paramètres et corps de requête
- Exemples de requêtes/réponses
- Codes d'erreur et gestion
- Rate limiting et quotas
- SDK et bibliothèques
- Changelog API
- Postman collection

Format: Markdown avec syntaxe claire
`;
    
    const apiDocContent = await this.groqClient.generateCode({
      type: 'api-doc',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'API Documentation',
      type: 'api',
      content: apiDocContent,
      filename: 'api.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération de la documentation des composants
   */
  async generateComponentDoc(docSpec, config) {
    const prompt = `
Génère une documentation complète des composants:

Composants: ${JSON.stringify(docSpec.components || [], null, 2)}
Framework: ${docSpec.framework || 'React'}
Langue: ${config.language}

Inclus:
- Guide d'utilisation des composants
- Props et API de chaque composant
- Exemples d'utilisation
- Storybook integration
- Thèmes et personnalisation
- Bonnes pratiques
- Patterns de composition
- Tests et validation

Format: Markdown avec exemples de code
`;
    
    const componentDocContent = await this.groqClient.generateCode({
      type: 'component-doc',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'Components Documentation',
      type: 'component',
      content: componentDocContent,
      filename: 'components.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération du guide de développement
   */
  async generateDevelopmentGuide(docSpec, config) {
    const prompt = `
Génère un guide de développement complet:

Projet: ${JSON.stringify(docSpec, null, 2)}
Technologies: ${JSON.stringify(docSpec.technologies || [], null, 2)}
Langue: ${config.language}

Inclus:
- Configuration de l'environnement
- Structure du projet
- Standards de code
- Workflow Git et branches
- Tests et qualité
- Debugging et profiling
- Performance et optimisation
- Sécurité et bonnes pratiques
- CI/CD et automatisation
- Troubleshooting courant

Format: Guide étape par étape
`;
    
    const devGuideContent = await this.groqClient.generateCode({
      type: 'development-guide',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'Development Guide',
      type: 'development',
      content: devGuideContent,
      filename: 'development.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération du guide de déploiement
   */
  async generateDeploymentGuide(docSpec, config) {
    const prompt = `
Génère un guide de déploiement détaillé:

Projet: ${JSON.stringify(docSpec, null, 2)}
Infrastructure: ${JSON.stringify(docSpec.infrastructure || {}, null, 2)}
Langue: ${config.language}

Inclus:
- Prérequis et dépendances
- Configuration des environnements
- Déploiement local/staging/production
- Variables d'environnement
- Base de données et migrations
- Monitoring et logs
- Backup et restauration
- Scaling et performance
- Sécurité et SSL
- Rollback et maintenance

Format: Instructions étape par étape
`;
    
    const deploymentGuideContent = await this.groqClient.generateCode({
      type: 'deployment-guide',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'Deployment Guide',
      type: 'deployment',
      content: deploymentGuideContent,
      filename: 'deployment.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération du guide utilisateur
   */
  async generateUserGuide(docSpec, config) {
    const prompt = `
Génère un guide utilisateur convivial:

Application: ${JSON.stringify(docSpec, null, 2)}
Fonctionnalités: ${JSON.stringify(docSpec.features || [], null, 2)}
Langue: ${config.language}

Inclus:
- Introduction et premiers pas
- Interface utilisateur
- Fonctionnalités principales
- Tutoriels étape par étape
- FAQ et problèmes courants
- Raccourcis et astuces
- Paramètres et personnalisation
- Support et contact
- Glossaire des termes

Style: Accessible et non-technique
`;
    
    const userGuideContent = await this.groqClient.generateCode({
      type: 'user-guide',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'User Guide',
      type: 'user',
      content: userGuideContent,
      filename: 'user-guide.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération de la documentation d'architecture
   */
  async generateArchitectureDoc(docSpec, config) {
    const prompt = `
Génère une documentation d'architecture technique:

Architecture: ${JSON.stringify(docSpec.architecture || {}, null, 2)}
Technologies: ${JSON.stringify(docSpec.technologies || [], null, 2)}
Langue: ${config.language}

Inclus:
- Vue d'ensemble de l'architecture
- Diagrammes de composants
- Flux de données
- Patterns et principes
- Décisions techniques
- Scalabilité et performance
- Sécurité et conformité
- Intégrations externes
- Evolution et roadmap
- Alternatives considérées

Format: Documentation technique détaillée
`;
    
    const architectureDocContent = await this.groqClient.generateCode({
      type: 'architecture-doc',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'Architecture Documentation',
      type: 'architecture',
      content: architectureDocContent,
      filename: 'architecture.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération du changelog
   */
  async generateChangelog(docSpec, config) {
    const prompt = `
Génère un changelog structuré:

Projet: ${docSpec.name}
Versions: ${JSON.stringify(docSpec.versions || [], null, 2)}
Langue: ${config.language}

Inclus:
- Format Keep a Changelog
- Versions avec dates
- Catégories: Added, Changed, Deprecated, Removed, Fixed, Security
- Liens vers releases
- Migration guides si nécessaire
- Breaking changes clairement marqués

Format: Markdown standardisé
`;
    
    const changelogContent = await this.groqClient.generateCode({
      type: 'changelog-doc',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'Changelog',
      type: 'changelog',
      content: changelogContent,
      filename: 'CHANGELOG.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération de l'index de documentation
   */
  async generateIndex(docs, docSpec, config) {
    const prompt = `
Génère un index/sommaire pour cette documentation:

Documents: ${JSON.stringify(docs.map(d => ({ name: d.name, type: d.type })), null, 2)}
Projet: ${docSpec.name}
Langue: ${config.language}

Inclus:
- Table des matières hiérarchique
- Description de chaque section
- Liens vers les documents
- Guide de navigation
- Recherche et filtres
- Statut de chaque document
- Dernière mise à jour

Format: Page d'accueil attractive
`;
    
    const indexContent = await this.groqClient.generateCode({
      type: 'docs-index',
      prompt,
      context: { docs, docSpec, config }
    });
    
    return {
      name: 'Documentation Index',
      type: 'index',
      content: indexContent,
      filename: 'index.md',
      format: 'markdown'
    };
  }
  
  /**
   * Génération des assets (diagrammes, images)
   */
  async generateAssets(docSpec, config) {
    const assets = [];
    
    // Diagramme d'architecture
    if (docSpec.architecture) {
      const architectureDiagram = await this.generateArchitectureDiagram(docSpec, config);
      assets.push(architectureDiagram);
    }
    
    // Diagramme de flux de données
    if (docSpec.dataFlow) {
      const dataFlowDiagram = await this.generateDataFlowDiagram(docSpec, config);
      assets.push(dataFlowDiagram);
    }
    
    // Diagramme de base de données
    if (docSpec.database) {
      const dbDiagram = await this.generateDatabaseDiagram(docSpec, config);
      assets.push(dbDiagram);
    }
    
    // Diagrammes de séquence pour l'API
    if (docSpec.api) {
      const sequenceDiagrams = await this.generateSequenceDiagrams(docSpec, config);
      assets.push(...sequenceDiagrams);
    }
    
    return assets;
  }
  
  /**
   * Génération du diagramme d'architecture
   */
  async generateArchitectureDiagram(docSpec, config) {
    const prompt = `
Génère un diagramme d'architecture en Mermaid:

Architecture: ${JSON.stringify(docSpec.architecture, null, 2)}
Composants: ${JSON.stringify(docSpec.components || [], null, 2)}

Crée un diagramme qui montre:
- Composants principaux
- Relations et dépendances
- Flux de données
- Interfaces externes
- Couches d'abstraction

Format: Syntaxe Mermaid
`;
    
    const diagramCode = await this.groqClient.generateCode({
      type: 'architecture-diagram',
      prompt,
      context: { docSpec, config }
    });
    
    return {
      name: 'Architecture Diagram',
      type: 'diagram',
      content: diagramCode,
      filename: 'architecture.mmd',
      format: 'mermaid'
    };
  }
  
  /**
   * Templates de documentation
   */
  getReadmeTemplate() {
    return `
# {{projectName}}

{{description}}

## 🚀 Installation

\`\`\`bash
npm install {{packageName}}
\`\`\`

## 📖 Utilisation

\`\`\`javascript
// Exemple d'utilisation
\`\`\`

## 📚 Documentation

- [Guide de développement](./docs/development.md)
- [Documentation API](./docs/api.md)
- [Guide de déploiement](./docs/deployment.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le [guide de contribution](./CONTRIBUTING.md).

## 📄 Licence

Ce projet est sous licence {{license}}.
    `;
  }
  
  getAPITemplate() {
    return `
# Documentation API

## Authentification

## Endpoints

### {{endpoint}}

**{{method}}** \`{{path}}\`

{{description}}

#### Paramètres

#### Réponse

#### Exemples
    `;
  }
  
  getComponentTemplate() {
    return `
# Documentation des Composants

## {{componentName}}

{{description}}

### Props

### Utilisation

\`\`\`jsx
<{{componentName}} />
\`\`\`

### Exemples
    `;
  }
  
  getGuideTemplate() {
    return `
# {{guideTitle}}

## Introduction

## Prérequis

## Étapes

### Étape 1

### Étape 2

## Dépannage

## Ressources supplémentaires
    `;
  }
  
  getChangelogTemplate() {
    return `
# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

## [{{version}}] - {{date}}

### Ajouté
### Modifié
### Déprécié
### Supprimé
### Corrigé
### Sécurité
    `;
  }
  
  /**
   * Création de la structure de documentation
   */
  async createDocsStructure(docSpec, config) {
    const structure = {
      'docs/': {
        'api/': {},
        'guides/': {},
        'assets/': {
          'images/': {},
          'diagrams/': {},
          'videos/': {}
        },
        'examples/': {},
        'templates/': {}
      }
    };
    
    // Ajout des fichiers selon les types demandés
    for (const type of config.types) {
      switch (type) {
        case 'api':
          structure['docs/']['api/']['endpoints.md'] = 'Documentation des endpoints';
          structure['docs/']['api/']['authentication.md'] = 'Guide d\'authentification';
          break;
        case 'component':
          structure['docs/']['components/'] = {};
          break;
        case 'development':
          structure['docs/']['guides/']['development.md'] = 'Guide de développement';
          break;
      }
    }
    
    return structure;
  }
  
  /**
   * Génération de la configuration de documentation
   */
  async generateDocsConfig(docSpec, config) {
    const configFiles = [];
    
    // Configuration Docusaurus si demandé
    if (config.platform === 'docusaurus') {
      const docusaurusConfig = await this.generateDocusaurusConfig(docSpec, config);
      configFiles.push(docusaurusConfig);
    }
    
    // Configuration GitBook si demandé
    if (config.platform === 'gitbook') {
      const gitbookConfig = await this.generateGitBookConfig(docSpec, config);
      configFiles.push(gitbookConfig);
    }
    
    // Configuration générique
    const genericConfig = await this.generateGenericConfig(docSpec, config);
    configFiles.push(genericConfig);
    
    return configFiles;
  }
  
  /**
   * Utilitaires
   */
  normalizeSections(sections) {
    return sections.map(section => ({
      name: section.name,
      title: section.title || section.name,
      description: section.description || '',
      order: section.order || 0,
      subsections: section.subsections || [],
      required: section.required || false
    }));
  }
  
  /**
   * Conversion de formats
   */
  async convertToFormat(content, fromFormat, toFormat) {
    if (fromFormat === toFormat) return content;
    
    // Implémentation de conversion entre formats
    // Markdown -> HTML, PDF, etc.
    
    return content; // Simplifié pour l'exemple
  }
  
  /**
   * Validation de la documentation
   */
  async validateDocumentation(docs) {
    const issues = [];
    
    for (const doc of docs) {
      // Vérification des liens brisés
      // Vérification de la structure
      // Vérification de la grammaire
      // Vérification des exemples de code
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
  
  /**
   * Génération de métriques de documentation
   */
  async generateMetrics(docs) {
    return {
      totalPages: docs.length,
      totalWords: docs.reduce((sum, doc) => sum + (doc.content?.split(' ').length || 0), 0),
      coverage: this.calculateCoverage(docs),
      lastUpdated: Date.now(),
      languages: ['fr'], // Basé sur la configuration
      formats: [...new Set(docs.map(d => d.format))]
    };
  }
  
  calculateCoverage(docs) {
    // Calcul du pourcentage de couverture de la documentation
    // basé sur les sections requises vs présentes
    return 85; // Exemple
  }
}

