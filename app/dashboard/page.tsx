'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Wrench,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';

// Import des composants d'outils
import AnalyseMicroscopique from '@/components/outils/AnalyseMicroscopique';
import EvolutionProjetMaitre from '@/components/outils/EvolutionProjetMaitre';
import ValidationPostBuild from '@/components/outils/ValidationPostBuild';
import VisualisationRapports from '@/components/outils/VisualisationRapports';

export default function Dashboard() {
  const [ongletActif, setOngletActif] = useState('overview');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🚀 Jarvis Workstation Dashboard</h1>
          <p className="text-muted-foreground">
            Système complet d'analyse, évolution et validation des projets
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
      </div>
      </div>

      <Tabs value={ongletActif} onValueChange={setOngletActif} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">📊 Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analyse">🔬 Analyse</TabsTrigger>
          <TabsTrigger value="evolution">⚡ Évolution</TabsTrigger>
          <TabsTrigger value="validation">✅ Validation</TabsTrigger>
          <TabsTrigger value="rapports">📋 Rapports</TabsTrigger>
          <TabsTrigger value="outils">🛠️ Outils</TabsTrigger>
        </TabsList>

        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projets Analysés</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 depuis la semaine dernière</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Corrections Détectées</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+12 depuis hier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Réussis</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">+3% depuis la semaine dernière</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+25%</div>
                <p className="text-xs text-muted-foreground">Amélioration moyenne</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>🔬 Analyse Microscopique</CardTitle>
                <CardDescription>
                  Analyse rigoureuse selon les directives 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyseMicroscopique dossierCible="Dashboard-1" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Évolution Projet Maître</CardTitle>
                <CardDescription>
                  Évolution sécurisée avec sauvegarde
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EvolutionProjetMaitre />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Analyse */}
        <TabsContent value="analyse" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AnalyseMicroscopique dossierCible="Dashboard-1" />
            <AnalyseMicroscopique dossierCible="Handshake" />
                  </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AnalyseMicroscopique dossierCible="Package JSON" />
            <AnalyseMicroscopique dossierCible="Tout" />
          </div>
        </TabsContent>

        {/* Onglet Évolution */}
        <TabsContent value="evolution" className="space-y-4">
          <EvolutionProjetMaitre />
        </TabsContent>

        {/* Onglet Validation */}
        <TabsContent value="validation" className="space-y-4">
          <ValidationPostBuild />
        </TabsContent>

        {/* Onglet Rapports */}
        <TabsContent value="rapports" className="space-y-4">
          <VisualisationRapports />
        </TabsContent>

        {/* Onglet Outils */}
        <TabsContent value="outils" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Analyse Microscopique
                </CardTitle>
                <CardDescription>
                  Lancer une analyse complète selon les directives 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyser Dashboard-1
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyser Handshake
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyser Tout
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Évolution Projet Maître
                </CardTitle>
                <CardDescription>
                  Faire évoluer le projet maître avec les corrections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Créer Sauvegarde
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Wrench className="w-4 h-4 mr-2" />
                    Intégrer Corrections
                  </Button>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Valider Évolution
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Gestion des Rapports
                </CardTitle>
                <CardDescription>
                  Gérer et visualiser les rapports d'analyse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir Tous les Rapports
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter Rapports
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer Rapport
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Validation Post-Build
                </CardTitle>
                <CardDescription>
                  Valider que tout fonctionne après modification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Test de Build
                  </Button>
                  <Button className="w-full" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test Fonctionnel
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Test Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
                    </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}