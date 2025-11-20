/**
 * Ollama Service
 *
 * Provides a local LLM alternative to OpenAI using Ollama.
 * Ollama runs models like Llama, Mistral, Phi locally or on your infrastructure.
 */

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaGenerateRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

interface OllamaGenerateResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

interface OllamaEmbedRequest {
  model: string;
  prompt: string;
}

interface OllamaEmbedResponse {
  embedding: number[];
}

export class OllamaService {
  private baseUrl: string;
  private chatModel: string;
  private embedModel: string;

  constructor(baseUrl?: string, chatModel?: string, embedModel?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.chatModel = chatModel || process.env.OLLAMA_CHAT_MODEL || 'llama3.2:3b';
    this.embedModel = embedModel || process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
  }

  /**
   * Generate embeddings using Ollama
   */
  async embed(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.embedModel,
          prompt: text,
        } as OllamaEmbedRequest),
      });

      if (!response.ok) {
        throw new Error(`Ollama embedding failed: ${response.status} ${response.statusText}`);
      }

      const data: OllamaEmbedResponse = await response.json();
      return data.embedding;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating Ollama embedding:', error);
      throw new Error(`Failed to generate embedding: ${errorMessage}`);
    }
  }

  /**
   * Generate embeddings for multiple texts
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    // Process in batches to avoid overwhelming the service
    const results: number[][] = [];
    for (const text of texts) {
      const embedding = await this.embed(text);
      results.push(embedding);
    }
    return results;
  }

  /**
   * Generate an answer using Ollama's chat completion
   */
  async generateAnswer(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.chatModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 2000,
          },
        } as OllamaGenerateRequest),
      });

      if (!response.ok) {
        throw new Error(`Ollama generation failed: ${response.status} ${response.statusText}`);
      }

      const data: OllamaGenerateResponse = await response.json();
      return data.message.content;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating answer with Ollama:', error);
      throw new Error(`Failed to generate answer: ${errorMessage}`);
    }
  }

  /**
   * Check if Ollama service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to list models');
      }

      const data: any = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      console.error('Error listing Ollama models:', error);
      return [];
    }
  }
}
