"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'good' | 'warning' | 'critical';
}

interface ProjectPerformance {
  id: string;
  name: string;
  metrics: PerformanceMetric[];
  overallScore: number;
  lastUpdated: Date;
}

const PerformanceTracking = () => {
  const [projects, setProjects] = useState<ProjectPerformance[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Données de démonstration
  useEffect(() => {
    const mockData: ProjectPerformance[] = [
      {
        id: 'project-1',
        name: 'Dashboard IA',
        overallScore: 87,
        lastUpdated: new Date(),
        metrics: [
          {
            id: 'perf-1',
            name: 'Temps de réponse',
            value: 120,
            target: 100,
            unit: 'ms',
            trend: 'down',
            change: -15,
            status: 'good'
          },
          {
            id: 'perf-2',
            name: 'Taux de succès',
            value: 98.5,
            target: 95,
            unit: '%',
            trend: 'up',
            change: 2.3,
            status: 'good'
          },
          {
            id: 'perf-3',
            name: 'Utilisateurs actifs',
            value: 1250,
            target: 1500,
            unit: 'users',
            trend: 'up',
            change: 8.7,
            status: 'warning'
          },
          {
            id: 'perf-4',
            name: 'Erreurs 500',
            value: 12,
            target: 5,
            unit: 'errors',
            trend: 'up',
            change: 140,
            status: 'critical'
          }
        ]
      },
      {
        id: 'project-2',
        name: 'API Backend',
        overallScore: 92,
        lastUpdated: new Date(),
        metrics: [
          {
            id: 'perf-5',
            name: 'Disponibilité',
            value: 99.9,
            target: 99.5,
            unit: '%',
            trend: 'stable',
            change: 0.1,
            status: 'good'
          },
          {
            id: 'perf-6',
            name: 'Throughput',
            value: 2500,
            target: 2000,
            unit: 'req/s',
            trend: 'up',
            change: 12.5,
            status: 'good'
          }
        ]
      }
    ];

    setProjects(mockData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'critical': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Suivi des Performances
            </CardTitle>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
              </select>
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
              >
                <LineChart className="h-4 w-4 mr-2" />
                Détail
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vue d'ensemble */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProject === project.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="text-2xl font-bold">{project.overallScore}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score global</span>
                        <span>{project.overallScore}/100</span>
                      </div>
                      <Progress value={project.overallScore} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.metrics.length} métriques • 
                      Mis à jour {project.lastUpdated.toLocaleTimeString()}
                    </div>
                    <div className="flex gap-2">
                      {project.metrics.slice(0, 3).map(metric => (
                        <div key={metric.id} className="flex items-center gap-1">
                          {getStatusIcon(metric.status)}
                          <span className="text-xs">{metric.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vue détaillée */}
      {viewMode === 'detailed' && selectedProjectData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{selectedProjectData.name}</CardTitle>
              <p className="text-muted-foreground">
                Détail des performances • {selectedProjectData.metrics.length} métriques
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProjectData.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(metric.status)}
                        <h3 className="font-semibold">{metric.name}</h3>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.change >= 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {metric.value} {metric.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Cible: {metric.target} {metric.unit}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression vers l'objectif</span>
                        <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={Math.min((metric.value / metric.target) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Métriques globales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métriques Globales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-500">
                {projects.filter(p => p.overallScore >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Projets performants</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-yellow-500">
                {projects.filter(p => p.overallScore >= 60 && p.overallScore < 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Projets en cours</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-red-500">
                {projects.filter(p => p.overallScore < 60).length}
              </div>
              <div className="text-sm text-muted-foreground">Projets critiques</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-500">
                {Math.round(projects.reduce((acc, p) => acc + p.overallScore, 0) / projects.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Score moyen</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceTracking;
