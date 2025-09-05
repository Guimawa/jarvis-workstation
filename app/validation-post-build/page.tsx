'use client';

import React from 'react';
import ValidationPostBuild from '@/components/outils/ValidationPostBuild';

export default function ValidationPostBuildPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">✅ Validation Post-Build</h1>
        <p className="text-muted-foreground">
          Validation complète pour s'assurer que tout fonctionne parfaitement après modification
        </p>
      </div>
      
      <ValidationPostBuild />
    </div>
  );
}
