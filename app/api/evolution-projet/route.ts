import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { action, corrections } = await request.json();

    // Chemin vers le script d'évolution
    const scriptPath = path.join(process.cwd(), 'scripts', 'evolution-projet-maitre-2025.cjs');
    
    let command = '';
    
    switch (action) {
      case 'creer-sauvegarde':
        command = `node "${scriptPath}" --sauvegarde`;
        break;
      case 'lancer-evolution':
        command = `node "${scriptPath}" --evolution --corrections='${JSON.stringify(corrections)}'`;
        break;
      case 'rollback':
        command = `node "${scriptPath}" --rollback`;
        break;
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }

    console.log(`Exécution de la commande: ${command}`);

    // Exécuter le script
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 600000 // 10 minutes timeout
    });

    if (stderr) {
      console.error('Erreur stderr:', stderr);
    }

    // Parser la sortie pour extraire les résultats
    const resultats = parserSortieEvolution(stdout);

    return NextResponse.json({
      success: true,
      resultats,
      logs: stdout,
      erreurs: stderr
    });

  } catch (error) {
    console.error('Erreur lors de l\'évolution:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

function parserSortieEvolution(stdout: string) {
  const lignes = stdout.split('\n');
  
  let correctionsIntegrees = 0;
  let correctionsReportees = 0;
  let testsReussis = 0;
  let testsEchecs = 0;
  let performanceAmelioree = 0;
  let bugsCorriges = 0;
  let statut = 'termine';
  let sauvegardeChemin = '';

  for (const ligne of lignes) {
    if (ligne.includes('Corrections intégrées')) {
      const match = ligne.match(/(\d+)/);
      if (match) correctionsIntegrees = parseInt(match[1]);
    }
    if (ligne.includes('Corrections reportées')) {
      const match = ligne.match(/(\d+)/);
      if (match) correctionsReportees = parseInt(match[1]);
    }
    if (ligne.includes('Tests réussis')) {
      const match = ligne.match(/(\d+)/);
      if (match) testsReussis = parseInt(match[1]);
    }
    if (ligne.includes('Tests échoués')) {
      const match = ligne.match(/(\d+)/);
      if (match) testsEchecs = parseInt(match[1]);
    }
    if (ligne.includes('Performance améliorée')) {
      const match = ligne.match(/(\d+)/);
      if (match) performanceAmelioree = parseInt(match[1]);
    }
    if (ligne.includes('Bugs corrigés')) {
      const match = ligne.match(/(\d+)/);
      if (match) bugsCorriges = parseInt(match[1]);
    }
    if (ligne.includes('Sauvegarde créée')) {
      const match = ligne.match(/Sauvegarde créée: (.+)/);
      if (match) sauvegardeChemin = match[1];
    }
    if (ligne.includes('ERREUR') || ligne.includes('ÉCHEC')) {
      statut = 'erreur';
    }
  }

  return {
    corrections_integrees: correctionsIntegrees,
    corrections_reportees: correctionsReportees,
    tests_reussis: testsReussis,
    tests_echecs: testsEchecs,
    performance_amelioree: performanceAmelioree,
    bugs_corriges: bugsCorriges,
    statut,
    sauvegarde_chemin: sauvegardeChemin,
    timestamp: new Date().toISOString()
  };
}
