import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { dossierCible, action } = await request.json();

    // Chemin vers le script d'analyse
    const scriptPath = path.join(process.cwd(), 'scripts', 'analyse-microscopique-2025.cjs');
    
    let command = '';
    
    switch (action) {
      case 'analyser':
        command = `node "${scriptPath}" --dossier="${dossierCible}"`;
        break;
      case 'analyser-tout':
        command = `node "${scriptPath}" --tout`;
        break;
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }

    console.log(`Exécution de la commande: ${command}`);

    // Exécuter le script
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 300000 // 5 minutes timeout
    });

    if (stderr) {
      console.error('Erreur stderr:', stderr);
    }

    // Parser la sortie pour extraire les résultats
    const resultats = parserSortieAnalyse(stdout);

    return NextResponse.json({
      success: true,
      resultats,
      logs: stdout,
      erreurs: stderr
    });

  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

function parserSortieAnalyse(stdout: string) {
  // Parser la sortie du script pour extraire les résultats
  const lignes = stdout.split('\n');
  
  let fichiersAnalyses = 0;
  let correctionsDetectees = 0;
  let scoreUtilite = 0;
  let statut = 'termine';

  for (const ligne of lignes) {
    if (ligne.includes('Total fichiers analysés')) {
      const match = ligne.match(/(\d+)/);
      if (match) fichiersAnalyses = parseInt(match[1]);
    }
    if (ligne.includes('Corrections détectées')) {
      const match = ligne.match(/(\d+)/);
      if (match) correctionsDetectees = parseInt(match[1]);
    }
    if (ligne.includes('Score utilité')) {
      const match = ligne.match(/(\d+\.?\d*)/);
      if (match) scoreUtilite = parseFloat(match[1]);
    }
    if (ligne.includes('ERREUR') || ligne.includes('ÉCHEC')) {
      statut = 'erreur';
    }
  }

  return {
    fichiers_analyses: fichiersAnalyses,
    corrections_detectees: correctionsDetectees,
    score_utilite: scoreUtilite,
    statut,
    timestamp: new Date().toISOString()
  };
}
