"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Wrench,
  Zap,
  Shield,
  Brain,
  Target,
  TrendingUp,
  Activity,
  Clock,
  Star,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info
} from 'lucide-react';

// Types
interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'blocked' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
  progress: number;
  team: string[];
  tools: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

// Mock Data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Dashboard Guimawa IA',
    status: 'active',
    priority: 'high',
    deadline: '2025-02-15',
    progress: 85,
    team: ['Guillaume', 'IA Assistant'],
    tools: ['React', 'Next.js', 'Tailwind'],
    description: 'Dashboard ultra moderne avec interface handshake',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15'
  },
  {
    id: '2',
    name: 'Système de Gestion Projets',
    status: 'active',
    priority: 'medium',
    deadline: '2025-03-01',
    progress: 60,
    team: ['Guillaume', 'Dev Team'],
    tools: ['Vue.js', 'Node.js', 'MongoDB'],
    description: 'Plateforme de gestion de projets collaboratifs',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-14'
  },
  {
    id: '3',
    name: 'API Intelligence Artificielle',
    status: 'blocked',
    priority: 'urgent',
    deadline: '2025-01-20',
    progress: 30,
    team: ['Guillaume', 'AI Team'],
    tools: ['Python', 'FastAPI', 'Groq'],
    description: 'API pour intégration IA dans les projets',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-12'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouveau Projet Créé',
    message: 'Dashboard Guimawa IA a été créé avec succès',
    type: 'success',
    timestamp: '2025-01-15 14:30',
    read: false
  },
  {
    id: '2',
    title: 'Deadline Approche',
    message: 'API Intelligence Artificielle - Deadline dans 5 jours',
    type: 'warning',
    timestamp: '2025-01-15 10:15',
    read: false
  },
  {
    id: '3',
    title: 'Projet Bloqué',
    message: 'Système de Gestion Projets nécessite une révision',
    type: 'error',
    timestamp: '2025-01-14 16:45',
    read: true
  }
];

// Components
const StatusBadge = ({ status }: { status: Project['status'] }) => {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: Play, label: 'Actif' },
    completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Terminé' },
    blocked: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Bloqué' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En attente' }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: Project['priority'] }) => {
  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-800', label: 'Faible' },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Moyen' },
    high: { color: 'bg-orange-100 text-orange-800', label: 'Élevé' },
    urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
  };
  
  const config = priorityConfig[priority];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const ProjectCard = ({ project, onEdit, onDelete, onView }: { 
  project: Project; 
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {project.description}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(project)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(project)}
          className="p-2 text-gray-400 hover:text-blue-600"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project)}
          className="p-2 text-gray-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="flex items-center justify-between mb-4">
      <StatusBadge status={project.status} />
      <PriorityBadge priority={project.priority} />
    </div>
    
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
        <span>Progression</span>
        <span>{project.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
    
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
      <span>{project.team.length} membre(s)</span>
    </div>
    
    <div className="flex flex-wrap gap-1 mt-3">
      {project.tools.map((tool, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
        >
          {tool}
        </span>
      ))}
    </div>
  </motion.div>
);

const NotificationItem = ({ notification, onMarkAsRead }: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) => {
  const typeConfig = {
    info: { color: 'text-blue-600', icon: Info },
    success: { color: 'text-green-600', icon: CheckCircle },
    warning: { color: 'text-yellow-600', icon: AlertCircle },
    error: { color: 'text-red-600', icon: XCircle }
  };
  
  const config = typeConfig[notification.type];
  const Icon = config.icon;
  
  return (
    <div 
      className={`p-3 border-l-4 ${
        notification.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
      } border-l-${notification.type === 'info' ? 'blue' : notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : 'red'}-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {notification.timestamp}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, change, color = 'blue' }: {
  title: string;
  value: string | number;
  icon: any;
  change?: string;
  color?: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </div>
);

// Main Component
export default function DashboardGuimawa() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'projects', label: 'Projets', icon: Target },
    { id: 'ai-tools', label: 'Outils IA', icon: Brain },
    { id: 'performance', label: 'Performances', icon: BarChart3 },
    { id: 'vault', label: 'Coffre-fort', icon: Shield },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEditProject = (project: Project) => {
    console.log('Edit project:', project);
    // TODO: Implement edit functionality
  };

  const handleDeleteProject = (project: Project) => {
    setProjects(prev => prev.filter(p => p.id !== project.id));
  };

  const handleViewProject = (project: Project) => {
    console.log('View project:', project);
    // TODO: Implement view functionality
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    blockedProjects: projects.filter(p => p.status === 'blocked').length,
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard Guimawa IA
              </h1>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="blocked">Bloqué</option>
              <option value="pending">En attente</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNewProject(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau Projet</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <Bell className="w-5 h-5" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.unreadNotifications}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkNotificationAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
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
          className="bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-73px)] overflow-hidden"
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Total Projets"
                      value={stats.totalProjects}
                      icon={Target}
                      change="+2 cette semaine"
                      color="blue"
                    />
                    <StatsCard
                      title="Projets Actifs"
                      value={stats.activeProjects}
                      icon={Activity}
                      change="+1 cette semaine"
                      color="green"
                    />
                    <StatsCard
                      title="Projets Terminés"
                      value={stats.completedProjects}
                      icon={CheckCircle}
                      change="+3 cette semaine"
                      color="purple"
                    />
                    <StatsCard
                      title="Projets Bloqués"
                      value={stats.blockedProjects}
                      icon={AlertCircle}
                      change="+1 cette semaine"
                      color="red"
                    />
                  </div>

                  {/* Recent Projects */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Projets Récents
                      </h2>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Voir tout
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProjects.slice(0, 6).map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onEdit={handleEditProject}
                          onDelete={handleDeleteProject}
                          onView={handleViewProject}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Tous les Projets
                    </h2>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Exporter</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Importer</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                        onView={handleViewProject}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ai-tools' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Outils IA
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Assistant IA
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Assistant intelligent pour la gestion de projets et l'automatisation des tâches.
                      </p>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Activer
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Générateur de Code
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Génération automatique de code pour vos projets React, Vue, et autres.
                      </p>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Activer
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Sécurité IA
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Analyse de sécurité et détection de vulnérabilités dans vos projets.
                      </p>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Activer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performances
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Progression des Projets
                      </h3>
                      <div className="space-y-4">
                        {projects.map(project => (
                          <div key={project.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {project.name}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {project.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Statistiques
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Temps moyen par projet
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            12 jours
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Taux de réussite
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            85%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Projets en retard
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            2
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vault' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Coffre-fort Sécurisé
                  </h2>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-center py-12">
                      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Coffre-fort Verrouillé
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Accédez à vos données sensibles de manière sécurisée
                      </p>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Déverrouiller
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Paramètres
                  </h2>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Préférences Générales
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              Mode sombre
                            </span>
                            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              Notifications
                            </span>
                            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
