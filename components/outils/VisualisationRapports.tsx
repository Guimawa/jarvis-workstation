'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface RapportAnalyse {
  id: string;
  nom: string;
  date: string;
  statut: 'en_cours' | 'termine' | 'erreur';
  fichiers_analyses: number;
  corrections_detectees: number;
  score_utilite: number;
  chemin: string;
  details?: {
    fichiers_identiques: number;
    fichiers_differents: number;
    fichiers_uniques: number;
    doutes_detectes: number;
    temps_analyse: number;
  };
}

interface Statistiques {
  total_rapports: number;
  total_fichiers_analyses: number;
  total_corrections: number;
  score_moyen: number;
  rapports_reussis: number;
  rapports_echecs: number;
}

export default function VisualisationRapports() {
  const [rapports, setRapports] = useState<RapportAnalyse[]>([]);
  const [statistiques, setStatistiques] = useState<Statistiques>({
    total_rapports: 0,
    total_fichiers_analyses: 0,
    total_corrections: 0,
    score_moyen: 0,
    rapports_reussis: 0,
    rapports_echecs: 0
  });
  const [filtre, setFiltre] = useState<string>('tous');
  const [recherche, setRecherche] = useState('');

  // Simulation des données
  useEffect(() => {
    const rapportsSimules: RapportAnalyse[] = [
      {
        id: '1',
        nom: 'Dashboard-1',
        date: '2025-01-15',
        statut: 'termine',
        fichiers_analyses: 115,
        corrections_detectees: 23,
        score_utilite: 8.5,
        chemin: '/CORRECTION/rapport-analyse-dashboard-1-2025-01-15.md',
        details: {
          fichiers_identiques: 45,
          fichiers_differents: 32,
          fichiers_uniques: 38,
          doutes_detectes: 5,
          temps_analyse: 45.2
        }
      },
      {
        id: '2',
        nom: 'Handshake Dashboard',
        date: '2025-01-15',
        statut: 'termine',
        fichiers_analyses: 89,
        corrections_detectees: 15,
        score_utilite: 9.2,
        chemin: '/CORRECTION/rapport-analyse-handshake-dashboard-2025-01-15.md',
        details: {
          fichiers_identiques: 30,
          fichiers_differents: 25,
          fichiers_uniques: 34,
          doutes_detectes: 2,
          temps_analyse: 32.1
        }
      },
      {
        id: '3',
        nom: 'Package JSON',
        date: '2025-01-15',
        statut: 'termine',
        fichiers_analyses: 12,
        corrections_detectees: 8,
        score_utilite: 7.8,
        chemin: '/CORRECTION/rapport-analyse-package-json-2025-01-15.md',
        details: {
          fichiers_identiques: 5,
          fichiers_differents: 4,
          fichiers_uniques: 3,
          doutes_detectes: 1,
          temps_analyse: 8.5
        }
      }
    ];

    setRapports(rapportsSimules);

    // Calcul des statistiques
    const stats: Statistiques = {
      total_rapports: rapportsSimules.length,
      total_fichiers_analyses: rapportsSimules.reduce((acc, r) => acc + r.fichiers_analyses, 0),
      total_corrections: rapportsSimules.reduce((acc, r) => acc + r.corrections_detectees, 0),
      score_moyen: rapportsSimules.reduce((acc, r) => acc + r.score_utilite, 0) / rapportsSimules.length,
      rapports_reussis: rapportsSimules.filter(r => r.statut === 'termine').length,
      rapports_echecs: rapportsSimules.filter(r => r.statut === 'erreur').length
    };

    setStatistiques(stats);
  }, []);

  const rapportsFiltres = rapports.filter(rapport => {
    const matchFiltre = filtre === 'tous' || rapport.statut === filtre;
    const matchRecherche = rapport.nom.toLowerCase().includes(recherche.toLowerCase());
    return matchFiltre && matchRecherche;
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'termine':
        return 'bg-green-500';
      case 'en_cours':
        return 'bg-blue-500';
      case 'erreur':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'termine':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'en_cours':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'erreur':
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{statistiques.total_rapports}</p>
                <p className="text-xs text-muted-foreground">Rapports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{statistiques.total_fichiers_analyses}</p>
                <p className="text-xs text-muted-foreground">Fichiers analysés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{statistiques.total_corrections}</p>
                <p className="text-xs text-muted-foreground">Corrections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{statistiques.score_moyen.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Score moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un rapport..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-md"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filtre}
                onChange={(e) => setFiltre(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="tous">Tous les statuts</option>
                <option value="termine">Terminé</option>
                <option value="en_cours">En cours</option>
                <option value="erreur">Erreur</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rapports */}
      <div className="space-y-4">
        {rapportsFiltres.map((rapport) => (
          <Card key={rapport.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatutColor(rapport.statut)}`} />
                    <h3 className="text-lg font-semibold">{rapport.nom}</h3>
                    {getStatutBadge(rapport.statut)}
                    <Badge variant="outline">{rapport.score_utilite}/10</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{rapport.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fichiers analysés:</span>
                      <p className="font-medium">{rapport.fichiers_analyses}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Corrections:</span>
                      <p className="font-medium">{rapport.corrections_detectees}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temps d'analyse:</span>
                      <p className="font-medium">{rapport.details?.temps_analyse.toFixed(1)}s</p>
                    </div>
                  </div>

                  {rapport.details && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Identiques:</span>
                        <p className="font-medium">{rapport.details.fichiers_identiques}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Différents:</span>
                        <p className="font-medium">{rapport.details.fichiers_differents}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Uniques:</span>
                        <p className="font-medium">{rapport.details.fichiers_uniques}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Doutes:</span>
                        <p className="font-medium">{rapport.details.doutes_detectes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rapportsFiltres.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun rapport trouvé</h3>
            <p className="text-muted-foreground">
              Aucun rapport ne correspond à vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
