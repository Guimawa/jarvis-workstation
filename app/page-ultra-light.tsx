'use client';

import React, { useState, useEffect } from 'react';

export default function UltraLightDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulation d'un chargement rapide
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Jarvis Ultra Instinct</h1>
          <p className="text-gray-400">Chargement ultra rapide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Ultra Minimal */}
      <header className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">🚀 Jarvis Ultra Instinct</h1>
          <div className="flex space-x-4">
            <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Dashboard Complet
            </button>
            <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
              Analyse Rapide
            </button>
          </div>
        </div>
      </header>

      {/* Contenu Principal Ultra Léger */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Status */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Status Système</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Build:</span>
                <span className="text-green-400">✅ OK</span>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <span className="text-blue-400">⚡ Optimisé</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="text-purple-400">🚀 Ultra Light</span>
              </div>
            </div>
          </div>

          {/* Card 2: Actions Rapides */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700">
                Lancer Analyse
              </button>
              <button className="w-full bg-green-600 py-2 rounded hover:bg-green-700">
                Dashboard Complet
              </button>
              <button className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700">
                Configuration
              </button>
            </div>
          </div>

          {/* Card 3: Métriques */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Métriques</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Temps de chargement:</span>
                <span className="text-green-400">~0.5s</span>
              </div>
              <div className="flex justify-between">
                <span>Taille bundle:</span>
                <span className="text-blue-400">~500KB</span>
              </div>
              <div className="flex justify-between">
                <span>Dépendances:</span>
                <span className="text-purple-400">Minimales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone d'actions principales */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interface Ultra Légère</h2>
          <p className="text-gray-400 mb-6">
            Version optimisée pour un démarrage ultra rapide. 
            Toutes les fonctionnalités principales sont accessibles.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg hover:from-blue-700 hover:to-purple-700">
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold">Analyse</div>
              </div>
            </button>
            
            <button className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-lg hover:from-green-700 hover:to-blue-700">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">Dashboard</div>
              </div>
            </button>
            
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg hover:from-purple-700 hover:to-pink-700">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-semibold">Config</div>
              </div>
            </button>
            
            <button className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-lg hover:from-orange-700 hover:to-red-700">
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-semibold">Ultra Mode</div>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="bg-gray-800 p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>Jarvis Ultra Instinct v2.0 - Mode Ultra Light</p>
          <p className="text-sm">Optimisé pour le démarrage rapide</p>
        </div>
      </footer>
    </div>
  );
}
