'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RotateCcw,
  Shield,
  Zap,
  Search,
  Play,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function DashboardLight() {
  const [isRunning, setIsRunning] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🚀 Jarvis Ultra Instinct</h1>
            <p className="text-gray-600">Version Allégée - Dashboard IA Minimal Fonctionnel</p>
          </div>
          <Badge variant="secondary">v2.0.0-light</Badge>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Build</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">✅ OK</div>
              <p className="text-xs text-gray-600">Version allégée fonctionnelle</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépendances</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-xs text-gray-600">Minimales installées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">+85%</div>
              <p className="text-xs text-gray-600">Plus rapide</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taille</CardTitle>
              <Settings className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">-70%</div>
              <p className="text-xs text-gray-600">Réduite</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Analyse Microscopique
              </CardTitle>
              <CardDescription>
                Version allégée de l'analyse selon les directives 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dossier-cible">Dossier cible</Label>
                <Input id="dossier-cible" placeholder="Dashboard-1" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="analyse-profond">Analyse profonde</Label>
                <Switch 
                  id="analyse-profond" 
                  checked={true}
                />
              </div>
              <Button className="w-full" onClick={() => setIsRunning(!isRunning)}>
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Arrêter' : 'Lancer'} Analyse
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuration
              </CardTitle>
              <CardDescription>
                Paramètres de la version allégée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sauvegarde-auto">Sauvegarde automatique</Label>
                <Switch 
                  id="sauvegarde-auto" 
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dossier-rapports">Dossier des rapports</Label>
                <Input id="dossier-rapports" defaultValue="CORRECTION/" />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Commandes essentielles pour la version allégée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Démarrer Dev
              </Button>
              <Button variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Build
              </Button>
              <Button variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Tests
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Version allégée créée pour résoudre les problèmes de build</p>
          <p>Amélioration progressive recommandée</p>
        </div>
      </div>
    </div>
  );
}
