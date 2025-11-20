import { Pool } from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export interface DocumentMetadata {
  path: string;
  heading?: string;
  source: string;
  platform?: string;
  sdk?: string;
  concepts?: string[];
}

export interface Document {
  id: string;
  embedding: number[];
  text: string;
  metadata: DocumentMetadata;
}

export interface SearchResult {
  id: string;
  text: string;
  metadata: DocumentMetadata;
  similarity: number;
}

export interface SearchOptions {
  topK?: number;
  minSimilarity?: number;
  filters?: {
    platform?: string;
    sdk?: string;
    source?: string;
    concepts?: string[];
  };
}

export class VectorStore {
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  /**
   * Generate a deterministic ID for a document chunk
   */
  private generateId(text: string, path: string, heading?: string): string {
    const content = `${path}:${heading || 'root'}:${text.slice(0, 100)}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Upsert a single document
   */
  async upsertDocument(doc: Omit<Document, 'id'>): Promise<void> {
    const client = await this.pool.connect();

    try {
      const id = this.generateId(doc.text, doc.metadata.path, doc.metadata.heading);

      await client.query(
        `
        INSERT INTO documents (id, embedding, text, path, heading, source, platform, sdk, concepts)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          embedding = EXCLUDED.embedding,
          text = EXCLUDED.text,
          path = EXCLUDED.path,
          heading = EXCLUDED.heading,
          source = EXCLUDED.source,
          platform = EXCLUDED.platform,
          sdk = EXCLUDED.sdk,
          concepts = EXCLUDED.concepts
        `,
        [
          id,
          JSON.stringify(doc.embedding), // pgvector accepts JSON array
          doc.text,
          doc.metadata.path,
          doc.metadata.heading || null,
          doc.metadata.source,
          doc.metadata.platform || null,
          doc.metadata.sdk || null,
          doc.metadata.concepts || null,
        ]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Upsert multiple documents in a transaction (more efficient)
   */
  async upsertDocuments(docs: Omit<Document, 'id'>[]): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      for (const doc of docs) {
        const id = this.generateId(doc.text, doc.metadata.path, doc.metadata.heading);

        await client.query(
          `
          INSERT INTO documents (id, embedding, text, path, heading, source, platform, sdk, concepts)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            embedding = EXCLUDED.embedding,
            text = EXCLUDED.text,
            path = EXCLUDED.path,
            heading = EXCLUDED.heading,
            source = EXCLUDED.source,
            platform = EXCLUDED.platform,
            sdk = EXCLUDED.sdk,
            concepts = EXCLUDED.concepts
          `,
          [
            id,
            JSON.stringify(doc.embedding),
            doc.text,
            doc.metadata.path,
            doc.metadata.heading || null,
            doc.metadata.source,
            doc.metadata.platform || null,
            doc.metadata.sdk || null,
            doc.metadata.concepts || null,
          ]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Search for similar documents using vector similarity
   */
  async search(queryEmbedding: number[], options: SearchOptions = {}): Promise<SearchResult[]> {
    const client = await this.pool.connect();

    try {
      const topK = options.topK || 8;
      const minSimilarity = options.minSimilarity || 0.0;

      // Build WHERE clause for filters
      const whereClauses: string[] = [];
      const params: any[] = [JSON.stringify(queryEmbedding), topK];
      let paramIndex = 3;

      if (options.filters) {
        if (options.filters.platform) {
          whereClauses.push(`platform = $${paramIndex}`);
          params.push(options.filters.platform);
          paramIndex++;
        }

        if (options.filters.sdk) {
          whereClauses.push(`sdk = $${paramIndex}`);
          params.push(options.filters.sdk);
          paramIndex++;
        }

        if (options.filters.source) {
          whereClauses.push(`source = $${paramIndex}`);
          params.push(options.filters.source);
          paramIndex++;
        }

        if (options.filters.concepts && options.filters.concepts.length > 0) {
          whereClauses.push(`concepts && $${paramIndex}`);
          params.push(options.filters.concepts);
          paramIndex++;
        }
      }

      const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      const query = `
        SELECT
          id,
          text,
          path,
          heading,
          source,
          platform,
          sdk,
          concepts,
          1 - (embedding <=> $1::vector) AS similarity
        FROM documents
        ${whereClause}
        ORDER BY embedding <=> $1::vector
        LIMIT $2
      `;

      const result = await client.query(query, params);

      return result.rows
        .filter((row) => row.similarity >= minSimilarity)
        .map((row) => ({
          id: row.id,
          text: row.text,
          metadata: {
            path: row.path,
            heading: row.heading,
            source: row.source,
            platform: row.platform,
            sdk: row.sdk,
            concepts: row.concepts,
          },
          similarity: row.similarity,
        }));
    } finally {
      client.release();
    }
  }

  /**
   * Delete all documents from a specific source
   */
  async deleteBySource(source: string): Promise<number> {
    const client = await this.pool.connect();

    try {
      const result = await client.query('DELETE FROM documents WHERE source = $1', [source]);
      return result.rowCount || 0;
    } finally {
      client.release();
    }
  }

  /**
   * Delete all documents
   */
  async clear(): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('TRUNCATE TABLE documents');
    } finally {
      client.release();
    }
  }

  /**
   * Get statistics about the document store
   */
  async getStats(): Promise<{
    totalDocuments: number;
    bySource: Record<string, number>;
    byPlatform: Record<string, number>;
    bySdk: Record<string, number>;
  }> {
    const client = await this.pool.connect();

    try {
      const totalResult = await client.query('SELECT COUNT(*) as count FROM documents');

      const sourceResult = await client.query(`
        SELECT source, COUNT(*) as count
        FROM documents
        GROUP BY source
      `);

      const platformResult = await client.query(`
        SELECT platform, COUNT(*) as count
        FROM documents
        WHERE platform IS NOT NULL
        GROUP BY platform
      `);

      const sdkResult = await client.query(`
        SELECT sdk, COUNT(*) as count
        FROM documents
        WHERE sdk IS NOT NULL
        GROUP BY sdk
      `);

      return {
        totalDocuments: parseInt(totalResult.rows[0].count),
        bySource: Object.fromEntries(sourceResult.rows.map((r) => [r.source, parseInt(r.count)])),
        byPlatform: Object.fromEntries(platformResult.rows.map((r) => [r.platform, parseInt(r.count)])),
        bySdk: Object.fromEntries(sdkResult.rows.map((r) => [r.sdk, parseInt(r.count)])),
      };
    } finally {
      client.release();
    }
  }

  /**
   * Close the pool
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Singleton instance
export const vectorStore = new VectorStore();
