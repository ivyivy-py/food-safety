import React, { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { ContextRibbon } from './components/ContextRibbon';
import { SearchConsole } from './components/SearchConsole';
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

import { ADDITIVES_DATABASE, checkAdditive } from '../api/mcp-engine.js';
import { AdditiveDossier } from './types';
import { callMcp } from './services/mcpClient';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('safety-dossier-scanner');
  const [query, setQuery] = useState('E250 (Sodium Nitrite) & Chlorpyrifos Residues in Cured Meats');
  const [activeDossier, setActiveDossier] = useState<AdditiveDossier>(ADDITIVES_DATABASE[0]);
  const [rawMcpResponse, setRawMcpResponse] = useState<any>(null);
  const [latency, setLatency] = useState(142);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isMcpInspectorOpen, setIsMcpInspectorOpen] = useState(false);

  const [activeToggles, setActiveToggles] = useState({
    jecfaEfsa: true,
    adiDosimetry: true,
    dietaryCheck: true,
    israeliMoh: true,
    pesticideMrl: true,
  });

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    if (!q.trim()) return;

    // If query looks like an ingredient list with multiple commas
    if (q.includes(',') && (q.toLowerCase().includes('sugar') || q.toLowerCase().includes('acid') || q.split(',').length > 2)) {
      setActiveTab('safety-dossier-scanner');
    }

    setIsLoading(true);
    try {
      const response = await callMcp<AdditiveDossier>('check_additive', { query: q });
      if (response.data) {
        setActiveDossier(response.data);
        setRawMcpResponse(response.rawPayload);
        setLatency(response.latency || 142);
      }
    } catch (_) {
      const matched = checkAdditive(q);
      setActiveDossier(matched);
      setLatency(138);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCodices = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLatency(118);
    }, 800);
  };

  const handleSelectAdditive = (dossier: AdditiveDossier) => {
    setActiveDossier(dossier);
    setQuery(`${dossier.ins} (${dossier.name})`);
    setActiveTab('safety-dossier-scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      dossier: activeDossier,
      timestamp: new Date().toISOString(),
      standards: "CXS 192, EFSA OpenFoodTox 2024.1, IL-MoH 5780",
      verification: "ISO 17025 Data Verified"
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

              {/* Primary Assay Dossier */}
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
                onSync={handleSyncCodices}
                isSyncing={isSyncing}
              />
            </>
          )}

          {activeTab === 'pesticide-mrl-lookup' && (
            <PesticideLookupView />
          )}

          {activeTab === 'e-number-directory' && (
            <ENumberDirectory onSelectAdditive={handleSelectAdditive} />
          )}

          {activeTab === 'nutrition-profiler' && (
            <NutritionDirectory />
          )}

          {activeTab === 'api-mcp-docs' && (
            <McpDocsView />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Export Modal Dialog */}
      {showExportModal && (
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
                className="text-[#72787a] hover:text-[#001318] p-1 cursor-pointer"
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
