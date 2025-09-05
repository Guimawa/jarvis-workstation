'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Zap, 
  CheckCircle, 
  FileText, 
  Settings,
  BarChart3,
  Wrench,
  Shield
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Vue d\'ensemble',
    href: '/dashboard',
    icon: Home,
    description: 'Tableau de bord principal'
  },
  {
    name: 'Analyse Microscopique',
    href: '/outils-analyse',
    icon: Search,
    description: 'Analyse rigoureuse des projets'
  },
  {
    name: 'Évolution Projet',
    href: '/evolution-projet',
    icon: Zap,
    description: 'Évolution sécurisée du projet maître'
  },
  {
    name: 'Validation Post-Build',
    href: '/validation-post-build',
    icon: CheckCircle,
    description: 'Validation complète après modification'
  },
  {
    name: 'Rapports',
    href: '/rapports',
    icon: FileText,
    description: 'Visualisation des rapports d\'analyse'
  },
  {
    name: 'Métriques',
    href: '/metriques',
    icon: BarChart3,
    description: 'Statistiques et performances'
  },
  {
    name: 'Outils',
    href: '/outils',
    icon: Wrench,
    description: 'Outils avancés d\'analyse'
  },
  {
    name: 'Configuration',
    href: '/configuration',
    icon: Settings,
    description: 'Paramètres du système'
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">Jarvis Workstation</h1>
            <p className="text-sm text-gray-400">Analyse Microscopique 2025</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-400">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <div>Version 2.0</div>
          <div>Ultra Instinct Mode</div>
        </div>
      </div>
    </div>
  );
}
