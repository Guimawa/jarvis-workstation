import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Globe,
  Sliders,
} from 'lucide-react';

// Generate a handful of placeholder projects for the initial graph
const initialProjects = [
  { id: 'projA', label: 'Projet Alpha', type: 'project', color: '#60A5FA', size: 20, progress: 75 },
  { id: 'projB', label: 'Projet Beta', type: 'project', color: '#34D399', size: 18, progress: 65 },
  { id: 'projC', label: 'Projet Gamma', type: 'project', color: '#FBBF24', size: 16, progress: 55 },
  { id: 'projD', label: 'Projet Delta', type: 'project', color: '#F472B6', size: 14, progress: 45 },
];

// Ranking list placeholders (names & overall change)
const initialRanking = [
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
];

export default function HandshakeClone() {
  // Graph state: nodes and links
  const [graphData, setGraphData] = useState({
    nodes: [...initialProjects],
    links: [],
  });
  const [selected, setSelected] = useState(null);
  const fgRef = useRef();

  // Timeline bars placeholder heights
  const [timeline, setTimeline] = useState(
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 50) + 4)
  );

  // Clear radial nodes helper
  const clearRadial = () => {
    setGraphData((g) => {
      const newNodes = g.nodes.filter((n) => !n.radial);
      const newLinks = g.links.filter((l) => !l.radial);
      return { nodes: newNodes, links: newLinks };
    });
  };

  // Click on a node: expand radial list or collapse
  const handleNodeClick = (node) => {
    if (node.type !== 'project') return; // ignore non-project nodes
    if (selected && selected.id === node.id) {
      // Collapse
      setSelected(null);
      clearRadial();
    } else {
      // Select new
      setSelected(node);
      clearRadial();
      // Add radial nodes: simulate events & influencers
      const categories = [
        { name: 'Événements', items: ['Conférence A', 'Webinar B', 'Atelier C'] },
        { name: 'Influenceurs', items: ['Alex', 'Benoît', 'Camille'] },
      ];
      setGraphData((g) => {
        const newNodes = [...g.nodes];
        const newLinks = [...g.links];
        const radius = 120;
        let angleOffset = 0;
        categories.forEach((cat, ci) => {
          cat.items.forEach((it, i) => {
            const angle = angleOffset + (Math.PI * 2) * (i / cat.items.length);
            const id = `${node.id}-${cat.name}-${it}`;
            newNodes.push({
              id,
              label: it,
              type: ci === 0 ? 'event' : 'influencer',
              color: ci === 0 ? '#FBBF24' : '#34D399',
              size: 6,
              radial: true,
              fx: node.fx !== undefined ? node.fx + radius * Math.cos(angle) : radius * Math.cos(angle),
              fy: node.fy !== undefined ? node.fy + radius * Math.sin(angle) : radius * Math.sin(angle),
            });
            newLinks.push({ source: node.id, target: id, radial: true });
          });
          angleOffset += Math.PI * 2 / categories.length;
        });
        return { nodes: newNodes, links: newLinks };
      });
    }
  };

  // Node tooltip states
  const [hoverNode, setHoverNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Tooltip update
  const handleNodeHover = (node, prevNode) => {
    setHoverNode(node);
  };
  const handleMouseMove = (event) => {
    setTooltipPos({ x: event.clientX + 10, y: event.clientY + 10 });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr 320px',
        gridTemplateRows: 'auto 1fr auto',
        gap: '12px',
        height: '100%',
        padding: '12px',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Sidebar */}
      <aside className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>Menu</div>
        <button className="btn">Vue d’ensemble</button>
        <button className="btn">Coffre‑fort</button>
        <button className="btn">Table Ronde IA</button>
        <button className="btn">Performances</button>
        <button className="btn">Paramètres</button>
      </aside>

      {/* Top bar */}
      <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '60%' }}>
          <Search size={16} color="#94A3B8" />
          <input type="text" className="input" placeholder="Rechercher un projet" />
          {/* Score slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Score</span>
            <input type="range" min="0" max="100" defaultValue="40" className="slider" style={{ width: '80px' }} />
          </div>
          {/* Actors select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={16} color="#94A3B8" />
            <select className="input" style={{ width: '90px' }}>
              <option>Acteurs: Tous</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          {/* Geography select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={16} color="#94A3B8" />
            <select className="input" style={{ width: '110px' }}>
              <option>Géogr.: Monde</option>
              <option>Europe</option>
              <option>USA</option>
            </select>
          </div>
        </div>
        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="btn" style={{ gap: '4px' }}>
            4 Groupé
          </div>
          <div className="btn" style={{ gap: '4px' }}>
            3 Favoris
          </div>
          <div className="btn" style={{ gap: '4px' }}>
            Moi <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Graph area */}
      <div
        style={{ position: 'relative' }}
        className="panel"
        onMouseLeave={() => setHoverNode(null)}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeRelSize={4}
          nodeVal={(n) => n.size}
          linkColor={() => 'rgba(255,255,255,0.15)'}
          linkWidth={() => 1}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          enableZoomPanInteraction={true}
          enableNodeDrag={false}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const size = node.size;
            // Outer glow
            ctx.save();
            ctx.shadowColor = node.color;
            ctx.shadowBlur = selected && selected.id === node.id ? 20 : 10;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,0.04)';
            ctx.fill();
            ctx.restore();
            // Core
            ctx.beginPath();
            ctx.arc(node.x, node.y, size - 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
          }}
        />
        {/* Tooltip */}
        {hoverNode && (
          <div
            className="node-tooltip"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div style={{ fontWeight: '600' }}>{hoverNode.label}</div>
            {hoverNode.type === 'project' && <div className="small">Projet</div>}
            {hoverNode.type === 'event' && <div className="small">Événement</div>}
            {hoverNode.type === 'influencer' && <div className="small">Influenceur</div>}
          </div>
        )}
      </div>

      {/* Ranking panel */}
      <aside className="panel" style={{ overflowY: 'auto' }}>
        <div style={{ marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>Classement</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
          <span>Nom</span>
          <span>Score</span>
        </div>
        {initialRanking.map((person, idx) => (
          <div key={person.name} className="ranking-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '14px', textAlign: 'right' }}>{idx + 1}.</span>
              <span>{person.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{person.value}</span>
              {person.diff > 0 ? (
                <ArrowUpRight size={12} color="#34D399" />
              ) : person.diff < 0 ? (
                <ArrowDownRight size={12} color="#F87171" />
              ) : (
                <span style={{ width: '12px' }} />
              )}
            </div>
          </div>
        ))}
      </aside>

      {/* Bottom timeline */}
      <div className="panel" style={{ gridColumn: '2 / span 1' }}>
        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '600' }}>Trends par thèmes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA' }} /> Mentions
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }} /> Influence
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBF24' }} /> Engagement
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Août 20 – Aujourd’hui</div>
        </div>
        <div className="timeline">
          {timeline.map((h, i) => (
            <div
              key={i}
              className={
                'bar ' + (i % 7 === 0 ? 'active' : '')
              }
              style={{ height: h }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}