import React, { useState } from 'react';
import { NUTRITION_DATABASE } from '../../api/mcp-engine.js';
import { NutritionProfile } from '../types';
import { callMcp } from '../services/mcpClient';

export const NutritionDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<NutritionProfile>(NUTRITION_DATABASE[0]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredFoods = NUTRITION_DATABASE.filter(f =>
    f.nameHe.includes(searchQuery) ||
    f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLookup = async (queryText: string) => {
    setIsLoading(true);
    try {
      const res = await callMcp<NutritionProfile>('check_nutrition', { query: queryText });
      if (res.data) {
        setSelectedFood(res.data);
      }
    } catch (_) {
      const match = NUTRITION_DATABASE.find(item =>
        item.nameHe.includes(queryText) || item.nameEn.toLowerCase().includes(queryText.toLowerCase())
      );
      if (match) setSelectedFood(match);
    } finally {
      setIsLoading(false);
    }
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
            Israeli Ministry of Health Nutrition Registry (4,624 Foods)
          </h2>
        </div>
        <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
          Official toxicological and nutritional database for foods sold in Israel. Analyzes calories, macro/micronutrients, vitamins, minerals, and automatically computes mandatory Israeli MoH front-of-package red warning seals (Decree 5780-2020 / Standard 1145) in Hebrew and English.
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
            type="button"
            onClick={() => handleLookup(searchQuery || "חומוס")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0f292f] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm rounded-xl hover:bg-[#001318] transition-colors cursor-pointer shrink-0 disabled:opacity-70"
          >
            {isLoading ? 'Querying IL-MoH...' : 'Search Food'}
          </button>
        </div>

        {/* Quick select pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-wider text-[#42484a] mr-1">
            Popular Israeli Items:
          </span>
          {NUTRITION_DATABASE.slice(0, 7).map((food, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedFood(food);
                setSearchQuery(food.nameHe);
              }}
              className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-xs border border-[#e5eeff] transition-colors cursor-pointer"
            >
              {food.nameHe} ({food.nameEn.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Food Nutrition Dossier */}
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
                  <span className="material-symbols-outlined text-[20px]">drive_file_rename</span>
                  <span className="text-[8px] font-bold">נתרן</span>
                </div>
                <div>
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318] block">
                    {selectedFood.labels.sodium.labelHe} ({selectedFood.labels.sodium.labelEn})
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#42484a]">
                    {selectedFood.sodium} mg / 100g (Threshold: 500mg)
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded font-['Inter'] text-xs font-bold uppercase shrink-0 ${
                selectedFood.labels.sodium.triggered ? 'bg-[#ba1a1a] text-white' : 'bg-[#e5eeff] text-[#42484a]'
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
                  <span className="material-symbols-outlined text-[20px]">water_drop</span>
                  <span className="text-[8px] font-bold">שומן</span>
                </div>
                <div>
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318] block">
                    {selectedFood.labels.saturatedFat.labelHe} ({selectedFood.labels.saturatedFat.labelEn})
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#42484a]">
                    {selectedFood.saturatedFat} g / 100g (Threshold: 5.0g)
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded font-['Inter'] text-xs font-bold uppercase shrink-0 ${
                selectedFood.labels.saturatedFat.triggered ? 'bg-[#ba1a1a] text-white' : 'bg-[#e5eeff] text-[#42484a]'
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
                  <span className="material-symbols-outlined text-[20px]">cookie</span>
                  <span className="text-[8px] font-bold">סוכר</span>
                </div>
                <div>
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#001318] block">
                    {selectedFood.labels.sugar.labelHe} ({selectedFood.labels.sugar.labelEn})
                  </span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#42484a]">
                    {selectedFood.sugars} g / 100g (Threshold: 10.0g)
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded font-['Inter'] text-xs font-bold uppercase shrink-0 ${
                selectedFood.labels.sugar.triggered ? 'bg-[#ba1a1a] text-white' : 'bg-[#e5eeff] text-[#42484a]'
              }`}>
                {selectedFood.labels.sugar.triggered ? 'TRIGGERED' : 'CLEAR'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#e5eeff] text-xs text-[#42484a] space-y-1">
            <span className="font-semibold text-[#001318] block">Dietary &amp; Religious Status:</span>
            <div className="flex flex-wrap gap-2 pt-1 font-['JetBrains_Mono']">
              <span className="px-2 py-0.5 bg-white rounded border border-[#e2e8f0]">
                Kosher: {selectedFood.dietary.kosher}
              </span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#e2e8f0]">
                Vegan: {selectedFood.dietary.vegan ? 'Yes' : 'No'}
              </span>
              <span className="px-2 py-0.5 bg-white rounded border border-[#e2e8f0]">
                Gluten-Free: {selectedFood.dietary.glutenFree ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
