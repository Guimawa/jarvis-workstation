"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Network, 
  Shield, 
  BarChart3, 
  Bot, 
  Code, 
  FileText, 
  History, 
  Brain, 
  FlaskConical,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';

// Import des composants
import AIRoundTable from '@/components/sections/AIRoundTable';
import NetworkGraph from '@/components/sections/NetworkGraph';
import SecureVault from '@/components/sections/SecureVault';
import PerformanceTracking from '@/components/sections/PerformanceTracking';

const UltraInstinctDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const sections = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Home, color: 'text-blue-500' },
    { id: 'network', name: 'Réseau de Projets', icon: Network, color: 'text-green-500' },
    { id: 'vault', name: 'Coffre-fort', icon: Shield, color: 'text-purple-500' },
    { id: 'performance', name: 'Performances', icon: BarChart3, color: 'text-orange-500' },
    { id: 'ai-roundtable', name: 'Table Ronde IA', icon: Bot, color: 'text-pink-500' },
    { id: 'generate', name: 'Générer', icon: Code, color: 'text-cyan-500' },
    { id: 'templates', name: 'Templates', icon: FileText, color: 'text-indigo-500' },
    { id: 'memory', name: 'Mémoire', icon: History, color: 'text-yellow-500' },
    { id: 'learning', name: 'Apprentissage', icon: Brain, color: 'text-emerald-500' },
    { id: 'tests', name: 'Tests', icon: FlaskConical, color: 'text-red-500' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'network':
        return <NetworkGraph />;
      case 'vault':
        return <SecureVault />;
      case 'performance':
        return <PerformanceTracking />;
      case 'ai-roundtable':
        return <AIRoundTable />;
      case 'generate':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold">Générateur de Code</h2><p className="text-muted-foreground">Utilisez le CLI Jarvis pour générer du code</p></div>;
      case 'templates':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold">Templates</h2><p className="text-muted-foreground">Gestion des templates de code</p></div>;
      case 'memory':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold">Mémoire</h2><p className="text-muted-foreground">Historique des générations</p></div>;
      case 'learning':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold">Apprentissage</h2><p className="text-muted-foreground">Logs d'apprentissage de Jarvis</p></div>;
      case 'tests':
        return <div className="text-center py-20"><h2 className="text-2xl font-bold">Tests</h2><p className="text-muted-foreground">Tests automatisés</p></div>;
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  🧠 Jarvis Ultra Instinct
                  <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">
                    v2.0
                  </span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Système complet de génération de code IA avec interface moderne
                </p>
              </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Projets Actifs</p>
                      <p className="text-3xl font-bold">12</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Network className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Générations</p>
                      <p className="text-3xl font-bold">247</p>
                    </div>
                    <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Code className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de Succès</p>
                      <p className="text-3xl font-bold">94%</p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Secrets Stockés</p>
                      <p className="text-3xl font-bold">8</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveSection('generate')}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Code className="h-6 w-6" />
                    <span>Générer du Code</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('network')}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                  >
                    <Network className="h-6 w-6" />
                    <span>Voir le Réseau</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('ai-roundtable')}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                  >
                    <Bot className="h-6 w-6" />
                    <span>Table Ronde IA</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Composant Button généré', time: 'Il y a 2 minutes', type: 'success' },
                    { action: 'Test unitaire ajouté', time: 'Il y a 15 minutes', type: 'info' },
                    { action: 'Projet Dashboard créé', time: 'Il y a 1 heure', type: 'success' },
                    { action: 'Erreur de compilation corrigée', time: 'Il y a 2 heures', type: 'warning' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'success' ? 'bg-green-500' :
                          item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <span>{item.action}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold">Jarvis Ultra Instinct</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 0 }}
          className="hidden lg:block lg:w-64 bg-card border-r overflow-hidden"
        >
          <div className="p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full justify-start gap-3 h-12"
                >
                  <Icon className={`h-5 w-5 ${section.color}`} />
                  <span>{section.name}</span>
                </Button>
              );
            })}
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r lg:hidden"
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'default' : 'ghost'}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSidebarOpen(false);
                    }}
                    className="w-full justify-start gap-3 h-12"
                  >
                    <Icon className={`h-5 w-5 ${section.color}`} />
                    <span>{section.name}</span>
                  </Button>
                );
              })}
            </div>
          </motion.aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default UltraInstinctDashboard;
