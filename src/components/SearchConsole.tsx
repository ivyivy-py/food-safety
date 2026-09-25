import React from 'react';

interface SearchConsoleProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (customQuery?: string) => void;
  isLoading: boolean;
  activeEngine?: string;
  activeToggles: {
    jecfaEfsa: boolean;
    adiDosimetry: boolean;
    dietaryCheck: boolean;
    israeliMoh: boolean;
    pesticideMrl: boolean;
  };
  setToggles: React.Dispatch<React.SetStateAction<{
    jecfaEfsa: boolean;
    adiDosimetry: boolean;
    dietaryCheck: boolean;
    israeliMoh: boolean;
    pesticideMrl: boolean;
  }>>;
}

export const SearchConsole: React.FC<SearchConsoleProps> = ({
  query,
  setQuery,
  onSearch,
  isLoading,
  activeEngine = "JECFA 96th Report / EFSA 2023-R",
  activeToggles,
  setToggles
}) => {
  const suggestedBiomarkers = [
    { label: "E250 Sodium Nitrite", query: "E250 (Sodium Nitrite) & Chlorpyrifos Residues in Cured Meats" },
    { label: "E171 Titanium Dioxide", query: "E171 Titanium Dioxide" },
    { label: "E102 Tartrazine", query: "E102 Tartrazine" },
    { label: "Glyphosate MRL", query: "Glyphosate MRL & Residues in Wheat" },
    { label: "E951 Aspartame", query: "E951 Aspartame" },
    { label: "E330 Citric Acid", query: "E330 Citric Acid" },
    { label: "Chlorpyrifos", query: "Chlorpyrifos Organophosphate Residue" },
    { label: "חומוס (Hummus)", query: "חומוס מוכן למריחה" },
    { label: "Scan Ingredients Cocktail", query: "Sugar, E150d, E621, Citric Acid, E211" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const toggleParam = (key: keyof typeof activeToggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="relative bg-white rounded-xl p-5 sm:p-6 lg:p-8 shadow-xs border border-[#e2e8f0] space-y-6 overflow-hidden">
      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dce9ff] text-[#001318] rounded-full">
            <span className="material-symbols-outlined text-[#006c49] text-[16px]">biotech</span>
            <span className="font-['Inter'] text-[11px] font-bold tracking-wider uppercase">
              Analytical Bio-Safety Intelligence Terminal
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#001318] leading-tight tracking-tight">
            Unified Food Additive, Nutrition &amp; Pesticide Safety Intelligence
          </h1>
          <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-2xl leading-relaxed">
            Query any E-number, additive compound, agricultural pesticide, or raw matrix against EFSA/JECFA evaluations, ADI limits, Israeli MoH front-of-package red/green symbols, dietary conformance, and multi-jurisdictional MRL registries via live Model Context Protocol (MCP).
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto font-['JetBrains_Mono'] text-xs text-[#42484a] bg-[#eff4ff] p-3 rounded-lg border border-[#e5eeff] shrink-0">
          <div className="text-right">
            <span className="block text-[#001318] font-semibold">Active Assay Engine</span>
            <span>{activeEngine}</span>
          </div>
          <span className="material-symbols-outlined text-[#006c49] text-[24px]">verified</span>
        </div>
      </div>

      {/* Advanced Search Form */}
      <div className="relative z-10 bg-[#eff4ff] p-4 sm:p-5 rounded-xl border border-[#e5eeff] space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787a] text-[22px]">
              science
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter E-number (e.g., E171, E621), chemical additive, pesticide active ingredient, or product name..."
              className="w-full pl-11 pr-10 py-3.5 bg-white text-[#0b1c30] font-['Inter'] text-sm sm:text-base rounded-lg shadow-xs border border-[#c2c7c9]/60 focus:outline-none focus:ring-2 focus:ring-[#0f292f] focus:border-transparent transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#72787a] hover:text-[#0b1c30] p-1 cursor-pointer"
                title="Clear input"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#0f292f] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm sm:text-base rounded-lg shadow-sm hover:bg-[#001318] active:scale-98 transition-all shrink-0 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Connecting MCP...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">manage_search</span>
                <span>Run ToxiScan MCP</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Select Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] mr-1">
            Suggested Biomarkers:
          </span>
          {suggestedBiomarkers.map((bm, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(bm.query);
                onSearch(bm.query);
              }}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-[#dce9ff] text-[#0b1c30] font-['JetBrains_Mono'] text-xs border border-[#e2e8f0] shadow-2xs transition-colors cursor-pointer"
            >
              {bm.label}
            </button>
          ))}
        </div>

        {/* Parameter Toggles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 text-[#0b1c30] text-xs font-medium">
          <label
            onClick={() => toggleParam('jecfaEfsa')}
            className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#e2e8f0] cursor-pointer hover:bg-slate-50 select-none shadow-2xs"
          >
            <input
              type="checkbox"
              checked={activeToggles.jecfaEfsa}
              onChange={() => {}}
              className="w-4 h-4 rounded text-[#006c49] accent-[#006c49] cursor-pointer"
            />
            <span className="truncate">JECFA &amp; EFSA Limits</span>
          </label>

          <label
            onClick={() => toggleParam('adiDosimetry')}
            className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#e2e8f0] cursor-pointer hover:bg-slate-50 select-none shadow-2xs"
          >
            <input
              type="checkbox"
              checked={activeToggles.adiDosimetry}
              onChange={() => {}}
              className="w-4 h-4 rounded text-[#006c49] accent-[#006c49] cursor-pointer"
            />
            <span className="truncate">ADI Dosimetry Profile</span>
          </label>

          <label
            onClick={() => toggleParam('dietaryCheck')}
            className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#e2e8f0] cursor-pointer hover:bg-slate-50 select-none shadow-2xs"
          >
            <input
              type="checkbox"
              checked={activeToggles.dietaryCheck}
              onChange={() => {}}
              className="w-4 h-4 rounded text-[#006c49] accent-[#006c49] cursor-pointer"
            />
            <span className="truncate">Dietary (Kosher/Halal)</span>
          </label>

          <label
            onClick={() => toggleParam('israeliMoh')}
            className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#e2e8f0] cursor-pointer hover:bg-slate-50 select-none shadow-2xs"
          >
            <input
              type="checkbox"
              checked={activeToggles.israeliMoh}
              onChange={() => {}}
              className="w-4 h-4 rounded text-[#006c49] accent-[#006c49] cursor-pointer"
            />
            <span className="truncate">Israeli MoH Red/Green</span>
          </label>

          <label
            onClick={() => toggleParam('pesticideMrl')}
            className="flex items-center gap-2 p-2 bg-white rounded-md border border-[#e2e8f0] cursor-pointer hover:bg-slate-50 select-none shadow-2xs col-span-2 sm:col-span-1"
          >
            <input
              type="checkbox"
              checked={activeToggles.pesticideMrl}
              onChange={() => {}}
              className="w-4 h-4 rounded text-[#006c49] accent-[#006c49] cursor-pointer"
            />
            <span className="truncate">Pesticide Residues (MRL)</span>
          </label>
        </div>
      </div>
    </section>
  );
};
