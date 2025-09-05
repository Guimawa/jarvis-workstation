// ==============================================
// 🌐 API GENERATOR - Générateur de Routes API
// ==============================================
// Version: 2.0.0 Ultra Instinct
// Auteur: Jarvis Expert
// Description: Générateur intelligent de routes API REST/GraphQL
// avec authentification, validation et documentation automatique
// ==============================================

import fs from 'fs/promises';
import path from 'path';
import GroqClient from '../utils/groq-client.js';
import Logger from '../utils/logger.js';
import { formatCode } from '../utils/formatters.js';
import { validateAPISpec } from '../utils/validators.js';

/**
 * Générateur de routes API intelligent
 */
export default class APIGenerator {
  constructor(groqClient, memory) {
    this.groqClient = groqClient || new GroqClient();
    this.memory = memory;
    this.logger = new Logger('APIGenerator');
    
    // Templates et patterns
    this.templates = {
      express: this.getExpressTemplate(),
      fastify: this.getFastifyTemplate(),
      koa: this.getKoaTemplate(),
      graphql: this.getGraphQLTemplate()
    };
    
    // Configuration par défaut
    this.defaultConfig = {
      framework: 'express',
      authentication: true,
      validation: true,
      documentation: true,
      testing: true,
      typescript: false,
      database: 'mongodb',
      cors: true,
      rateLimit: true
    };
  }
  
  /**
   * Génération d'une API complète
   */
  async generateAPI(spec, options = {}) {
    try {
      this.logger.info(`🌐 Génération de l'API: ${spec.name}`);
      
      const config = { ...this.defaultConfig, ...options };
      const apiSpec = await this.analyzeAPISpec(spec);
      
      // Génération des composants
      const routes = await this.generateRoutes(apiSpec, config);
      const middleware = await this.generateMiddleware(apiSpec, config);
      const models = await this.generateModels(apiSpec, config);
      const controllers = await this.generateControllers(apiSpec, config);
      const validators = await this.generateValidators(apiSpec, config);
      const tests = config.testing ? await this.generateTests(apiSpec, config) : null;
      const docs = config.documentation ? await this.generateDocumentation(apiSpec, config) : null;
      
      // Structure du projet
      const projectStructure = await this.createProjectStructure(apiSpec, config);
      
      // Fichiers de configuration
      const configFiles = await this.generateConfigFiles(apiSpec, config);
      
      return {
        success: true,
        api: {
          spec: apiSpec,
          routes,
          middleware,
          models,
          controllers,
          validators,
          tests,
          docs,
          structure: projectStructure,
          config: configFiles
        },
        metadata: {
          framework: config.framework,
          endpoints: routes.length,
          models: models.length,
          timestamp: Date.now()
        }
      };
      
    } catch (error) {
      this.logger.error('❌ Erreur génération API:', error);
      throw error;
    }
  }
  
  /**
   * Analyse de la spécification API
   */
  async analyzeAPISpec(spec) {
    const prompt = `
Analyse cette spécification d'API et structure-la de manière optimale:

Spécification:
${JSON.stringify(spec, null, 2)}

Retourne une spécification structurée avec:
- Endpoints organisés par ressource
- Modèles de données inférés
- Relations entre entités
- Besoins d'authentification
- Validation requise
- Patterns REST appropriés
`;
    
    const analysis = await this.groqClient.generateCode({
      type: 'api-analysis',
      prompt,
      context: { spec }
    });
    
    return {
      ...spec,
      ...analysis,
      endpoints: this.normalizeEndpoints(analysis.endpoints || []),
      models: this.normalizeModels(analysis.models || []),
      auth: analysis.auth || { required: true, type: 'jwt' }
    };
  }
  
  /**
   * Génération des routes
   */
  async generateRoutes(apiSpec, config) {
    const routes = [];
    
    for (const endpoint of apiSpec.endpoints) {
      const route = await this.generateSingleRoute(endpoint, apiSpec, config);
      routes.push(route);
    }
    
    return routes;
  }
  
