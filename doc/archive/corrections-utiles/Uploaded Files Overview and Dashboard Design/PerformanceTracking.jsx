import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, FileText, TrendingUp, Users, Eye, Calendar } from 'lucide-react';

const PerformanceTracking = () => {
  // Données simulées pour les graphiques
  const youtubeData = [
    { name: 'Jan', views: 1200 },
    { name: 'Fév', views: 1900 },
    { name: 'Mar', views: 2400 },
    { name: 'Avr', views: 2100 },
    { name: 'Mai', views: 2800 },
    { name: 'Jun', views: 3200 },
  ];

  const usersData = [
    { name: 'Sem 1', users: 450 },
    { name: 'Sem 2', users: 620 },
    { name: 'Sem 3', users: 580 },
    { name: 'Sem 4', users: 750 },
  ];

  const projectMetrics = [
    { name: 'E-commerce', completion: 85, users: 1250, revenue: 15600 },
    { name: 'Mobile App', completion: 100, users: 890, revenue: 8900 },
    { name: 'Dashboard', completion: 45, users: 340, revenue: 2100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Suivi des Performances
          </CardTitle>
          <p className="text-muted-foreground">
            Analysez les métriques de vos projets et exportez vos rapports
          </p>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">24.5K</div>
                <p className="text-sm text-muted-foreground">Vues totales</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-xs text-green-500 mt-2">+12% ce mois</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">2.8K</div>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-xs text-green-500 mt-2">+8% ce mois</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-sm text-muted-foreground">Taux de completion</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-xs text-green-500 mt-2">+5% ce mois</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">€26.6K</div>
                <p className="text-sm text-muted-foreground">Revenus générés</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-xs text-green-500 mt-2">+18% ce mois</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YouTube Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vues YouTube</CardTitle>
            <p className="text-sm text-muted-foreground">Évolution mensuelle</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={youtubeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Utilisateurs Actifs</CardTitle>
            <p className="text-sm text-muted-foreground">Par semaine</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métriques par Projet</CardTitle>
          <p className="text-sm text-muted-foreground">Performance détaillée de chaque projet</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Projet</th>
                  <th className="text-left py-3 px-4">Completion</th>
                  <th className="text-left py-3 px-4">Utilisateurs</th>
                  <th className="text-left py-3 px-4">Revenus</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectMetrics.map((project, index) => (
                  <motion.tr
                    key={project.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-border/50"
                  >
                    <td className="py-3 px-4 font-medium">{project.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${project.completion}%` }}
                          />
                        </div>
                        <span className="text-sm">{project.completion}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{project.users.toLocaleString()}</td>
                    <td className="py-3 px-4">€{project.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exports et Rapports</CardTitle>
          <p className="text-sm text-muted-foreground">
            Générez et téléchargez vos rapports de performance
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Exporter en PDF</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Exporter en CSV</span>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Rapport automatique</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Recevez un rapport hebdomadaire automatique par email
            </p>
            <Button size="sm">Configurer les rapports automatiques</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PerformanceTracking;

