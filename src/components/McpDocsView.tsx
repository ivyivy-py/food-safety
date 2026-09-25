import React, { useState } from 'react';
import { callMcp, MCP_ENDPOINT_CONFIG } from '../services/mcpClient';

export const McpDocsView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('check_additive');
  const [testPayload, setTestPayload] = useState<string>(
    JSON.stringify({ query: "E171" }, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const toolsDocs = [
    {
      name: "check_additive",
      description: "Look up a food additive by name, E-number, or CAS number. Returns safety score, ADI, JECFA/EFSA evidence, EU/US/Israel regulatory status, health concerns, allergens, and vegan/halal/kosher compatibility.",
      sampleQuery: { query: "E171" },
      exampleResponse: `query: "E171"
→ Titanium Dioxide; Safety: 3/10 (high concern); ADI: not established (EFSA 2021 withdrawal);
EU: banned as food additive (2022); US: permitted ≤1%; Concerns: genotoxicity (nano)`
    },
    {
      name: "check_ingredient_list",
      description: "Scan a packaged-food ingredient list for additive safety and regulatory flags. Returns matched additives, high-risk scores, banned-country notes, allergen warnings, dietary compatibility issues, and an overall food safety assessment.",
      sampleQuery: { ingredients: "Sugar, E150d, E621, Citric Acid, E211" },
      exampleResponse: `ingredients: "Sugar, E150d, E621, Citric Acid, E211"
→ Risk: MODERATE — E211 (sodium benzoate) flagged for benzene formation with ascorbic acid;
E621 (MSG) sensitivity concern; E150d (caramel IV) has 4-MEI limit`
    },
    {
      name: "search_additives",
      description: "Search food additives by keyword, category, function, dietary status, or health concern. Use for finding preservatives, colorants, sweeteners, allergens, banned additives, or high-risk E-numbers.",
      sampleQuery: { query: "banned preservative" },
      exampleResponse: `query: "banned preservative" → matches BHA (E320), potassium bromate, etc.`
    },
    {
      name: "check_nutrition",
      description: "Look up Israeli Ministry of Health nutrition data for a food item in Hebrew or English. Returns per-100g calories, macronutrients, vitamins, minerals, fatty acids, cholesterol, sugars, and fiber.",
      sampleQuery: { query: "חומוס" },
      exampleResponse: `query: "חומוס" → Calories: 166kcal, Protein: 8.0g, Fat: 9.6g, Carbs: 14.3g, Fiber: 6.0g`
    },
    {
      name: "check_pesticide_mrl",
      description: "Check Israeli pesticide maximum residue limits (MRLs) by pesticide, crop, or combined query. Returns active substance, crop, official MRL value in mg/kg, update date, and pending-change notes.",
      sampleQuery: { query: "glyphosate wheat" },
      exampleResponse: `query: "glyphosate wheat" → MRL: 10.0 mg/kg; Status: active; Updated: 2023`
    }
  ];

  const handleSelectTool = (toolName: string) => {
    setActiveTool(toolName);
    const doc = toolsDocs.find(t => t.name === toolName);
    if (doc) {
      setTestPayload(JSON.stringify(doc.sampleQuery, null, 2));
    }
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setResponseOutput(null);
    try {
      const parsedArgs = JSON.parse(testPayload);
      const res = await callMcp(activeTool, parsedArgs);
      setResponseOutput(JSON.stringify(res.rawPayload, null, 2));
    } catch (err: any) {
      setResponseOutput(JSON.stringify({ error: err.message || "Failed to execute call" }, null, 2));
    } finally {
      setIsRunning(false);
    }
  };

  const currentToolDoc = toolsDocs.find(t => t.name === activeTool)!;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006c49] text-[24px]">
            integration_instructions
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl sm:text-2xl text-[#001318]">
            Model Context Protocol (MCP) JSON-RPC 2.0 API Docs
          </h2>
        </div>
        <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
          The NutriSafe Bio-Portal connects to the remote MCP server via HTTP POST JSON-RPC 2.0 and supports both standard JSON responses and streaming Server-Sent Events (SSE).
        </p>

        {/* Protocol Spec Box */}
        <div className="p-4 bg-[#eff4ff] border border-[#e5eeff] rounded-xl space-y-2 font-['JetBrains_Mono'] text-xs">
          <div className="flex items-center gap-2 text-[#001318]">
            <span className="font-bold">Primary Endpoint:</span>
            <span className="text-[#006c49] select-all font-semibold">{MCP_ENDPOINT_CONFIG}</span>
          </div>
          <div className="flex items-center gap-2 text-[#42484a]">
            <span className="font-bold">Method:</span>
            <span>POST</span>
            <span className="text-[#c2c7c9]">|</span>
            <span className="font-bold">Content-Type:</span>
            <span>application/json</span>
            <span className="text-[#c2c7c9]">|</span>
            <span className="font-bold">Accept:</span>
            <span>application/json, text/event-stream</span>
          </div>
          <p className="font-['Inter'] text-xs text-[#42484a] pt-1">
            SSE replies stream lines starting with <code className="bg-white px-1 py-0.5 rounded text-[#001318]">data:</code>, and the client parses the JSON object whose <code className="bg-white px-1 py-0.5 rounded text-[#001318]">id</code> matches the request.
          </p>
        </div>
      </div>

      {/* Interactive Tool Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tools List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-4 sm:p-5 space-y-2">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] block px-2 pb-1">
            Registered MCP Tools
          </span>
          <div className="space-y-1">
            {toolsDocs.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => handleSelectTool(t.name)}
                className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer font-['JetBrains_Mono'] text-xs flex flex-col gap-1 ${
                  activeTool === t.name
                    ? 'bg-[#0f292f] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#001318] hover:bg-[#e5eeff]'
                }`}
              >
                <span className="font-semibold">{t.name}</span>
                <span className={`font-['Inter'] text-[11px] line-clamp-1 ${
                  activeTool === t.name ? 'text-[#779198]' : 'text-[#72787a]'
                }`}>
                  {t.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Console & Tester (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg text-[#001318]">
              Tool: {currentToolDoc.name}
            </h3>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a]">
              {currentToolDoc.description}
            </p>
          </div>

          {/* Sample Query & Input */}
          <div className="space-y-2">
            <label className="font-['Inter'] text-xs font-semibold text-[#001318] block">
              Arguments Payload (JSON):
            </label>
            <textarea
              rows={4}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full p-3 bg-[#001318] text-[#4edea3] font-['JetBrains_Mono'] text-xs rounded-lg border border-[#0f292f] focus:outline-none focus:ring-2 focus:ring-[#006c49]"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="font-['Inter'] text-xs text-[#72787a]">
              Dispatches via Model Context Protocol JSON-RPC 2.0
            </span>

            <button
              type="button"
              onClick={handleExecute}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#006c49] text-white font-['Plus_Jakarta_Sans'] font-semibold text-xs sm:text-sm rounded-lg hover:bg-[#005236] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRunning ? 'animate-spin' : ''}`}>
                {isRunning ? 'refresh' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Executing MCP...' : 'Send Live Request'}</span>
            </button>
          </div>

          {/* Expected Response Specification */}
          <div className="p-3 bg-[#eff4ff] border border-[#e5eeff] rounded-lg space-y-1 font-['JetBrains_Mono'] text-xs">
            <span className="font-bold text-[#001318] block">Codex Specification Example:</span>
            <pre className="text-[#42484a] whitespace-pre-wrap font-['JetBrains_Mono'] text-[11px]">
              {currentToolDoc.exampleResponse}
            </pre>
          </div>

          {/* Response Inspector */}
          {responseOutput && (
            <div className="space-y-2 pt-2 border-t border-[#e2e8f0]">
              <span className="font-['Inter'] text-xs font-semibold text-[#001318] block">
                Live Server-Sent JSON-RPC Response:
              </span>
              <div className="bg-[#001318] p-4 rounded-lg overflow-x-auto max-h-72 font-['JetBrains_Mono'] text-xs text-[#b0cbd3]">
                <pre>{responseOutput}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