  /**
   * Génération d'une route unique
   */
  async generateSingleRoute(endpoint, apiSpec, config) {
    const template = this.templates[config.framework];
    
    const prompt = `
Génère une route ${config.framework} pour cet endpoint:

Endpoint: ${JSON.stringify(endpoint, null, 2)}
Framework: ${config.framework}
Configuration: ${JSON.stringify(config, null, 2)}

Template de base:
${template.route}

Inclus:
- Validation des paramètres
- Gestion d'erreurs
- Authentification si requise
- Documentation JSDoc
- Logging approprié
- Codes de statut HTTP corrects
`;
    
    const routeCode = await this.groqClient.generateCode({
      type: 'api-route',
      prompt,
      context: { endpoint, config, framework: config.framework }
    });
    
    return {
      path: endpoint.path,
      method: endpoint.method,
      name: endpoint.name,
      code: await formatCode(routeCode, config.typescript ? 'typescript' : 'javascript'),
      filename: this.getRouteFilename(endpoint, config),
      middleware: endpoint.middleware || [],
      auth: endpoint.auth || false
    };
  }
  
  /**
   * Génération des middlewares
   */
  async generateMiddleware(apiSpec, config) {
    const middlewares = [];
    
    // Middleware d'authentification
    if (config.authentication) {
      const authMiddleware = await this.generateAuthMiddleware(apiSpec, config);
      middlewares.push(authMiddleware);
    }
    
    // Middleware de validation
    if (config.validation) {
      const validationMiddleware = await this.generateValidationMiddleware(apiSpec, config);
      middlewares.push(validationMiddleware);
    }
    
    // Middleware de rate limiting
    if (config.rateLimit) {
      const rateLimitMiddleware = await this.generateRateLimitMiddleware(apiSpec, config);
      middlewares.push(rateLimitMiddleware);
    }
    
    // Middleware de logging
    const loggingMiddleware = await this.generateLoggingMiddleware(apiSpec, config);
    middlewares.push(loggingMiddleware);
    
    // Middleware d'erreurs
    const errorMiddleware = await this.generateErrorMiddleware(apiSpec, config);
    middlewares.push(errorMiddleware);
    
    return middlewares;
  }
  
  /**
   * Génération des modèles de données
   */
  async generateModels(apiSpec, config) {
    const models = [];
    
    for (const model of apiSpec.models) {
      const modelCode = await this.generateSingleModel(model, apiSpec, config);
      models.push(modelCode);
    }
    
    return models;
  }
  
  /**
   * Génération d'un modèle unique
   */
  async generateSingleModel(model, apiSpec, config) {
    const template = this.getModelTemplate(config.database);
    
    const prompt = `
Génère un modèle ${config.database} pour cette entité:

Modèle: ${JSON.stringify(model, null, 2)}
Base de données: ${config.database}
Configuration: ${JSON.stringify(config, null, 2)}

Template de base:
${template}

Inclus:
- Schéma avec validation
- Méthodes CRUD
- Relations avec autres modèles
- Hooks/middleware de modèle
- Indexation appropriée
- Timestamps automatiques
`;
    
    const modelCode = await this.groqClient.generateCode({
      type: 'data-model',
      prompt,
      context: { model, config, database: config.database }
    });
    
    return {
      name: model.name,
      code: await formatCode(modelCode, config.typescript ? 'typescript' : 'javascript'),
      filename: `${model.name.toLowerCase()}.${config.typescript ? 'ts' : 'js'}`,
      fields: model.fields,
      relations: model.relations || []
    };
  }
  
  /**
   * Génération des contrôleurs
   */
  async generateControllers(apiSpec, config) {
    const controllers = [];
    
    // Groupement des endpoints par ressource
    const resourceGroups = this.groupEndpointsByResource(apiSpec.endpoints);
    
    for (const [resource, endpoints] of Object.entries(resourceGroups)) {
      const controller = await this.generateSingleController(resource, endpoints, apiSpec, config);
      controllers.push(controller);
    }
    
    return controllers;
  }
  
