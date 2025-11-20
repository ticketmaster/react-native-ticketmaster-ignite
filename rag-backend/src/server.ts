import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { ragService } from './services/ragService';
import { vectorStore } from './services/vectorStore';
import { askSchema, type AskRequest } from './types/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for demo HTML
})); // Security headers

// CORS configuration - Allow GitHub Pages and localhost
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'https://ticketmaster.github.io',
    /^https:\/\/.*\.railway\.app$/, // Railway preview URLs
    /^https:\/\/.*\.vercel\.app$/, // Vercel preview URLs
  ],
  credentials: true,
}));

app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined')); // Request logging

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Error handler type
interface ErrorWithStatus extends Error {
  status?: number;
}

/**
 * Health check endpoint
 */
app.get('/health', async (_req: Request, res: Response) => {
  try {
    const stats = await vectorStore.getStats();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        totalDocuments: stats.totalDocuments,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    });
  }
});

/**
 * Get vector store statistics
 */
app.get('/api/ignite-docs/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await vectorStore.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Main RAG endpoint - Ask a question about Ignite documentation
 */
app.post('/api/ignite-docs/ask', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validation = askSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid request',
        details: validation.error.errors,
      });
      return;
    }

    const { question, topK, includeDebugInfo } = validation.data as AskRequest;

    // Process the question
    const result = await ragService.ask({
      question,
      topK,
      includeDebugInfo,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Batch question endpoint
 */
app.post(
  '/api/ignite-docs/ask-batch',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questions } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid request: questions must be a non-empty array',
        });
        return;
      }

      if (questions.length > 10) {
        res.status(400).json({
          success: false,
          error: 'Batch size limited to 10 questions',
        });
        return;
      }

      const results = await ragService.askBatch(questions);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Root endpoint with API documentation
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Ignite Documentation RAG API',
    version: '1.0.0',
    description: 'Retrieval-Augmented Generation API for Ticketmaster Ignite React Native documentation',
    endpoints: {
      'GET /health': 'Health check and database status',
      'GET /api/ignite-docs/stats': 'Get vector store statistics',
      'POST /api/ignite-docs/ask': 'Ask a question about Ignite documentation',
      'POST /api/ignite-docs/ask-batch': 'Ask multiple questions in batch',
    },
    documentation: 'https://github.com/ticketmaster/react-native-ticketmaster-ignite',
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

/**
 * Global error handler
 */
app.use((err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received, shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await vectorStore.close();
      console.log('Database connections closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│  Ignite Documentation RAG API                   │');
  console.log('└─────────────────────────────────────────────────┘');
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/ignite-docs/stats`);
  console.log(`   POST /api/ignite-docs/ask`);
  console.log(`   POST /api/ignite-docs/ask-batch`);
  console.log(`\n💡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;
