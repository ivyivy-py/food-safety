import React from 'react';
import { AdditiveDossier } from '../types';

interface PrimaryDossierProps {
  dossier: AdditiveDossier;
}

export const PrimaryDossier: React.FC<PrimaryDossierProps> = ({ dossier }) => {
  // Score color calculation
  const score = dossier.safetyScore;
  const isHighRisk = score < 65;
  const strokeColor = isHighRisk ? "#ba1a1a" : score < 80 ? "#f59e0b" : "#006c49";

  return (
    <section className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Dossier Header & Executive Warning Ribbon */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#e2e8f0]/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-[#001318] text-white font-['JetBrains_Mono'] font-bold text-base sm:text-lg">
                {dossier.ins}
              </span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-xl sm:text-2xl text-[#001318]">
                {dossier.name}
              </h2>
              {dossier.cas && (
                <span className="px-2 py-0.5 bg-[#e5eeff] text-[#42484a] font-['JetBrains_Mono'] text-xs rounded">
                  CAS #{dossier.cas}
                </span>
              )}
              {dossier.einecs && (
                <span className="px-2 py-0.5 bg-[#e5eeff] text-[#42484a] font-['JetBrains_Mono'] text-xs rounded">
                  EINECS {dossier.einecs}
                </span>
              )}
            </div>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a]">
              Functional Class: {dossier.functionalClass}
            </p>
          </div>

          {/* Overall Safety Score Dial Card */}
          <div className="flex items-center gap-3.5 bg-[#eff4ff] p-3 rounded-xl border border-[#e5eeff] shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#e5eeff]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={strokeColor}
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-['JetBrains_Mono'] text-lg font-bold text-[#001318]">
                  {score}
                </span>
                <span className="font-['Inter'] text-[9px] uppercase tracking-tighter text-[#72787a]">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className={`font-['Inter'] text-xs uppercase font-bold block ${isHighRisk ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                {dossier.riskTitle}
              </span>
              <span className="font-['Inter'] text-xs text-[#0b1c30] block font-medium">
                {dossier.riskSubtitle.split('·')[0]}
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#42484a] block">
                {dossier.riskSubtitle.split('·')[1] || 'EFSA ANS Panel Re-evaluated'}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Safety Alert Callout */}
        <div className="flex items-start gap-3.5 p-4 bg-[#ffdad6]/40 rounded-xl text-[#93000a] border border-[#ffdad6]">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[26px] shrink-0 mt-0.5">
            warning
          </span>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#ba1a1a]">
                {dossier.alertHeadline}
              </span>
              <span className="px-2 py-0.5 bg-[#ba1a1a] text-white rounded font-['Inter'] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                {dossier.alertBadge}
              </span>
            </div>
            <p className="font-['Inter'] text-xs sm:text-sm leading-relaxed text-[#0b1c30]">
              {dossier.alertDescription}
            </p>
          </div>
        </div>
      </div>

      {/* 4-Column Metric KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: ADI */}
        <div className="bg-[#eff4ff] p-4 rounded-xl space-y-2 border border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[11px] font-bold text-[#42484a] uppercase tracking-wider">
              1. Acceptable Daily Intake (ADI)
            </span>
            <span className="material-symbols-outlined text-[#72787a] text-[18px]">speed</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-['JetBrains_Mono'] text-lg sm:text-xl font-bold text-[#001318]">
              {dossier.adi.range}
            </span>
            <span className="font-['Inter'] text-xs text-[#42484a] ml-1">
              {dossier.adi.unit}
            </span>
          </div>
          <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006c49] h-full rounded-full transition-all"
              style={{ width: `${dossier.adi.fillPercent}%` }}
            ></div>
          </div>
          <p className="font-['Inter'] text-xs text-[#42484a] leading-normal">
            {dossier.adi.note}
          </p>
        </div>

        {/* KPI 2: Carcinogenicity */}
        <div className="bg-[#eff4ff] p-4 rounded-xl space-y-2 border border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider">
              2. Carcinogenicity Hazard
            </span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">radiology</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-['JetBrains_Mono'] text-lg sm:text-xl font-bold text-[#ba1a1a]">
              {dossier.carcinogenicity.hazard}
            </span>
            <span className="font-['Inter'] text-xs text-[#42484a] ml-1">
              {dossier.carcinogenicity.tag}
            </span>
          </div>
          <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#ba1a1a] h-full rounded-full transition-all"
              style={{ width: `${dossier.carcinogenicity.fillPercent}%` }}
            ></div>
          </div>
          <p className="font-['Inter'] text-xs text-[#42484a] leading-normal">
            {dossier.carcinogenicity.note}
          </p>
        </div>

        {/* KPI 3: Max Ingoing */}
        <div className="bg-[#eff4ff] p-4 rounded-xl space-y-2 border border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[11px] font-bold text-[#42484a] uppercase tracking-wider">
              3. Max Permitted Ingoing (EU/IL)
            </span>
            <span className="material-symbols-outlined text-[#72787a] text-[18px]">tune</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-['JetBrains_Mono'] text-lg sm:text-xl font-bold text-[#001318]">
              {dossier.maxIngoing.value}
            </span>
            <span className="font-['Inter'] text-xs text-[#42484a] ml-1">
              {dossier.maxIngoing.unit}
            </span>
          </div>
          <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#c47d00] h-full rounded-full transition-all"
              style={{ width: `${dossier.maxIngoing.fillPercent}%` }}
            ></div>
          </div>
          <p className="font-['Inter'] text-xs text-[#42484a] leading-normal">
            {dossier.maxIngoing.note}
          </p>
        </div>

        {/* KPI 4: Pediatric & Allergen */}
        <div className="bg-[#eff4ff] p-4 rounded-xl space-y-2 border border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[11px] font-bold text-[#42484a] uppercase tracking-wider">
              4. Pediatric &amp; Allergen Risk
            </span>
            <span className="material-symbols-outlined text-[#72787a] text-[18px]">personal_injury</span>
          </div>
          <div className="space-y-0.5">
            <span className="font-['JetBrains_Mono'] text-lg sm:text-xl font-bold text-[#001318]">
              {dossier.pediatricRisk.value}
            </span>
            <span className="font-['Inter'] text-xs text-[#42484a] ml-1">
              {dossier.pediatricRisk.sub}
            </span>
          </div>
          <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#ba1a1a] h-full rounded-full transition-all"
              style={{ width: `${dossier.pediatricRisk.fillPercent}%` }}
            ></div>
          </div>
          <p className="font-['Inter'] text-xs text-[#42484a] leading-normal">
            {dossier.pediatricRisk.note}
          </p>
        </div>
      </div>
    </section>
  );
};
