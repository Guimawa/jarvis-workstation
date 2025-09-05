import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react';

const ProjectOverview = () => {
  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      status: 'in-progress',
      progress: 65,
      startDate: '2025-01-15',
      endDate: '2025-03-30',
      team: 3,
      tools: ['React', 'Node.js', 'MongoDB'],
      links: {
        figma: '#',
        github: '#',
        notion: '#'
      }
    },
    {
      id: 2,
      name: 'Mobile App Design',
      status: 'completed',
      progress: 100,
      startDate: '2024-12-01',
      endDate: '2025-01-10',
      team: 2,
      tools: ['Figma', 'React Native'],
      links: {
        figma: '#',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'Dashboard Analytics',
      status: 'blocked',
      progress: 30,
      startDate: '2025-01-20',
      endDate: '2025-04-15',
      team: 4,
      tools: ['Vue.js', 'Python', 'PostgreSQL'],
      links: {
        github: '#',
        notion: '#'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'blocked':
        return 'Bloqué';
      default:
        return 'Inconnu';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vue d'ensemble des projets</CardTitle>
          <p className="text-muted-foreground">
            Suivi complet de vos projets numériques de A à Z
          </p>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Projets actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1</div>
            <p className="text-sm text-muted-foreground">Terminé ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">65%</div>
            <p className="text-sm text-muted-foreground">Progression moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">9</div>
            <p className="text-sm text-muted-foreground">Membres d'équipe</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(project.status)} text-white`}
                      >
                        {getStatusLabel(project.status)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {project.progress}% terminé
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {project.links.figma && (
                      <a href={project.links.figma} className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.github && (
                      <a href={project.links.github} className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.notion && (
                      <a href={project.links.notion} className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getStatusColor(project.status)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{project.startDate} - {project.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{project.team} membres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Mis à jour il y a 2h</span>
                  </div>
                </div>

                {/* Tools */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun projet</h3>
              <p>Créez votre premier projet pour commencer</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ProjectOverview;

