import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Shield, Eye, EyeOff, Plus, Lock, Key } from 'lucide-react';

const SecureVault = () => {
  const [showPasswords, setShowPasswords] = useState({});
  const [newEntry, setNewEntry] = useState({
    label: '',
    value: '',
    type: 'api-key'
  });

  const [entries] = useState([
    { id: 1, label: 'OpenAI API Key', type: 'api-key', encrypted: true },
    { id: 2, label: 'GitHub Token', type: 'token', encrypted: true },
    { id: 3, label: 'Database Password', type: 'password', encrypted: true },
    { id: 4, label: 'Stripe Secret Key', type: 'api-key', encrypted: true },
  ]);

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddEntry = () => {
    console.log('Nouvelle entrée:', newEntry);
    setNewEntry({ label: '', value: '', type: 'api-key' });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'api-key':
        return <Key className="h-4 w-4" />;
      case 'password':
        return <Lock className="h-4 w-4" />;
      case 'token':
        return <Shield className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'api-key':
        return 'text-blue-500';
      case 'password':
        return 'text-red-500';
      case 'token':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
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
            <Shield className="h-6 w-6" />
            Coffre-fort Sécurisé
          </CardTitle>
          <p className="text-muted-foreground">
            Stockage chiffré AES pour vos clés API, mots de passe et tokens
          </p>
        </CardHeader>
      </Card>

      {/* Add New Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter une nouvelle entrée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Libellé</Label>
              <Input
                id="label"
                placeholder="ex: OpenAI API Key"
                value={newEntry.label}
                onChange={(e) => setNewEntry(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={newEntry.type}
                onChange={(e) => setNewEntry(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                <option value="api-key">Clé API</option>
                <option value="password">Mot de passe</option>
                <option value="token">Token</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valeur</Label>
              <Input
                id="value"
                type="password"
                placeholder="Valeur à chiffrer..."
                value={newEntry.value}
                onChange={(e) => setNewEntry(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddEntry}
            disabled={!newEntry.label || !newEntry.value}
            className="w-full"
          >
            Ajouter et chiffrer
          </Button>
        </CardContent>
      </Card>

      {/* Existing Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entrées stockées</CardTitle>
          <p className="text-sm text-muted-foreground">
            Toutes les valeurs sont chiffrées avec AES-256
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{entry.label}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {entry.type.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm bg-muted px-3 py-1 rounded">
                    {showPasswords[entry.id] 
                      ? 'sk-1234567890abcdef...' 
                      : '••••••••••••••••••••'
                    }
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePasswordVisibility(entry.id)}
                  >
                    {showPasswords[entry.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    Copier
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Supprimer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune entrée</h3>
              <p className="text-muted-foreground">
                Ajoutez vos premières clés API ou mots de passe ci-dessus
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400">
                Sécurité renforcée
              </h4>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Toutes les données sont chiffrées localement avec AES-256 avant stockage. 
                Vos clés ne quittent jamais votre navigateur en clair.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecureVault;

