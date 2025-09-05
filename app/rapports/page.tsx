'use client';

import React from 'react';
import VisualisationRapports from '@/components/outils/VisualisationRapports';

export default function RapportsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📋 Rapports d'Analyse</h1>
        <p className="text-muted-foreground">
          Visualisation et gestion des rapports d'analyse microscopique
        </p>
      </div>
      
      <VisualisationRapports />
    </div>
  );
}
