import OpenAI from 'openai';
import dotenv from 'dotenv';
import { OllamaService } from './ollamaService.js';
import { generateMockEmbedding } from './mockEmbeddings.js';

dotenv.config();

type AIProvider = 'openai' | 'ollama';

export class AIService {
  private openai?: OpenAI;
  private ollama?: OllamaService;
  private provider: AIProvider;
  private embeddingModel: string;
  private chatModel: string;

  constructor() {
    // Determine which provider to use
    const preferredProvider = process.env.AI_PROVIDER?.toLowerCase() as AIProvider;

    // Check if Ollama is configured
    const hasOllama = process.env.OLLAMA_BASE_URL || process.env.USE_OLLAMA === 'true';

    // Check if OpenAI is configured
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    // Priority: explicit preference > Ollama > OpenAI > mock
    if (preferredProvider === 'ollama' && hasOllama) {
      this.provider = 'ollama';
      this.ollama = new OllamaService();
      console.log('✅ Using Ollama for embeddings and chat');
    } else if (preferredProvider === 'openai' && hasOpenAI) {
      this.provider = 'openai';
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log('✅ Using OpenAI for embeddings and chat');
    } else if (hasOllama) {
      this.provider = 'ollama';
      this.ollama = new OllamaService();
      console.log('✅ Using Ollama for embeddings and chat (auto-detected)');
    } else if (hasOpenAI) {
      this.provider = 'openai';
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log('✅ Using OpenAI for embeddings and chat (auto-detected)');
    } else {
      this.provider = 'ollama'; // Will fall back to mock in methods
      console.warn('⚠️  No AI provider configured. Will use mock embeddings and fallback responses.');
      console.warn('    Set OLLAMA_BASE_URL or OPENAI_API_KEY in .env');
    }

    this.embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large';
    this.chatModel = process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo-preview';
  }

  /**
   * Generate embeddings for a given text
   * @param text - Text to embed
   * @returns Vector embedding
   */
  async embed(text: string): Promise<number[]> {
    try {
      if (this.provider === 'ollama' && this.ollama) {
        try {
          return await this.ollama.embed(text);
        } catch (ollamaError: any) {
          console.warn('Ollama embedding failed, using mock embeddings:', ollamaError.message);
          return generateMockEmbedding(text);
        }
      } else if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.embeddings.create({
          model: this.embeddingModel,
          input: text,
          encoding_format: 'float',
        });
        return response.data[0].embedding;
      } else {
        // No provider configured, use mock
        return generateMockEmbedding(text);
      }
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param texts - Array of texts to embed
   * @returns Array of vector embeddings
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    try {
      if (this.provider === 'ollama' && this.ollama) {
        try {
          return await this.ollama.embedBatch(texts);
        } catch (ollamaError: any) {
          console.warn('Ollama batch embedding failed, using mock embeddings:', ollamaError.message);
          return texts.map(text => generateMockEmbedding(text));
        }
      } else if (this.provider === 'openai' && this.openai) {
        // OpenAI has a limit on batch size, so we might need to chunk this
        const batchSize = 2048;
        const results: number[][] = [];

        for (let i = 0; i < texts.length; i += batchSize) {
          const batch = texts.slice(i, i + batchSize);
          const response = await this.openai.embeddings.create({
            model: this.embeddingModel,
            input: batch,
            encoding_format: 'float',
          });

          results.push(...response.data.map((d) => d.embedding));
        }

        return results;
      } else {
        // No provider configured, use mock
        return texts.map(text => generateMockEmbedding(text));
      }
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error('Failed to generate batch embeddings');
    }
  }

  /**
   * Generate an answer using the LLM
   * @param systemPrompt - System instructions
   * @param userPrompt - User query
   * @returns Generated answer text
   */
  async generateAnswer(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      if (this.provider === 'ollama' && this.ollama) {
        try {
          return await this.ollama.generateAnswer(systemPrompt, userPrompt);
        } catch (ollamaError: unknown) {
          const errorMessage = ollamaError instanceof Error ? ollamaError.message : 'Unknown error';
          console.warn('Ollama chat failed, attempting OpenAI fallback:', errorMessage);

          // Fall back to OpenAI if configured
          if (process.env.OPENAI_API_KEY) {
            if (!this.openai) {
              this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            }
            console.log('Using OpenAI fallback for chat generation');
            const response = await this.openai.chat.completions.create({
              model: this.chatModel,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.3,
              max_tokens: 2000,
            });
            return response.choices[0]?.message?.content || 'No response generated';
          }

          throw ollamaError;
        }
      } else if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: this.chatModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3, // Lower temperature for more focused, factual responses
          max_tokens: 2000,
        });

        return response.choices[0]?.message?.content || 'No response generated';
      } else {
        throw new Error('No AI provider configured');
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      throw new Error('Failed to generate answer');
    }
  }

  /**
   * Get the embedding dimension for the current model
   * @returns Embedding dimension size
   */
  getEmbeddingDimension(): number {
    if (this.provider === 'ollama') {
      // nomic-embed-text uses 768 dimensions
      // all-minilm uses 384 dimensions
      // For now, return 768 as default for Ollama
      return 768;
    } else {
      // text-embedding-3-large uses 3072 dimensions
      // text-embedding-3-small uses 1536 dimensions
      if (this.embeddingModel.includes('3-large')) {
        return 3072;
      } else if (this.embeddingModel.includes('3-small')) {
        return 1536;
      }
      // Default for ada-002
      return 1536;
    }
  }

  /**
   * Get the current provider
   */
  getProvider(): AIProvider {
    return this.provider;
  }

  /**
   * Check if Ollama is available
   */
  async checkOllamaHealth(): Promise<boolean> {
    if (this.ollama) {
      return await this.ollama.isAvailable();
    }
    return false;
  }
}

// Singleton instance
export const aiService = new AIService();
