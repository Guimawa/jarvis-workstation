// Test du générateur React avec Abacus LLM
import ReactGeneratorAbacus from './src/generators/react-gen-abacus.js';

async function testReactGeneratorAbacus() {
  console.log('⚛️ Test du générateur React avec Abacus LLM...\n');
  
  try {
    // Initialisation du générateur
    const generator = new ReactGeneratorAbacus({
      abacusApiKey: process.env.ABACUS_API_KEY || 'your-api-key-here',
      enableValidation: true
    });
    
    await generator.initialize();
    console.log('✅ Générateur React Abacus initialisé');
    
    // Test 1: Génération d'un composant simple
    console.log('\n📝 Test 1: Composant Button simple');
    const buttonSpec = {
      name: 'Button',
      type: 'fonctionnel',
      description: 'un bouton réutilisable avec différentes variantes',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Contenu du bouton' },
        { name: 'variant', type: 'string', required: false, description: 'Variante du bouton (primary, secondary, danger)' },
        { name: 'size', type: 'string', required: false, description: 'Taille du bouton (sm, md, lg)' },
        { name: 'onClick', type: 'function', required: false, description: 'Fonction de clic' }
      ],
      features: ['Variantes de style', 'Tailles différentes', 'Gestion des événements'],
      styling: 'Tailwind CSS',
      accessibility: true,
      performance: true
    };
    
    const buttonResult = await generator.generateComponent(buttonSpec, {
      typescript: true,
      storybook: true,
      tests: true,
      documentation: true
    });
    
    if (buttonResult.success) {
      console.log('✅ Composant Button généré avec succès');
      console.log(`   Qualité: ${(buttonResult.metadata.quality * 100).toFixed(1)}%`);
      console.log(`   Tokens: ${buttonResult.metadata.tokens}`);
      console.log('\n📄 Code généré:');
      console.log(buttonResult.component);
      
      if (buttonResult.documentation) {
        console.log('\n📚 Documentation:');
        console.log(buttonResult.documentation.content);
      }
      
      if (buttonResult.tests) {
        console.log('\n🧪 Tests:');
        console.log(buttonResult.tests.content);
      }
      
      if (buttonResult.storybook) {
        console.log('\n📖 Storybook:');
        console.log(buttonResult.storybook.content);
      }
    } else {
      console.log('❌ Échec de la génération du composant Button');
      console.log(`   Erreur: ${buttonResult.error.message}`);
    }
    
    // Test 2: Génération d'une page complète
    console.log('\n📝 Test 2: Page Dashboard');
    const dashboardSpec = {
      name: 'DashboardPage',
      description: 'une page de dashboard avec statistiques et graphiques',
      layout: 'Sidebar + Main content',
      sections: [
        'Header avec navigation',
        'Sidebar avec menu',
        'Section statistiques',
        'Graphiques de données',
        'Tableau des activités récentes'
      ]
    };
    
    const dashboardResult = await generator.generatePage(dashboardSpec, {
      typescript: true,
      documentation: true
    });
    
    if (dashboardResult.success) {
      console.log('✅ Page Dashboard générée avec succès');
      console.log(`   Qualité: ${(dashboardResult.metadata.quality * 100).toFixed(1)}%`);
      console.log(`   Tokens: ${dashboardResult.metadata.tokens}`);
      console.log('\n📄 Code de la page:');
      console.log(dashboardResult.page.substring(0, 500) + '...');
    } else {
      console.log('❌ Échec de la génération de la page Dashboard');
      console.log(`   Erreur: ${dashboardResult.error.message}`);
    }
    
    // Test 3: Génération d'un hook personnalisé
    console.log('\n📝 Test 3: Hook useApi');
    const hookSpec = {
      name: 'useApi',
      description: 'gère les appels API avec loading, erreur et données',
      parameters: [
        { name: 'url', type: 'string', required: true, description: 'URL de l\'API' },
        { name: 'options', type: 'object', required: false, description: 'Options de la requête' }
      ],
      returnValue: '{ data, loading, error, refetch }'
    };
    
    const hookResult = await generator.generateHook(hookSpec, {
      typescript: true,
      tests: true,
      documentation: true
    });
    
    if (hookResult.success) {
      console.log('✅ Hook useApi généré avec succès');
      console.log(`   Qualité: ${(hookResult.metadata.quality * 100).toFixed(1)}%`);
      console.log(`   Tokens: ${hookResult.metadata.tokens}`);
      console.log('\n📄 Code du hook:');
      console.log(hookResult.hook);
      
      if (hookResult.tests) {
        console.log('\n🧪 Tests du hook:');
        console.log(hookResult.tests.content);
      }
    } else {
      console.log('❌ Échec de la génération du hook useApi');
      console.log(`   Erreur: ${hookResult.error.message}`);
    }
    
    // Test 4: Métriques du générateur
    console.log('\n📊 Métriques du générateur:');
    const metrics = generator.getMetrics();
    if (metrics) {
      console.log(`   Requêtes totales: ${metrics.totalRequests}`);
      console.log(`   Requêtes réussies: ${metrics.successfulRequests}`);
      console.log(`   Taux de succès: ${(metrics.successRate * 100).toFixed(1)}%`);
      console.log(`   Temps moyen: ${metrics.averageResponseTime.toFixed(0)}ms`);
      console.log(`   Qualité moyenne: ${(metrics.averageQuality * 100).toFixed(1)}%`);
      console.log(`   Taux de cache: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
    }
    
    console.log('\n🎉 Tous les tests du générateur React Abacus sont passés avec succès !');
    
    // Fermeture du générateur
    await generator.close();
    console.log('✅ Générateur fermé proprement');
    
  } catch (error) {
    console.error('❌ Erreur lors du test du générateur React Abacus:', error);
    
    if (error.message.includes('Clé API Abacus manquante')) {
      console.log('\n💡 Pour tester avec une vraie clé API:');
      console.log('   1. Obtenez votre clé API sur https://abacus.ai');
      console.log('   2. Définissez la variable d\'environnement:');
      console.log('      export ABACUS_API_KEY="votre-clé-api"');
      console.log('   3. Relancez le test');
    }
  }
}

testReactGeneratorAbacus();
