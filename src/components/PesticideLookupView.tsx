import React, { useState, useEffect } from 'react';
import { PesticideMrlItem } from '../types';
import { callMcp, describeMcpError } from '../services/mcpClient';

interface PesticideLookupViewProps {
  initialQuery?: string;
}

export const PesticideLookupView: React.FC<PesticideLookupViewProps> = ({
  initialQuery = 'Glyphosate'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedPesticide, setSelectedPesticide] = useState<PesticideMrlItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = [
    { label: "Glyphosate", q: "Glyphosate" },
    { label: "Chlorpyrifos", q: "Chlorpyrifos" },
    { label: "Deltamethrin", q: "Deltamethrin" },
    { label: "Imidacloprid", q: "Imidacloprid" },
    { label: "Boscalid", q: "Boscalid" }
  ];

  const handleSearch = async (queryString: string) => {
    if (!queryString.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await callMcp<PesticideMrlItem>('check_pesticide_mrl', {
        query: queryString.trim()
      });
      if (response.data) {
        setSelectedPesticide(response.data);
      } else {
        setSelectedPesticide(null);
        setErrorMessage(`No matching pesticide record found in demo dataset (5 pesticides) for "${queryString}".`);
      }
    } catch (err) {
      setSelectedPesticide(null);
      setErrorMessage(describeMcpError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(initialQuery || 'Glyphosate');
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[24px]">
              pest_control
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl sm:text-2xl text-[#001318]">
              Plant Protection &amp; Pesticide MRL Registry (5 Demo Compounds)
            </h2>
          </div>
          <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
            Query Maximum Residue Limits (MRLs) established by the Israeli Ministry of Agriculture Plant Protection and Inspection Services (PPIS) and Ministry of Health, harmonized against EU Commission regulations and US EPA tolerances.
          </p>
          <p className="font-['Inter'] text-xs text-[#72787a]">
            Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787a] text-[20px]">
              science
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter active substance (e.g. Glyphosate, Chlorpyrifos, Boscalid, Deltamethrin, Imidacloprid)..."
              className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border border-[#e5eeff] rounded-xl font-['Inter'] text-sm sm:text-base text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0f292f] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0f292f] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm rounded-xl hover:bg-[#001318] transition-colors cursor-pointer shrink-0 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Querying MCP...</span>
              </>
            ) : (
              'Query MRL Database'
            )}
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] mr-1">
            Demo Substances:
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(preset.q);
                handleSearch(preset.q);
              }}
              className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['JetBrains_Mono'] text-xs border border-[#e5eeff] transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-12 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#006c49]/20 border-t-[#006c49] rounded-full animate-spin mx-auto"></div>
          <p className="font-['JetBrains_Mono'] text-sm text-[#42484a]">
            Retrieving agrochemical tolerances from local MCP server (/api/mcp)...
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

      {/* Selected Pesticide Detail */}
      {!isLoading && !errorMessage && selectedPesticide && (
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl sm:text-2xl text-[#001318]">
                  {selectedPesticide.compound}
                </h3>
                <span className="px-2.5 py-0.5 bg-[#eff4ff] text-[#42484a] font-['JetBrains_Mono'] text-xs rounded border border-[#e5eeff]">
                  CAS #{selectedPesticide.cas}
                </span>
                <span className="px-2.5 py-0.5 bg-[#e5eeff] text-[#001318] font-['Inter'] text-xs font-semibold rounded">
                  {selectedPesticide.group}
                </span>
              </div>
              <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a]">
                Regulated Agricultural Commodity Crops: {selectedPesticide.crops.join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-bold uppercase ${
                selectedPesticide.isViolation ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6cf8bb] text-[#00714d]'
              }`}>
                {selectedPesticide.verdict}
              </span>
            </div>
          </div>

          {/* 3 Jurisdictional MRL Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Israel MoH */}
            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#e5eeff] space-y-2">
              <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] block">
                1. Israel MoH / PPIS MRL
              </span>
              <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#001318] block">
                {selectedPesticide.israelMrl}
              </span>
              <span className="font-['Inter'] text-xs text-[#42484a] block">
                Status: {selectedPesticide.status} (Updated {selectedPesticide.updated})
              </span>
            </div>

            {/* EU MRL */}
            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#e5eeff] space-y-2">
              <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] block">
                2. European Union (EFSA)
              </span>
              <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#001318] block">
                {selectedPesticide.euMrl}
              </span>
              <span className="font-['Inter'] text-xs text-[#42484a] block">
                Regulation: SCoPAFF Phytosanitary Limits
              </span>
            </div>

            {/* US EPA */}
            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#e5eeff] space-y-2">
              <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] block">
                3. United States (EPA)
              </span>
              <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#001318] block">
                {selectedPesticide.usEpa}
              </span>
              <span className="font-['Inter'] text-xs text-[#42484a] block">
                Tolerance: 40 CFR Part 180 Raw Crops
              </span>
            </div>
          </div>

          {/* Regulatory Divergence Notice */}
          <div className="p-4 bg-white rounded-xl border border-[#e2e8f0] space-y-2 font-['Inter'] text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold text-[#001318]">
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">balance</span>
              <span>Jurisdictional Harmonization Analysis:</span>
            </div>
            <p className="text-[#42484a] leading-relaxed">
              {selectedPesticide.divergenceNotice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
