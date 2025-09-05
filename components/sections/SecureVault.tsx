"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Copy, 
  Key, 
  Lock, 
  Unlock,
  Shield,
  Database
} from 'lucide-react';

interface VaultEntry {
  id: string;
  label: string;
  value: string;
  type: 'password' | 'api-key' | 'secret' | 'note';
  createdAt: Date;
}

const SecureVault = () => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [newEntry, setNewEntry] = useState({
    label: '',
    value: '',
    type: 'password' as const
  });
  const [isAdding, setIsAdding] = useState(false);

  // Simulation de chiffrement (en production, utiliser une vraie librairie)
  const encrypt = (text: string, key: string) => {
    // Simulation simple - en production utiliser CryptoJS ou Web Crypto API
    return btoa(text + key);
  };

  const decrypt = (encryptedText: string, key: string) => {
    try {
      const decrypted = atob(encryptedText);
      return decrypted.replace(key, '');
    } catch {
      return '';
    }
  };

  const handleUnlock = () => {
    if (masterPassword.trim()) {
      setIsUnlocked(true);
      // En production, vérifier le hash du mot de passe
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.label.trim() || !newEntry.value.trim()) return;

    const entry: VaultEntry = {
      id: Date.now().toString(),
      label: newEntry.label,
      value: encrypt(newEntry.value, masterPassword),
      type: newEntry.type,
      createdAt: new Date()
    };

    setEntries(prev => [...prev, entry]);
    setNewEntry({ label: '', value: '', type: 'password' });
    setIsAdding(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password': return <Lock className="h-4 w-4" />;
      case 'api-key': return <Key className="h-4 w-4" />;
      case 'secret': return <Shield className="h-4 w-4" />;
      case 'note': return <Database className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'password': return 'text-red-500';
      case 'api-key': return 'text-blue-500';
      case 'secret': return 'text-purple-500';
      case 'note': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (!isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Coffre-fort Sécurisé
            </CardTitle>
            <p className="text-muted-foreground">
              Entrez votre mot de passe maître pour accéder au coffre-fort
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-password">Mot de passe maître</Label>
              <Input
                id="master-password"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Entrez votre mot de passe maître"
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              />
            </div>
            <Button onClick={handleUnlock} className="w-full">
              <Unlock className="h-4 w-4 mr-2" />
              Déverrouiller le coffre-fort
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Coffre-fort Sécurisé
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsUnlocked(false)}>
                <Lock className="h-4 w-4 mr-2" />
                Verrouiller
              </Button>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Formulaire d'ajout */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nouvelle entrée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={newEntry.label}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Nom de l'entrée"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={newEntry.type}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="password">Mot de passe</option>
                    <option value="api-key">Clé API</option>
                    <option value="secret">Secret</option>
                    <option value="note">Note</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Valeur</Label>
                <Textarea
                  id="value"
                  value={newEntry.value}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Valeur à stocker"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddEntry}>
                  Ajouter
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Liste des entrées */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune entrée dans le coffre-fort</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${getTypeColor(entry.type)}`}>
                        {getTypeIcon(entry.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{entry.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.type} • {entry.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {showPasswords[entry.id] 
                            ? decrypt(entry.value, masterPassword)
                            : '••••••••'
                          }
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(entry.id)}
                        >
                          {showPasswords[entry.id] ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(decrypt(entry.value, masterPassword))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SecureVault;
