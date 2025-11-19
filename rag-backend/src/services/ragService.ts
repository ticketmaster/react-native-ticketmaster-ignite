import { aiService } from './aiService';
import { vectorStore, SearchOptions } from './vectorStore';
import { generateMockEmbedding } from './mockEmbeddings';

export interface RAGResponse {
  answer: string;
  sources: Array<{
    path?: string;
    url?: string;
    heading?: string;
  }>;
  retrievedChunks?: number;
  processingTime?: number;
}

export interface RAGQuery {
  question: string;
  topK?: number;
  includeDebugInfo?: boolean;
}

export class RAGService {
  private readonly defaultTopK: number;

  constructor(topK: number = 8) {
    this.defaultTopK = topK;
  }

  /**
   * Extract platform, SDK, and concept hints from the question
   */
  private extractQueryHints(question: string): {
    platform?: string;
    sdk?: string;
    concepts: string[];
  } {
    const lower = question.toLowerCase();
    const hints: { platform?: string; sdk?: string; concepts: string[] } = {
      concepts: [],
    };

    // Platform detection
    if (lower.includes('android')) {
      hints.platform = 'android';
    } else if (lower.includes('ios')) {
      hints.platform = 'ios';
    } else if (lower.includes('expo')) {
      hints.platform = 'expo';
    }

    // SDK detection
    if (lower.includes('retail') || lower.includes('purchase') || lower.includes('prepurchase')) {
      hints.sdk = 'Retail';
    } else if (lower.includes('ticket') && !lower.includes('ticketmaster')) {
      hints.sdk = 'Tickets';
    } else if (lower.includes('account')) {
      hints.sdk = 'Accounts';
    }

    // Concept detection
    const conceptKeywords = [
      'auth',
      'token',
      'deeplink',
      'scheme',
      'config',
      'analytics',
      'modal',
      'embedded',
      'secure entry',
      'login',
      'logout',
      'market domain',
      'region',
      'prebuilt modules',
      'event header',
      'installation',
      'setup',
      'migration',
      'troubleshooting',
    ];

    for (const keyword of conceptKeywords) {
      if (lower.includes(keyword)) {
        hints.concepts.push(keyword);
      }
    }

    return hints;
  }

  /**
   * Build search options based on query hints
   */
  private buildSearchOptions(question: string, topK: number): SearchOptions {
    const hints = this.extractQueryHints(question);

    const searchOptions: SearchOptions = {
      topK,
      minSimilarity: 0.5, // Filter out low-relevance results
    };

    // Apply filters if we have strong hints
    if (hints.platform || hints.sdk || hints.concepts.length > 0) {
      searchOptions.filters = {};

      if (hints.platform) {
        searchOptions.filters.platform = hints.platform;
      }

      if (hints.sdk) {
        searchOptions.filters.sdk = hints.sdk;
      }

      if (hints.concepts.length > 0) {
        searchOptions.filters.concepts = hints.concepts;
      }
    }

    return searchOptions;
  }

