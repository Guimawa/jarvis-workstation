// Test du cerveau Ultra Instinct
import BrainSystemUltra from './src/core/brain-ultra.js';

async function testBrainUltra() {
  console.log('🧠 Test du cerveau Ultra Instinct...\n');
  
  try {
    // Initialisation
    const brain = new BrainSystemUltra({
      memoryEnabled: true,
      learningEnabled: true,
      maxConcurrentTasks: 3
    });
    
    await brain.initialize();
    console.log('✅ Cerveau Ultra Instinct initialisé');
    
    // Test de traitement d'une requête simple
    const simpleRequest = {
      type: 'component',
      name: 'SimpleButton',
      description: 'Un bouton simple',
      domain: 'react'
    };
    
    console.log('\n📝 Test 1: Requête simple');
    const result1 = await brain.processRequest(simpleRequest);
    console.log(`✅ Résultat: ${result1.success ? 'Succès' : 'Échec'}`);
    console.log(`   Stratégie: ${result1.strategy}`);
    console.log(`   Temps: ${result1.metadata.processingTime}ms`);
    
    // Test de traitement d'une requête complexe
    const complexRequest = {
      type: 'component',
      name: 'ComplexDashboard',
      description: 'Un dashboard complexe avec plusieurs sections et interactions',
      domain: 'react',
      customRequirements: ['responsive', 'dark-mode', 'animations'],
      dependencies: ['react-router', 'framer-motion', 'recharts']
    };
    
    console.log('\n📝 Test 2: Requête complexe');
    const result2 = await brain.processRequest(complexRequest);
    console.log(`✅ Résultat: ${result2.success ? 'Succès' : 'Échec'}`);
    console.log(`   Stratégie: ${result2.strategy}`);
    console.log(`   Temps: ${result2.metadata.processingTime}ms`);
    
    // Test de traitement d'une requête avec échec simulé
    const failingRequest = {
      type: 'invalid',
      name: 'FailingComponent',
      description: 'Une requête qui va échouer'
    };
    
    console.log('\n📝 Test 3: Requête avec échec');
    const result3 = await brain.processRequest(failingRequest);
    console.log(`✅ Résultat: ${result3.success ? 'Succès' : 'Échec'}`);
    if (!result3.success) {
      console.log(`   Erreur: ${result3.error.message}`);
    }
    
    // Test du statut du cerveau
    console.log('\n📊 Statut du cerveau:');
    const status = brain.getStatus();
    console.log(`   Initialisé: ${status.initialized}`);
    console.log(`   Humeur: ${status.mood}`);
    console.log(`   Tâches actives: ${status.activeTasks}`);
    console.log(`   Requêtes totales: ${status.performance.totalRequests}`);
    console.log(`   Taux de succès: ${(status.performance.successfulRequests / status.performance.totalRequests * 100).toFixed(1)}%`);
    console.log(`   Temps moyen: ${status.performance.averageResponseTime.toFixed(0)}ms`);
    console.log(`   Qualité moyenne: ${(status.performance.averageQuality * 100).toFixed(1)}%`);
    
    // Test des statistiques détaillées
    console.log('\n📈 Statistiques détaillées:');
    const detailedStats = brain.getDetailedStats();
    console.log(`   Mémoire: ${detailedStats.memory ? 'Active' : 'Inactive'}`);
    console.log(`   Apprentissage: ${detailedStats.learning ? 'Active' : 'Inactive'}`);
    
    if (detailedStats.memory) {
      console.log(`   Entrées en mémoire: ${detailedStats.memory.totalEntries}`);
    }
    
    if (detailedStats.learning) {
      console.log(`   Événements d'apprentissage: ${detailedStats.learning.metrics.totalLearningEvents}`);
      console.log(`   Patterns découverts: ${detailedStats.learning.metrics.patternsDiscovered}`);
    }
    
    console.log('\n🎉 Tous les tests du cerveau sont passés avec succès !');
    
    // Fermeture propre
    await brain.close();
    console.log('✅ Cerveau fermé proprement');
    
  } catch (error) {
    console.error('❌ Erreur lors du test du cerveau:', error);
  }
}

testBrainUltra();
