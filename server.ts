import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { mcpHandler, MCP_PATH, SERVER_INFO, DATASET } from './api/_lib/mcp-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Health endpoint reporting MCP_PATH, SERVER_INFO, and DATASET
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      endpoint: MCP_PATH,
      server: SERVER_INFO,
      dataset: DATASET
    });
  });

  // Express JSON parser for /api routes with 1MB limit
  app.use('/api', express.json({ limit: '1mb' }));

  // Mount MCP handler on /api/mcp and /api
  app.all(['/api/mcp', '/api'], mcpHandler);

  // Express error handler for /api: turns JSON parse failures into -32700 and body errors into -32600
  app.use('/api', (err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err) {
      const isParseError = err instanceof SyntaxError || err.type === 'entity.parse.failed' || err.status === 400;
      const code = isParseError ? -32700 : -32600;
      const message = isParseError ? 'Parse error' : (err.message || 'Invalid Request');
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code, message },
        id: null
      });
    }
    next();
  });

  // Mount Vite or serve static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NutriSafe Bio-Portal server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
