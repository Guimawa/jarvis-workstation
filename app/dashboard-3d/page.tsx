"use client";

import React from "react";
import NetworkGraph3D, { GraphData } from "@/components/sections/NetworkGraph3D";

const DATA: GraphData = {
  nodes: [
    { id: "srv-api", label: "API", type: "project", color: "#60A5FA" },
    { id: "db", label: "DB", type: "cluster", color: "#22C55E" },
    { id: "cache", label: "Cache", type: "cluster", color: "#FBBF24" },
    { id: "queue", label: "Queue", type: "cluster", color: "#F472B6" },
    { id: "grafana", label: "Grafana", type: "item" },
    { id: "prom", label: "Prometheus", type: "item" },
  ],
  links: [
    { source: "srv-api", target: "db" },
    { source: "srv-api", target: "cache" },
    { source: "srv-api", target: "queue" },
    { source: "grafana", target: "prom" },
    { source: "grafana", target: "srv-api" },
  ],
};

export default function Dashboard3D() {
  return (
    <div className="h-screen w-screen">
      <NetworkGraph3D data={DATA} />
    </div>
  );
}
