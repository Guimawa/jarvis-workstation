// 📂 generators/test-gen.js
// ==========================
// Générateur de tests unitaires
// ==========================

const fs = require('fs');
const path = require('path');
const { formatCode } = require('../utils/formatters');

class TestGenerator {
  constructor(groqClient, memorySystem) {
    this.groqClient = groqClient;
    this.memory = memorySystem;
  }

  /**
   * Génère des tests unitaires pour un composant
   * @param {string} componentName - Nom du composant
   * @param {string} componentCode - Code du composant
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code des tests générés
   */
  async generateTests(componentName, componentCode, projectContext) {
    try {
      console.log(`🧪 Génération des tests pour ${componentName}...`);
      
      // Prompt pour Groq basé sur le composant et le contexte
      const prompt = this.buildTestPrompt(componentName, componentCode, projectContext);
      
      // Appel à l'API Groq
      const testCode = await this.groqClient.generateCode(prompt);
      
      // Formatage du code
      const formattedCode = await formatCode(testCode, 'javascript');
      
      // Détermination de l'extension
      const extension = projectContext.typescript ? 'test.tsx' : 'test.jsx';
      
      // Création du répertoire __tests__ si nécessaire
      const testsDir = path.join(process.cwd(), 'src', '__tests__');
      if (!fs.existsSync(testsDir)) {
        fs.mkdirSync(testsDir, { recursive: true });
      }
      
      // Chemin du fichier
      const filePath = path.join(testsDir, `${componentName}.${extension}`);
      
      // Écriture du fichier
      fs.writeFileSync(filePath, formattedCode);
      
      console.log(`✅ Tests ${componentName} générés: ${filePath}`);
      
      // Enregistrement dans la mémoire
      await this.memory.recordGeneration({
        type: 'test',
        name: componentName,
        path: filePath,
        context: projectContext,
        timestamp: new Date()
      });
      
      return formattedCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération des tests:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour la génération de tests
   * @param {string} componentName - Nom du composant
   * @param {string} componentCode - Code du composant
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildTestPrompt(componentName, componentCode, context) {
    const { typescript, testingFramework } = context;
    const framework = testingFramework || 'Jest avec Testing Library';
    
    return `
Génère des tests unitaires ${typescript ? 'TypeScript' : 'JavaScript'} avec ${framework} 
pour le composant suivant:

${componentCode}

Les tests doivent:
1. Couvrir les cas d'usage principaux du composant
2. Tester les interactions utilisateur (clics, saisie, etc.)
3. Vérifier le rendu correct des props
4. Tester les états du composant (loading, error, etc.)
5. Inclure des tests d'accessibilité de base
6. Utiliser les meilleures pratiques de testing
7. Être isolés et indépendants
8. Inclure des snapshots si approprié

Génère uniquement le code des tests, sans explications supplémentaires.
`;
  }

  /**
   * Génère un fichier de configuration pour les tests
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code de configuration généré
   */
  async generateTestConfig(projectContext) {
    try {
      console.log('🧪 Génération de la configuration de tests...');
      
      const prompt = this.buildTestConfigPrompt(projectContext);
      const configCode = await this.groqClient.generateCode(prompt);
      
      // Détermination du nom du fichier de configuration
      const configFileName = projectContext.typescript ? 'jest.config.ts' : 'jest.config.js';
      const configPath = path.join(process.cwd(), configFileName);
      
      // Écriture du fichier
      fs.writeFileSync(configPath, configCode);
      
      console.log(`✅ Configuration des tests générée: ${configPath}`);
      
      return configCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la configuration des tests:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour la configuration des tests
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildTestConfigPrompt(context) {
    const { framework, typescript } = context;
    
    return `
Génère un fichier de configuration Jest pour un projet ${framework} 
${typescript ? 'TypeScript' : 'JavaScript'}.

La configuration doit:
1. Configurer le support TypeScript si nécessaire
2. Inclure les mappings de module pour ${framework}
3. Configurer la couverture de code (coverage)
4. Configurer les transformations nécessaires
5. Inclure les setupFiles pour Testing Library
6. Configurer les extensions de fichier à traiter
7. Exclure les dossiers non nécessaires (node_modules, etc.)

Génère uniquement le code de configuration, sans explications supplémentaires.
`;
  }

  /**
   * Génère un setup file pour les tests
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code du setup file généré
   */
  async generateTestSetup(projectContext) {
    try {
      console.log('🧪 Génération du fichier de setup des tests...');
      
      const prompt = this.buildTestSetupPrompt(projectContext);
      const setupCode = await this.groqClient.generateCode(prompt);
      
      // Chemin du fichier de setup
      const setupPath = path.join(process.cwd(), 'src', 'setupTests.js');
      
      // Écriture du fichier
      fs.writeFileSync(setupPath, setupCode);
      
      console.log(`✅ Setup des tests généré: ${setupPath}`);
      
      return setupCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération du setup des tests:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour le setup des tests
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildTestSetupPrompt(context) {
    return `
Génère un fichier de setup pour les tests Jest avec React Testing Library.

Le setup doit:
1. Importer les extensions nécessaires de Jest
2. Configurer les globales pour les tests
3. Configurer le cleanup après chaque test
4. Importer les matchers personnalisés de Testing Library
5. Configurer les mocks globaux si nécessaires

Génère uniquement le code de setup, sans explications supplémentaires.
`;
  }
}

module.exports = TestGenerator;