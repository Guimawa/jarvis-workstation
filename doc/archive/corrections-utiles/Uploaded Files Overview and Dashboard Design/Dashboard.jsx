import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Plus, 
  Users, 
  Settings, 
  BarChart3, 
  Menu, 
  Bell, 
  Search,
  Filter,
  Calendar,
  Tool
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import NetworkGraph from './NetworkGraph';
import ProjectForm from './ProjectForm';
import AIRoundTable from './AIRoundTable';
import SecureVault from './SecureVault';
import ProjectOverview from './ProjectOverview';
import PerformanceTracking from './PerformanceTracking';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'new-project', label: 'Nouveau Projet', icon: Plus },
    { id: 'ai-roundtable', label: 'Table Ronde IA', icon: Users },
    { id: 'tools', label: 'Outils (Keys API)', icon: Tool },
    { id: 'performance', label: 'Suivi Performances', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <NetworkGraph />;
      case 'new-project':
        return <ProjectForm />;
      case 'ai-roundtable':
        return <AIRoundTable />;
      case 'tools':
        return <SecureVault />;
      case 'project-overview':
        return <ProjectOverview />;
      case 'performance':
        return <PerformanceTracking />;
      default:
        return <NetworkGraph />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark dashboard-gradient">
      {/* Header */}
      <header className="border-b border-border/10 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>

          {/* Filtres */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select className="bg-background border border-border rounded-md px-3 py-1 text-sm">
                <option>Statut</option>
                <option>En cours</option>
                <option>Terminé</option>
                <option>Bloqué</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select className="bg-background border border-border rounded-md px-3 py-1 text-sm">
                <option>Date</option>
                <option>Cette semaine</option>
                <option>Ce mois</option>
                <option>Cette année</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Tool className="h-4 w-4 text-muted-foreground" />
              <select className="bg-background border border-border rounded-md px-3 py-1 text-sm">
                <option>Outil</option>
                <option>Figma</option>
                <option>GitHub</option>
                <option>Notion</option>
              </select>
            </div>
            <select className="bg-background border border-border rounded-md px-3 py-1 text-sm">
              <option>Ranking Projets</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="notification-badge">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
              </Button>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 240 : 64,
            opacity: 1
          }}
          className="bg-card/30 backdrop-blur-sm border-r border-border/10 h-[calc(100vh-73px)] overflow-hidden"
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left sidebar-item ${
                    activeTab === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: sidebarOpen ? 1 : 0,
                      width: sidebarOpen ? 'auto' : 0
                    }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>

        {/* Right Panel - Ranking */}
        <aside className="w-80 bg-card/30 backdrop-blur-sm border-l border-border/10 p-6 hidden xl:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ranking Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">{i + 1}</span>
                      </div>
                      <div className="w-24 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="w-12 h-4 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

