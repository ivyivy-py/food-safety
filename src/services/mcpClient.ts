import { useSyncExternalStore } from 'react';

export const MCP_PATH = '/api/mcp';

export class McpNotFoundError extends Error {
  public found: false;
  public dataset: string;
  public source: string;

  constructor(message: string, public structuredContent?: any) {
    super(message);
    this.name = 'McpNotFoundError';
    this.found = false;
    this.dataset = structuredContent?.dataset || 'demo';
    this.source = structuredContent?.source || 'NutriSafe demo dataset bundled with this app';
  }
}

export function describeMcpError(err: unknown): string {
  if (err instanceof McpNotFoundError) {
    return err.message;
  }
  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.message.includes('timeout')) {
      return 'MCP server request timed out after 15 seconds.';
    }
    if (
      err.message.includes('500') ||
      err.message.includes('502') ||
      err.message.includes('503') ||
      err.message.includes('504')
    ) {
      return 'MCP server is currently offline or returning a server error.';
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return 'Network connection dropped or MCP server is unreachable.';
    }
    return err.message;
  }
  return 'An unexpected error occurred while communicating with the MCP server.';
}

export interface McpStatusState {
  status: 'online' | 'offline';
  latency: number | null; // null before first call or while offline
  serverInfo: {
    name: string;
    title: string;
    version: string;
  };
  dataset: {
    additives: number;
    foods: number;
    pesticides: number;
    note: string;
  };
  protocolVersion: string;
}

let mcpState: McpStatusState = {
  status: 'online',
  latency: null, // '--' before the first call
  serverInfo: {
    name: 'nutrisafe-food-mcp',
    title: 'NutriSafe Food Safety MCP (demo dataset)',
    version: '3.0.0'
  },
  dataset: {
    additives: 25,
    foods: 8,
    pesticides: 5,
    note: 'Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.'
  },
  protocolVersion: '2025-11-25'
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function updateMcpStatus(newStatus: 'online' | 'offline', latency: number | null = null) {
  mcpState = {
    ...mcpState,
    status: newStatus,
    latency: newStatus === 'offline' ? null : latency
  };
  emitChange();
}

export function useMcpStatus(): McpStatusState {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    () => mcpState,
    () => mcpState
  );
}

let negotiatedProtocolVersion = '2025-11-25';
let initPromise: Promise<void> | null = null;
let requestId = 1;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function ensureInitialized(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // 1. Send initialize with protocolVersion "2025-11-25"
    const initPayload = {
      jsonrpc: '2.0',
      id: requestId++,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: {
          name: 'nutrisafe-web-client',
          version: '3.0.0'
        }
      }
    };

    const initRes = await fetchWithTimeout('/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify(initPayload)
    });

    if (initRes.status >= 500) {
      throw new Error(`MCP server HTTP ${initRes.status}`);
    }

    const initData = await initRes.json();
    if (initData.result?.protocolVersion) {
      negotiatedProtocolVersion = initData.result.protocolVersion;
    }

    // 2. Send notifications/initialized (the server answers 202 with no body)
    const notifyPayload = {
      jsonrpc: '2.0',
      method: 'notifications/initialized'
    };

    const notifyRes = await fetchWithTimeout('/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'MCP-Protocol-Version': negotiatedProtocolVersion
      },
      body: JSON.stringify(notifyPayload)
    });

    if (notifyRes.status >= 500) {
      throw new Error(`MCP server HTTP ${notifyRes.status} on initialized notification`);
    }
  })().catch((err) => {
    initPromise = null;
    throw err;
  });

  return initPromise;
}

export async function callMcp<T = any>(
  tool: string,
  args: Record<string, any> = {}
): Promise<{ data: T; rawPayload: any; latency: number }> {
  const t0 = performance.now();

  try {
    await ensureInitialized();

    const callPayload = {
      jsonrpc: '2.0',
      id: requestId++,
      method: 'tools/call',
      params: {
        name: tool,
        arguments: args
      }
    };

    const res = await fetchWithTimeout('/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'MCP-Protocol-Version': negotiatedProtocolVersion
      },
      body: JSON.stringify(callPayload)
    });

    if (res.status >= 500) {
      throw new Error(`HTTP ${res.status} from MCP server`);
    }

    const json = await res.json();
    const elapsed = Math.max(1, Math.round(performance.now() - t0));

    if (json.error) {
      updateMcpStatus('online', elapsed);
      throw new Error(json.error.message || 'MCP JSON-RPC error');
    }

    const result = json.result;
    if (!result) {
      updateMcpStatus('online', elapsed);
      throw new Error('Invalid MCP response: no result payload');
    }

    // Check if reply has isError with found: false
    const structured = result.structuredContent;
    if (result.isError || (structured && structured.found === false)) {
      updateMcpStatus('online', elapsed);
      const msg =
        structured?.message ||
        (result.content && result.content[0]?.text) ||
        'Record not found in demo dataset';
      throw new McpNotFoundError(msg, structured);
    }

    updateMcpStatus('online', elapsed);

    const data = structured && structured.result !== undefined ? structured.result : result;
    return {
      data,
      rawPayload: json,
      latency: elapsed
    };
  } catch (err) {
    if (err instanceof McpNotFoundError) {
      throw err;
    }
    const isOffline =
      err instanceof Error &&
      (err.name === 'AbortError' ||
        err.message.includes('Failed to fetch') ||
        err.message.includes('500') ||
        err.message.includes('502') ||
        err.message.includes('503') ||
        err.message.includes('504'));
    if (isOffline) {
      updateMcpStatus('offline', null);
      initPromise = null;
    }
    throw err;
  }
}
