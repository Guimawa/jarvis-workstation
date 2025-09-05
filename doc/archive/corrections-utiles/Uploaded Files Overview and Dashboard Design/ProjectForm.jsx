import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    tools: [],
    status: 'draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nouveau projet:', formData);
    // Ici, on ajouterait la logique pour sauvegarder le projet
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nouveau Projet</CardTitle>
          <p className="text-muted-foreground">
            Créez un nouveau projet numérique de A à Z
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du projet */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du projet</Label>
              <Input
                id="name"
                placeholder="Entrez le nom de votre projet..."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre projet, ses objectifs et ses fonctionnalités..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin (estimée)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {/* Outils */}
            <div className="space-y-2">
              <Label>Outils prévus</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Figma', 'GitHub', 'Notion', 'Vercel', 'React', 'Node.js', 'MongoDB', 'Tailwind'].map((tool) => (
                  <motion.button
                    key={tool}
                    type="button"
                    onClick={() => {
                      const newTools = formData.tools.includes(tool)
                        ? formData.tools.filter(t => t !== tool)
                        : [...formData.tools, tool];
                      handleInputChange('tools', newTools);
                    }}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      formData.tools.includes(tool)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-accent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tool}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <Label htmlFor="status">Statut initial</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                <option value="draft">Brouillon</option>
                <option value="planning">Planification</option>
                <option value="in-progress">En cours</option>
              </select>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Créer le projet
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Sauvegarder comme brouillon
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Aperçu du projet */}
      {formData.name && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">{formData.name}</h3>
                {formData.description && (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                )}
                {formData.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tools.map(tool => (
                      <span key={tool} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectForm;

