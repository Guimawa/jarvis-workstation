'use client';

import React from 'react';
import EvolutionProjetMaitre from '@/components/outils/EvolutionProjetMaitre';

export default function EvolutionProjetPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">⚡ Évolution Projet Maître</h1>
        <p className="text-muted-foreground">
          Évolution sécurisée avec sauvegarde et validation selon les directives Ultra Instinct 2025
        </p>
      </div>
      
      <EvolutionProjetMaitre />
    </div>
  );
}
