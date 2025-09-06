"use client";

import React, { useMemo, useState } from "react";
import NetworkGraph3D, { GraphData, GraphNode, GraphLink } from "@/components/sections/NetworkGraph3D";

const PROJECTS = [
  { id: "p1", label: "Projet App Mobile", color: "#60A5FA" },
  { id: "p2", label: "Site E-commerce", color: "#FF6AD5" },
  { id: "p3", label: "Campagne Marketing", color: "#4ADE80" },
];

function makeSatellites(project: GraphNode) {
  const clusters = [
    { id: `${project.id}-S`, label: "Statuts", type: "cluster", color: "#86EFAC" },
    { id: `${project.id}-D`, label: "Dates", type: "cluster", color: "#93C5FD" },
    { id: `${project.id}-K`, label: "KPIs", type: "cluster", color: "#FDE68A" },
  ];

  const items = [
    { pid: "S", label: "En cours", color: "#22C55E" },
    { pid: "S", label: "Bloqué", color: "#EF4444" },
    { pid: "S", label: "Terminé", color: "#3B82F6" },
    { pid: "D", label: "Kickoff" },
    { pid: "D", label: "Échéance" },
    { pid: "D", label: "Dernière maj" },
    { pid: "K", label: "Utilisateurs" },
    { pid: "K", label: "Vues" },
    { pid: "K", label: "CA" },
  ];

  const nodes: GraphNode[] = [...clusters];
  const links: GraphLink[] = clusters.map((c) => ({ source: project.id, target: c.id }));

  items.forEach((it, i) => {
    const id = `${project.id}-${it.pid}-${i}`;
    nodes.push({ id, label: it.label, type: "item", color: it.color });
    const clusterId = `${project.id}-${it.pid}`;
    links.push({ source: clusterId, target: id });
  });

  return { nodes, links };
}

export default function Handshake3DPage() {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const base: GraphData = useMemo(() => {
    const nodes = PROJECTS.map((p) => ({ ...p, type: "project" }));
    const links: GraphLink[] = [];
    return { nodes, links };
  }, []);

  const graph: GraphData = useMemo(() => {
    const nodes = [...base.nodes];
    const links = [...base.links];
    Object.keys(expanded).forEach((pid) => {
      if (!expanded[pid]) return;
      const p = nodes.find((n) => n.id === pid);
      if (!p) return;
      const { nodes: extraN, links: extraL } = makeSatellites(p);
      extraN.forEach((n) => { if (!nodes.find((x) => x.id === n.id)) nodes.push(n); });
      extraL.forEach((l) => links.push(l));
    });
    links.push({ source: "p1", target: "p2" }, { source: "p2", target: "p3" });
    return { nodes, links };
  }, [base, expanded]);

  return (
    <div className="h-screen w-screen">
      <NetworkGraph3D
        data={graph}
        focusId={focusId}
        onNodeClick={(node) => {
          if (node?.id?.toString().startsWith("p")) {
            setFocusId(String(node.id));
            setExpanded((s) => ({ ...s, [String(node.id)]: !s[String(node.id)] }));
          }
        }}
      />
    </div>
  );
}
