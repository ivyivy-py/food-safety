import { MCP_PATH, SERVER_INFO, DATASET } from './_lib/mcp-server.js';

/**
 * Health check handler for Vercel and Express
 * Endpoint: /api/health
 */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json({
    status: 'ok',
    endpoint: MCP_PATH,
    server: SERVER_INFO,
    dataset: DATASET
  });
}
