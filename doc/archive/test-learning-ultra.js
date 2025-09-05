// Test du système d'apprentissage Ultra Instinct
import LearningSystemUltra from './src/core/learning-ultra.js';

async function testLearningUltra() {
  console.log('🎓 Test du système d\'apprentissage Ultra Instinct...\n');
  
  try {
    // Initialisation
    const learning = new LearningSystemUltra({
      dataPath: './test-data/learning',
      learningRate: 0.1,
      memoryWindow: 100
    });
    
    await learning.initialize();
    console.log('✅ Système d\'apprentissage Ultra initialisé');
    
    // Test d'apprentissage à partir d'un succès
    const request = {
      type: 'component',
      name: 'TestButton',
      description: 'Un bouton de test',
      domain: 'react',
      complexity: 0.3
    };
    
    const result = {
      success: true,
      validation: { quality: 0.9 },
      metadata: { responseTime: 1500 },
      strategy: 'direct_generation'
    };
    
    const analysis = {
      domain: 'react',
      complexity: 0.3,
      confidence: 0.8
    };
    
    await learning.learnFromExecution(request, result, analysis);
    console.log('✅ Apprentissage à partir d\'un succès');
    
    // Test d'apprentissage à partir d'un échec
    const failedRequest = {
      type: 'component',
      name: 'ComplexComponent',
      description: 'Un composant complexe',
      domain: 'react',
      complexity: 0.9
    };
    
    const error = new Error('Timeout: La requête a pris trop de temps');
    
    await learning.learnFromFailure(failedRequest, error);
    console.log('✅ Apprentissage à partir d\'un échec');
    
    // Test de sélection de stratégie
    const strategies = [
      { name: 'direct_generation', condition: true },
      { name: 'iterative_refinement', condition: true },
      { name: 'collaborative_approach', condition: true }
    ];
    
    const bestStrategy = await learning.selectBestStrategy(strategies, analysis);
    console.log(`✅ Meilleure stratégie sélectionnée: ${bestStrategy?.name || 'Aucune'}`);
    
    // Test des statistiques
    const stats = learning.getStats();
    console.log('✅ Statistiques d\'apprentissage:', {
      totalEvents: stats.metrics.totalLearningEvents,
      patterns: stats.knowledge.patterns,
      strategies: stats.knowledge.strategies,
      optimizations: stats.knowledge.optimizations
    });
    
    // Test des logs d'apprentissage
    const { getLearningLogs } = await import('./src/core/learning-ultra.js');
    const logs = getLearningLogs();
    console.log(`✅ Logs d'apprentissage: ${logs.length} entrées`);
    
    console.log('\n🎉 Tous les tests d\'apprentissage sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'apprentissage:', error);
  }
}

testLearningUltra();
