'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ElectronContextType {
  isElectron: boolean;
  platform: string;
  version: string;
  showNotification: (title: string, body: string) => Promise<void>;
  showDialog: (type: 'info' | 'warning' | 'error', title: string, message: string) => Promise<any>;
  openExternal: (url: string) => Promise<void>;
  log: (level: 'info' | 'warn' | 'error', message: string) => void;
  sendMetric: (metric: string, value: any) => Promise<void>;
}

const ElectronContext = createContext<ElectronContextType | null>(null);

interface ElectronProviderProps {
  children: ReactNode;
}

export function ElectronProvider({ children }: ElectronProviderProps) {
  const [isElectron, setIsElectron] = useState(false);
  const [platform, setPlatform] = useState('unknown');
  const [version, setVersion] = useState('2.0.0');
  const router = useRouter();

  useEffect(() => {
    // Vérifier si on est dans Electron
    const checkElectron = () => {
      if (typeof window !== 'undefined') {
        const hasElectron = !!(window.electronAPI && window.jarvisAPI);
        setIsElectron(hasElectron);
        
        if (hasElectron) {
          setPlatform(window.electronAPI?.platform || 'unknown');
          setVersion(window.CONSTANTS?.JARVIS_VERSION || '2.0.0');
          
          // Écouter les événements de navigation depuis Electron
          window.electronAPI?.onNavigate?.((path: string) => {
            router.push(path);
          });
          
          console.log('🚀 JARVIS Electron - Interface initialisée');
        } else {
          console.log('🌐 JARVIS Web - Mode navigateur');
        }
      }
    };

    checkElectron();
    
    // Réessayer après un délai
    const timeout = setTimeout(checkElectron, 100);
    return () => clearTimeout(timeout);
  }, [router]);

  // Fonction pour afficher des notifications
  const showNotification = async (title: string, body: string): Promise<void> => {
    if (isElectron && window.electronAPI) {
      try {
        await window.electronAPI.showNotification({ title, body });
      } catch (error) {
        console.error('Erreur notification Electron:', error);
        fallbackNotification(title, body);
      }
    } else {
      fallbackNotification(title, body);
    }
  };

  const fallbackNotification = (title: string, body: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  };

  // Fonction pour afficher des boîtes de dialogue
  const showDialog = async (type: 'info' | 'warning' | 'error', title: string, message: string): Promise<any> => {
    if (isElectron && window.electronAPI) {
      try {
        return await window.electronAPI.showMessageBox({
          type,
          title,
          message,
          buttons: ['OK']
        });
      } catch (error) {
        console.error('Erreur dialog Electron:', error);
        alert(`${title}: ${message}`);
        return { response: 0 };
      }
    } else {
      alert(`${title}: ${message}`);
      return { response: 0 };
    }
  };

  // Fonction pour ouvrir des liens externes
  const openExternal = async (url: string): Promise<void> => {
    if (isElectron && window.electronAPI) {
      try {
        await window.electronAPI.openExternal(url);
      } catch (error) {
        console.error('Erreur ouverture lien externe:', error);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  // Fonction de logging
  const log = (level: 'info' | 'warn' | 'error', message: string): void => {
    if (isElectron && window.jarvisAPI) {
      window.jarvisAPI.log[level](message).catch(console.error);
    } else {
      console[level](`[JARVIS] ${message}`);
    }
  };

  // Fonction pour envoyer des métriques
  const sendMetric = async (metric: string, value: any): Promise<void> => {
    if (isElectron && window.jarvisAPI) {
      try {
        await window.jarvisAPI.sendMetric(metric, value);
      } catch (error) {
        console.error('Erreur envoi métrique:', error);
      }
    } else {
      console.log(`[METRIC] ${metric}:`, value);
    }
  };

  const value: ElectronContextType = {
    isElectron,
    platform,
    version,
    showNotification,
    showDialog,
    openExternal,
    log,
    sendMetric
  };

  return (
    <ElectronContext.Provider value={value}>
      {children}
    </ElectronContext.Provider>
  );
}

// Hook pour utiliser le contexte Electron
export function useElectronContext(): ElectronContextType {
  const context = useContext(ElectronContext);
  if (!context) {
    throw new Error('useElectronContext doit être utilisé dans un ElectronProvider');
  }
  return context;
}

export default ElectronProvider;
