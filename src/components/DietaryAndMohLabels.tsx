import React from 'react';
import { AdditiveDossier } from '../types';

interface DietaryAndMohLabelsProps {
  dossier: AdditiveDossier;
}

export const DietaryAndMohLabels: React.FC<DietaryAndMohLabelsProps> = ({ dossier }) => {
  const { dietary, israeliMohLabels } = dossier;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Dietary & Cultural Compliance Matrix (5 Cols) */}
      <section className="lg:col-span-5 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">
              fact_check
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg text-[#001318]">
              Dietary &amp; Cultural Compliance
            </h3>
          </div>
          <p className="font-['Inter'] text-xs text-[#42484a]">
            Automated verification cross-referencing additive synthetic pathway and biological catalysts.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Halal */}
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-[22px] ${dietary.halal.certified ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                {dietary.halal.certified ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <span className="font-['Inter'] text-sm font-semibold text-[#001318] block">
                  {dietary.halal.certified ? 'Halal Certified' : 'Non-Halal / Restricted'}
                </span>
                <span className="font-['Inter'] text-xs text-[#42484a] block line-clamp-1">
                  {dietary.halal.note}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 font-['Inter'] text-[11px] font-bold rounded uppercase shrink-0 ${
              dietary.halal.certified ? 'bg-[#6cf8bb] text-[#00714d]' : 'bg-[#ffdad6] text-[#93000a]'
            }`}>
              {dietary.halal.badge}
            </span>
          </div>

          {/* Kosher */}
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-[22px] ${dietary.kosher.certified ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                {dietary.kosher.certified ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <span className="font-['Inter'] text-sm font-semibold text-[#001318] block">
                  Kosher {dietary.kosher.badge}
                </span>
                <span className="font-['Inter'] text-xs text-[#42484a] block line-clamp-1">
                  {dietary.kosher.note}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 font-['Inter'] text-[11px] font-bold rounded uppercase shrink-0 ${
              dietary.kosher.certified ? 'bg-[#6cf8bb] text-[#00714d]' : 'bg-[#ffdad6] text-[#93000a]'
            }`}>
              {dietary.kosher.badge}
            </span>
          </div>

          {/* Vegan */}
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-[22px] ${dietary.vegan.certified ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                {dietary.vegan.certified ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <span className="font-['Inter'] text-sm font-semibold text-[#001318] block">
                  {dietary.vegan.certified ? '100% Vegan & Vegetarian' : 'Non-Vegan / Animal Origin'}
                </span>
                <span className="font-['Inter'] text-xs text-[#42484a] block line-clamp-1">
                  {dietary.vegan.note}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 font-['Inter'] text-[11px] font-bold rounded uppercase shrink-0 ${
              dietary.vegan.certified ? 'bg-[#6cf8bb] text-[#00714d]' : 'bg-[#ffdad6] text-[#93000a]'
            }`}>
              {dietary.vegan.badge}
            </span>
          </div>

          {/* Gluten-Free */}
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-[22px] ${dietary.glutenFree.certified ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
                {dietary.glutenFree.certified ? 'check_circle' : 'cancel'}
              </span>
              <div>
                <span className="font-['Inter'] text-sm font-semibold text-[#001318] block">
                  {dietary.glutenFree.certified ? 'Celiac / Gluten-Free' : 'Contains Gluten'}
                </span>
                <span className="font-['Inter'] text-xs text-[#42484a] block line-clamp-1">
                  {dietary.glutenFree.note}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 font-['Inter'] text-[11px] font-bold rounded uppercase shrink-0 ${
              dietary.glutenFree.certified ? 'bg-[#6cf8bb] text-[#00714d]' : 'bg-[#ffdad6] text-[#93000a]'
            }`}>
              {dietary.glutenFree.badge}
            </span>
          </div>
        </div>

        <div className="p-2 bg-[#e5eeff] rounded font-['JetBrains_Mono'] text-xs text-[#42484a] flex items-center justify-between">
          <span className="truncate">{dietary.traceability}</span>
          <span className="text-[#006c49] font-semibold shrink-0 ml-2">Verified Pure</span>
        </div>
      </section>

      {/* Israeli MoH Front-of-Package System (7 Cols) */}
      <section className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">
                label_important
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg text-[#001318]">
                Israeli MoH Front-of-Package Warning Labels (סימון מזון אדום)
              </h3>
            </div>
            <p className="font-['Inter'] text-xs text-[#42484a]">
              Mandatory Public Health Protection Decree (Food) 5780-2020: Threshold testing on formulation matrix.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-[#e5eeff] text-[#0b1c30] font-['JetBrains_Mono'] text-xs rounded self-start sm:self-auto shrink-0 font-medium">
            IL-MoH Standard 1145
          </span>
        </div>

        {/* Warning Icons Render Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Red Symbol 1: Sodium */}
          <div className={`rounded-xl p-4 flex flex-col items-center text-center space-y-2.5 border transition-all ${
            israeliMohLabels.sodium.triggered
              ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
              : 'bg-[#eff4ff]/60 border-[#e5eeff] opacity-60'
          }`}>
            <div className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-sm ${
              israeliMohLabels.sodium.triggered
                ? 'bg-[#ba1a1a] text-white ring-4 ring-[#ba1a1a]/20'
                : 'bg-[#e5eeff] text-[#72787a]'
            }`}>
              <span className="material-symbols-outlined text-[28px]">
                drive_file_rename
              </span>
              <span className="text-[10px] font-bold tracking-tight">סמל אדום</span>
            </div>
            <div className="space-y-0.5">
              <span className={`font-['Plus_Jakarta_Sans'] text-sm font-bold block ${
                israeliMohLabels.sodium.triggered ? 'text-[#ba1a1a]' : 'text-[#42484a]'
              }`}>
                {israeliMohLabels.sodium.triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}
              </span>
              <span className="font-['Inter'] text-xs font-semibold text-[#001318] block">
                {israeliMohLabels.sodium.labelEn} / {israeliMohLabels.sodium.labelHe}
              </span>
              <span className={`font-['JetBrains_Mono'] text-xs font-semibold block ${
                israeliMohLabels.sodium.triggered ? 'text-[#ba1a1a]' : 'text-[#42484a]'
              }`}>
                {israeliMohLabels.sodium.value} {israeliMohLabels.sodium.unit}
              </span>
              <span className="font-['Inter'] text-[11px] text-[#42484a] block">
                Limit: &gt;{israeliMohLabels.sodium.limit} mg in solids
              </span>
            </div>
          </div>

          {/* Red Symbol 2: Saturated Fat */}
          <div className={`rounded-xl p-4 flex flex-col items-center text-center space-y-2.5 border transition-all ${
            israeliMohLabels.saturatedFat.triggered
              ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
              : 'bg-[#eff4ff]/60 border-[#e5eeff] opacity-60'
          }`}>
            <div className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-sm ${
              israeliMohLabels.saturatedFat.triggered
                ? 'bg-[#ba1a1a] text-white ring-4 ring-[#ba1a1a]/20'
                : 'bg-[#e5eeff] text-[#72787a]'
            }`}>
              <span className="material-symbols-outlined text-[28px]">
                water_drop
              </span>
              <span className="text-[10px] font-bold tracking-tight">שומן רווי</span>
            </div>
            <div className="space-y-0.5">
              <span className={`font-['Plus_Jakarta_Sans'] text-sm font-bold block ${
                israeliMohLabels.saturatedFat.triggered ? 'text-[#ba1a1a]' : 'text-[#42484a]'
              }`}>
                {israeliMohLabels.saturatedFat.triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}
              </span>
              <span className="font-['Inter'] text-xs font-semibold text-[#001318] block">
                {israeliMohLabels.saturatedFat.labelEn} / {israeliMohLabels.saturatedFat.labelHe}
              </span>
              <span className={`font-['JetBrains_Mono'] text-xs font-semibold block ${
                israeliMohLabels.saturatedFat.triggered ? 'text-[#ba1a1a]' : 'text-[#42484a]'
              }`}>
                {israeliMohLabels.saturatedFat.value} {israeliMohLabels.saturatedFat.unit}
              </span>
              <span className="font-['Inter'] text-[11px] text-[#42484a] block">
                Limit: &gt;{israeliMohLabels.saturatedFat.limit} g in solids
              </span>
            </div>
          </div>

          {/* Red Symbol 3: Sugar */}
          <div className={`rounded-xl p-4 flex flex-col items-center text-center space-y-2.5 border transition-all ${
            israeliMohLabels.sugar.triggered
              ? 'bg-[#ffdad6]/30 border-[#ffdad6]'
              : 'bg-[#eff4ff]/60 border-[#e5eeff] opacity-60'
          }`}>
            <div className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-sm ${
              israeliMohLabels.sugar.triggered
                ? 'bg-[#ba1a1a] text-white ring-4 ring-[#ba1a1a]/20'
                : 'bg-[#e5eeff] text-[#72787a]'
            }`}>
              <span className="material-symbols-outlined text-[28px]">
                cookie
              </span>
              <span className="text-[10px] font-bold tracking-tight">סוכר גבוה</span>
            </div>
            <div className="space-y-0.5">
              <span className={`font-['Plus_Jakarta_Sans'] text-sm font-bold block ${
                israeliMohLabels.sugar.triggered ? 'text-[#ba1a1a]' : 'text-[#42484a]'
              }`}>
                {israeliMohLabels.sugar.triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}
              </span>
              <span className="font-['Inter'] text-xs font-semibold text-[#001318] block">
                {israeliMohLabels.sugar.labelEn} / {israeliMohLabels.sugar.labelHe}
              </span>
              <span className={`font-['JetBrains_Mono'] text-xs font-semibold block ${
                israeliMohLabels.sugar.triggered ? 'text-[#ba1a1a]' : 'text-[#42484a]'
              }`}>
                {israeliMohLabels.sugar.value} {israeliMohLabels.sugar.unit}
              </span>
              <span className="font-['Inter'] text-[11px] text-[#42484a] block">
                Limit: &gt;{israeliMohLabels.sugar.limit} g in solids
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory note */}
        <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#e5eeff] space-y-1 font-['Inter'] text-xs text-[#0b1c30]">
          <div className="flex items-center gap-1.5 font-semibold text-[#001318]">
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">info</span>
            <span>Packaging Warning Compliance Assessment:</span>
          </div>
          <p className="text-[#42484a] leading-relaxed">
            {israeliMohLabels.complianceAssessment}
          </p>
        </div>
      </section>
    </div>
  );
};
