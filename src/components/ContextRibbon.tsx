import React from 'react';
import { useMcpStatus, MCP_PATH } from '../services/mcpClient';

interface ContextRibbonProps {
  latency?: number | null;
}

export const ContextRibbon: React.FC<ContextRibbonProps> = ({ latency: propLatency }) => {
  const { status, latency: statusLatency, dataset } = useMcpStatus();
  const displayLatency = propLatency !== undefined ? propLatency : statusLatency;
  const latencyText = status === 'offline' || displayLatency === null || displayLatency === undefined ? '--' : `${displayLatency}ms`;

  return (
    <div className="w-full bg-[#eff4ff] border-b border-[#e2e8f0]/60 px-4 sm:px-6 lg:px-8 py-1.5 text-[#42484a]">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 font-['JetBrains_Mono'] text-[11px] sm:text-xs">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className={`flex items-center gap-1.5 font-semibold ${status === 'online' ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
            <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-[#006c49] animate-pulse' : 'bg-[#ba1a1a]'}`}></span>
            MCP ENDPOINT: {MCP_PATH} ({status.toUpperCase()})
          </span>
          <span className="text-[#c2c7c9] hidden sm:inline">|</span>
          <span className="text-[#42484a]">LATENCY: {latencyText}</span>
          <span className="text-[#c2c7c9] hidden md:inline">|</span>
          <span className="text-[#42484a] hidden md:inline">
            DEMO DATASET: {dataset.additives} additives · {dataset.foods} foods · {dataset.pesticides} pesticides
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-[#0b1c30] text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-[#006c49]">info</span>
            Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
          </span>
        </div>
      </div>
    </div>
  );
};
