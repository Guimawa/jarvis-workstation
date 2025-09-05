
/**
 * @file Client Groq opérationnel
 * @module groq-client
 */

import chalk from 'chalk';

/**
 * @class GroqClient
 * @description Client pour interagir avec l'API Groq, incluant la gestion d'erreurs, le logging et l'optimisation des performances.
 */
class GroqClient {
  /**
   * @private
   * @static
   * @type {string}
   * @description URL de base de l'API Groq.
   */
  static BASE_URL = 'https://api.groq.com/openai/v1';

  /**
   * @private
   * @type {string}
   * @description Clé API pour l'authentification Groq.
   */
  #apiKey;

  /**
   * Crée une instance de GroqClient.
   * @param {string} apiKey - La clé API pour l'authentification Groq.
   * @throws {Error} Si la clé API n'est pas fournie.
   */
  constructor(apiKey) {
    if (!apiKey) {
      console.error(chalk.red('Erreur: La clé API Groq est requise.'));
      throw new Error('Groq API Key is required.');
    }
    this.#apiKey = apiKey;
    console.log(chalk.green('GroqClient initialisé avec succès.'));
  }

  /**
   * Gère les erreurs de l'API Groq.
   * @private
   * @param {Error} error - L'objet erreur à gérer.
   * @returns {void}
   */
  _handleError(error) {
    if (error.response) {
      console.error(chalk.red(`Erreur API Groq: ${error.response.status} - ${error.response.data.message}`));
      throw new Error(`Groq API Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      console.error(chalk.red('Erreur réseau: Aucune réponse reçue de l\'API Groq.'));
      throw new Error('Network Error: No response received from Groq API.');
    } else {
      console.error(chalk.red(`Erreur inattendue: ${error.message}`));
      throw new Error(`Unexpected Error: ${error.message}`);
    }
  }

  /**
   * Effectue une requête HTTP générique à l'API Groq.
   * @private
   * @async
   * @param {string} endpoint - Le point de terminaison de l'API (ex: '/chat/completions').
   * @param {object} options - Les options de la requête (méthode, en-têtes, corps).
   * @returns {Promise<object>}
   * @throws {Error} En cas d'échec de la requête API.
   */
  async _request(endpoint, options) {
    const url = `${GroqClient.BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.#apiKey}`,
      ...options.headers,
    };

    try {
      console.log(chalk.blue(`Requête Groq: ${options.method || 'GET'} ${url}`));
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Erreur de requête Groq');
        error.response = { status: response.status, data: errorData };
        this._handleError(error);
      }

      console.log(chalk.green(`Réponse Groq reçue pour ${endpoint}.`));
      return await response.json();
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Envoie une requête de complétion de chat à l'API Groq.
   * @async
   * @param {Array<object>} messages - Un tableau d'objets message au format OpenAI.
   * @param {string} model - Le modèle Groq à utiliser (ex: 'llama3-8b-8192').
   * @param {object} [options={}] - Options supplémentaires pour la complétion (ex: temperature, max_tokens).
   * @returns {Promise<object>} La réponse de l'API Groq.
   * @example
   * // Exemple d'utilisation:
   * const groq = new GroqClient(process.env.GROQ_API_KEY);
   * const messages = [
   *   { role: 'system', content: 'You are a helpful assistant.' },
   *   { role: 'user', content: 'Hello, how are you?' }
   * ];
   * try {
   *   const completion = await groq.chatCompletions(messages, 'llama3-8b-8192', { temperature: 0.7 });
   *   console.log('Réponse Groq:', completion.choices[0].message.content);
   * } catch (error) {
   *   console.error('Échec de la complétion du chat:', error.message);
   * }
   */
  async chatCompletions(messages, model, options = {}) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages are required for chat completions.');
    }
    if (!model) {
      throw new Error('Model is required for chat completions.');
    }

    const body = {
      messages,
      model,
      ...options,
    };

    return this._request('/chat/completions', { method: 'POST', body });
  }

  /**
   * Récupère la liste des modèles disponibles depuis l'API Groq.
   * @async
   * @returns {Promise<object>} La liste des modèles.
   * @example
   * // Exemple d'utilisation:
   * const groq = new GroqClient(process.env.GROQ_API_KEY);
   * try {
   *   const models = await groq.listModels();
   *   console.log('Modèles Groq disponibles:', models.data.map(m => m.id));
   * } catch (error) {
   *   console.error('Échec de la récupération des modèles:', error.message);
   * }
   */
  async listModels() {
    return this._request('/models');
  }
}

export default GroqClient;


