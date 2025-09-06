"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Brain, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Sliders
} from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'project' | 'team' | 'tool' | 'client';
  status: 'active' | 'completed' | 'blocked' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  connections: string[];
  position: { x: number; y: number };
  size: number;
  color: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: 'collaboration' | 'dependency' | 'tool' | 'client';
}

const NetworkGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [filter, setFilter] = useState<string>('all');
  
  // Nouvelles fonctionnalités Handshake
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scoreFilter, setScoreFilter] = useState<number>(40);
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [geographyFilter, setGeographyFilter] = useState<string>('world');
  const [timeline, setTimeline] = useState<number[]>([]);
  const [ranking, setRanking] = useState<Array<{name: string, value: number, diff: number}>>([]);

  // Configuration des nœuds
  const nodeConfig = {
    project: { color: '#3b82f6', icon: Target, size: 60 },
    team: { color: '#10b981', icon: Users, size: 50 },
    tool: { color: '#f59e0b', icon: Zap, size: 40 },
    client: { color: '#8b5cf6', icon: Shield, size: 45 }
  };

  // Initialisation des données Handshake
  useEffect(() => {
    // Timeline d'activité
    setTimeline(Array.from({ length: 20 }, () => Math.floor(Math.random() * 50) + 4));
    
    // Classement
    setRanking([
      { name: 'Arthur', value: 72, diff: 2 },
      { name: 'Brigitte', value: 68, diff: -1 },
      { name: 'Charles', value: 66, diff: 3 },
      { name: 'Diane', value: 61, diff: 0 },
      { name: 'Emile', value: 58, diff: -2 },
      { name: 'Fatima', value: 55, diff: 1 },
      { name: 'Gabriel', value: 52, diff: -1 },
      { name: 'Hélène', value: 49, diff: 2 },
      { name: 'Ismael', value: 45, diff: 0 },
      { name: 'Jade', value: 42, diff: -3 },
      { name: 'Kevin', value: 39, diff: 1 },
      { name: 'Laura', value: 37, diff: -1 },
    ]);
  }, []);

  // Données d'exemple
  useEffect(() => {
    const sampleNodes: Node[] = [
      {
        id: '1',
        label: 'Dashboard Guimawa IA',
        type: 'project',
        status: 'active',
        priority: 'high',
        progress: 85,
        connections: ['2', '3', '4'],
        position: { x: 200, y: 150 },
        size: 60,
        color: '#3b82f6'
      },
      {
        id: '2',
        label: 'Guillaume',
        type: 'team',
        status: 'active',
        priority: 'high',
        connections: ['1', '3', '5'],
        position: { x: 100, y: 100 },
        size: 50,
        color: '#10b981'
      },
      {
        id: '3',
        label: 'IA Assistant',
        type: 'team',
        status: 'active',
        priority: 'high',
        connections: ['1', '2', '6'],
        position: { x: 300, y: 100 },
        size: 50,
        color: '#10b981'
      },
      {
        id: '4',
        label: 'React',
        type: 'tool',
        status: 'active',
        priority: 'medium',
        connections: ['1', '5'],
        position: { x: 150, y: 250 },
        size: 40,
        color: '#f59e0b'
      },
      {
        id: '5',
        label: 'Next.js',
        type: 'tool',
        status: 'active',
        priority: 'medium',
        connections: ['1', '2', '4'],
        position: { x: 250, y: 250 },
        size: 40,
        color: '#f59e0b'
      },
      {
        id: '6',
        label: 'Guimawa Solutions',
        type: 'client',
        status: 'active',
        priority: 'high',
        connections: ['1', '3'],
        position: { x: 200, y: 50 },
        size: 45,
        color: '#8b5cf6'
      }
    ];

    const sampleEdges: Edge[] = [
      { id: 'e1', source: '1', target: '2', weight: 0.8, type: 'collaboration' },
      { id: 'e2', source: '1', target: '3', weight: 0.9, type: 'collaboration' },
      { id: 'e3', source: '1', target: '4', weight: 0.7, type: 'tool' },
      { id: 'e4', source: '1', target: '5', weight: 0.8, type: 'tool' },
      { id: 'e5', source: '1', target: '6', weight: 0.9, type: 'client' },
      { id: 'e6', source: '2', target: '3', weight: 0.6, type: 'collaboration' },
      { id: 'e7', source: '2', target: '4', weight: 0.5, type: 'tool' },
      { id: 'e8', source: '2', target: '5', weight: 0.7, type: 'tool' },
      { id: 'e9', source: '3', target: '6', weight: 0.8, type: 'client' }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
  }, []);

  // Animation des nœuds
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          position: {
            x: node.position.x + (Math.random() - 0.5) * 2,
            y: node.position.y + (Math.random() - 0.5) * 2
          }
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner les arêtes
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.position.x, sourceNode.position.y);
          ctx.lineTo(targetNode.position.x, targetNode.position.y);
          ctx.strokeStyle = edge.type === 'collaboration' ? '#10b981' : 
                           edge.type === 'tool' ? '#f59e0b' : 
                           edge.type === 'client' ? '#8b5cf6' : '#6b7280';
          ctx.lineWidth = edge.weight * 3;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Dessiner les nœuds
      nodes.forEach(node => {
        const config = nodeConfig[node.type];
        const Icon = config.icon;

        // Cercle de fond
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, node.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Bordure
        ctx.strokeStyle = selectedNode?.id === node.id ? '#ffffff' : node.color;
        ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
        ctx.stroke();

        // Icône (simulée par un cercle plus petit)
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, node.size / 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Texte
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.position.x, node.position.y + 40);
      });
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [nodes, edges, selectedNode]);

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(node || null);
  };

  const filteredNodes = nodes.filter(node => {
    if (filter === 'all') return true;
    return node.type === filter;
  });

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Réseau de Projets
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Visualisation interactive des connexions entre projets, équipe et outils
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filtres Handshake */}
            <div className="flex items-center space-x-2">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un projet"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Score</span>
              <input
                type="range"
                min="0"
                max="100"
                value={scoreFilter}
                onChange={(e) => setScoreFilter(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{scoreFilter}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-gray-500" />
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">Acteurs: Tous</option>
                <option value="team">Équipe</option>
                <option value="client">Clients</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-gray-500" />
              <select
                value={geographyFilter}
                onChange={(e) => setGeographyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="world">Géogr.: Monde</option>
                <option value="europe">Europe</option>
                <option value="usa">USA</option>
              </select>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous les éléments</option>
              <option value="project">Projets</option>
              <option value="team">Équipe</option>
              <option value="tool">Outils</option>
              <option value="client">Clients</option>
            </select>

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'overview' ? 'detailed' : 'overview')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {viewMode === 'overview' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 p-6">
        <canvas
          ref={canvasRef}
          className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Trouver le nœud le plus proche
            let closestNode = null;
            let minDistance = Infinity;
            
            nodes.forEach(node => {
              const distance = Math.sqrt(
                Math.pow(x - node.position.x, 2) + Math.pow(y - node.position.y, 2)
              );
              if (distance < minDistance && distance < node.size / 2) {
                minDistance = distance;
                closestNode = node;
              }
            });
            
            if (closestNode) {
              handleNodeClick((closestNode as any).id);
            }
          }}
        />

        {/* Légende */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Projets</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Équipe</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Outils</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Clients</span>
          </div>
        </div>
      </div>

      {/* Timeline d'activité Handshake */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-900 dark:text-white">Trends par thèmes</span>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Mentions</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Influence</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Engagement</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Août 20 – Aujourd'hui</div>
        </div>
        <div className="flex items-end space-x-1 h-12">
          {timeline.map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-sm ${
                i % 7 === 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>

      {/* Classement Handshake */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Classement</h3>
        <div className="space-y-2">
          {ranking.slice(0, 5).map((person, idx) => (
            <div key={person.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-4">{idx + 1}.</span>
                <span className="text-sm text-gray-900 dark:text-white">{person.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-900 dark:text-white">{person.value}</span>
                {person.diff > 0 ? (
                  <ArrowUpRight size={12} className="text-green-500" />
                ) : person.diff < 0 ? (
                  <ArrowDownRight size={12} className="text-red-500" />
                ) : (
                  <div className="w-3" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de détails */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {selectedNode.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Type: {selectedNode.type} | Statut: {selectedNode.status} | Priorité: {selectedNode.priority}
              </p>
              
              {selectedNode.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>Progression</span>
                    <span>{selectedNode.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedNode.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>Connexions: {selectedNode.connections.length}</p>
                <p>Position: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NetworkGraph;