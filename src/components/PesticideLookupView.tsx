import React, { useState } from 'react';
import { PESTICIDES_DATABASE } from '../../api/mcp-engine.js';
import { PesticideMrlItem } from '../types';
import { callMcp } from '../services/mcpClient';

export const PesticideLookupView: React.FC = () => {
  const [query, setQuery] = useState('glyphosate wheat');
  const [selectedPesticide, setSelectedPesticide] = useState<PesticideMrlItem>(PESTICIDES_DATABASE[1]);
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    { label: "Glyphosate in Wheat", q: "glyphosate wheat" },
    { label: "Chlorpyrifos in Citrus", q: "chlorpyrifos citrus" },
    { label: "Deltamethrin in Tomatoes", q: "deltamethrin tomato" },
    { label: "Imidacloprid in Apples", q: "imidacloprid apples" },
    { label: "Boscalid in Strawberries", q: "boscalid strawberries" }
  ];

  const handleSearch = async (queryString: string) => {
    setIsLoading(true);
    try {
      const response = await callMcp<PesticideMrlItem>('check_pesticide_mrl', { query: queryString });
      if (response.data) {
        setSelectedPesticide(response.data);
      }
    } catch (_) {
      const q = queryString.toLowerCase();
      const match = PESTICIDES_DATABASE.find(p =>
        q.includes(p.compound.toLowerCase()) ||
        p.crops.some(c => q.includes(c.toLowerCase()))
      );
      if (match) setSelectedPesticide(match);
    } finally {
      setIsLoading(false);
    }
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
              Israeli Plant Protection &amp; Pesticide MRL Registry
            </h2>
          </div>
          <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
            Query Maximum Residue Limits (MRLs) established by the Israeli Ministry of Agriculture Plant Protection and Inspection Services (PPIS) and Ministry of Health, harmonized against EU Commission regulations and US EPA tolerances.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787a] text-[20px]">
              science
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter active substance and crop (e.g. glyphosate wheat, chlorpyrifos apples)..."
              className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border border-[#e5eeff] rounded-xl font-['Inter'] text-sm sm:text-base text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0f292f] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch(query)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0f292f] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm rounded-xl hover:bg-[#001318] transition-colors cursor-pointer shrink-0 disabled:opacity-70"
          >
            {isLoading ? 'Checking Limits...' : 'Query MRL Database'}
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] mr-1">
            Quick Queries:
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

      {/* Selected Pesticide Detail */}
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

        {/* Catalog of all surveyed pesticides */}
        <div className="space-y-3 pt-3">
          <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#001318]">
            All Synchronized Active Agricultural Residues
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PESTICIDES_DATABASE.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPesticide(item)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPesticide.compound === item.compound
                    ? 'border-[#006c49] bg-[#eff4ff]'
                    : 'border-[#e2e8f0] bg-white hover:border-[#c2c7c9]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318]">
                    {item.compound}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.isViolation ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6cf8bb] text-[#00714d]'
                  }`}>
                    {item.isViolation ? 'Violation' : 'Compliant'}
                  </span>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#42484a] block mt-1">
                  IL MRL: {item.israelMrl}
                </span>
                <span className="font-['Inter'] text-[11px] text-[#72787a] block truncate">
                  Crops: {item.crops.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
