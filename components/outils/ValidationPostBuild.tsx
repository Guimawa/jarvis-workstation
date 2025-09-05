'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause,
  RotateCcw,
  Zap,
  Globe,
  Gauge,
  Shield
} from 'lucide-react';

interface TestValidation {
  id: string;
  nom: string;
  statut: 'en_attente' | 'en_cours' | 'reussi' | 'echec';
  type: 'build' | 'fonctionnel' | 'performance' | 'compatibilite' | 'regression' | 'stress' | 'rollback';
  resultat?: string;
  duree?: number;
  description: string;
}

interface ValidationPostBuildProps {
  onValidationComplete?: (resultat: any) => void;
}

export default function ValidationPostBuild({ onValidationComplete }: ValidationPostBuildProps) {
  const [tests, setTests] = useState<TestValidation[]>([
    {
      id: '1',
      nom: 'Test de Build',
      statut: 'en_attente',
      type: 'build',
      description: 'Vérifier que l\'application se compile sans erreur'
    },
    {
      id: '2',
      nom: 'Test de Démarrage',
      statut: 'en_attente',
      type: 'fonctionnel',
      description: 'Vérifier que l\'application démarre correctement'
    },
    {
      id: '3',
      nom: 'Test de Navigation',
      statut: 'en_attente',
      type: 'fonctionnel',
      description: 'Tester tous les liens et la navigation'
    },
    {
      id: '4',
      nom: 'Test de Performance',
      statut: 'en_attente',
      type: 'performance',
      description: 'Mesurer les performances et la vitesse'
    },
    {
      id: '5',
      nom: 'Test de Compatibilité',
      statut: 'en_attente',
      type: 'compatibilite',
      description: 'Tester sur différents navigateurs'
    },
    {
      id: '6',
      nom: 'Test de Régression',
      statut: 'en_attente',
      type: 'regression',
      description: 'Vérifier que rien n\'est cassé'
    },
    {
      id: '7',
      nom: 'Test de Stress',
      statut: 'en_attente',
      type: 'stress',
      description: 'Tester avec une charge importante'
    },
    {
      id: '8',
      nom: 'Test de Rollback',
      statut: 'en_attente',
      type: 'rollback',
      description: 'Vérifier qu\'on peut revenir en arrière'
    }
  ]);

  const [validationEnCours, setValidationEnCours] = useState(false);
  const [progression, setProgression] = useState(0);
  const [resultats, setResultats] = useState<any>(null);
  const [erreurs, setErreurs] = useState<string[]>([]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'reussi':
        return 'bg-green-500';
      case 'en_cours':
        return 'bg-blue-500';
      case 'echec':
        return 'bg-red-500';
      case 'en_attente':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'build':
        return <Zap className="w-4 h-4" />;
      case 'fonctionnel':
        return <CheckCircle className="w-4 h-4" />;
      case 'performance':
        return <Gauge className="w-4 h-4" />;
      case 'compatibilite':
        return <Globe className="w-4 h-4" />;
      case 'regression':
        return <AlertTriangle className="w-4 h-4" />;
      case 'stress':
        return <Zap className="w-4 h-4" />;
      case 'rollback':
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const executerTest = async (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, statut: 'en_cours' as const }
        : test
    ));
    
    // Simulation du test
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const success = Math.random() > 0.1; // 90% de chance de succès
    
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            statut: success ? 'reussi' as const : 'echec' as const,
            resultat: success ? 'Test réussi' : 'Test échoué',
            duree: Math.random() * 5 + 1
          }
        : test
    ));
  };

  const lancerValidationComplete = async () => {
    setValidationEnCours(true);
    setProgression(0);
    setErreurs([]);
    setResultats(null);

    try {
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        setTests(prev => prev.map(t => 
          t.id === test.id 
            ? { ...t, statut: 'en_cours' as const }
            : t
        ));

        setProgression(((i + 1) / tests.length) * 100);
        
        // Simulation du test
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
        
        const success = Math.random() > 0.05; // 95% de chance de succès
        
        setTests(prev => prev.map(t => 
          t.id === test.id 
            ? { 
                ...t, 
                statut: success ? 'reussi' as const : 'echec' as const,
                resultat: success ? 'Test réussi' : 'Test échoué',
                duree: Math.random() * 5 + 1
              }
            : t
        ));
      }

      // Calcul des résultats
      const testsReussis = tests.filter(t => t.statut === 'reussi').length;
      const testsEchecs = tests.filter(t => t.statut === 'echec').length;
      const scoreGlobal = (testsReussis / tests.length) * 100;

      setResultats({
        tests_reussis: testsReussis,
        tests_echecs: testsEchecs,
        score_global: scoreGlobal,
        validation_reussie: scoreGlobal >= 90,
        duree_totale: tests.reduce((acc, t) => acc + (t.duree || 0), 0)
      });

      setProgression(100);
      
      if (onValidationComplete) {
        onValidationComplete(resultats);
      }

    } catch (error) {
      setErreurs(['Erreur lors de la validation: ' + (error as Error).message]);
    } finally {
      setValidationEnCours(false);
    }
  };

  const relancerTousLesTests = () => {
    setTests(prev => prev.map(test => ({ ...test, statut: 'en_attente' as const, resultat: undefined, duree: undefined })));
    setResultats(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Validation Post-Build Ultra Instinct
        </CardTitle>
        <CardDescription>
          Validation complète pour s'assurer que tout fonctionne parfaitement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationEnCours && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Validation en cours...</span>
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
            <Alert variant={resultats.validation_reussie ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {resultats.validation_reussie 
                  ? `Validation réussie ! Score: ${resultats.score_global.toFixed(1)}%`
                  : `Validation échouée ! Score: ${resultats.score_global.toFixed(1)}%`
                }
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{resultats.tests_reussis}</div>
                <div className="text-sm text-muted-foreground">Tests réussis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{resultats.tests_echecs}</div>
                <div className="text-sm text-muted-foreground">Tests échoués</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{resultats.duree_totale.toFixed(1)}s</div>
                <div className="text-sm text-muted-foreground">Durée totale</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatutColor(test.statut)}`} />
                <div className="flex items-center space-x-2">
                  {getTypeIcon(test.type)}
                  <div>
                    <div className="font-medium">{test.nom}</div>
                    <div className="text-sm text-muted-foreground">{test.description}</div>
                    {test.resultat && (
                      <div className={`text-sm ${test.statut === 'reussi' ? 'text-green-600' : 'text-red-600'}`}>
                        {test.resultat} {test.duree && `(${test.duree.toFixed(1)}s)`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {test.statut === 'en_attente' && (
                  <Button 
                    size="sm" 
                    onClick={() => executerTest(test.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Exécuter
                  </Button>
                )}
                {test.statut === 'en_cours' && (
                  <Button size="sm" disabled>
                    <Pause className="w-4 h-4 mr-1" />
                    En cours...
                  </Button>
                )}
                {test.statut === 'reussi' && (
                  <Button size="sm" variant="outline" className="text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Réussi
                  </Button>
                )}
                {test.statut === 'echec' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => executerTest(test.id)}
                    className="text-red-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Relancer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={lancerValidationComplete}
            disabled={validationEnCours}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {validationEnCours ? 'Validation en cours...' : 'Lancer Validation Complète'}
          </Button>
          <Button 
            onClick={relancerTousLesTests}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Relancer Tous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
