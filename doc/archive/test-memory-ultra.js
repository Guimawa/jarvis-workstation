// Test du système de mémoire Ultra Instinct
import MemorySystemUltra from './src/core/memory-ultra.js';

async function testMemoryUltra() {
  console.log('🧠 Test du système de mémoire Ultra Instinct...\n');
  
  try {
    // Initialisation
    const memory = new MemorySystemUltra({
      dataPath: './test-data/memory',
      autoSave: false // Désactiver pour le test
    });
    
    await memory.initialize();
    console.log('✅ Mémoire Ultra initialisée');
    
    // Test d'enregistrement d'une génération
    const generation = {
      type: 'component',
      name: 'TestButton',
      code: 'export default function TestButton() { return <button>Test</button>; }',
      success: true,
      quality: 0.9,
      domain: 'react'
    };
    
    const id = await memory.recordGeneration(generation);
    console.log(`✅ Génération enregistrée avec l'ID: ${id}`);
    
    // Test de recherche
    const results = await memory.search('TestButton');
    console.log(`✅ Recherche trouvée: ${results.length} résultat(s)`);
    
    // Test de recherche similaire
    const similar = await memory.findSimilar({ type: 'component', name: 'Button' });
    console.log(`✅ Recherche similaire trouvée: ${similar.length} résultat(s)`);
    
    // Test des statistiques
    const stats = await memory.getStats();
    console.log('✅ Statistiques:', stats);
    
    // Test de l'historique
    const history = memory.getGenerationHistory();
    console.log(`✅ Historique: ${history.length} génération(s)`);
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
    // Nettoyage
    await memory.close();
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testMemoryUltra();
