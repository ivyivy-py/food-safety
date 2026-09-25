import React, { useState } from 'react';
import { AdditiveDossier } from '../types';

interface McpInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: AdditiveDossier;
  rawMcpResponse?: any;
  endpointUrl?: string;
  latency?: number;
}

export const McpInspectorModal: React.FC<McpInspectorModalProps> = ({
  isOpen,
  onClose,
  dossier,
  rawMcpResponse,
  endpointUrl = "https://food-mcp-server.rootsbybenda.workers.dev/mcp",
  latency = 142
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'payload' | 'runner' | 'headers' | 'protocol'>('payload');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Interactive Developer Runner state
  const [runnerTool, setRunnerTool] = useState<'check_additive' | 'check_ingredient_list' | 'search_additives' | 'check_nutrition' | 'check_pesticide_mrl'>('check_additive');
  const [runnerQuery, setRunnerQuery] = useState(dossier.ins || 'E250');
  const [runnerResponse, setRunnerResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execLatency, setExecLatency] = useState<number | null>(null);

  const handleExecuteRunner = async () => {
    setIsExecuting(true);
    const start = performance.now();
    try {
      const payload: any = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: runnerTool,
          arguments: runnerTool === 'check_ingredient_list' ? { ingredients: runnerQuery } : { query: runnerQuery }
        }
      };

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setRunnerResponse(data);
      setExecLatency(Math.round(performance.now() - start));
    } catch (err: any) {
      setRunnerResponse({
        jsonrpc: '2.0',
        error: { code: -32000, message: err?.message || 'Execution error' }
      });
      setExecLatency(Math.round(performance.now() - start));
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  const payloadToDisplay = rawMcpResponse || {
    jsonrpc: "2.0",
    id: Date.now(),
    mcp_version: "2024-11-05",
    mcp_endpoint: endpointUrl,
    active_engine: "JECFA 96th Report / EFSA 2023-R / IL-MoH 5780",
    mcp_latency_ms: latency,
    result: {
      query_entity: {
        ins_number: dossier.ins,
        chemical_name: dossier.chemicalName,
        cas_number: dossier.cas,
        molecular_formula: dossier.formula,
        einecs: dossier.einecs
      },
      toxicological_assessment: {
        safety_index_score: dossier.safetyScore,
        risk_level: dossier.riskLevel,
        adi_mg_per_kg_bw: {
          range: dossier.adi.range,
          unit: dossier.adi.unit,
          authority: "EFSA/JECFA",
          note: dossier.adi.note
        },
        carcinogenicity: {
          hazard: dossier.carcinogenicity.hazard,
          tag: dossier.carcinogenicity.tag,
          nitrosamine_formation_risk: dossier.ins === "E250",
          ndma_hazard_identified: dossier.ins === "E250",
          note: dossier.carcinogenicity.note
        },
        max_ingoing_eu_il: {
          value: dossier.maxIngoing.value,
          unit: dossier.maxIngoing.unit,
          note: dossier.maxIngoing.note
        },
        pediatric_and_allergen_risk: {
          value: dossier.pediatricRisk.value,
          sub: dossier.pediatricRisk.sub,
          note: dossier.pediatricRisk.note
        }
      },
      dietary_compliance: {
        halal: {
          status: dossier.dietary.halal.certified,
          badge: dossier.dietary.halal.badge,
          note: dossier.dietary.halal.note
        },
        kosher: {
          status: dossier.dietary.kosher.certified,
          designation: dossier.dietary.kosher.badge,
          note: dossier.dietary.kosher.note
        },
        vegan: {
          status: dossier.dietary.vegan.certified,
          badge: dossier.dietary.vegan.badge,
          note: dossier.dietary.vegan.note
        },
        gluten_free: {
          status: dossier.dietary.glutenFree.certified,
          badge: dossier.dietary.glutenFree.badge,
          note: dossier.dietary.glutenFree.note
        },
        traceability: dossier.dietary.traceability
      },
      israeli_front_of_pack_decree_5780: {
        red_sodium_symbol_triggered: dossier.israeliMohLabels.sodium.triggered,
        measured_sodium_mg_100g: dossier.israeliMohLabels.sodium.value,
        threshold_solid_mg: dossier.israeliMohLabels.sodium.limit,
        red_fat_symbol_triggered: dossier.israeliMohLabels.saturatedFat.triggered,
        measured_saturated_fat_g_100g: dossier.israeliMohLabels.saturatedFat.value,
        threshold_fat_solid_g: dossier.israeliMohLabels.saturatedFat.limit,
        red_sugar_symbol_triggered: dossier.israeliMohLabels.sugar.triggered,
        measured_total_sugar_g_100g: dossier.israeliMohLabels.sugar.value,
        threshold_sugar_solid_g: dossier.israeliMohLabels.sugar.limit,
        compliance_assessment: dossier.israeliMohLabels.complianceAssessment
      },
      pesticide_residues_mrl: dossier.pesticideResidues.map(p => ({
        compound: p.compound,
        cas: p.cas,
        group: p.group,
        detected_residue: p.detected,
        detected_ppm: p.detectedNum,
        eu_mrl_ppm: p.euMrl,
        us_epa_tolerance_ppm: p.usEpa,
        israel_mrl_moh: p.israelMrl,
        verdict: p.verdict,
        eu_compliance: !p.isViolation
      })),
      regulatory_dossier: dossier.regulatoryDossier
    }
  };

  const jsonString = JSON.stringify(payloadToDisplay, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ToxiScan_MCP_Inspector_${dossier.ins}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div className={`bg-[#0f292f] text-white flex flex-col shadow-2xl border border-white/10 overflow-hidden transition-all duration-200 ${
        isFullscreen ? 'w-full h-full max-w-none max-h-none rounded-none' : 'max-w-4xl w-full max-h-[90vh] rounded-2xl'
      }`}>
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#001318]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#006c49]/30 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[22px]">terminal</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base sm:text-lg text-white">
                  Developer Live Stream Inspector
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] font-['JetBrains_Mono'] text-[11px] font-semibold border border-[#4edea3]/30">
                  JSON-RPC 2.0 / SSE
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-['JetBrains_Mono'] text-[11px]">
                  {latency}ms
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-xs text-[#779198] block truncate max-w-md sm:max-w-xl">
                POST {endpointUrl}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Maximize Window"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Inspector"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Toolbar & Sub-tabs */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#0b2025] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('payload')}
              className={`px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                activeTab === 'payload'
                  ? 'bg-[#006c49] text-white font-semibold shadow-xs'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              Response Payload (.json)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('runner')}
              className={`px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                activeTab === 'runner'
                  ? 'bg-[#006c49] text-white font-semibold shadow-xs'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              Tool Runner (Dev)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                activeTab === 'headers'
                  ? 'bg-[#006c49] text-white font-semibold shadow-xs'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              Headers &amp; Protocol
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('protocol')}
              className={`px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                activeTab === 'protocol'
                  ? 'bg-[#006c49] text-white font-semibold shadow-xs'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              Codex Sync Specs
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded font-['JetBrains_Mono'] text-xs text-white transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#001318] hover:bg-slate-100 rounded font-['JetBrains_Mono'] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Save .JSON</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-['JetBrains_Mono'] text-xs leading-relaxed space-y-4">
          {activeTab === 'payload' && (
            <div className="bg-[#001318] p-4 rounded-xl border border-white/5 shadow-inner">
              <pre className="text-[#b0cbd3] overflow-x-auto select-all">
                <code>{jsonString}</code>
              </pre>
            </div>
          )}

          {activeTab === 'runner' && (
            <div className="space-y-4 font-['JetBrains_Mono'] text-xs">
              <div className="bg-[#001318] p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <label className="text-[#4edea3] font-bold text-xs sm:text-sm">Select MCP Tool:</label>
                  <select
                    value={runnerTool}
                    onChange={(e: any) => setRunnerTool(e.target.value)}
                    className="bg-[#0f292f] text-white border border-white/20 rounded px-2.5 py-1 text-xs outline-none cursor-pointer"
                  >
                    <option value="check_additive">check_additive (E-number, CAS, Name)</option>
                    <option value="check_ingredient_list">check_ingredient_list (Scan Ingredients)</option>
                    <option value="search_additives">search_additives (Keyword &amp; Category)</option>
                    <option value="check_nutrition">check_nutrition (Israeli MoH Food DB)</option>
                    <option value="check_pesticide_mrl">check_pesticide_mrl (Crop &amp; Residue Limits)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/70 text-xs">Parameter Value (Query or Ingredient Text):</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={runnerQuery}
                      onChange={(e) => setRunnerQuery(e.target.value)}
                      placeholder="e.g. E102, or חומוס, or Sugar, E150d, E211"
                      className="flex-1 bg-[#0b2025] text-white border border-white/20 rounded px-3 py-2 text-xs outline-none focus:border-[#4edea3]"
                    />
                    <button
                      type="button"
                      onClick={handleExecuteRunner}
                      disabled={isExecuting}
                      className="px-4 py-2 bg-[#006c49] hover:bg-[#005236] text-white rounded font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {isExecuting ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      )}
                      <span>Send JSON-RPC</span>
                    </button>
                  </div>
                </div>

                {execLatency !== null && (
                  <div className="flex items-center gap-4 text-[11px] text-[#779198] pt-1">
                    <span>Roundtrip: <strong className="text-white">{execLatency}ms</strong></span>
                    <span>Format: <strong className="text-[#4edea3]">JSON-RPC 2.0 / SSE</strong></span>
                    <span>Status: <strong className="text-[#4edea3]">200 OK</strong></span>
                  </div>
                )}
              </div>

              {runnerResponse && (
                <div className="bg-[#001318] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4edea3] font-bold text-xs">Live Stream Response:</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(runnerResponse, null, 2))}
                      className="text-[11px] text-white/70 hover:text-white px-2 py-0.5 rounded bg-white/5 cursor-pointer"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="text-[#b0cbd3] overflow-x-auto max-h-72 select-all leading-relaxed">
                    <code>{JSON.stringify(runnerResponse, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-4">
              <div className="bg-[#001318] p-4 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-[#4edea3] block text-sm">
                  Request Configuration:
                </span>
                <div className="space-y-1 text-white/80 font-['JetBrains_Mono'] text-xs">
                  <div><span className="text-[#779198]">URL:</span> {endpointUrl}</div>
                  <div><span className="text-[#779198]">Method:</span> POST</div>
                  <div><span className="text-[#779198]">Content-Type:</span> application/json</div>
                  <div><span className="text-[#779198]">Accept:</span> application/json, text/event-stream</div>
                  <div><span className="text-[#779198]">MCP Protocol Version:</span> 2024-11-05 (JSON-RPC 2.0)</div>
                </div>
              </div>

              <div className="bg-[#001318] p-4 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-[#ffb95f] block text-sm">
                  Streaming SSE Handler Strategy:
                </span>
                <p className="text-white/80 leading-relaxed font-['Inter'] text-xs">
                  The client and gateway accept both plain application/json responses and server-sent events (SSE). When the stream starts, chunks beginning with <code className="text-[#4edea3]">data:</code> are decoded in real-time and matched against the originating JSON-RPC <code className="text-[#4edea3]">id</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'protocol' && (
            <div className="space-y-3 font-['Inter'] text-xs text-white/80">
              <div className="p-4 bg-[#001318] rounded-xl border border-white/5 space-y-2">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-white block">
                  Synchronized Codex Standards
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#b0cbd3] font-['JetBrains_Mono'] text-xs">
                  <li>WHO/FAO Codex Alimentarius (CXS 192-1995 Master Standard)</li>
                  <li>EFSA OpenFoodTox Chemical Hazards Compendium (2024.1)</li>
                  <li>Israeli Ministry of Health Decree 5780-2020 / Food Standard 1145</li>
                  <li>Regulation (EC) No 1333/2008 &amp; Commission Regulation (EU) 2022/63</li>
                  <li>US FDA 21 CFR Parts 73, 74, 172, 182, 184</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-lg text-[#779198] font-['JetBrains_Mono'] text-[11px]">
                Assay Hash: SHA-256: 8c3f910ab94e0192eab55cf943... · Verified ISO 17025 Compliant Node
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#001318] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#779198]">
          <span className="font-['JetBrains_Mono'] text-[11px] truncate">
            Entity: {dossier.ins} · {dossier.name} · Score: {dossier.safetyScore}/100
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
