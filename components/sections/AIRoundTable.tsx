"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Lightbulb, Zap } from 'lucide-react';

const AIRoundTable = () => {
  const [idea, setIdea] = useState('');
  const [responses, setResponses] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const aiPersonas = [
    {
      name: 'IA Créative',
      icon: Lightbulb,
      color: 'text-yellow-500',
      specialty: 'Idées innovantes et créativité'
    },
    {
      name: 'IA Technique',
      icon: Zap,
      color: 'text-blue-500',
      specialty: 'Solutions techniques et architecture'
    },
    {
      name: 'IA Business',
      icon: Bot,
      color: 'text-green-500',
      specialty: 'Stratégie et modèle économique'
    }
  ];

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    
    // Simulation de génération de réponses IA
    setTimeout(() => {
      const mockResponses = [
        {
          persona: 'IA Créative',
          response: 'Voici une approche créative pour votre idée...',
          color: 'border-yellow-500'
        },
        {
          persona: 'IA Technique',
          response: 'Du point de vue technique, je recommande...',
          color: 'border-blue-500'
        },
        {
          persona: 'IA Business',
          response: 'Pour la stratégie business, considérez...',
          color: 'border-green-500'
        }
      ];
      
      setResponses(mockResponses);
      setIsGenerating(false);
    }, 2000);
  };

  const handleClear = () => {
    setIdea('');
    setResponses([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Table Ronde IA
          </CardTitle>
          <p className="text-muted-foreground">
            Brainstormez avec plusieurs IA spécialisées pour enrichir vos idées
          </p>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Votre idée</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Décrivez votre idée, votre problème ou votre projet. Plus vous donnez de détails, plus les IA pourront vous aider..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate} 
              disabled={!idea.trim() || isGenerating}
              className="flex-1"
            >
              {isGenerating ? 'Génération en cours...' : 'Générer les réponses IA'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Personas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiPersonas.map((persona, index) => {
          const Icon = persona.icon;
          return (
            <motion.div
              key={persona.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${persona.color}`} />
                    <CardTitle className="text-base">{persona.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{persona.specialty}</p>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      En attente d'une idée...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Responses */}
      {responses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Réponses des IA</h3>
          {responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className={`border-l-4 ${response.color}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{response.persona}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{response.response}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Synthesis Section */}
      {responses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Synthèse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-md p-4 min-h-[100px] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  La synthèse sera générée automatiquement...
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  Exporter la synthèse
                </Button>
                <Button variant="outline" className="flex-1">
                  Créer un projet à partir de cette idée
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading Animation */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Les IA réfléchissent à votre idée...</span>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIRoundTable;
