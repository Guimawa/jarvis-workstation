'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Zap, 
  CheckCircle, 
  FileText, 
  BarChart3,
  Wrench,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-12 h-12 text-blue-500" />
          <h1 className="text-4xl font-bold">Jarvis Workstation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Système complet d'analyse microscopique, d'évolution et de validation des projets
        </p>
        <p className="text-lg text-muted-foreground">
          Version 2.0 - Ultra Instinct Mode
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-6 h-6 mr-2 text-blue-500" />
              Analyse Microscopique
            </CardTitle>
            <CardDescription>
              Analyse rigoureuse selon les directives 2025 avec détection des corrections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Lecture ligne par ligne</li>
              <li>• Comparaison avec fichiers maîtres</li>
              <li>• Détection des corrections cachées</li>
              <li>• Rapports détaillés</li>
            </ul>
            <Link href="/outils-analyse">
              <Button className="w-full mt-4">
                Lancer l'Analyse
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-6 h-6 mr-2 text-green-500" />
              Évolution Projet Maître
            </CardTitle>
            <CardDescription>
              Évolution sécurisée avec sauvegarde et validation Ultra Instinct
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sauvegarde automatique</li>
              <li>• Intégration progressive</li>
              <li>• Tests de validation</li>
              <li>• Rollback en cas d'erreur</li>
            </ul>
            <Link href="/evolution-projet">
              <Button className="w-full mt-4">
                Évoluer le Projet
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-purple-500" />
              Validation Post-Build
            </CardTitle>
            <CardDescription>
              Validation complète pour s'assurer que tout fonctionne parfaitement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Tests de build</li>
              <li>• Tests fonctionnels</li>
              <li>• Tests de performance</li>
              <li>• Tests de régression</li>
            </ul>
            <Link href="/validation-post-build">
              <Button className="w-full mt-4">
                Valider le Build
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-2 text-orange-500" />
              Rapports d'Analyse
            </CardTitle>
            <CardDescription>
              Visualisation et gestion des rapports d'analyse microscopique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Visualisation des rapports</li>
              <li>• Statistiques détaillées</li>
              <li>• Export des données</li>
              <li>• Historique des analyses</li>
            </ul>
            <Link href="/rapports">
              <Button className="w-full mt-4">
                Voir les Rapports
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-red-500" />
              Métriques et Statistiques
            </CardTitle>
            <CardDescription>
              Analyse des performances et statistiques du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Métriques en temps réel</li>
              <li>• Graphiques de performance</li>
              <li>• Tendances d'évolution</li>
              <li>• Alertes automatiques</li>
            </ul>
            <Link href="/metriques">
              <Button className="w-full mt-4">
                Voir les Métriques
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-6 h-6 mr-2 text-gray-500" />
              Outils Avancés
            </CardTitle>
            <CardDescription>
              Outils spécialisés pour l'analyse et la maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Outils de diagnostic</li>
              <li>• Maintenance automatique</li>
              <li>• Configuration avancée</li>
              <li>• Support technique</li>
            </ul>
            <Link href="/outils">
              <Button className="w-full mt-4">
                Accéder aux Outils
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Actions Rapides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard Principal
            </Button>
          </Link>
          <Link href="/outils-analyse">
            <Button variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Analyser Maintenant
            </Button>
          </Link>
          <Link href="/rapports">
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Voir Rapports
            </Button>
          </Link>
          <Link href="/configuration">
            <Button variant="outline" className="w-full">
              <Wrench className="w-4 h-4 mr-2" />
              Configuration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}