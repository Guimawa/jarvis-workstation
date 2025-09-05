#!/usr/bin/env node
/**
 * 🧬 SCRIPT D'ANALYSE MICROSCOPIQUE 2025 - VERSION API
 * Script appelé par l'API du dashboard
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AnalyseMicroscopiqueAPI {
    constructor() {
        this.projectRoot = process.cwd();
        this.rapportsRoot = path.join(this.projectRoot, 'CORRECTION');
        this.dossierCible = '';
        this.resultats = {
            fichiers_analyses: 0,
            corrections_detectees: 0,
            fichiers_identiques: 0,
            fichiers_differents: 0,
            fichiers_uniques: 0,
            score_utilite: 0,
            doutes_detectes: 0,
            temps_analyse: 0
        };
    }

    async demarrerAnalyse(dossierCible) {
        console.log('🧬 DÉMARRAGE DE L\'ANALYSE MICROSCOPIQUE 2025');
        console.log(`📁 Dossier cible: ${dossierCible}`);
        
        const debut = Date.now();
        this.dossierCible = dossierCible;
        
        try {
            // Phase 1: Analyser le dossier cible
            await this.analyserDossier(dossierCible);
            
            // Phase 2: Générer le rapport
            await this.genererRapport();
            
            const fin = Date.now();
            this.resultats.temps_analyse = (fin - debut) / 1000;
            
            console.log('✅ ANALYSE TERMINÉE AVEC SUCCÈS');
            this.afficherResultats();
            
            return this.resultats;
            
        } catch (error) {
            console.error('❌ ERREUR CRITIQUE:', error.message);
            throw error;
        }
    }

    async analyserDossier(cheminDossier) {
        console.log(`🔍 Analyse du dossier: ${cheminDossier}`);
        
        const cheminComplet = path.join(this.projectRoot, cheminDossier);
        
        if (!fs.existsSync(cheminComplet)) {
            throw new Error(`Dossier non trouvé: ${cheminComplet}`);
        }

        await this.scannerDossier(cheminComplet);
    }

    async scannerDossier(cheminDossier) {
        const items = fs.readdirSync(cheminDossier);
        
        for (const item of items) {
            const cheminComplet = path.join(cheminDossier, item);
            const stat = fs.statSync(cheminComplet);
            
            // Ignorer certains dossiers
            if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'build') {
                continue;
            }
            
            if (stat.isDirectory()) {
                await this.scannerDossier(cheminComplet);
            } else if (stat.isFile()) {
                await this.analyserFichier(cheminComplet);
            }
        }
    }

    async analyserFichier(cheminFichier) {
        try {
            const stat = fs.statSync(cheminFichier);
            const contenu = fs.readFileSync(cheminFichier, 'utf8');
            const nomFichier = path.basename(cheminFichier);
            
            this.resultats.fichiers_analyses++;
            
            // Analyser le contenu
            const analyse = this.analyserContenu(contenu, cheminFichier);
            
            // Détecter les corrections
            if (this.detecterCorrections(contenu, nomFichier)) {
                this.resultats.corrections_detectees++;
            }
            
            // Détecter les doutes
            if (this.detecterDoutes(analyse)) {
                this.resultats.doutes_detectes++;
            }
            
            // Classifier le fichier
            this.classifierFichier(analyse);
            
        } catch (error) {
            console.error(`❌ Erreur analyse ${cheminFichier}:`, error.message);
        }
    }

    analyserContenu(contenu, cheminFichier) {
        const lignes = contenu.split('\n').length;
        const fonctions = this.extraireFonctions(contenu);
        const dependances = this.extraireDependances(contenu);
        const complexite = this.calculerComplexite(contenu);
        const qualite = this.evaluerQualite(contenu);
        
        return {
            lignes,
            fonctions: fonctions.length,
            dependances: dependances.length,
            complexite,
            qualite
        };
    }

    extraireFonctions(contenu) {
        const fonctions = [];
        const functionRegex = /function\s+(\w+)\s*\(/g;
        let match;
        while ((match = functionRegex.exec(contenu)) !== null) {
            fonctions.push(match[1]);
        }
        return fonctions;
    }

    extraireDependances(contenu) {
        const dependances = [];
        const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(contenu)) !== null) {
            dependances.push(match[1]);
        }
        return dependances;
    }

    calculerComplexite(contenu) {
        let complexite = 1;
        complexite += (contenu.match(/for\s*\(/g) || []).length;
        complexite += (contenu.match(/while\s*\(/g) || []).length;
        complexite += (contenu.match(/if\s*\(/g) || []).length;
        complexite += (contenu.match(/try\s*{/g) || []).length;
        return Math.min(complexite, 10);
    }

    evaluerQualite(contenu) {
        let qualite = 5;
        const lignesCommentaires = (contenu.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length;
        const lignesTotal = contenu.split('\n').length;
        const ratioCommentaires = lignesCommentaires / lignesTotal;
        
        if (ratioCommentaires > 0.2) qualite += 2;
        else if (ratioCommentaires > 0.1) qualite += 1;
        
        return Math.min(Math.round(qualite), 10);
    }

    detecterCorrections(contenu, nomFichier) {
        const motsCles = [
            'fix', 'correction', 'bug', 'error', 'patch',
            'amélioration', 'optimisation', 'refactor',
            'TODO', 'FIXME', 'HACK'
        ];
        
        const contenuLower = contenu.toLowerCase();
        return motsCles.some(mot => contenuLower.includes(mot));
    }

    detecterDoutes(analyse) {
        return analyse.qualite >= 5 && analyse.qualite <= 7;
    }

    classifierFichier(analyse) {
        if (analyse.qualite > 7) {
            this.resultats.fichiers_uniques++;
        } else if (analyse.qualite < 5) {
            this.resultats.fichiers_identiques++;
        } else {
            this.resultats.fichiers_differents++;
        }
    }

    async genererRapport() {
        const rapport = this.genererTemplateRapport();
        const nomRapport = `rapport-analyse-${this.dossierCible.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.md`;
        const cheminRapport = path.join(this.rapportsRoot, nomRapport);
        
        fs.writeFileSync(cheminRapport, rapport, 'utf8');
        console.log(`📊 Rapport généré: ${cheminRapport}`);
    }

    genererTemplateRapport() {
        const date = new Date().toISOString();
        
        return `# 🔬 RAPPORT D'ANALYSE MICROSCOPIQUE 2025
## Dossier : ${this.dossierCible}
## Date : ${date}
## Version : API 1.0

### 📋 INFORMATIONS GÉNÉRALES
- **Dossier analysé** : ${this.dossierCible}
- **Fichiers analysés** : ${this.resultats.fichiers_analyses}
- **Temps d'analyse** : ${this.resultats.temps_analyse.toFixed(1)}s
- **Date d'analyse** : ${date}

### 🔍 RÉSULTATS DE L'ANALYSE
- **Fichiers identiques** : ${this.resultats.fichiers_identiques}
- **Fichiers différents** : ${this.resultats.fichiers_differents}
- **Fichiers uniques** : ${this.resultats.fichiers_uniques}
- **Corrections détectées** : ${this.resultats.corrections_detectees}
- **Doutes détectés** : ${this.resultats.doutes_detectes}

### 📊 SCORE D'UTILITÉ
- **Score global** : ${this.resultats.score_utilite}/10
- **Classification** : ${this.resultats.score_utilite > 7 ? 'Élevée' : this.resultats.score_utilite > 5 ? 'Moyenne' : 'Faible'}

### 🎯 RECOMMANDATIONS
${this.genererRecommandations()}

---
*Rapport généré automatiquement par Analyse Microscopique 2025 API v1.0*
`;
    }

    genererRecommandations() {
        const recommandations = [];
        
        if (this.resultats.corrections_detectees > 0) {
            recommandations.push(`- Intégrer les ${this.resultats.corrections_detectees} corrections détectées`);
        }
        
        if (this.resultats.fichiers_identiques > 0) {
            recommandations.push(`- Éliminer les ${this.resultats.fichiers_identiques} fichiers identiques (doublons)`);
        }
        
        if (this.resultats.doutes_detectes > 0) {
            recommandations.push(`- Examiner les ${this.resultats.doutes_detectes} fichiers avec doutes`);
        }
        
        return recommandations.join('\n') || '- Aucune recommandation spécifique';
    }

    afficherResultats() {
        console.log('\n📊 RÉSULTATS FINAUX');
        console.log('=' .repeat(40));
        console.log(`Fichiers analysés : ${this.resultats.fichiers_analyses}`);
        console.log(`Corrections détectées : ${this.resultats.corrections_detectees}`);
        console.log(`Fichiers identiques : ${this.resultats.fichiers_identiques}`);
        console.log(`Fichiers différents : ${this.resultats.fichiers_differents}`);
        console.log(`Fichiers uniques : ${this.resultats.fichiers_uniques}`);
        console.log(`Doutes détectés : ${this.resultats.doutes_detectes}`);
        console.log(`Temps d'analyse : ${this.resultats.temps_analyse.toFixed(1)}s`);
        console.log('=' .repeat(40));
    }
}

// 🚀 EXÉCUTION
async function main() {
    const args = process.argv.slice(2);
    let dossierCible = 'Dashboard-1';
    
    // Parser les arguments
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--dossier' && args[i + 1]) {
            dossierCible = args[i + 1];
            i++;
        } else if (args[i] === '--tout') {
            dossierCible = 'Tout';
        }
    }
    
    const analyseur = new AnalyseMicroscopiqueAPI();
    
    try {
        const resultats = await analyseur.demarrerAnalyse(dossierCible);
        process.exit(0);
    } catch (error) {
        console.error('❌ Échec de l\'analyse:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = AnalyseMicroscopiqueAPI;