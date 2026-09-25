import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import {
  ADDITIVES_DATABASE,
  NUTRITION_DATABASE,
  PESTICIDES_DATABASE,
  checkAdditive,
  scanIngredientList,
  searchAdditives,
  checkNutrition,
  checkPesticideMrl
} from './mcp-engine.js';

export const MCP_PATH = '/api/mcp';

export const SERVER_INFO = {
  name: 'nutrisafe-food-mcp',
  title: 'NutriSafe Food Safety MCP (demo dataset)',
  version: '3.0.0'
};

export const DATASET = {
  additives: ADDITIVES_DATABASE.length,
  foods: NUTRITION_DATABASE.length,
  pesticides: PESTICIDES_DATABASE.length,
  note: 'Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.'
};

const DATASET_SOURCE = 'NutriSafe demo dataset bundled with this app';

function sendJsonRpcError(res, statusCode, code, message) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const payload = {
    jsonrpc: '2.0',
    error: { code, message },
    id: null
  };
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(payload);
  } else {
    res.end(JSON.stringify(payload));
  }
}

function checkOrigin(req, res) {
  const origin = req.headers['origin'];
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const reqHost = req.headers['host'];
    const xForwardedHost = req.headers['x-forwarded-host'];
    const firstForwardedHost = xForwardedHost ? xForwardedHost.split(',')[0].trim() : null;

    if (originHost !== reqHost && originHost !== firstForwardedHost) {
      sendJsonRpcError(res, 403, -32000, 'Forbidden: Origin does not match Host.');
      return false;
    }
  } catch (_) {
    sendJsonRpcError(res, 403, -32000, 'Forbidden: Invalid Origin header.');
    return false;
  }
  return true;
}

function registerTools(server) {
  // 1. check_additive
  server.registerTool('check_additive', {
    title: 'Check Food Additive (demo dataset)',
    description: 'Returns a complete toxicological dossier and regulatory limits for a food additive. The data is read from the demo dataset bundled with this app. Use this tool when evaluating additive safety, ADI limits, or regulatory status by E-number, CAS, or name. It does not cover uncurated industrial compounds outside the bundled catalog.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).describe('E-number (e.g. E211, E-211), exact CAS number, or additive name')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    const result = checkAdditive(args.query);
    if (result) {
      const payload = { found: true, dataset: 'demo', source: DATASET_SOURCE, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `No matching additive found in demo dataset (${DATASET.additives} additives) for "${args.query}".`;
    const payload = { found: false, dataset: 'demo', source: DATASET_SOURCE, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });

  // 2. check_ingredient_list
  server.registerTool('check_ingredient_list', {
    title: 'Scan Ingredient List (demo dataset)',
    description: 'Scans packaged food ingredients for monitored additives, chemical synergies, allergens, and dietary suitability. The analysis is evaluated against the demo dataset bundled with this app. Use this tool when checking a recipe or label formulation for hazardous additive combinations. It does not certify unlisted processing aids or undisclosed proprietary flavorings.',
    inputSchema: {
      ingredients: z.string().trim().min(1).max(4000).describe('Full food ingredients declaration text to scan')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    const result = scanIngredientList(args.ingredients);
    const payload = { found: true, dataset: 'demo', source: DATASET_SOURCE, result };
    return {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      structuredContent: payload
    };
  });

  // 3. search_additives
  server.registerTool('search_additives', {
    title: 'Search Additives Directory (demo dataset)',
    description: 'Searches and filters food additives by keyword, functional category, or regulatory status. All records are retrieved from the demo dataset bundled with this app. Use this tool to browse additives such as preservatives, colors, or EU-banned ingredients. It does not track live regulatory gazette amendments outside the bundled demo database.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).optional().describe('Optional search keyword (e.g. preservative, color, banned)'),
      category: z.string().trim().min(1).max(100).optional().describe('Optional functional class or category (e.g. banned, antioxidant)')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    const result = searchAdditives(args.query || '', args.category || '');
    const payload = { found: true, dataset: 'demo', source: DATASET_SOURCE, result };
    return {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      structuredContent: payload
    };
  });

  // 4. check_nutrition
  server.registerTool('check_nutrition', {
    title: 'Check Israeli Nutrition Data (demo dataset)',
    description: 'Retrieves nutritional values and Israeli Ministry of Health front-of-pack red warning label evaluations. The profile is queried from the demo dataset bundled with this app. Use this tool to check sodium, sugar, saturated fat, and calories for standard Israeli foods in Hebrew or English. It does not provide nutrition facts for customized restaurant recipes.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).describe('Food item name in Hebrew or English (e.g. חומוס, tahini, falafel)')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    const result = checkNutrition(args.query);
    if (result) {
      const payload = { found: true, dataset: 'demo', source: DATASET_SOURCE, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `No matching food item found in demo dataset (${DATASET.foods} foods) for "${args.query}".`;
    const payload = { found: false, dataset: 'demo', source: DATASET_SOURCE, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });

  // 5. check_pesticide_mrl
  server.registerTool('check_pesticide_mrl', {
    title: 'Check Pesticide MRL Limits (demo dataset)',
    description: 'Retrieves statutory Maximum Residue Limits and multi-jurisdictional divergence for agrochemicals across EU, US EPA, and Israeli standards. The data is retrieved from the demo dataset bundled with this app. Use this tool to check regulatory thresholds, ban notices, and crop tolerances for active pesticides. It does not verify physical lab certificates or commercial batch compliance.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).describe('Pesticide active ingredient (e.g. Chlorpyrifos, Glyphosate), CAS number, or single crop')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    const result = checkPesticideMrl(args.query);
    if (result) {
      const payload = { found: true, dataset: 'demo', source: DATASET_SOURCE, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `No matching pesticide record found in demo dataset (${DATASET.pesticides} pesticides) for "${args.query}".`;
    const payload = { found: false, dataset: 'demo', source: DATASET_SOURCE, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });
}

export async function mcpHandler(req, res) {
  // 1. Origin header check
  if (!checkOrigin(req, res)) {
    return;
  }

  // 2. GET without "text/event-stream" in Accept header
  const accept = req.headers['accept'] || '';
  if (req.method === 'GET' && !accept.includes('text/event-stream')) {
    const info = {
      server: SERVER_INFO,
      tools: [
        'check_additive',
        'check_ingredient_list',
        'search_additives',
        'check_nutrition',
        'check_pesticide_mrl'
      ],
      dataset: DATASET,
      connect: {
        protocol: '2025-11-25',
        endpoint: MCP_PATH,
        transport: 'Streamable HTTP (POST /api/mcp)',
        instructions: 'Send MCP JSON-RPC 2.0 messages via HTTP POST with Accept: application/json, text/event-stream'
      }
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (typeof res.json === 'function') {
      res.json(info);
    } else {
      res.end(JSON.stringify(info, null, 2));
    }
    return;
  }

  // 3. Any other method except POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET');
    sendJsonRpcError(res, 405, -32000, 'Method not allowed. Send MCP messages with POST.');
    return;
  }

  // 4. POST handling
  let body;
  try {
    if (req.body !== undefined) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } else if (typeof req.on === 'function') {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(data ? JSON.parse(data) : undefined);
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
    }
  } catch (_) {
    sendJsonRpcError(res, 400, -32700, 'Parse error');
    return;
  }

  const server = new McpServer(SERVER_INFO, { instructions: DATASET.note });
  registerTools(server);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  await server.connect(transport);

  res.on('close', () => {
    try { transport.close(); } catch (_) {}
    try { server.close(); } catch (_) {}
  });

  await transport.handleRequest(req, res, body);
}
