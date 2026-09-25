import React from 'react';
import { Logo } from './Logo';
import { useMcpStatus } from '../services/mcpClient';

export type NavTab =
  | 'safety-dossier-scanner'
  | 'ingredient-scanner'
  | 'pesticide-mrl-lookup'
  | 'e-number-directory'
  | 'nutrition-profiler'
  | 'api-mcp-docs';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onExport: () => void;
  onOpenMcpInspector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExport,
  onOpenMcpInspector
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { status, serverInfo } = useMcpStatus();

  const navItems: Array<{ id: NavTab; label: string }> = [
    { id: 'safety-dossier-scanner', label: 'Safety Dossier Scanner' },
    { id: 'ingredient-scanner', label: 'Ingredient Scanner' },
    { id: 'pesticide-mrl-lookup', label: 'Pesticide MRL Lookup' },
    { id: 'e-number-directory', label: 'E-Number Directory' },
    { id: 'nutrition-profiler', label: 'Nutrition Profiler' },
    { id: 'api-mcp-docs', label: 'API / MCP Docs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e2e8f0]/80 shadow-[0_1px_8px_rgba(15,41,47,0.04)]">
      <div className="h-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div 
          onClick={() => setActiveTab('safety-dossier-scanner')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <Logo size={36} className="h-9 w-auto shrink-0 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-base sm:text-lg text-[#001318] leading-tight tracking-tight">
              NutriSafe ToxiScan Bio-Portal
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] sm:text-xs text-[#42484a] flex items-center gap-1.5 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${status === 'online' ? 'bg-[#006c49] animate-pulse' : 'bg-[#ba1a1a]'}`}></span>
              <span className="truncate max-w-[200px] sm:max-w-none">
                {status === 'online' ? `MCP Connected: ${serverInfo.name} v${serverInfo.version}` : 'MCP Offline'}
              </span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#e5eeff] text-[#001318] font-semibold shadow-xs'
                    : 'text-[#42484a] hover:bg-[#e5eeff]/60 hover:text-[#001318] font-normal'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenMcpInspector && (
            <button
              type="button"
              onClick={onOpenMcpInspector}
              className="flex items-center gap-1.5 bg-[#001318] text-[#4edea3] hover:text-white hover:bg-[#0f292f] border border-[#4edea3]/40 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-medium transition-all shadow-xs cursor-pointer active:scale-95"
              title="Open Model Context Protocol (MCP) Live Stream Inspector in pop-up window"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] inline-block animate-ping shrink-0" />
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span className="hidden sm:inline">MCP Inspector</span>
              <span className="sm:hidden">MCP</span>
              <span className="bg-[#006c49] text-white text-[10px] px-1 py-0.2 rounded font-bold">DEV</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 bg-[#0f292f] text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#001318] transition-all shadow-xs cursor-pointer active:scale-95"
            title="Export complete toxicology assessment as JSON or printable document"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">download</span>
            <span className="hidden sm:inline">Export PDF / JSON</span>
            <span className="sm:hidden">Export</span>
          </button>

          <div
            className="w-8 h-8 rounded-full bg-[#001318] flex items-center justify-center text-white shrink-0 shadow-xs cursor-pointer hover:bg-[#0f292f] transition-colors"
            title="Assay Session: Analyst #TXS-88219"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#001318] hover:bg-[#e5eeff] transition-colors"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#f8f9ff] border-b border-[#e2e8f0] px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between ${
                  isActive
                    ? 'bg-[#e5eeff] text-[#001318] font-semibold'
                    : 'text-[#42484a] hover:bg-[#e5eeff]/50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="material-symbols-outlined text-[18px] text-[#006c49]">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
