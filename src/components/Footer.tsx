import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#eff4ff] border-t border-[#e2e8f0] shadow-[0_-1px_8px_rgba(15,41,47,0.02)] mt-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-[#e2e8f0]/80">
          {/* Col 1 & 2 */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-[#006c49]">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-base sm:text-lg text-[#001318]">
                Analytical Regulatory Compliance Notice
              </span>
            </div>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#42484a] leading-relaxed max-w-xl">
              NutriSafe ToxiScan is a precision bio-informatics clinical support module integrated via Model Context Protocol (MCP). Chemical threshold assessments and toxicology indices are dynamically reconciled against active codices.
            </p>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="font-['Inter'] text-[11px] font-bold text-[#42484a] uppercase tracking-wider block">
              Synchronized Harmonization
            </span>
            <ul className="space-y-1.5 font-['JetBrains_Mono'] text-xs text-[#0b1c30]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] shrink-0"></span>
                <span>WHO/FAO Codex Alimentarius (CXS 192-1995)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] shrink-0"></span>
                <span>EFSA OpenFoodTox Chemical Hazards</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] shrink-0"></span>
                <span>IL-MoH Public Health Protection (Food 5780)</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <span className="font-['Inter'] text-[11px] font-bold text-[#42484a] uppercase tracking-wider block">
              Clinical Disclaimer
            </span>
            <p className="font-['Inter'] text-xs text-[#42484a] leading-relaxed">
              Calculated toxicological limits and Acceptable Daily Intake (ADI) metrics do not constitute definitive diagnostic legal certificates. Verified laboratory assays prevail.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-['JetBrains_Mono'] text-xs text-[#42484a]">
            &copy; 2025 NutriSafe Bio-Informatics MCP. ISO 17025 Compliant Toxicology Node.
          </span>

          <div className="flex items-center gap-4 sm:gap-6 font-['Inter'] text-xs text-[#42484a] flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006c49]">security</span>
              <span>Codex Validated</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006c49]">policy</span>
              <span>EFSA SafeHarbor Sync</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006c49]">bolt</span>
              <span>MCP Stream 4.2.1</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
