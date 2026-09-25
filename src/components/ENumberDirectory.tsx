import React, { useState } from 'react';
import { ADDITIVES_DATABASE } from '../../api/mcp-engine.js';
import { AdditiveDossier } from '../types';
import { callMcp } from '../services/mcpClient';

interface ENumberDirectoryProps {
  onSelectAdditive: (dossier: AdditiveDossier) => void;
}

export const ENumberDirectory: React.FC<ENumberDirectoryProps> = ({ onSelectAdditive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [additivesList, setAdditivesList] = useState<AdditiveDossier[]>(ADDITIVES_DATABASE);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Additives' },
    { id: 'preservative', label: 'Preservatives' },
    { id: 'color', label: 'Colorants & Dyes' },
    { id: 'sweetener', label: 'Sweeteners' },
    { id: 'flavor', label: 'Flavor Enhancers' },
    { id: 'banned', label: 'Banned / High Hazard' },
  ];

  const handleSearch = async (term: string, cat: string) => {
    setIsLoading(true);
    try {
      const response = await callMcp<AdditiveDossier[]>('search_additives', {
        query: term,
        category: cat === 'ALL' ? '' : cat
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAdditivesList(response.data);
      } else {
        // Fallback filter
        filterLocal(term, cat);
      }
    } catch (_) {
      filterLocal(term, cat);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocal = (term: string, cat: string) => {
    const q = term.toLowerCase().trim();
    const filtered = ADDITIVES_DATABASE.filter(item => {
      const matchQ = !q ||
        item.ins.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.chemicalName.toLowerCase().includes(q) ||
        item.functionalClass.toLowerCase().includes(q) ||
        item.cas.includes(q);

      const matchCat = cat === 'ALL' ||
        (cat === 'banned' && (item.riskLevel.includes('BANNED') || item.riskLevel.includes('CRITICAL') || item.ins === 'E171' || item.ins === 'E924a')) ||
        item.functionalClass.toLowerCase().includes(cat);

      return matchQ && matchCat;
    });
    setAdditivesList(filtered);
  };

  const onCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    handleSearch(searchTerm, catId);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[24px]">
              inventory_2
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl sm:text-2xl text-[#001318]">
              Codex E-Number &amp; Additive Master Directory
            </h2>
          </div>
          <p className="font-['Inter'] text-sm sm:text-base text-[#42484a] max-w-3xl leading-relaxed">
            Search food additives by keyword, functional category, dietary conformance, or regulatory status. Click any entry to inspect its analytical toxicological monograph.
          </p>
        </div>

        {/* Input & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72787a] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                filterLocal(e.target.value, selectedCategory);
              }}
              placeholder="Search by E-number (e.g. E250, E171), chemical name (e.g. Sodium Nitrite), CAS number..."
              className="w-full pl-10 pr-4 py-3 bg-[#eff4ff] border border-[#e5eeff] rounded-xl font-['Inter'] text-sm sm:text-base text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0f292f] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSearch(searchTerm, selectedCategory)}
            disabled={isLoading}
            className="px-6 py-3 bg-[#0f292f] text-white font-['Plus_Jakarta_Sans'] font-semibold text-sm rounded-xl hover:bg-[#001318] transition-colors cursor-pointer shrink-0 disabled:opacity-70"
          >
            {isLoading ? 'Querying Codex...' : 'Filter Additives'}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryClick(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-['Inter'] transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0f292f] text-white font-semibold shadow-xs'
                  : 'bg-[#eff4ff] text-[#42484a] hover:bg-[#e5eeff] border border-[#e5eeff]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Additive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {additivesList.map((item) => {
          const isHighRisk = item.safetyScore < 60;
          return (
            <div
              key={item.ins}
              onClick={() => onSelectAdditive(item)}
              className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 hover:border-[#006c49] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-[#001318] text-white font-['JetBrains_Mono'] font-bold text-sm">
                    {item.ins}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`}></span>
                    <span className={`font-['JetBrains_Mono'] text-xs font-bold ${isHighRisk ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                      {item.safetyScore}/100
                    </span>
                  </div>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#001318] group-hover:text-[#006c49] transition-colors">
                  {item.name}
                </h3>
                <span className="font-['JetBrains_Mono'] text-xs text-[#72787a] block">
                  CAS #{item.cas}
                </span>
                <p className="font-['Inter'] text-xs text-[#42484a] line-clamp-2 leading-relaxed">
                  {item.functionalClass}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between font-['Inter'] text-xs">
                <span className="text-[#42484a]">
                  ADI: {item.adi.range} {item.adi.unit}
                </span>
                <span className="text-[#006c49] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Dossier</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
