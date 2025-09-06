import { useEffect, useState, useCallback } from 'react';

// Interface TypeScript pour l'API Electron
interface ElectronAPI {
  getVersion: () => Promise<string>;
  showMessageBox: (options: any) => Promise<any>;
  showOpenDialog: (options: any) => Promise<any>;
  showSaveDialog: (options: any) => Promise<any>;
  showNotification: (options: { title: string; body: string }) => Promise<void>;
  onNavigate: (callback: (path: string) => void) => void;
  platform: string;
  isElectron: boolean;
  toggleTheme: () => Promise<void>;
  getTheme: () => Promise<string>;
  onThemeChanged: (callback: (theme: string) => void) => void;
  openExternal: (url: string) => Promise<void>;
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, data: string) => Promise<void>;
  send: (channel: string, data?: any) => void;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

interface JarvisAPI {
  isDevelopment: boolean;
  getConfig: () => Promise<any>;
  setConfig: (config: any) => Promise<void>;
  log: {
    info: (message: string) => Promise<void>;
    warn: (message: string) => Promise<void>;
    error: (message: string) => Promise<void>;
  };
  sendMetric: (metric: string, value: any) => Promise<void>;
  createProject: (projectData: any) => Promise<any>;
  loadProject: (projectPath: string) => Promise<any>;
  saveProject: (projectData: any) => Promise<void>;
  analyzeCode: (code: string, options?: any) => Promise<any>;
  generateCode: (prompt: string, options?: any) => Promise<any>;
  getTemplates: () => Promise<any[]>;
  saveTemplate: (template: any) => Promise<void>;
}

interface Constants {
  JARVIS_VERSION: string;
  ELECTRON_VERSION: string;
  NODE_VERSION: string;
  CHROME_VERSION: string;
  PLATFORM: string;
  ARCH: string;
}

// Extension de window avec les API Electron
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    jarvisAPI?: JarvisAPI;
    CONSTANTS?: Constants;
  }
}

export function useElectron() {
  const [isElectron, setIsElectron] = useState(false);
  const [electronAPI, setElectronAPI] = useState<ElectronAPI | null>(null);
  const [jarvisAPI, setJarvisAPI] = useState<JarvisAPI | null>(null);
  const [constants, setConstants] = useState<Constants | null>(null);

  useEffect(() => {
    // Vérifier si on est dans Electron
    const checkElectron = () => {
      if (typeof window !== 'undefined') {
        const hasElectron = !!(window.electronAPI && window.jarvisAPI);
        setIsElectron(hasElectron);
        
        if (hasElectron) {
          setElectronAPI(window.electronAPI!);
          setJarvisAPI(window.jarvisAPI!);
          setConstants(window.CONSTANTS || null);
        }
      }
    };

    checkElectron();

    // Réessayer après un délai au cas où les API ne seraient pas encore disponibles
    const timeout = setTimeout(checkElectron, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Wrapper pour les notifications
  const showNotification = useCallback(async (title: string, body: string) => {
    if (electronAPI) {
      try {
        await electronAPI.showNotification({ title, body });
      } catch (error) {
        console.error('Erreur notification Electron:', error);
        // Fallback vers l'API Notification du navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body });
        }
      }
    } else if ('Notification' in window) {
      // Fallback pour le navigateur
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      }
    }
  }, [electronAPI]);

  // Wrapper pour les boîtes de dialogue
  const showDialog = useCallback(async (type: 'info' | 'warning' | 'error', title: string, message: string) => {
    if (electronAPI) {
      try {
        return await electronAPI.showMessageBox({
          type,
          title,
          message,
          buttons: ['OK']
        });
      } catch (error) {
        console.error('Erreur dialog Electron:', error);
        // Fallback vers alert
        alert(`${title}: ${message}`);
        return { response: 0 };
      }
    } else {
      // Fallback pour le navigateur
      alert(`${title}: ${message}`);
      return { response: 0 };
    }
  }, [electronAPI]);

  // Wrapper pour ouvrir des liens externes
  const openExternal = useCallback(async (url: string) => {
    if (electronAPI) {
      try {
        await electronAPI.openExternal(url);
      } catch (error) {
        console.error('Erreur ouverture lien externe:', error);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  }, [electronAPI]);

  // Wrapper pour les logs JARVIS
  const log = useCallback((level: 'info' | 'warn' | 'error', message: string) => {
    if (jarvisAPI) {
      jarvisAPI.log[level](message).catch(console.error);
    } else {
      console[level](`[JARVIS] ${message}`);
    }
  }, [jarvisAPI]);

  // Wrapper pour les métriques
  const sendMetric = useCallback(async (metric: string, value: any) => {
    if (jarvisAPI) {
      try {
        await jarvisAPI.sendMetric(metric, value);
      } catch (error) {
        console.error('Erreur envoi métrique:', error);
      }
    } else {
      console.log(`[METRIC] ${metric}:`, value);
    }
  }, [jarvisAPI]);

  // Informations sur l'environnement
  const getEnvironmentInfo = useCallback(() => {
    return {
      isElectron,
      platform: constants?.PLATFORM || (typeof navigator !== 'undefined' ? navigator.platform : 'unknown'),
      isDevelopment: jarvisAPI?.isDevelopment || process.env.NODE_ENV === 'development',
      version: constants?.JARVIS_VERSION || '2.0.0',
      electronVersion: constants?.ELECTRON_VERSION,
      nodeVersion: constants?.NODE_VERSION,
      chromeVersion: constants?.CHROME_VERSION
    };
  }, [isElectron, constants, jarvisAPI]);

  return {
    isElectron,
    electronAPI,
    jarvisAPI,
    constants,
    // Méthodes utilitaires
    showNotification,
    showDialog,
    openExternal,
    log,
    sendMetric,
    getEnvironmentInfo
  };
}

export default useElectron;
