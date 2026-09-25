import React, { useState, useEffect } from 'react';
import { IngredientScanResult, AdditiveDossier } from '../types';
import { callMcp, describeMcpError } from '../services/mcpClient';

interface IngredientScannerViewProps {
  initialText?: string;
  onSelectAdditive: (dossier: AdditiveDossier) => void;
}

export const IngredientScannerView: React.FC<IngredientScannerViewProps> = ({
  initialText = "Sugar, E150d, E621, Citric Acid, E211, Ascorbic Acid",
  onSelectAdditive
}) => {
  const [ingredientsText, setIngredientsText] = useState(initialText);
  const [scanResult, setScanResult] = useState<IngredientScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = [
    {
      name: "Cola Soft Drink Formulation",
      text: "Carbonated Water, Sugar, E150d (Caramel IV), Phosphoric Acid, Natural Flavors, Caffeine, E211, Citric Acid, E300"
    },
    {
      name: "Cured Deli Meat Matrix",
      text: "Beef, Water, Salt, E250 (Sodium Nitrite), Sodium Erythorbate, Spices, Dextrose, Sodium Phosphate"
    },
    {
      name: "Instant Savory Noodle Broth",
      text: "Wheat Flour, Palm Oil, Salt, E621 (MSG), Sugar, Soy Sauce Powder, E102 (Tartrazine), Disodium Inosinate, E320 (BHA)"
    },
    {
      name: "Confectionery Glaze & Candy",
      text: "Sugar, Corn Syrup, E171 (Titanium Dioxide), Artificial Flavors, E129 (Allura Red), E102, Carnauba Wax"
    }
  ];

  const handleScan = async (textToScan?: string) => {
    const text = textToScan !== undefined ? textToScan : ingredientsText;
    if (!text.trim()) return;
    setIsScanning(true);
    setErrorMessage(null);
    try {
      const response = await callMcp<IngredientScanResult>('check_ingredient_list', { ingredients: text.trim() });
      if (response.data) {
        setScanResult(response.data);
      }
    } catch (err) {
      setScanResult(null);
      setErrorMessage(describeMcpError(err));
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    setIngredientsText(initialText);
    handleScan(initialText);
  }, [initialText]);

  const getRiskBadge = (risk: string) => {
    if (risk.includes("HIGH") || risk.includes("BANNED")) {
      return { bg: "bg-[#ffdad6]", text: "text-[#ba1a1a]", label: "HIGH RISK / BANNED" };
    }
    if (risk.includes("MODERATE")) {
      return { bg: "bg-[#ffddb8]", text: "text-[#653e00]", label: "MODERATE CONCERN" };
    }
    return { bg: "bg-[#6cf8bb]", text: "text-[#00714d]", label: "LOW RISK / SAFE" };
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006c49] text-[24px]">
            document_scanner
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl sm:text-2xl text-[#001318]">
            Packaged-Food Ingredient List Scanner
          </h2>
        </div>
        <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
          Scan complete packaged-food ingredient declarations for monitored additives, synergistic chemical hazards (such as benzene or nitrosamine formation), banned multi-jurisdictional substances, and allergen warnings via the Model Context Protocol.
        </p>
        <p className="font-['Inter'] text-xs text-[#72787a]">
          Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
        </p>

        {/* Input Text Area */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <textarea
              rows={4}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Paste ingredient statement here (e.g. Sugar, E150d, E621, Citric Acid, E211, Ascorbic Acid)..."
              className="w-full p-4 bg-[#eff4ff] border border-[#e5eeff] rounded-xl font-['Inter'] text-sm sm:text-base text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0f292f] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] mr-1">
                Sample Formulations:
              </span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIngredientsText(preset.text);
                    handleScan(preset.text);
                  }}
                  className="px-2.5 py-1 rounded bg-white hover:bg-[#dce9ff] text-[#0b1c30] font-['JetBrains_Mono'] text-xs border border-[#e2e8f0] shadow-2xs transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleScan()}
              disabled={isScanning}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0f292f] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm rounded-lg hover:bg-[#001318] transition-all cursor-pointer shadow-xs disabled:opacity-70"
            >
              {isScanning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Scanning Matrix...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">search_check</span>
                  <span>Execute Bio-Safety Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Card */}
      {isScanning && (
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-12 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#006c49]/20 border-t-[#006c49] rounded-full animate-spin mx-auto"></div>
          <p className="font-['JetBrains_Mono'] text-sm text-[#42484a]">
            Executing formulation toxicology scan via local MCP server (/api/mcp)...
          </p>
        </div>
      )}

      {/* Error state */}
      {!isScanning && errorMessage && (
        <div className="bg-white rounded-xl shadow-xs border border-[#ba1a1a]/30 p-8 text-center space-y-2">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[36px]">error</span>
          <p className="font-['Inter'] font-semibold text-[#ba1a1a] text-base">{errorMessage}</p>
          <p className="font-['Inter'] text-xs text-[#72787a]">
            Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
          </p>
        </div>
      )}

      {/* Scan Results Card */}
      {!isScanning && !errorMessage && scanResult && (
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl text-[#001318]">
                  Formulation Toxicology Assessment
                </h3>
                {(() => {
                  const badge = getRiskBadge(scanResult.risk);
                  return (
                    <span className={`px-2.5 py-1 rounded font-['Inter'] text-xs font-bold uppercase ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
              <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a]">
                {scanResult.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2 rounded-xl border border-[#e5eeff] shrink-0 font-['JetBrains_Mono'] text-xs">
              <span className="text-[#42484a]">Safety Index:</span>
              <span className="text-lg font-bold text-[#001318]">{scanResult.score} / 100</span>
            </div>
          </div>

          {/* Synergistic Chemical Interactions Alert */}
          {scanResult.synergies.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-sm sm:text-base text-[#ba1a1a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>Flagged Chemical Synergies &amp; Cocktail Hazards</span>
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {scanResult.synergies.map((syn, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#ffdad6]/30 border border-[#ffdad6] rounded-xl space-y-2 text-[#93000a]"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#ba1a1a]">
                        {syn.mechanism}: {syn.compound1} + {syn.compound2}
                      </span>
                      <span className="px-2 py-0.5 bg-[#ba1a1a] text-white rounded font-['Inter'] text-[10px] font-bold uppercase">
                        Severity: {syn.severity}
                      </span>
                    </div>
                    <p className="font-['Inter'] text-xs sm:text-sm text-[#0b1c30] leading-relaxed">
                      {syn.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banned Countries / Notes */}
          {scanResult.bannedNotes.length > 0 && (
            <div className="p-4 bg-[#ffdad6]/20 border border-[#ffdad6] rounded-xl space-y-2">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#ba1a1a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>Regulatory Prohibition Warnings:</span>
              </span>
              <ul className="list-disc list-inside text-xs sm:text-sm text-[#0b1c30] space-y-1">
                {scanResult.bannedNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Allergen Warnings */}
          {scanResult.allergenWarnings.length > 0 && (
            <div className="p-4 bg-[#eff4ff] border border-[#e5eeff] rounded-xl space-y-2">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#001318] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#f59e0b]">priority_high</span>
                <span>Potential Priority Allergenic Matrices Detected:</span>
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {scanResult.allergenWarnings.map((allg, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#c2c7c9]/60 rounded-full font-['Inter'] text-xs font-semibold text-[#001318]"
                  >
                    {allg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Additives Breakdown */}
          <div className="space-y-3">
            <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#001318]">
              Monitored Additives in this Sample ({scanResult.matchedAdditives.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {scanResult.matchedAdditives.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectAdditive(item)}
                  className="p-4 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#006c49] transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-2xs group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#001318] group-hover:text-[#006c49] transition-colors block">
                        {item.ins}: {item.name}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-xs text-[#72787a] block">
                        CAS #{item.cas}
                      </span>
                    </div>
                    <span className={`text-xs font-bold font-['JetBrains_Mono'] ${
                      item.safetyScore < 60 ? 'text-[#ba1a1a]' : 'text-[#006c49]'
                    }`}>
                      {item.safetyScore}/100
                    </span>
                  </div>
                  <p className="font-['Inter'] text-xs text-[#42484a] line-clamp-2">
                    {item.functionalClass}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e2e8f0] text-xs font-['Inter']">
                    <span className="text-[#72787a]">ADI: {item.adi.range} {item.adi.unit}</span>
                    <span className="text-[#006c49] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
