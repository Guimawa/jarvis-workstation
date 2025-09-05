'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause,
  Download,
  Eye
} from 'lucide-react';

interface AnalyseMicroscopiqueProps {
  onAnalyseComplete?: (resultat: any) => void;
  dossierCible?: string;
}

export default function AnalyseMicroscopique({ 
  onAnalyseComplete, 
  dossierCible = 'Dashboard-1' 
}: AnalyseMicroscopiqueProps) {
  const [analyseEnCours, setAnalyseEnCours] = useState(false);
  const [progression, setProgression] = useState(0);
  const [etapeActuelle, setEtapeActuelle] = useState('');
  const [resultats, setResultats] = useState<any>(null);
  const [erreurs, setErreurs] = useState<string[]>([]);

  const etapes = [
    'Initialisation de l\'analyse...',
    'Lecture des fichiers...',
    'Analyse microscopique...',
    'Comparaison avec fichiers maîtres...',
    'Détection des corrections...',
    'Génération du rapport...',
    'Finalisation...'
  ];

  const lancerAnalyse = async () => {
    setAnalyseEnCours(true);
    setProgression(0);
    setErreurs([]);
    setResultats(null);

    try {
      // Appel à l'API réelle
      const response = await fetch('/api/analyse-microscopique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dossierCible: dossierCible,
          action: 'analyser'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      // Simulation des étapes pour l'UI
      for (let i = 0; i < etapes.length; i++) {
        setEtapeActuelle(etapes[i]);
        setProgression((i / etapes.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResultats({
        fichiers_analyses: data.resultats.fichiers_analyses,
        corrections_detectees: data.resultats.corrections_detectees,
        fichiers_identiques: data.resultats.fichiers_identiques || 0,
        fichiers_differents: data.resultats.fichiers_differents || 0,
        fichiers_uniques: data.resultats.fichiers_uniques || 0,
        score_utilite: data.resultats.score_utilite,
        rapport_chemin: `/CORRECTION/rapport-analyse-${dossierCible.toLowerCase()}-${new Date().toISOString().split('T')[0]}.md`
      });

      setProgression(100);
      setEtapeActuelle('Analyse terminée avec succès !');
      
      if (onAnalyseComplete) {
        onAnalyseComplete(resultats);
      }

    } catch (error) {
      setErreurs(['Erreur lors de l\'analyse: ' + (error as Error).message]);
      setEtapeActuelle('Erreur lors de l\'analyse');
    } finally {
      setAnalyseEnCours(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Analyse Microscopique 2025
        </CardTitle>
        <CardDescription>
          Analyse rigoureuse du dossier: {dossierCible}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analyseEnCours && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{etapeActuelle}</span>
              <span>{Math.round(progression)}%</span>
            </div>
            <Progress value={progression} className="w-full" />
          </div>
        )}

        {erreurs.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {erreurs.map((erreur, index) => (
                <div key={index}>{erreur}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {resultats && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Analyse terminée avec succès !
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fichiers analysés:</span>
                  <Badge variant="outline">{resultats.fichiers_analyses}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Corrections détectées:</span>
                  <Badge variant="outline">{resultats.corrections_detectees}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Score utilité:</span>
                  <Badge variant="outline">{resultats.score_utilite}/10</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Identiques:</span>
                  <Badge variant="outline">{resultats.fichiers_identiques}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Différents:</span>
                  <Badge variant="outline">{resultats.fichiers_differents}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Uniques:</span>
                  <Badge variant="outline">{resultats.fichiers_uniques}</Badge>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                Voir Rapport
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                Télécharger
              </Button>
            </div>
          </div>
        )}

        {!analyseEnCours && !resultats && (
          <Button 
            onClick={lancerAnalyse}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Lancer l'Analyse Microscopique
          </Button>
        )}

        {resultats && (
          <Button 
            onClick={lancerAnalyse}
            variant="outline"
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Relancer l'Analyse
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