  /**
   * Génération d'un contrôleur unique
   */
  async generateSingleController(resource, endpoints, apiSpec, config) {
    const prompt = `
Génère un contrôleur pour la ressource "${resource}":

Endpoints: ${JSON.stringify(endpoints, null, 2)}
Framework: ${config.framework}
Configuration: ${JSON.stringify(config, null, 2)}

Inclus:
- Méthodes pour chaque endpoint
- Logique métier appropriée
- Gestion d'erreurs
- Validation des données
- Interaction avec les modèles
- Réponses structurées
- Documentation JSDoc
`;
    
    const controllerCode = await this.groqClient.generateCode({
      type: 'api-controller',
      prompt,
      context: { resource, endpoints, config }
    });
    
    return {
      name: resource,
      code: await formatCode(controllerCode, config.typescript ? 'typescript' : 'javascript'),
      filename: `${resource.toLowerCase()}.controller.${config.typescript ? 'ts' : 'js'}`,
      endpoints: endpoints.length,
      methods: endpoints.map(e => e.method)
    };
  }
  
  /**
   * Génération des validateurs
   */
  async generateValidators(apiSpec, config) {
    const validators = [];
    
    for (const endpoint of apiSpec.endpoints) {
      if (endpoint.validation) {
        const validator = await this.generateSingleValidator(endpoint, apiSpec, config);
        validators.push(validator);
      }
    }
    
    return validators;
  }
  
  /**
   * Génération d'un validateur unique
   */
  async generateSingleValidator(endpoint, apiSpec, config) {
    const prompt = `
Génère un validateur pour cet endpoint:

Endpoint: ${JSON.stringify(endpoint, null, 2)}
Validation: ${JSON.stringify(endpoint.validation, null, 2)}

Utilise Joi ou Yup pour la validation.
Inclus:
- Validation des paramètres
- Validation du body
- Validation des query params
- Messages d'erreur personnalisés
- Sanitisation des données
`;
    
    const validatorCode = await this.groqClient.generateCode({
      type: 'api-validator',
      prompt,
      context: { endpoint, config }
    });
    
    return {
      name: `${endpoint.name}Validator`,
      code: await formatCode(validatorCode, config.typescript ? 'typescript' : 'javascript'),
      filename: `${endpoint.name.toLowerCase()}.validator.${config.typescript ? 'ts' : 'js'}`,
      endpoint: endpoint.name
    };
  }
  
  /**
   * Génération des tests
   */
  async generateTests(apiSpec, config) {
    const tests = [];
    
    for (const endpoint of apiSpec.endpoints) {
      const test = await this.generateSingleTest(endpoint, apiSpec, config);
      tests.push(test);
    }
    
    // Test d'intégration global
    const integrationTest = await this.generateIntegrationTest(apiSpec, config);
    tests.push(integrationTest);
    
    return tests;
  }
  
  /**
   * Génération d'un test unique
   */
  async generateSingleTest(endpoint, apiSpec, config) {
    const prompt = `
Génère des tests Jest/Mocha pour cet endpoint:

Endpoint: ${JSON.stringify(endpoint, null, 2)}
Framework: ${config.framework}

Inclus:
- Tests de succès
- Tests d'erreur
- Tests de validation
- Tests d'authentification
- Mocking approprié
- Setup et teardown
- Assertions complètes
`;
    
    const testCode = await this.groqClient.generateCode({
      type: 'api-test',
      prompt,
      context: { endpoint, config }
    });
    
    return {
      name: `${endpoint.name}Test`,
      code: await formatCode(testCode, config.typescript ? 'typescript' : 'javascript'),
      filename: `${endpoint.name.toLowerCase()}.test.${config.typescript ? 'ts' : 'js'}`,
      endpoint: endpoint.name
    };
  }
  
  /**
   * Génération de la documentation
   */
  async generateDocumentation(apiSpec, config) {
    const docs = [];
    
    // Documentation OpenAPI/Swagger
    const openApiDoc = await this.generateOpenAPIDoc(apiSpec, config);
    docs.push(openApiDoc);
    
    // README
    const readme = await this.generateReadme(apiSpec, config);
    docs.push(readme);
    
    // Guide d'utilisation
    const usageGuide = await this.generateUsageGuide(apiSpec, config);
    docs.push(usageGuide);
    
    return docs;
  }
  
