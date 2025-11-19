import { z } from 'zod';

/**
 * Request schema for /api/ignite-docs/ask endpoint
 */
export const askSchema = z.object({
  question: z
    .string()
    .min(3, 'Question must be at least 3 characters')
    .max(500, 'Question must be less than 500 characters'),
  topK: z.number().int().min(1).max(20).optional(),
  includeDebugInfo: z.boolean().optional(),
});

export type AskRequest = z.infer<typeof askSchema>;

/**
 * Response type for /api/ignite-docs/ask endpoint
 */
export interface AskResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: Array<{
      path?: string;
      url?: string;
      heading?: string;
    }>;
    retrievedChunks?: number;
    processingTime?: number;
  };
  error?: string;
}

/**
 * Response type for /api/ignite-docs/stats endpoint
 */
export interface StatsResponse {
  success: boolean;
  data?: {
    totalDocuments: number;
    bySource: Record<string, number>;
    byPlatform: Record<string, number>;
    bySdk: Record<string, number>;
  };
  error?: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database?: {
    connected: boolean;
    totalDocuments?: number;
  };
  error?: string;
}
