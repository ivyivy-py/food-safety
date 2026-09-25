export const MCP_ENDPOINT_CONFIG = "https://food-mcp-server.rootsbybenda.workers.dev/mcp";

export interface McpResponse<T = any> {
  jsonrpc: string;
  id: number | string;
  result: T;
  mcp_source?: string;
  mcp_endpoint?: string;
  active_engine?: string;
  mcp_latency_ms?: number;
}

export async function callMcp<T = any>(
  tool: string,
  args: Record<string, any> = {}
): Promise<{ data: T; rawPayload: McpResponse<T>; latency: number }> {
  const startTime = performance.now();
  const requestId = Date.now();

  const payload = {
    jsonrpc: "2.0",
    id: requestId,
    method: "tools/call",
    params: {
      name: tool,
      arguments: args
    }
  };

  try {
    const response = await fetch("/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
      },
      body: JSON.stringify(payload)
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from MCP gateway`);
    }

    const json: McpResponse<T> = await response.json();
    return {
      data: json.result,
      rawPayload: json,
      latency: json.mcp_latency_ms || elapsed
    };
  } catch (err) {
    console.warn("Failed to reach local /api/mcp proxy, falling back to client defaults", err);
    throw err;
  }
}
