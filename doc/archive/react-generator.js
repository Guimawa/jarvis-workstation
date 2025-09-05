// 📂 generators/react-gen.js
// ===========================
// Générateur de composants React/Next.js
// ===========================

const fs = require('fs');
const path = require('path');
const { formatCode } = require('../utils/formatters');

class ReactGenerator {
  constructor(groqClient, memorySystem) {
    this.groqClient = groqClient;
    this.memory = memorySystem;
  }

  /**
   * Génère un composant React/Next.js
   * @param {string} name - Nom du composant
   * @param {string} directory - Répertoire de destination
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code du composant généré
   */
  async generateComponent(name, directory, projectContext) {
    try {
      console.log(`🧠 Génération du composant ${name}...`);

      // Prompt pour Groq basé sur le contexte
      const prompt = this.buildComponentPrompt(name, projectContext);
      
      // Appel à l'API Groq
      const componentCode = await this.groqClient.generateCode(prompt);
      
      // Formatage du code
      const formattedCode = await formatCode(componentCode, 'javascript');
      
      // Détermination de l'extension
      const extension = projectContext.typescript ? 'tsx' : 'jsx';
      
      // Création du répertoire si nécessaire
      const componentDir = path.join(process.cwd(), directory);
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
      }
      
      // Chemin du fichier
      const filePath = path.join(componentDir, `${name}.${extension}`);
      
      // Écriture du fichier
      fs.writeFileSync(filePath, formattedCode);
      
      console.log(`✅ Composant ${name} généré: ${filePath}`);
      
      // Enregistrement dans la mémoire
      await this.memory.recordGeneration({
        type: 'component',
        name: name,
        path: filePath,
        context: projectContext,
        timestamp: new Date()
      });
      
      return formattedCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération du composant:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour la génération du composant
   * @param {string} name - Nom du composant
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildComponentPrompt(name, context) {
    const { typescript, framework, designSystem } = context;
    
    return `
Génère un composant ${name} ${typescript ? 'TypeScript' : 'JavaScript'} React pour ${framework}.
Utilise ${designSystem} pour le styling.

Le composant doit:
1. Être modulaire et réutilisable
2. Suivre les meilleures pratiques React
3. Avoir des PropTypes ou types TypeScript appropriés
4. Être responsive
5. Avoir une accessibilité de base (aria-labels si nécessaire)
6. Utiliser des hooks modernes (useState, useEffect, etc.)
7. Inclure des commentaires JSDoc pour les props

Génère uniquement le code du composant, sans explications supplémentaires.
`;
  }

  /**
   * Génère une page Next.js
   * @param {string} name - Nom de la page
   * @param {string} directory - Répertoire de destination
   * @param {object} projectContext - Contexte du projet
   * @returns {Promise<string>} Code de la page générée
   */
  async generatePage(name, directory, projectContext) {
    try {
      console.log(`🧠 Génération de la page ${name}...`);
      
      // Prompt spécifique pour les pages Next.js
      const prompt = this.buildPagePrompt(name, projectContext);
      
      // Appel à l'API Groq
      const pageCode = await this.groqClient.generateCode(prompt);
      
      // Formatage du code
      const formattedCode = await formatCode(pageCode, 'javascript');
      
      // Détermination de l'extension
      const extension = projectContext.typescript ? 'tsx' : 'jsx';
      
      // Chemin du fichier (pages/ pour Next.js, src/pages/ pour autres)
      const pagesDir = projectContext.framework === 'nextjs' 
        ? path.join(process.cwd(), 'pages') 
        : path.join(process.cwd(), 'src', 'pages');
      
      if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
      }
      
      // Écriture du fichier
      const filePath = path.join(pagesDir, `${name.toLowerCase()}.${extension}`);
      fs.writeFileSync(filePath, formattedCode);
      
      console.log(`✅ Page ${name} générée: ${filePath}`);
      
      // Enregistrement dans la mémoire
      await this.memory.recordGeneration({
        type: 'page',
        name: name,
        path: filePath,
        context: projectContext,
        timestamp: new Date()
      });
      
      return formattedCode;
      
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la page:', error.message);
      throw error;
    }
  }

  /**
   * Construit le prompt pour la génération de page
   * @param {string} name - Nom de la page
   * @param {object} context - Contexte du projet
   * @returns {string} Prompt détaillé
   */
  buildPagePrompt(name, context) {
    const { typescript, framework, designSystem } = context;
    
    return `
Génère une page ${name} ${typescript ? 'TypeScript' : 'JavaScript'} pour ${framework}.
Utilise ${designSystem} pour le styling.

La page doit:
1. Suivre la structure de routing de ${framework}
2. Inclure les métadonnées appropriées (title, meta tags)
3. Être responsive et accessible
4. Utiliser les meilleures pratiques de performance
5. Inclure des exemples de contenu pertinents
6. Gérer les états de chargement et d'erreur si nécessaire

Génère uniquement le code de la page, sans explications supplémentaires.
`;
  }
}

module.exports = ReactGenerator;