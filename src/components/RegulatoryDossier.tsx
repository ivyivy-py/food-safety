import React from 'react';
import { AdditiveDossier } from '../types';

interface RegulatoryDossierProps {
  dossier: AdditiveDossier;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const RegulatoryDossier: React.FC<RegulatoryDossierProps> = ({
  dossier,
  onSync,
  isSyncing = false
}) => {
  return (
    <section className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 sm:p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#001318] text-[22px]">
              policy
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl text-[#001318]">
              Cross-Jurisdictional Regulatory Agency Dossier
            </h3>
          </div>
          <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a]">
            Harmonized status analysis across major toxicological bodies for {dossier.ins} ({dossier.chemicalName}).
          </p>
        </div>

        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] text-[#001318] rounded-md font-['JetBrains_Mono'] text-xs hover:bg-[#e5eeff] border border-[#e5eeff] transition-colors cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>{isSyncing ? 'Synchronizing...' : 'Sync Codices'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {dossier.regulatoryDossier.map((reg, idx) => {
          let dotColor = "bg-[#006c49]";
          let statusTextClass = "text-[#006c49]";
          if (reg.statusColor === "error") {
            dotColor = "bg-[#ba1a1a]";
            statusTextClass = "text-[#ba1a1a]";
          } else if (reg.statusColor === "amber") {
            dotColor = "bg-[#c47d00]";
            statusTextClass = "text-[#c47d00]";
          }

          return (
            <div
              key={idx}
              className="bg-[#eff4ff] p-4 rounded-xl space-y-3 flex flex-col justify-between border border-[#e5eeff]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm sm:text-base text-[#001318]">
                    {reg.agency}
                  </span>
                  <span className={`w-3 h-3 rounded-full ${dotColor} shrink-0`}></span>
                </div>
                <span className="font-['Inter'] text-[11px] font-bold text-[#72787a] uppercase tracking-wider block">
                  {reg.reg}
                </span>
                <p className="font-['Inter'] text-xs text-[#42484a] leading-relaxed">
                  {reg.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5eeff] font-['JetBrains_Mono'] text-xs space-y-1">
                <div className="flex justify-between text-[#0b1c30]">
                  <span className="text-[#42484a]">ADI:</span>
                  <span className="font-semibold">{reg.adi}</span>
                </div>
                <div className="flex justify-between text-[#0b1c30]">
                  <span className="text-[#42484a]">Status:</span>
                  <span className={`font-semibold ${statusTextClass}`}>
                    {reg.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
