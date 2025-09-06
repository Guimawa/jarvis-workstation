"use client";

import React, { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export type GraphNode = { id: string; label?: string; color?: string; x?: number; y?: number; z?: number; [k: string]: any; };
export type GraphLink = { source: string | GraphNode; target: string | GraphNode; [k: string]: any; };
export type GraphData = { nodes: GraphNode[]; links: GraphLink[] };

type Props = { data: GraphData; focusId?: string | null; onNodeClick?: (node: GraphNode) => void; };

function colorById(id: string) {
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) % 360;
  return new THREE.Color(`hsl(${h}, 70%, 55%)`).getStyle();
}

export default function NetworkGraph3D({ data, focusId, onNodeClick }: Props) {
  const fgRef = useRef<ForceGraphMethods>();
  const graphData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!focusId || !fgRef.current) return;
    const node = graphData.nodes.find((n) => n.id === focusId);
    if (!node) return;
    const distance = 120; const ms = 800;
    // @ts-ignore
    fgRef.current!.cameraPosition(
      node.x != null ? { x: node.x, y: node.y, z: (node.z||0) + distance } : { x: 0, y: 0, z: distance },
      node, ms
    );
  }, [focusId, graphData.nodes]);

  return (
    <ForceGraph3D
      ref={fgRef as any}
      graphData={graphData}
      backgroundColor="#060B16"
      showNavInfo={false}
      enableNodeDrag={false}
      linkColor={() => "rgba(255,255,255,0.12)"}
      linkWidth={1}
      nodeRelSize={6}
      nodeLabel={(n: any) => n.label || n.id}
      nodeThreeObject={(n: any) => {
        const group = new THREE.Group();
        const r = n.type === "project" ? 6 : n.type === "cluster" ? 4.5 : 3.5;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), new THREE.MeshPhongMaterial({ color: n.color || colorById(n.id) }));
        group.add(sphere);
        return group;
      }}
      onNodeClick={(node: any) => onNodeClick?.(node)}
    />
  );
}
