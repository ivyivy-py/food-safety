import React, { useState, useEffect } from 'react';
import { NutritionProfile } from '../types';
import { callMcp, describeMcpError } from '../services/mcpClient';

interface NutritionDirectoryProps {
  initialQuery?: string;
}

export const NutritionDirectory: React.FC<NutritionDirectoryProps> = ({ initialQuery = 'חומוס' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFood, setSelectedFood] = useState<NutritionProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const popularItems = [
    { label: 'חומוס (Hummus)', query: 'חומוס מוכן למריחה' },
    { label: 'טחינה (Tahini)', query: 'טחינה גולמית משומשום מלא' },
    { label: 'פלאפל (Falafel)', query: 'פלאפל מטוגן בשמן עמוק' },
    { label: 'שקשוקה (Shakshuka)', query: 'שקשוקה מסורתית ברוטב עגבניות' },
    { label: 'גבינה צהובה (Yellow Cheese)', query: 'גבינה צהובה 28% שומן' },
    { label: 'במבה (Bamba)', query: 'במבה חטיף בוטנים קלאסי' },
    { label: 'ביסלי (Bisli)', query: 'ביסלי גריל חטיף חיטה' },
    { label: 'קוטג\' (Cottage Cheese)', query: 'גבינת קוטג\' 5% שומן' },
  ];

  const handleLookup = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await callMcp<NutritionProfile>('check_nutrition', { query: queryText.trim() });
      if (res.data) {
        setSelectedFood(res.data);
      } else {
        setSelectedFood(null);
        setErrorMessage(`No matching food found in demo dataset (8 foods) for "${queryText}".`);
      }
    } catch (err) {
      setSelectedFood(null);
      setErrorMessage(describeMcpError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLookup(initialQuery || 'חומוס');
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006c49] text-[24px]">
            nutrition
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl sm:text-2xl text-[#001318]">
            Israeli Ministry of Health Nutrition Registry (8 Demo Foods)
          </h2>
        </div>
        <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
          Demo toxicological and nutritional database for foods sold in Israel. Analyzes calories, macro/micronutrients, vitamins, minerals, and computes Israeli MoH front-of-package red warning seals (Decree 5780-2020 / Standard 1145) in Hebrew and English.
        </p>
        <p className="font-['Inter'] text-xs text-[#72787a]">
          Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787a] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Israeli food in Hebrew or English (e.g. חומוס, טחינה, פלאפל, במבה, קוטג')..."
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
              'Search Food'
            )}
          </button>
        </form>

        {/* Quick select pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] mr-1">
            Demo Items:
          </span>
          {popularItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(item.query);
                handleLookup(item.query);
              }}
              className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-xs border border-[#e5eeff] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-12 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#006c49]/20 border-t-[#006c49] rounded-full animate-spin mx-auto"></div>
          <p className="font-['JetBrains_Mono'] text-sm text-[#42484a]">
            Loading nutritional dossier from local MCP server (/api/mcp)...
          </p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && errorMessage && (
        <div className="bg-white rounded-xl shadow-xs border border-[#ba1a1a]/30 p-8 text-center space-y-2">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[36px]">error</span>
          <p className="font-['Inter'] font-semibold text-[#ba1a1a] text-base">{errorMessage}</p>
          <p className="font-['Inter'] text-xs text-[#72787a]">
            Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
          </p>
        </div>
      )}

      {/* Selected Food Nutrition Dossier */}
      {!isLoading && !errorMessage && selectedFood && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Nutrition Facts Sheet */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
              <div className="space-y-0.5">
                <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#006c49]">
                  MoH Registry: {selectedFood.code} · {selectedFood.category}
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#001318]">
                  {selectedFood.nameHe}
                </h3>
                <span className="font-['Inter'] text-sm text-[#42484a] block">
                  {selectedFood.nameEn}
                </span>
              </div>
              <div className="bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#e5eeff] text-right shrink-0">
                <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#001318] block">
                  {selectedFood.calories} kcal
                </span>
                <span className="font-['Inter'] text-[11px] text-[#42484a]">
                  Per {selectedFood.servingSize}
                </span>
              </div>
            </div>

            <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a] leading-relaxed">
              {selectedFood.description}
            </p>

            {/* Macronutrients Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e5eeff]">
                <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#42484a] block">Protein</span>
                <span className="font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-[#001318]">{selectedFood.protein}g</span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e5eeff]">
                <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#42484a] block">Total Fat</span>
                <span className="font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-[#001318]">{selectedFood.totalFat}g</span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e5eeff]">
                <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#42484a] block">Carbohydrates</span>
                <span className="font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-[#001318]">{selectedFood.carbohydrates}g</span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e5eeff]">
                <span className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#42484a] block">Fiber</span>
                <span className="font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-[#001318]">{selectedFood.fiber}g</span>
              </div>
            </div>

            {/* Detailed Nutrient Breakdown Table */}
            <div className="space-y-2 pt-2">
              <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318]">
                Micronutrient &amp; Biochemical Analysis (Per 100g)
              </h4>
              <div className="divide-y divide-[#e2e8f0] border border-[#e2e8f0] rounded-xl overflow-hidden font-['Inter'] text-xs sm:text-sm">
                <div className="flex justify-between p-3 bg-white">
                  <span className="text-[#42484a]">Sodium (נתרן)</span>
                  <span className={`font-['JetBrains_Mono'] font-bold ${selectedFood.sodium > 500 ? 'text-[#ba1a1a]' : 'text-[#001318]'}`}>
                    {selectedFood.sodium} mg
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50">
                  <span className="text-[#42484a]">Saturated Fatty Acids (חומצות שומן רוויות)</span>
                  <span className={`font-['JetBrains_Mono'] font-bold ${selectedFood.saturatedFat > 5.0 ? 'text-[#ba1a1a]' : 'text-[#001318]'}`}>
                    {selectedFood.saturatedFat} g
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white">
                  <span className="text-[#42484a]">Total Sugars (סוכרים)</span>
                  <span className={`font-['JetBrains_Mono'] font-bold ${selectedFood.sugars > 10.0 ? 'text-[#ba1a1a]' : 'text-[#001318]'}`}>
                    {selectedFood.sugars} g
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50">
                  <span className="text-[#42484a]">Calcium (סידן)</span>
                  <span className="font-['JetBrains_Mono'] font-semibold text-[#001318]">
                    {selectedFood.calcium} mg
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white">
                  <span className="text-[#42484a]">Iron (ברזל)</span>
                  <span className="font-['JetBrains_Mono'] font-semibold text-[#001318]">
                    {selectedFood.iron} mg
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50">
                  <span className="text-[#42484a]">Potassium (אשלגן)</span>
                  <span className="font-['JetBrains_Mono'] font-semibold text-[#001318]">
                    {selectedFood.potassium} mg
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white">
                  <span className="text-[#42484a]">Cholesterol (כולסטרול)</span>
                  <span className="font-['JetBrains_Mono'] font-semibold text-[#001318]">
                    {selectedFood.cholesterol} mg
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Israeli MoH Front-of-Package Warning Determination */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-7 space-y-5">
            <div className="space-y-1">
              <span className="font-['Inter'] text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
                Decree 5780-2020 Compliance Verdict
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl text-[#001318]">
                Israeli MoH Red Label Seals (סימון אדום)
              </h3>
              <p className="font-['Inter'] text-xs text-[#42484a]">
                Calculated based on solid food thresholds: Sodium &gt;500mg, Sat. Fat &gt;5.0g, Sugars &gt;10.0g.
              </p>
            </div>

            <div className="space-y-3">
              {/* Sodium Seal */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                selectedFood.labels.sodium.triggered
                  ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
                  : 'bg-[#eff4ff]/60 border-[#e5eeff] opacity-60'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-white shrink-0 ${
                    selectedFood.labels.sodium.triggered ? 'bg-[#ba1a1a] shadow-xs' : 'bg-[#72787a]'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span className="font-['Inter'] text-[9px] font-bold">נתרן</span>
                  </div>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#001318] block">
                      {selectedFood.labels.sodium.labelHe} ({selectedFood.labels.sodium.labelEn})
                    </span>
                    <span className="font-['Inter'] text-xs text-[#42484a]">
                      Measured: {selectedFood.labels.sodium.value} mg (Threshold: 500 mg)
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-['Inter'] font-semibold ${
                  selectedFood.labels.sodium.triggered
                    ? 'bg-[#ba1a1a] text-white'
                    : 'bg-[#e5eeff] text-[#42484a]'
                }`}>
                  {selectedFood.labels.sodium.triggered ? 'TRIGGERED' : 'CLEAR'}
                </span>
              </div>

              {/* Saturated Fat Seal */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                selectedFood.labels.saturatedFat.triggered
                  ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
                  : 'bg-[#eff4ff]/60 border-[#e5eeff] opacity-60'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-white shrink-0 ${
                    selectedFood.labels.saturatedFat.triggered ? 'bg-[#ba1a1a] shadow-xs' : 'bg-[#72787a]'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span className="font-['Inter'] text-[9px] font-bold">שומן</span>
                  </div>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#001318] block">
                      {selectedFood.labels.saturatedFat.labelHe} ({selectedFood.labels.saturatedFat.labelEn})
                    </span>
                    <span className="font-['Inter'] text-xs text-[#42484a]">
                      Measured: {selectedFood.labels.saturatedFat.value} g (Threshold: 5.0 g)
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-['Inter'] font-semibold ${
                  selectedFood.labels.saturatedFat.triggered
                    ? 'bg-[#ba1a1a] text-white'
                    : 'bg-[#e5eeff] text-[#42484a]'
                }`}>
                  {selectedFood.labels.saturatedFat.triggered ? 'TRIGGERED' : 'CLEAR'}
                </span>
              </div>

              {/* Sugar Seal */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                selectedFood.labels.sugar.triggered
                  ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
                  : 'bg-[#eff4ff]/60 border-[#e5eeff] opacity-60'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-white shrink-0 ${
                    selectedFood.labels.sugar.triggered ? 'bg-[#ba1a1a] shadow-xs' : 'bg-[#72787a]'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span className="font-['Inter'] text-[9px] font-bold">סוכר</span>
                  </div>
                  <div>
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#001318] block">
                      {selectedFood.labels.sugar.labelHe} ({selectedFood.labels.sugar.labelEn})
                    </span>
                    <span className="font-['Inter'] text-xs text-[#42484a]">
                      Measured: {selectedFood.labels.sugar.value} g (Threshold: 10.0 g)
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-['Inter'] font-semibold ${
                  selectedFood.labels.sugar.triggered
                    ? 'bg-[#ba1a1a] text-white'
                    : 'bg-[#e5eeff] text-[#42484a]'
                }`}>
                  {selectedFood.labels.sugar.triggered ? 'TRIGGERED' : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* Dietary Verification */}
            <div className="pt-4 border-t border-[#e2e8f0] space-y-2">
              <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] block">
                Dietary &amp; Kashrut Suitability
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-['Inter']">
                <div className="p-2.5 bg-[#eff4ff] rounded-lg">
                  <span className="text-[#42484a] block">Kosher Status</span>
                  <span className="font-semibold text-[#001318]">{selectedFood.dietary.kosher}</span>
                </div>
                <div className="p-2.5 bg-[#eff4ff] rounded-lg">
                  <span className="text-[#42484a] block">Vegan</span>
                  <span className="font-semibold text-[#001318]">{selectedFood.dietary.vegan ? 'Yes' : 'No'}</span>
                </div>
                <div className="p-2.5 bg-[#eff4ff] rounded-lg">
                  <span className="text-[#42484a] block">Gluten Free</span>
                  <span className="font-semibold text-[#001318]">{selectedFood.dietary.glutenFree ? 'Yes' : 'No'}</span>
                </div>
                <div className="p-2.5 bg-[#eff4ff] rounded-lg">
                  <span className="text-[#42484a] block">Halal</span>
                  <span className="font-semibold text-[#001318]">{selectedFood.dietary.halal ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
