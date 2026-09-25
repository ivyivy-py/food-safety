import React, { useState } from 'react';
import { AdditiveDossier } from '../types';
import { useMcpStatus, callMcp, MCP_PATH } from '../services/mcpClient';

interface McpInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: AdditiveDossier | null;
  rawMcpResponse?: any;
  latency?: number | null;
}

export const McpInspectorModal: React.FC<McpInspectorModalProps> = ({
  isOpen,
  onClose,
  dossier,
  rawMcpResponse,
  latency
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'payload' | 'runner' | 'headers' | 'protocol'>('payload');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { status, latency: currentLatency, dataset, serverInfo, protocolVersion } = useMcpStatus();
  const measuredLatency = latency !== undefined ? latency : currentLatency;
  const latencyDisplay = status === 'offline' || measuredLatency === null || measuredLatency === undefined ? '--' : `${measuredLatency}ms`;

  // Interactive Developer Runner state
  const [runnerTool, setRunnerTool] = useState<'check_additive' | 'check_ingredient_list' | 'search_additives' | 'check_nutrition' | 'check_pesticide_mrl'>('check_additive');
  const [runnerQuery, setRunnerQuery] = useState(dossier?.ins || 'E250');
  const [runnerResponse, setRunnerResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execLatency, setExecLatency] = useState<number | null>(null);

  const handleExecuteRunner = async () => {
    setIsExecuting(true);
    try {
      const args = runnerTool === 'check_ingredient_list' ? { ingredients: runnerQuery } : { query: runnerQuery };
      const res = await callMcp(runnerTool, args);
      setRunnerResponse(res.rawPayload);
      setExecLatency(res.latency);
    } catch (err: any) {
      setRunnerResponse(err?.structuredContent || {
        isError: true,
        error: err?.message || 'Execution error'
      });
      setExecLatency(null);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  const payloadToDisplay = rawMcpResponse || {
    info: "No real MCP response captured yet. Submit a query in the main console or run a tool in the Developer Runner tab.",
    server: serverInfo,
    dataset: dataset,
    status: status
  };

  const jsonString = JSON.stringify(payloadToDisplay, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-[#001f26] text-white border border-[#4edea3]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl max-h-[90vh]'
      }`}>
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#001318] border-b border-white/10 select-none">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">terminal</span>
            <h2 className="font-['JetBrains_Mono'] text-sm sm:text-base font-bold text-white tracking-wide">
              MCP Live Stream Inspector
            </h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-['JetBrains_Mono'] ${
              status === 'online' ? 'bg-[#006c49] text-white' : 'bg-[#ba1a1a] text-white'
            }`}>
              {status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Status Ribbon */}
        <div className="bg-[#001920] px-4 py-2 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-['JetBrains_Mono'] text-[#b0cbd3]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#4edea3]">● {MCP_PATH}</span>
            <span className="text-white/20">|</span>
            <span>MEASURED LATENCY: {latencyDisplay}</span>
            <span className="text-white/20">|</span>
            <span>PROTOCOL: {protocolVersion}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#779198]">
              {dataset.additives} additives · {dataset.foods} foods · {dataset.pesticides} pesticides
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-3 bg-[#001318] border-b border-white/10 text-xs font-['JetBrains_Mono']">
          <button
            type="button"
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'payload'
                ? 'bg-[#001f26] text-[#4edea3] font-bold border-t border-x border-[#4edea3]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Live Server Payload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('runner')}
            className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'runner'
                ? 'bg-[#001f26] text-[#4edea3] font-bold border-t border-x border-[#4edea3]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Developer Tool Runner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('headers')}
            className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'headers'
                ? 'bg-[#001f26] text-[#4edea3] font-bold border-t border-x border-[#4edea3]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Headers &amp; Transport
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'protocol'
                ? 'bg-[#001f26] text-[#4edea3] font-bold border-t border-x border-[#4edea3]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Standards &amp; Dataset
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#001f26]">
          {activeTab === 'payload' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-['JetBrains_Mono'] text-[#779198]">
                  Verified Streamable HTTP JSON-RPC 2.0 payload returned directly by /api/mcp
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded font-['JetBrains_Mono'] text-xs text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#001318] rounded-xl border border-white/5 font-['JetBrains_Mono'] text-xs text-[#4edea3] overflow-x-auto leading-relaxed shadow-inner max-h-[55vh]">
                <code>{jsonString}</code>
              </pre>
            </div>
          )}

          {activeTab === 'runner' && (
            <div className="space-y-4">
              <div className="bg-[#001318] p-4 rounded-xl border border-white/10 space-y-3">
                <span className="font-['JetBrains_Mono'] text-xs text-[#4edea3] font-bold block uppercase tracking-wider">
                  Execute Real MCP Tool Call (/api/mcp)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-[#779198] font-['JetBrains_Mono'] block mb-1">
                      Tool Name
                    </label>
                    <select
                      value={runnerTool}
                      onChange={(e) => setRunnerTool(e.target.value as any)}
                      className="w-full bg-[#001f26] border border-white/10 rounded-lg p-2 text-xs font-['JetBrains_Mono'] text-white focus:outline-none focus:border-[#4edea3]"
                    >
                      <option value="check_additive">check_additive</option>
                      <option value="check_ingredient_list">check_ingredient_list</option>
                      <option value="search_additives">search_additives</option>
                      <option value="check_nutrition">check_nutrition</option>
                      <option value="check_pesticide_mrl">check_pesticide_mrl</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-[#779198] font-['JetBrains_Mono'] block mb-1">
                      Input Argument ({runnerTool === 'check_ingredient_list' ? 'ingredients' : 'query'})
                    </label>
                    <input
                      type="text"
                      value={runnerQuery}
                      onChange={(e) => setRunnerQuery(e.target.value)}
                      placeholder="e.g. E211, MSG, חומוס, glyphosate..."
                      className="w-full bg-[#001f26] border border-white/10 rounded-lg p-2 text-xs font-['JetBrains_Mono'] text-white focus:outline-none focus:border-[#4edea3]"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleExecuteRunner}
                    disabled={isExecuting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#006c49] hover:bg-[#00895c] rounded-lg text-xs font-['JetBrains_Mono'] font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isExecuting ? 'sync' : 'play_arrow'}
                    </span>
                    <span>{isExecuting ? 'Calling MCP...' : 'Send tools/call'}</span>
                  </button>
                </div>
              </div>

              {runnerResponse && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#779198]">
                    <span>MCP Response Payload</span>
                    {execLatency !== null && <span>Measured: {execLatency}ms</span>}
                  </div>
                  <pre className="p-4 bg-[#001318] rounded-xl border border-white/5 font-['JetBrains_Mono'] text-xs text-[#4edea3] overflow-x-auto leading-relaxed max-h-[40vh]">
                    <code>{JSON.stringify(runnerResponse, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-4 font-['JetBrains_Mono'] text-xs">
              <div className="bg-[#001318] p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[#4edea3] font-bold block">HTTP Request Specifications:</span>
                <div className="text-white/80 space-y-1">
                  <div><span className="text-[#779198]">Method:</span> POST</div>
                  <div><span className="text-[#779198]">Path:</span> {MCP_PATH}</div>
                  <div><span className="text-[#779198]">Content-Type:</span> application/json</div>
                  <div><span className="text-[#779198]">Accept:</span> application/json, text/event-stream</div>
                  <div><span className="text-[#779198]">MCP-Protocol-Version:</span> {protocolVersion}</div>
                  <div><span className="text-[#779198]">Client Timeout:</span> 15,000ms</div>
                </div>
              </div>

              <div className="bg-[#001318] p-4 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-[#ffb95f] block text-sm">
                  Streamable HTTP Transport:
                </span>
                <p className="text-white/80 leading-relaxed font-['Inter'] text-xs">
                  This server implements the MCP 2025-11-25 Streamable HTTP transport with stateless request handling and direct JSON responses. All data is served from the bundled demo dataset without external network hops.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="space-y-3 font-['Inter'] text-xs text-white/80">
              <div className="p-4 bg-[#001318] rounded-xl border border-white/5 space-y-2">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-white block">
                  Demo Dataset Monograph
                </span>
                <p className="font-['Inter'] text-xs text-[#b0cbd3] leading-relaxed">
                  {dataset.note}
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#b0cbd3] font-['JetBrains_Mono'] text-xs pt-1">
                  <li>Curated Additives Codex: {dataset.additives} items</li>
                  <li>Israeli MoH Nutrition Records: {dataset.foods} items</li>
                  <li>Plant Protection Pesticide MRLs: {dataset.pesticides} compounds</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-lg text-[#779198] font-['JetBrains_Mono'] text-[11px]">
                Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#001318] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#779198]">
          <span className="font-['JetBrains_Mono'] text-[11px] truncate">
            {dossier ? `Entity: ${dossier.ins} · ${dossier.name} · Score: ${dossier.safetyScore}/100` : 'MCP Server: nutrisafe-food-mcp v3.0.0'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors cursor-pointer text-xs"
          >
            Close Pop-up
          </button>
        </div>
      </div>
    </div>
  );
};
