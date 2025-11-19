/**
 * Mock embeddings service for demo mode
 * Generates consistent embeddings without calling OpenAI
 */

/**
 * Generate a deterministic mock embedding from text
 * This allows the demo to work without OpenAI API calls
 */
export function generateMockEmbedding(text: string): number[] {
  const embedding: number[] = [];
  let hash = 0;

  // Simple hash function to make embeddings consistent for the same text
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }

  // Generate 1536 dimensions (text-embedding-3-small size)
  for (let i = 0; i < 1536; i++) {
    const x = Math.sin(hash + i) * 10000;
    embedding.push(x - Math.floor(x));
  }

  // Normalize to unit length (required for cosine similarity)
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}
