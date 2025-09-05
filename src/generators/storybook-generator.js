// 📂 generators/storybook-gen.js
// ==============================
// Générateur de stories Storybook
// ==============================

const fs = require('fs');
const path = require('path');
const { formatCode } = require('../utils/formatters');

class StorybookGenerator {
  constructor(groqClient, memorySystem) {
    this.groqClient = groqClient;
    this.memory = memorySystem;
  }

  /**
   * Génère une story Storybook pour un composant
   * @param {string} componentName - Nom du composant
   * @param {string} componentCode - Code du composant
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code de la story générée
   */
  async generateStory(componentName, componentCode, projectContext) {
    try {
      console.log(`📚 Génération de la story pour ${componentName}...`);
      
      // Prompt pour Groq basé sur le composant et le contexte
      const prompt = this.buildStoryPrompt(componentName, componentCode, projectContext);
      
      // Appel à l'API Groq
      const storyCode = await this.groqClient.generateCode(prompt);
      
      // Formatage du code
      const formattedCode = await formatCode(storyCode, 'javascript');
      
      // Détermination de l'extension
      const extension = projectContext.typescript ? 'ts' : 'js';
      
      // Création du répertoire stories si nécessaire
      const storiesDir = path.join(process.cwd(), 'src', 'stories');
      if (!fs.existsSync(storiesDir)) {
        fs.mkdirSync(storiesDir, { recursive: true });
      }
      
      // Chemin du fichier
      const filePath = path.join(storiesDir, `${componentName}.stories.${extension}`);
      
      // Écriture du fichier
      fs.writeFileSync(filePath, formattedCode);
      
      console.log(`✅ Story ${componentName} générée: ${filePath}`);
      
      // Enregistrement dans la mémoire
      await this.memory.recordGeneration({
        type: 'story',
        name: componentName,
        path: filePath,
        context: projectContext,
        timestamp: new Date()
      });
      
      return formattedCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la story:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour la génération de story
   * @param {string} componentName - Nom du composant
   * @param {string} componentCode - Code du composant
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildStoryPrompt(componentName, componentCode, context) {
    const { typescript } = context;
    
    return `
Génère une story Storybook ${typescript ? 'TypeScript' : 'JavaScript'} pour le composant suivant:

${componentCode}

La story doit:
1. Couvrir tous les états et variantes du composant
2. Inclure des contrôles (args) pour toutes les props modifiables
3. Suivre les meilleures pratiques Storybook
4. Inclure une documentation avec des descriptions pertinentes
5. Avoir des noms significatifs pour chaque story
6. Utiliser Template.bind({}) pour les stories basées sur des args

Génère uniquement le code de la story, sans explications supplémentaires.
`;
  }

  /**
   * Génère un fichier de configuration pour Storybook
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code de configuration généré
   */
  async generateStorybookConfig(projectContext) {
    try {
      console.log('📚 Génération de la configuration Storybook...');
      
      const prompt = this.buildConfigPrompt(projectContext);
      const configCode = await this.groqClient.generateCode(prompt);
      
      // Chemin du fichier de configuration principal
      const configPath = path.join(process.cwd(), '.storybook', 'main.js');
      
      // Création du répertoire .storybook si nécessaire
      const storybookDir = path.join(process.cwd(), '.storybook');
      if (!fs.existsSync(storybookDir)) {
        fs.mkdirSync(storybookDir, { recursive: true });
      }
      
      // Écriture du fichier
      fs.writeFileSync(configPath, configCode);
      
      console.log(`✅ Configuration Storybook générée: ${configPath}`);
      
      return configCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la configuration Storybook:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour la configuration Storybook
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildConfigPrompt(context) {
    const { framework, typescript, designSystem } = context;
    
    return `
Génère un fichier de configuration Storybook (main.js) pour un projet ${framework} 
${typescript ? 'TypeScript' : 'JavaScript'} utilisant ${designSystem}.

La configuration doit:
1. Inclure les addons essentiels (controls, actions, etc.)
2. Configurer le support TypeScript si nécessaire
3. Configurer le support de ${designSystem}
4. Inclure la gestion des assets statiques (images, CSS)
5. Configurer le webpack pour le projet ${framework}
6. Inclure des alias de chemin si communs dans ${framework}

Génère uniquement le code de configuration, sans explications supplémentaires.
`;
  }
}

module.exports = StorybookGenerator;