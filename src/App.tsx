import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { ContextRibbon } from './components/ContextRibbon';
import { SearchConsole, isIngredientListQuery } from './components/SearchConsole';
import { PrimaryDossier } from './components/PrimaryDossier';
import { DietaryAndMohLabels } from './components/DietaryAndMohLabels';
import { PesticideMrlSection } from './components/PesticideMrlSection';
import { RegulatoryDossier } from './components/RegulatoryDossier';
import { McpInspectorModal } from './components/McpInspectorModal';
import { IngredientScannerView } from './components/IngredientScannerView';
import { PesticideLookupView } from './components/PesticideLookupView';
import { ENumberDirectory } from './components/ENumberDirectory';
import { NutritionDirectory } from './components/NutritionDirectory';
import { McpDocsView } from './components/McpDocsView';
import { Footer } from './components/Footer';

import { AdditiveDossier } from './types';
import { callMcp, describeMcpError } from './services/mcpClient';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('safety-dossier-scanner');
  const [query, setQuery] = useState('E250');
  const [activeDossier, setActiveDossier] = useState<AdditiveDossier | null>(null);
  const [rawMcpResponse, setRawMcpResponse] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isMcpInspectorOpen, setIsMcpInspectorOpen] = useState(false);

  // Tab query coordination
  const [pesticideQuery, setPesticideQuery] = useState('Glyphosate');
  const [nutritionQuery, setNutritionQuery] = useState('חומוס מוכן למריחה');
  const [ingredientScannerText, setIngredientScannerText] = useState(
    'Sugar, E150d, E621, Citric Acid, E211, Ascorbic Acid'
  );

  const [activeToggles, setActiveToggles] = useState({
    jecfaEfsa: true,
    adiDosimetry: true,
    dietaryCheck: true,
    israeliMoh: true,
    pesticideMrl: true,
  });

  const handleSearch = async (overrideQuery?: string, targetTab?: NavTab) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    if (!q.trim()) return;

    if (targetTab) {
      if (targetTab === 'ingredient-scanner') {
        setIngredientScannerText(q);
        setActiveTab('ingredient-scanner');
        return;
      }
      if (targetTab === 'pesticide-mrl-lookup') {
        setPesticideQuery(q);
        setActiveTab('pesticide-mrl-lookup');
        return;
      }
      if (targetTab === 'nutrition-profiler') {
        setNutritionQuery(q);
        setActiveTab('nutrition-profiler');
        return;
      }
      setActiveTab(targetTab);
    }

    // Check if query is an ingredient list with two or more ", " separators
    if (isIngredientListQuery(q)) {
      setIngredientScannerText(q);
      setActiveTab('ingredient-scanner');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await callMcp<AdditiveDossier>('check_additive', { query: q.trim() });
      if (response.data) {
        setActiveDossier(response.data);
        setRawMcpResponse(response.rawPayload);
        setLatency(response.latency);
      } else {
        setActiveDossier(null);
        setErrorMessage(`No matching additive found in demo dataset (25 additives) for "${q}".`);
      }
    } catch (err) {
      setActiveDossier(null);
      setErrorMessage(describeMcpError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('E250');
  }, []);

  const handleRefreshFromMcp = () => {
    setIsSyncing(true);
    handleSearch(query || 'E250').finally(() => {
      setIsSyncing(false);
    });
  };

  const handleSelectAdditive = (dossier: AdditiveDossier) => {
    setActiveDossier(dossier);
    setQuery(dossier.ins);
    setActiveTab('safety-dossier-scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportJson = () => {
    if (!activeDossier) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      dossier: activeDossier,
      timestamp: new Date().toISOString(),
      standards: "CXS 192, EFSA OpenFoodTox 2024.1, IL-MoH 5780",
      dataset: "Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources."
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ToxiScan_${activeDossier.ins}_Clinical_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportModal(false);
  };

  const handleExportPrint = () => {
    setShowExportModal(false);
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Inter']">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={() => setShowExportModal(true)}
        onOpenMcpInspector={() => setIsMcpInspectorOpen(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-16 flex-1 flex flex-col">
        {/* Top Context & Protocol Ribbon */}
        <ContextRibbon latency={latency} />

        {/* Content Body */}
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
          {activeTab === 'safety-dossier-scanner' && (
            <>
              {/* Search Console */}
              <SearchConsole
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
                activeToggles={activeToggles}
                setToggles={setActiveToggles}
                onOpenMcpInspector={() => setIsMcpInspectorOpen(true)}
              />

              {/* Loading State */}
              {isLoading && !activeDossier && (
                <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-12 text-center space-y-4">
                  <div className="w-10 h-10 border-3 border-[#006c49]/20 border-t-[#006c49] rounded-full animate-spin mx-auto"></div>
                  <p className="font-['JetBrains_Mono'] text-sm text-[#42484a]">
                    Loading additive toxicological dossier from local MCP server (/api/mcp)...
                  </p>
                </div>
              )}

              {/* Error / No Match State */}
              {!isLoading && errorMessage && (
                <div className="bg-white rounded-xl shadow-xs border border-[#ba1a1a]/30 p-8 text-center space-y-2">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[36px]">error</span>
                  <p className="font-['Inter'] font-semibold text-[#ba1a1a] text-base">{errorMessage}</p>
                  <p className="font-['Inter'] text-xs text-[#72787a]">
                    Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
                  </p>
                </div>
              )}

              {/* Primary Assay Dossier */}
              {activeDossier && (
                <>
                  <PrimaryDossier
                    dossier={activeDossier}
                    onOpenMcpInspector={() => setIsMcpInspectorOpen(true)}
                  />

                  {/* Dietary & Israeli MoH Warning Labels System */}
                  <DietaryAndMohLabels dossier={activeDossier} />

                  {/* Pesticide Residue & MRL Harmonization Screen */}
                  {activeToggles.pesticideMrl && (
                    <PesticideMrlSection dossier={activeDossier} />
                  )}

                  {/* Cross-Jurisdictional Regulatory Agency Dossier */}
                  <RegulatoryDossier
                    dossier={activeDossier}
                    onSync={handleRefreshFromMcp}
                    isSyncing={isSyncing}
                  />
                </>
              )}
            </>
          )}

          {activeTab === 'ingredient-scanner' && (
            <IngredientScannerView
              initialText={ingredientScannerText}
              onSelectAdditive={handleSelectAdditive}
            />
          )}

          {activeTab === 'pesticide-mrl-lookup' && (
            <PesticideLookupView initialQuery={pesticideQuery} />
          )}

          {activeTab === 'e-number-directory' && (
            <ENumberDirectory onSelectAdditive={handleSelectAdditive} />
          )}

          {activeTab === 'nutrition-profiler' && (
            <NutritionDirectory initialQuery={nutritionQuery} />
          )}

          {activeTab === 'api-mcp-docs' && (
            <McpDocsView />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Export Modal Dialog */}
      {showExportModal && activeDossier && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8f0] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c49] text-[24px]">download</span>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#001318]">
                  Export Toxicology Assay Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-[#72787a] hover:text-[#0b1c30] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a] leading-relaxed">
              Generate an official analytical bio-safety report for <strong>{activeDossier.ins} ({activeDossier.chemicalName})</strong> including ADI limits, Israeli MoH front-of-package red label evaluation, and pesticide MRL matrix.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#e2e8f0] hover:border-[#006c49] bg-[#eff4ff] hover:bg-[#dce9ff] transition-all cursor-pointer group text-left"
              >
                <div className="space-y-0.5">
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318] block">
                    Download Raw .JSON Dossier
                  </span>
                  <span className="font-['Inter'] text-xs text-[#42484a]">
                    Structured JSON-RPC 2.0 object for LIMS integration
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#006c49] text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                type="button"
                onClick={handleExportPrint}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#e2e8f0] hover:border-[#006c49] bg-white hover:bg-slate-50 transition-all cursor-pointer group text-left"
              >
                <div className="space-y-0.5">
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318] block">
                    Print / Save as PDF Monograph
                  </span>
                  <span className="font-['Inter'] text-xs text-[#42484a]">
                    Formatted laboratory report optimized for clinical review
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#006c49] text-[20px] group-hover:translate-x-1 transition-transform">
                  print
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Context Protocol (MCP) Live Stream Inspector Pop-Up Window */}
      <McpInspectorModal
        isOpen={isMcpInspectorOpen}
        onClose={() => setIsMcpInspectorOpen(false)}
        dossier={activeDossier}
        rawMcpResponse={rawMcpResponse}
        latency={latency}
      />

      {/* Floating Developer Tools Launcher */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsMcpInspectorOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2.5 bg-[#001318] text-white rounded-full shadow-2xl hover:bg-[#0f292f] border border-[#00e698]/40 hover:border-[#00e698] transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Open Developer Model Context Protocol (MCP) Live Stream Inspector"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e698] inline-block animate-ping shrink-0" />
          <span className="material-symbols-outlined text-[18px] text-[#4edea3]">terminal</span>
          <span className="font-['JetBrains_Mono'] text-xs font-semibold tracking-wide">MCP Inspector</span>
          <span className="bg-[#006c49] text-[10px] font-mono px-1.5 py-0.5 rounded text-white font-bold">DEV</span>
        </button>
      </div>
    </div>
  );
}