  /**
   * Génération de la documentation OpenAPI
   */
  async generateOpenAPIDoc(apiSpec, config) {
    const prompt = `
Génère une spécification OpenAPI 3.0 complète pour cette API:

API: ${JSON.stringify(apiSpec, null, 2)}
Configuration: ${JSON.stringify(config, null, 2)}

Inclus:
- Info et métadonnées
- Tous les endpoints avec paramètres
- Schémas de données
- Réponses et codes d'erreur
- Authentification
- Exemples de requêtes/réponses
`;
    
    const openApiSpec = await this.groqClient.generateCode({
      type: 'openapi-spec',
      prompt,
      context: { apiSpec, config }
    });
    
    return {
      name: 'OpenAPI Specification',
      code: JSON.stringify(openApiSpec, null, 2),
      filename: 'openapi.json',
      type: 'documentation'
    };
  }
  
  /**
   * Création de la structure du projet
   */
  async createProjectStructure(apiSpec, config) {
    const structure = {
      'src/': {
        'routes/': {},
        'controllers/': {},
        'models/': {},
        'middleware/': {},
        'validators/': {},
        'services/': {},
        'utils/': {},
        'config/': {}
      },
      'tests/': {
        'unit/': {},
        'integration/': {},
        'fixtures/': {}
      },
      'docs/': {},
      'scripts/': {}
    };
    
    // Ajout des fichiers spécifiques au framework
    if (config.framework === 'express') {
      structure['src/']['app.js'] = 'Application Express principale';
      structure['src/']['server.js'] = 'Serveur HTTP';
    }
    
    // Ajout des fichiers de configuration
    structure['package.json'] = 'Configuration npm';
    structure['.env.example'] = 'Variables d\'environnement exemple';
    structure['README.md'] = 'Documentation du projet';
    
    if (config.typescript) {
      structure['tsconfig.json'] = 'Configuration TypeScript';
    }
    
    return structure;
  }
  
  /**
   * Génération des fichiers de configuration
   */
  async generateConfigFiles(apiSpec, config) {
    const configFiles = [];
    
    // Package.json
    const packageJson = await this.generatePackageJson(apiSpec, config);
    configFiles.push(packageJson);
    
    // Fichier principal de l'app
    const appFile = await this.generateAppFile(apiSpec, config);
    configFiles.push(appFile);
    
    // Configuration de base de données
    const dbConfig = await this.generateDatabaseConfig(apiSpec, config);
    configFiles.push(dbConfig);
    
    // Variables d'environnement
    const envFile = await this.generateEnvFile(apiSpec, config);
    configFiles.push(envFile);
    
    if (config.typescript) {
      const tsConfig = await this.generateTSConfig(apiSpec, config);
      configFiles.push(tsConfig);
    }
    
    return configFiles;
  }
  
  /**
   * Templates pour différents frameworks
   */
  getExpressTemplate() {
    return {
      route: `
const express = require('express');
const router = express.Router();

// Route template
router.{{method}}('{{path}}', async (req, res) => {
  try {
    // Implementation here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
      `
    };
  }
  
  getFastifyTemplate() {
    return {
      route: `
async function routes(fastify, options) {
  fastify.{{method}}('{{path}}', async (request, reply) => {
    try {
      // Implementation here
      return { success: true };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  });
}

module.exports = routes;
      `
    };
  }
  
  getKoaTemplate() {
    return {
      route: `
const Router = require('@koa/router');
const router = new Router();

router.{{method}}('{{path}}', async (ctx) => {
  try {
    // Implementation here
    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

module.exports = router;
      `
    };
  }
  
  getGraphQLTemplate() {
    return {
      resolver: `
const resolvers = {
  Query: {
    // Query resolvers
  },
  Mutation: {
    // Mutation resolvers
  }
};

module.exports = resolvers;
      `
    };
  }
  
