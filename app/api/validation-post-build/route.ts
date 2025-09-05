import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { action, testType } = await request.json();

    // Chemin vers le script de validation
    const scriptPath = path.join(process.cwd(), 'scripts', 'validation-post-build-2025.cjs');
    
    let command = '';
    
    switch (action) {
      case 'test-build':
        command = `node "${scriptPath}" --build`;
        break;
      case 'test-fonctionnel':
        command = `node "${scriptPath}" --fonctionnel`;
        break;
      case 'test-performance':
        command = `node "${scriptPath}" --performance`;
        break;
      case 'test-compatibilite':
        command = `node "${scriptPath}" --compatibilite`;
        break;
      case 'test-regression':
        command = `node "${scriptPath}" --regression`;
        break;
      case 'test-stress':
        command = `node "${scriptPath}" --stress`;
        break;
      case 'test-rollback':
        command = `node "${scriptPath}" --rollback`;
        break;
      case 'validation-complete':
        command = `node "${scriptPath}" --complete`;
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
    const resultats = parserSortieValidation(stdout, testType);

    return NextResponse.json({
      success: true,
      resultats,
      logs: stdout,
      erreurs: stderr
    });

  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

function parserSortieValidation(stdout: string, testType?: string) {
  const lignes = stdout.split('\n');
  
  let statut = 'reussi';
  let duree = 0;
  let resultat = '';
  let details = '';

  for (const ligne of lignes) {
    if (ligne.includes('Test réussi') || ligne.includes('SUCCESS')) {
      statut = 'reussi';
      resultat = 'Test réussi';
    }
    if (ligne.includes('Test échoué') || ligne.includes('FAILED') || ligne.includes('ERROR')) {
      statut = 'echec';
      resultat = 'Test échoué';
    }
    if (ligne.includes('Durée:')) {
      const match = ligne.match(/Durée: ([\d.]+)s/);
      if (match) duree = parseFloat(match[1]);
    }
    if (ligne.includes('Détails:')) {
      details = ligne.replace('Détails:', '').trim();
    }
  }

  return {
    statut,
    duree,
    resultat,
    details,
    test_type: testType || 'unknown',
    timestamp: new Date().toISOString()
  };
}
