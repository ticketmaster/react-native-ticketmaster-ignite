import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Starting database migration...');

    // Enable pgvector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    console.log('✓ Enabled pgvector extension');

    // Create documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        embedding vector(1536),
        text TEXT NOT NULL,
        path TEXT NOT NULL,
        heading TEXT,
        source TEXT NOT NULL,
        platform TEXT,
        sdk TEXT,
        concepts TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Created documents table');

    // Create index for vector similarity search (HNSW for better performance)
    await client.query(`
      CREATE INDEX IF NOT EXISTS documents_embedding_idx
      ON documents
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
    `);
    console.log('✓ Created HNSW index for vector similarity search');

    // Create index for metadata filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS documents_source_idx ON documents(source)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS documents_platform_idx ON documents(platform)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS documents_sdk_idx ON documents(sdk)
    `);
    console.log('✓ Created metadata indexes');

    // Create GIN index for concepts array
    await client.query(`
      CREATE INDEX IF NOT EXISTS documents_concepts_idx ON documents USING GIN(concepts)
    `);
    console.log('✓ Created GIN index for concepts');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