  /**
   * Template de modèle selon la base de données
   */
  getModelTemplate(database) {
    switch (database) {
      case 'mongodb':
        return `
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // Schema definition
}, {
  timestamps: true
});

module.exports = mongoose.model('{{ModelName}}', schema);
        `;
      
      case 'postgresql':
        return `
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Model = sequelize.define('{{ModelName}}', {
    // Model definition
  });
  
  return Model;
};
        `;
      
      default:
        return `
// Generic model template
class {{ModelName}} {
  constructor(data) {
    Object.assign(this, data);
  }
}

module.exports = {{ModelName}};
        `;
    }
  }
  
  /**
   * Utilitaires
   */
  normalizeEndpoints(endpoints) {
    return endpoints.map(endpoint => ({
      name: endpoint.name || this.generateEndpointName(endpoint),
      path: endpoint.path,
      method: endpoint.method.toLowerCase(),
      description: endpoint.description || '',
      parameters: endpoint.parameters || [],
      body: endpoint.body || null,
      responses: endpoint.responses || {},
      auth: endpoint.auth || false,
      validation: endpoint.validation || null,
      middleware: endpoint.middleware || []
    }));
  }
  
  normalizeModels(models) {
    return models.map(model => ({
      name: model.name,
      fields: model.fields || {},
      relations: model.relations || [],
      indexes: model.indexes || [],
      hooks: model.hooks || []
    }));
  }
  
  generateEndpointName(endpoint) {
    const method = endpoint.method.toLowerCase();
    const pathParts = endpoint.path.split('/').filter(p => p && !p.startsWith(':'));
    return `${method}${pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
  }
  
  getRouteFilename(endpoint, config) {
    const ext = config.typescript ? 'ts' : 'js';
    return `${endpoint.name.toLowerCase()}.route.${ext}`;
  }
  
  groupEndpointsByResource(endpoints) {
    const groups = {};
    
    endpoints.forEach(endpoint => {
      const resource = endpoint.path.split('/')[1] || 'default';
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(endpoint);
    });
    
    return groups;
  }
  
  /**
   * Génération du package.json
   */
  async generatePackageJson(apiSpec, config) {
    const dependencies = this.getFrameworkDependencies(config.framework);
    
    if (config.authentication) dependencies.push('jsonwebtoken', 'bcryptjs');
    if (config.validation) dependencies.push('joi');
    if (config.cors) dependencies.push('cors');
    if (config.rateLimit) dependencies.push('express-rate-limit');
    if (config.database === 'mongodb') dependencies.push('mongoose');
    if (config.database === 'postgresql') dependencies.push('sequelize', 'pg');
    
    const packageJson = {
      name: apiSpec.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: apiSpec.description || 'API générée par Jarvis',
      main: config.typescript ? 'dist/app.js' : 'src/app.js',
      scripts: {
        start: 'node src/app.js',
        dev: 'nodemon src/app.js',
        test: 'jest',
        'test:watch': 'jest --watch'
      },
      dependencies: dependencies.reduce((acc, dep) => {
        acc[dep] = 'latest';
        return acc;
      }, {}),
      devDependencies: {
        nodemon: 'latest',
        jest: 'latest',
        supertest: 'latest'
      }
    };
    
    if (config.typescript) {
      packageJson.devDependencies.typescript = 'latest';
      packageJson.devDependencies['@types/node'] = 'latest';
      packageJson.scripts.build = 'tsc';
      packageJson.scripts.start = 'node dist/app.js';
    }
    
    return {
      name: 'package.json',
      code: JSON.stringify(packageJson, null, 2),
      filename: 'package.json'
    };
  }
  
  getFrameworkDependencies(framework) {
    switch (framework) {
      case 'express':
        return ['express', 'helmet', 'compression'];
      case 'fastify':
        return ['fastify'];
      case 'koa':
        return ['koa', '@koa/router', '@koa/cors'];
      default:
        return ['express'];
    }
  }
}

