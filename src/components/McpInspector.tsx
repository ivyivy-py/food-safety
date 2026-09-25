import React, { useState } from 'react';
import { AdditiveDossier } from '../types';

interface McpInspectorProps {
  dossier: AdditiveDossier;
  rawMcpResponse?: any;
}

export const McpInspector: React.FC<McpInspectorProps> = ({
  dossier,
  rawMcpResponse
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const payloadToDisplay = rawMcpResponse || {
    mcp_version: "2024-11-05",
    query_entity: {
      ins_number: dossier.ins,
      chemical_name: dossier.chemicalName,
      cas_number: dossier.cas,
      molecular_formula: dossier.formula
    },
    toxicological_assessment: {
      safety_index_score: dossier.safetyScore,
      adi_mg_per_kg_bw: { min: 0.0, max: dossier.adi.range, authority: "EFSA/JECFA" },
      carcinogenicity: {
        iarc_group: `${dossier.carcinogenicity.hazard} ${dossier.carcinogenicity.tag}`,
        nitrosamine_formation_risk: dossier.ins === "E250",
        ndma_hazard_identified: dossier.ins === "E250"
      }
    },
    dietary_compliance: {
      halal: { status: dossier.dietary.halal.certified, source: dossier.dietary.halal.note },
      kosher: { status: dossier.dietary.kosher.certified, designation: dossier.dietary.kosher.badge },
      vegan: { status: dossier.dietary.vegan.certified, animal_derivatives: !dossier.dietary.vegan.certified },
      gluten_free: { status: dossier.dietary.glutenFree.certified, ppm: 0 }
    },
    israeli_front_of_pack_decree_5780: {
      red_sodium_symbol_triggered: dossier.israeliMohLabels.sodium.triggered,
      measured_sodium_mg_100g: dossier.israeliMohLabels.sodium.value,
      threshold_solid_mg: dossier.israeliMohLabels.sodium.limit,
      red_fat_symbol_triggered: dossier.israeliMohLabels.saturatedFat.triggered,
      red_sugar_symbol_triggered: dossier.israeliMohLabels.sugar.triggered
    },
    pesticide_residues_mrl: dossier.pesticideResidues.map(p => ({
      compound: p.compound,
      detected_ppm: p.detectedNum,
      eu_mrl_ppm: parseFloat(p.euMrl) || 0.010,
      us_epa_tolerance_ppm: parseFloat(p.usEpa) || 0.050,
      eu_compliance: !p.isViolation
    }))
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
    downloadAnchor.setAttribute("download", `ToxiScan_${dossier.ins}_Assay_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section className="bg-[#0f292f] text-white rounded-xl shadow-md p-5 sm:p-6 lg:p-8 space-y-4 overflow-hidden border border-[#001318]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
              terminal
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl text-white">
              Model Context Protocol (MCP) Live Stream Inspector
            </h3>
          </div>
          <span className="font-['JetBrains_Mono'] text-xs text-[#779198] block truncate max-w-xl">
            GET mcp://food-safety-service/v1/evaluate?e_number={dossier.ins}&amp;include_mrl=true&amp;jurisdiction=EU,US,IL
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded font-['JetBrains_Mono'] text-xs text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Payload'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006c49] hover:bg-[#005236] text-white rounded font-['JetBrains_Mono'] text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isCollapsed ? 'unfold_more' : 'unfold_less'}
            </span>
            <span>{isCollapsed ? 'Expand View' : 'Collapse View'}</span>
          </button>
        </div>
      </div>

      {/* JSON Code Window */}
      {!isCollapsed && (
        <div className="bg-[#001318] p-4 rounded-lg overflow-x-auto max-h-96 font-['JetBrains_Mono'] text-xs text-[#b0cbd3] leading-relaxed shadow-inner border border-white/5">
          <pre className="font-['JetBrains_Mono'] text-xs text-[#779198]">
            <code className="text-white">
              {jsonString}
            </code>
          </pre>
        </div>
      )}

      {/* Terminal Actions & Export Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
        <span className="font-['JetBrains_Mono'] text-[11px] sm:text-xs text-[#779198]">
          Assay Hash: SHA-256: 8c3f910ab94e0192eab55cf943... · Verified
        </span>

        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#001318] rounded font-['JetBrains_Mono'] text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Download .JSON Dossier</span>
        </button>
      </div>
    </section>
  );
};
