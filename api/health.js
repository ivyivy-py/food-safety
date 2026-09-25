import { MCP_SERVER_ENDPOINT } from './mcp-engine.js';

/**
 * Standalone health handler for Vercel serverless functions
 * Endpoint: /api/health
 */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json({
    status: 'healthy',
    service: 'NutriSafe ToxiScan Bio-Portal',
    timestamp: new Date().toISOString(),
    mcp_endpoint: MCP_SERVER_ENDPOINT,
  });
}
