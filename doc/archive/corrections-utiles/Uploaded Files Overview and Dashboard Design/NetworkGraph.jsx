import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const NetworkGraph = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { id: 1, x: 200, y: 150, color: 'bg-pink-500', size: 'w-12 h-12' },
    { id: 2, x: 350, y: 100, color: 'bg-green-500', size: 'w-10 h-10' },
    { id: 3, x: 150, y: 250, color: 'bg-green-400', size: 'w-14 h-14' },
    { id: 4, x: 450, y: 200, color: 'bg-yellow-500', size: 'w-8 h-8' },
    { id: 5, x: 300, y: 300, color: 'bg-blue-500', size: 'w-10 h-10' },
    { id: 6, x: 100, y: 350, color: 'bg-yellow-400', size: 'w-12 h-12' },
    { id: 7, x: 400, y: 350, color: 'bg-green-500', size: 'w-9 h-9' },
    { id: 8, x: 250, y: 400, color: 'bg-blue-400', size: 'w-11 h-11' },
  ];

  const connections = [
    { from: { x: 250, y: 250 }, to: { x: 200, y: 150 } },
    { from: { x: 250, y: 250 }, to: { x: 350, y: 100 } },
    { from: { x: 250, y: 250 }, to: { x: 150, y: 250 } },
    { from: { x: 250, y: 250 }, to: { x: 450, y: 200 } },
    { from: { x: 250, y: 250 }, to: { x: 300, y: 300 } },
    { from: { x: 250, y: 250 }, to: { x: 100, y: 350 } },
    { from: { x: 250, y: 250 }, to: { x: 400, y: 350 } },
    { from: { x: 250, y: 250 }, to: { x: 250, y: 400 } },
  ];

  return (
    <div className="relative w-full h-[600px] bg-card/20 rounded-lg border border-border/10 overflow-hidden">
      {/* SVG pour les connexions */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => (
          <motion.line
            key={index}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-border opacity-30"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: index * 0.1 }}
          />
        ))}
      </svg>

      {/* Nœud central */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-2 border-primary bg-background/80 backdrop-blur-sm flex items-center justify-center cursor-pointer"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center">
          <Plus className="h-6 w-6 mx-auto mb-1 text-primary" />
          <span className="text-xs font-medium text-foreground">Créer un</span>
          <br />
          <span className="text-xs font-medium text-foreground">nouveau projet</span>
        </div>
      </motion.div>

      {/* Nœuds périphériques */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          className={`absolute ${node.size} ${node.color} rounded-full border-2 border-background/20 cursor-pointer network-node`}
          style={{ 
            left: node.x - (parseInt(node.size.split(' ')[0].replace('w-', '')) * 4), 
            top: node.y - (parseInt(node.size.split(' ')[1].replace('h-', '')) * 4) 
          }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
        />
      ))}

      {/* Tooltip pour les nœuds */}
      {hoveredNode && (
        <motion.div
          className="absolute bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border border-border text-sm"
          style={{ 
            left: nodes.find(n => n.id === hoveredNode)?.x + 20, 
            top: nodes.find(n => n.id === hoveredNode)?.y - 10 
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          Placeholder Projet {hoveredNode}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-sm text-muted-foreground">
        Cliquez sur le centre pour créer un nouveau projet
      </div>
    </div>
  );
};

export default NetworkGraph;

