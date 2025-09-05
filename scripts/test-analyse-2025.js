#!/usr/bin/env node
/**
 * 🧪 SCRIPT DE TEST - ANALYSE MICROSCOPIQUE 2025
 * Test des fonctionnalités principales
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AnalyseMicroscopique from './analyse-microscopique-2025.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestAnalyseMicroscopique {
    constructor() {
        this.testsReussis = 0;
        this.testsEchoues = 0;
        this.tests = [];
    }

    async demarrerTests() {
        console.log('🧪 DÉMARRAGE DES TESTS - ANALYSE MICROSCOPIQUE 2025');
        console.log('=' .repeat(60));
        
        try {
            // Test 1: Initialisation
            await this.testerInitialisation();
            
            // Test 2: Détection des doutes
            await this.testerDetectionDoutes();
            
            // Test 3: Calcul de hash
            await this.testerCalculHash();
            
            // Test 4: Analyse de fichier
            await this.testerAnalyseFichier();
            
            // Test 5: Gestion des erreurs
            await this.testerGestionErreurs();
            
            // Rapport final
            this.afficherRapportTests();
            
        } catch (error) {
            console.error('❌ ERREUR CRITIQUE DANS LES TESTS:', error.message);
        }
    }

    async testerInitialisation() {
        console.log('\n🔧 Test 1: Initialisation...');
        
        try {
            const analyseur = new AnalyseMicroscopique();
            
            // Vérifier les propriétés
            this.verifier(analyseur.doutes !== undefined, 'Propriété doutes initialisée');
            this.verifier(analyseur.stats.doutes === 0, 'Compteur doutes à zéro');
            this.verifier(analyseur.masterFiles instanceof Map, 'Map maîtres initialisée');
            
            console.log('  ✅ Initialisation réussie');
            this.testsReussis++;
            
        } catch (error) {
            console.log(`  ❌ Échec: ${error.message}`);
            this.testsEchoues++;
        }
    }

    async testerDetectionDoutes() {
        console.log('\n🔍 Test 2: Détection des doutes...');
        
        try {
            const analyseur = new AnalyseMicroscopique();
            
            // Test cas d'utilité ambiguë
            const analyseAmbigue = {
                chemin: '/test/ambigue.js',
                nom: 'ambigue.js',
                utilite: 6,
                qualite: 5,
                comparaison: { statut: 'UNIQUE', differences: [] },
                dependances: [],
                complexite: 3,
                lignes: 100
            };
            
            analyseur.detecterDoutes(analyseAmbigue);
            
            this.verifier(analyseur.doutes.length > 0, 'Doute détecté pour utilité ambiguë');
            this.verifier(analyseur.stats.doutes === 1, 'Compteur doutes incrémenté');
            
            // Test cas de dépendances excessives
            const analyseDependances = {
                chemin: '/test/dependances.js',
                nom: 'dependances.js',
                utilite: 8,
                qualite: 7,
                comparaison: { statut: 'UNIQUE', differences: [] },
                dependances: new Array(25).fill('module'),
                complexite: 5,
                lignes: 200
            };
            
            analyseur.detecterDoutes(analyseDependances);
            
            this.verifier(analyseur.doutes.length === 2, 'Deux doutes détectés');
            
            console.log('  ✅ Détection des doutes réussie');
            this.testsReussis++;
            
        } catch (error) {
            console.log(`  ❌ Échec: ${error.message}`);
            this.testsEchoues++;
        }
    }

    async testerCalculHash() {
        console.log('\n🔐 Test 3: Calcul de hash...');
        
        try {
            const analyseur = new AnalyseMicroscopique();
            
            // Créer un fichier de test
            const testFile = path.join(__dirname, 'test-hash.txt');
            const contenu = 'Test de calcul de hash pour analyse microscopique 2025';
            fs.writeFileSync(testFile, contenu, 'utf8');
            
            // Calculer le hash
            const hash1 = await analyseur.calculerHash(testFile);
            const hash2 = await analyseur.calculerHash(testFile);
            
            this.verifier(hash1 === hash2, 'Hash identique pour même fichier');
            this.verifier(hash1.length === 64, 'Hash SHA256 de 64 caractères');
            
            // Nettoyer
            fs.unlinkSync(testFile);
            
            console.log('  ✅ Calcul de hash réussi');
            this.testsReussis++;
            
        } catch (error) {
            console.log(`  ❌ Échec: ${error.message}`);
            this.testsEchoues++;
        }
    }

    async testerAnalyseFichier() {
        console.log('\n🔬 Test 4: Analyse de fichier...');
        
        try {
            const analyseur = new AnalyseMicroscopique();
            
            // Créer un fichier de test
            const testFile = path.join(__dirname, 'test-analyse.js');
            const contenu = `
// Test d'analyse microscopique
function testFunction() {
    console.log('Hello World');
    return true;
}

const testVariable = 'test';
export { testFunction, testVariable };
`;
            fs.writeFileSync(testFile, contenu, 'utf8');
            
            // Analyser le fichier
            await analyseur.analyserFichier(testFile);
            
            this.verifier(analyseur.analysisResults.length === 1, 'Fichier analysé');
            this.verifier(analyseur.analysisResults[0].nom === 'test-analyse.js', 'Nom de fichier correct');
            this.verifier(analyseur.analysisResults[0].fonctions.includes('testFunction'), 'Fonction détectée');
            this.verifier(analyseur.analysisResults[0].type === 'JavaScript', 'Type de fichier correct');
            
            // Nettoyer
            fs.unlinkSync(testFile);
            
            console.log('  ✅ Analyse de fichier réussie');
            this.testsReussis++;
            
        } catch (error) {
            console.log(`  ❌ Échec: ${error.message}`);
            this.testsEchoues++;
        }
    }

    async testerGestionErreurs() {
        console.log('\n⚠️ Test 5: Gestion des erreurs...');
        
        try {
            const analyseur = new AnalyseMicroscopique();
            
            // Tenter d'analyser un fichier inexistant
            const fichierInexistant = '/fichier/inexistant.js';
            
            // Capturer l'erreur
            let erreurCapturee = false;
            try {
                await analyseur.analyserFichier(fichierInexistant);
            } catch (error) {
                erreurCapturee = true;
            }
            
            this.verifier(erreurCapturee, 'Erreur capturée pour fichier inexistant');
            this.verifier(analyseur.stats.errors > 0, 'Compteur d\'erreurs incrémenté');
            
            console.log('  ✅ Gestion des erreurs réussie');
            this.testsReussis++;
            
        } catch (error) {
            console.log(`  ❌ Échec: ${error.message}`);
            this.testsEchoues++;
        }
    }

    verifier(condition, description) {
        if (condition) {
            console.log(`    ✓ ${description}`);
            return true;
        } else {
            console.log(`    ✗ ${description}`);
            return false;
        }
    }

    afficherRapportTests() {
        console.log('\n📊 RAPPORT DES TESTS');
        console.log('=' .repeat(40));
        console.log(`Tests réussis : ${this.testsReussis}`);
        console.log(`Tests échoués : ${this.testsEchoues}`);
        console.log(`Total tests : ${this.testsReussis + this.testsEchoues}`);
        
        const pourcentage = ((this.testsReussis / (this.testsReussis + this.testsEchoues)) * 100).toFixed(1);
        console.log(`Taux de réussite : ${pourcentage}%`);
        
        if (this.testsEchoues === 0) {
            console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
            console.log('✅ Le système d\'analyse microscopique 2025 est prêt à l\'emploi');
        } else {
            console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
            console.log('🔧 Vérifiez la configuration et relancez les tests');
        }
        
        console.log('=' .repeat(40));
    }
}

// 🚀 EXÉCUTION DES TESTS
if (import.meta.url === `file://${process.argv[1]}`) {
    const testeur = new TestAnalyseMicroscopique();
    testeur.demarrerTests().catch(console.error);
}

export default TestAnalyseMicroscopique;
