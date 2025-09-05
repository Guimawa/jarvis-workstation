'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Save, 
  RotateCcw,
  Shield,
  Zap,
  Search
} from 'lucide-react';

export default function ConfigurationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">⚙️ Configuration</h1>
        <p className="text-muted-foreground">
          Paramètres et configuration du système d'analyse microscopique
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Analyse Microscopique
            </CardTitle>
            <CardDescription>
              Configuration des paramètres d'analyse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="utilite-ambigue-min">Utilité ambiguë minimum</Label>
              <Input id="utilite-ambigue-min" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utilite-ambigue-max">Utilité ambiguë maximum</Label>
              <Input id="utilite-ambigue-max" type="number" defaultValue="7" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="differences-nombreuses">Différences nombreuses</Label>
              <Input id="differences-nombreuses" type="number" defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dependances-excessives">Dépendances excessives</Label>
              <Input id="dependances-excessives" type="number" defaultValue="20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Évolution Projet
            </CardTitle>
            <CardDescription>
              Configuration de l'évolution du projet maître
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sauvegarde-auto">Sauvegarde automatique</Label>
              <Switch id="sauvegarde-auto" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="validation-auto">Validation automatique</Label>
              <Switch id="validation-auto" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rollback-auto">Rollback automatique en cas d'erreur</Label>
              <Switch id="rollback-auto" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout-evolution">Timeout évolution (minutes)</Label>
              <Input id="timeout-evolution" type="number" defaultValue="10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et protection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="protection-maitre">Protection dossier maître</Label>
              <Switch id="protection-maitre" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmation-actions">Confirmation avant actions</Label>
              <Switch id="confirmation-actions" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niveau-securite">Niveau de sécurité</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="standard">Standard</option>
                <option value="elevé" selected>Élevé</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Système
            </CardTitle>
            <CardDescription>
              Configuration générale du système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dossier-rapports">Dossier des rapports</Label>
              <Input id="dossier-rapports" defaultValue="jarvis-workstation/CORRECTION/" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dossier-archive">Dossier d'archive</Label>
              <Input id="dossier-archive" defaultValue="ARCHIVE_2025/" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dossier-ultra-instinct">Dossier Ultra Instinct</Label>
              <Input id="dossier-ultra-instinct" defaultValue="ULTRA_INSTINCT_2025/" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niveau-log">Niveau de log</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="error">Erreur</option>
                <option value="warn">Avertissement</option>
                <option value="info" selected>Information</option>
                <option value="debug">Debug</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder Configuration
        </Button>
      </div>
    </div>
  );
}
