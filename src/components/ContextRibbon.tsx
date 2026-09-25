import React from 'react';

interface ContextRibbonProps {
  latency?: number;
  source?: string;
  sessionId?: string;
}

export const ContextRibbon: React.FC<ContextRibbonProps> = ({
  latency = 142,
  sessionId = "#TXS-88219-B"
}) => {
  return (
    <div className="w-full bg-[#eff4ff] border-b border-[#e2e8f0]/60 px-4 sm:px-6 lg:px-8 py-1.5 text-[#42484a]">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 font-['JetBrains_Mono'] text-[11px] sm:text-xs">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-[#006c49]">
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
            MCP ENDPOINT: food-safety-v4.2.prod
          </span>
          <span className="text-[#c2c7c9] hidden sm:inline">|</span>
          <span className="text-[#42484a]">LATENCY: {latency}ms</span>
          <span className="text-[#c2c7c9] hidden md:inline">|</span>
          <span className="text-[#42484a] hidden md:inline">
            SYNCHRONIZED CODICES: CXS 192, EFSA OpenFoodTox 2024.1, IL-MoH 5780
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="bg-[#e5eeff] px-2 py-0.5 rounded text-[#0b1c30] font-medium">
            SESSION: {sessionId}
          </span>
          <span className="text-[#c2c7c9]">|</span>
          <span className="flex items-center gap-1 text-[#0b1c30]">
            <span className="material-symbols-outlined text-[14px] text-[#006c49]">shield</span>
            ISO 17025 Data Verified
          </span>
        </div>
      </div>
    </div>
  );
};
