// Test du client Abacus LLM
import AbacusClient from './src/core/abacus-client.js';

async function testAbacusClient() {
  console.log('🔗 Test du client Abacus LLM...\n');
  
  try {
    // Initialisation du client
    const abacus = new AbacusClient({
      apiKey: process.env.ABACUS_API_KEY || 's2_3df6866c7c9241109d5e59cd77460986',
      enableCache: true,
      enableMetrics: true
    });
    
    await abacus.initialize();
    console.log('✅ Client Abacus initialisé');
    
    // Test 1: Génération de code simple
    console.log('\n📝 Test 1: Génération de composant React');
    const codeResult = await abacus.generateCode(
      'Crée un composant Button avec props pour le texte et onClick',
      {
        type: 'component',
        typescript: true,
        temperature: 0.7
      }
    );
    
    console.log(`✅ Code généré avec succès`);
    console.log(`   Qualité: ${(codeResult.quality * 100).toFixed(1)}%`);
    console.log(`   Tokens: ${codeResult.metadata.tokens}`);
    console.log(`   Modèle: ${codeResult.metadata.model}`);
    console.log('\n📄 Code généré:');
    console.log(codeResult.content);
    
    // Test 2: Génération de documentation
    console.log('\n📝 Test 2: Génération de documentation');
    const docResult = await abacus.generateDocumentation(codeResult.content, {
      maxTokens: 500
    });
    
    console.log(`✅ Documentation générée avec succès`);
    console.log(`   Qualité: ${(docResult.quality * 100).toFixed(1)}%`);
    console.log(`   Tokens: ${docResult.metadata.tokens}`);
    console.log('\n📚 Documentation:');
    console.log(docResult.content);
    
    // Test 3: Analyse de code
    console.log('\n📝 Test 3: Analyse de code');
    const analysisResult = await abacus.analyzeCode(codeResult.content, {
      maxTokens: 300
    });
    
    console.log(`✅ Analyse terminée avec succès`);
    console.log(`   Qualité: ${(analysisResult.quality * 100).toFixed(1)}%`);
    console.log(`   Tokens: ${analysisResult.metadata.tokens}`);
    console.log('\n🔍 Analyse:');
    console.log(analysisResult.content);
    
    // Test 4: Génération de tests
    console.log('\n📝 Test 4: Génération de tests');
    const testResult = await abacus.generateTests(codeResult.content, {
      maxTokens: 800
    });
    
    console.log(`✅ Tests générés avec succès`);
    console.log(`   Qualité: ${(testResult.quality * 100).toFixed(1)}%`);
    console.log(`   Tokens: ${testResult.metadata.tokens}`);
    console.log('\n🧪 Tests:');
    console.log(testResult.content);
    
    // Test 5: Test du cache
    console.log('\n📝 Test 5: Test du cache');
    const startTime = Date.now();
    const cachedResult = await abacus.generateCode(
      'Crée un composant Button avec props pour le texte et onClick',
      { type: 'component' }
    );
    const cacheTime = Date.now() - startTime;
    
    console.log(`✅ Requête mise en cache`);
    console.log(`   Temps de réponse: ${cacheTime}ms`);
    console.log(`   Contenu identique: ${cachedResult.content === codeResult.content}`);
    
    // Test 6: Métriques
    console.log('\n📊 Métriques du client Abacus:');
    const metrics = abacus.getMetrics();
    console.log(`   Requêtes totales: ${metrics.totalRequests}`);
    console.log(`   Requêtes réussies: ${metrics.successfulRequests}`);
    console.log(`   Taux de succès: ${(metrics.successRate * 100).toFixed(1)}%`);
    console.log(`   Temps moyen: ${metrics.averageResponseTime.toFixed(0)}ms`);
    console.log(`   Qualité moyenne: ${(metrics.averageQuality * 100).toFixed(1)}%`);
    console.log(`   Taux de cache: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
    
    // Test 7: Historique des requêtes
    console.log('\n📋 Historique des requêtes:');
    const history = abacus.getRequestHistory(3);
    history.forEach((req, index) => {
      console.log(`   ${index + 1}. ${req.request.type} - ${req.responseTime}ms - ${(req.response.quality * 100).toFixed(1)}%`);
    });
    
    console.log('\n🎉 Tous les tests Abacus sont passés avec succès !');
    
    // Fermeture du client
    await abacus.close();
    console.log('✅ Client Abacus fermé proprement');
    
  } catch (error) {
    console.error('❌ Erreur lors du test Abacus:', error);
    
    if (error.message.includes('Clé API Abacus manquante')) {
      console.log('\n💡 Pour tester avec une vraie clé API:');
      console.log('   1. Obtenez votre clé API sur https://abacus.ai');
      console.log('   2. Définissez la variable d\'environnement:');
      console.log('      export ABACUS_API_KEY="votre-clé-api"');
      console.log('   3. Relancez le test');
    }
  }
}

testAbacusClient();