  /**
   * Build the RAG prompt with retrieved context
   */
  private buildPrompt(
    question: string,
    contexts: Array<{ text: string; path: string; heading?: string; source: string }>
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are an expert assistant helping developers integrate Ticketmaster Ignite via the react-native-ticketmaster-ignite library.

Your role:
- Provide accurate, actionable answers based ONLY on the provided documentation context
- Use concrete examples from the documentation whenever possible
- Reference specific files and sections in your answers
- If information is missing or unclear, explicitly state "the documentation doesn't specify that"
- Prioritize copy-pastable code examples when available
- Be concise but thorough

Important guidelines:
- NEVER make up information not present in the context
- ALWAYS cite your sources using the format: "See [path] > [heading]"
- If multiple approaches exist, present all of them
- Distinguish between iOS, Android, and Expo-specific instructions when relevant
- Highlight important configuration differences between SDKs (Retail, Tickets, Accounts)`;

    // Build context section with numbered references
    let contextSection = 'DOCUMENTATION CONTEXT:\n\n';

    contexts.forEach((ctx, index) => {
      const refNum = index + 1;
      const sourceLabel = ctx.source === 'ignite-docs' ? 'Official Ignite Docs' : 'Library README/Docs';
      const location = ctx.heading ? `${ctx.path} > ${ctx.heading}` : ctx.path;

      contextSection += `[${refNum}] ${sourceLabel}: ${location}\n`;
      contextSection += `${ctx.text}\n\n`;
      contextSection += '---\n\n';
    });

    const userPrompt = `${contextSection}

USER QUESTION:
${question}

Please provide a detailed answer based on the documentation context above. Include specific references to sources in your response.`;

    return { systemPrompt, userPrompt };
  }

  /**
   * Extract unique sources from retrieved contexts
   */
  private extractSources(
    contexts: Array<{ path: string; heading?: string; source: string }>
  ): RAGResponse['sources'] {
    const sourcesMap = new Map<string, { path?: string; url?: string; heading?: string }>();

    for (const ctx of contexts) {
      const key = `${ctx.path}:${ctx.heading || ''}`;

      if (!sourcesMap.has(key)) {
        const isUrl = ctx.path.startsWith('http');

        sourcesMap.set(key, {
          ...(isUrl ? { url: ctx.path } : { path: ctx.path }),
          heading: ctx.heading,
        });
      }
    }

    return Array.from(sourcesMap.values());
  }

  /**
   * Answer a question using RAG
   */
  async ask(query: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();

    try {
      const topK = query.topK || this.defaultTopK;

      // Step 1: Embed the question (with fallback to mock embeddings)
      let questionEmbedding: number[];
      try {
        questionEmbedding = await aiService.embed(query.question);
      } catch (embedError: any) {
        console.warn('OpenAI embedding failed, using mock embeddings:', embedError.message);
        questionEmbedding = generateMockEmbedding(query.question);
      }

      // Step 2: Retrieve relevant documents with smart filtering
      const searchOptions = this.buildSearchOptions(query.question, topK);
      let results = await vectorStore.search(questionEmbedding, searchOptions);

      // Step 3: If we got too few results with filters, retry without filters
      if (results.length < 3 && searchOptions.filters) {
        console.log('Few results with filters, retrying without filters...');
        results = await vectorStore.search(questionEmbedding, {
          topK,
          minSimilarity: searchOptions.minSimilarity,
        });
      }

      if (results.length === 0) {
        return {
          answer:
            "I couldn't find relevant information in the documentation to answer your question. Please try rephrasing or ask about a different topic related to the react-native-ticketmaster-ignite library.",
          sources: [],
          retrievedChunks: 0,
          processingTime: Date.now() - startTime,
        };
      }

      // Step 4: Build prompt with context
      const contexts = results.map((r) => ({
        text: r.text,
        path: r.metadata.path,
        heading: r.metadata.heading,
        source: r.metadata.source,
      }));

      const { systemPrompt, userPrompt } = this.buildPrompt(query.question, contexts);

      // Step 5: Generate answer (with fallback if OpenAI fails)
      let answer: string;
      try {
        answer = await aiService.generateAnswer(systemPrompt, userPrompt);
      } catch (llmError: any) {
        // If LLM fails (e.g., no credits), return the retrieved docs instead
        console.warn('LLM generation failed, falling back to retrieved documents:', llmError.message);

        answer = `**📚 I found these relevant sections in the documentation:**\n\n`;
        answer += `**Note**: AI answer generation is unavailable (${llmError.message.includes('quota') ? 'OpenAI credits needed' : 'service error'}). Here are the relevant documentation sections:\n\n`;

        contexts.forEach((ctx, index) => {
          const heading = ctx.heading ? ` > ${ctx.heading}` : '';
          answer += `**[${index + 1}] ${ctx.path}${heading}**\n\n`;
          answer += `${ctx.text.slice(0, 500)}${ctx.text.length > 500 ? '...' : ''}\n\n`;
          answer += `---\n\n`;
        });

        answer += `\n💡 **To enable AI-generated answers**, add OpenAI credits to your account or configure Ollama for free local LLM.`;
      }

      // Step 6: Extract sources
      const sources = this.extractSources(contexts);

      const processingTime = Date.now() - startTime;

      return {
        answer,
        sources,
        ...(query.includeDebugInfo && {
          retrievedChunks: results.length,
          processingTime,
        }),
      };
    } catch (error) {
      console.error('RAG query failed:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }

  /**
   * Batch process multiple questions (useful for testing)
   */
  async askBatch(questions: string[]): Promise<RAGResponse[]> {
    const results = await Promise.all(
      questions.map((q) => this.ask({ question: q, includeDebugInfo: true }))
    );

    return results;
  }
}

// Singleton instance
export const ragService = new RAGService(parseInt(process.env.TOP_K_RESULTS || '8', 10));
