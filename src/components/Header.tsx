import React from 'react';
import { Sparkles, Download, History, Radio, Wifi, WifiOff, Layers, Keyboard } from 'lucide-react';
import { ThemeSelectorDropdown } from './ThemeSelectorDropdown';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenIntegrations: () => void;
  onOpenAIEngines: () => void;
  onOpenShortcuts?: () => void;
  onOpenThemeModal?: () => void;
  isInstallable: boolean;
  onInstallPWA: () => void;
  historyCount: number;
  isOnline: boolean;
  autosaveNode?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenIntegrations,
  onOpenAIEngines,
  onOpenShortcuts,
  onOpenThemeModal,
  isInstallable,
  onInstallPWA,
  historyCount,
  isOnline,
  autosaveNode,
}) => {
  return (
    <header className="border-b border-[#E05A47]/30 bg-[#0E0D12]/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E05A47] via-[#F97316] to-[#EC4899] p-[2px] terracotta-glow flex-shrink-0">
              <div className="w-full h-full bg-[#18131B] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FB923C] animate-pulse-glow" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#FFFFFF]">
                  PLAYSTART <span className="bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] bg-clip-text text-transparent">IA</span>
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EC4899]/15 text-[#FB7185] border border-[#EC4899]/40">
                  PWA v1.0
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/40">
                  16 IAs
                </span>
              </div>
              <p className="text-xs text-[#E2E8F0] font-medium hidden sm:block">
                Todas as IAs que você precisa, em um só lugar!
              </p>
            </div>
          </div>

          {/* Mobile Right Badges */}
          <div className="flex md:hidden items-center gap-2">
            {isInstallable && (
              <button
                id="btn-pwa-install-mobile"
                onClick={onInstallPWA}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] text-white shadow-md shadow-[#E05A47]/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar</span>
              </button>
            )}
            <button
              id="btn-history-mobile"
              onClick={onOpenHistory}
              className="relative p-2 rounded-lg bg-[#1F1722] text-[#FFFFFF] border border-[#E05A47]/30"
              aria-label="Ver Histórico"
            >
              <History className="w-4 h-4 text-[#FB923C]" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EC4899] text-[9px] font-bold flex items-center justify-center text-white">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Corporate Info & Quick Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Online/Offline Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1F1722] border border-[#10B981]/30 text-xs text-[#E2E8F0] flex-shrink-0">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[11px] text-[#10B981] font-bold">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="text-[11px] text-[#F97316] font-bold">Modo Offline PWA</span>
              </>
            )}
          </div>

          {/* Dynamic Theme Controller Dropdown */}
          <ThemeSelectorDropdown onOpenFullModal={onOpenThemeModal} />

          {/* AI Matrix Modal Button */}
          <button
            id="btn-header-ai-matrix"
            onClick={onOpenAIEngines}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1722] hover:bg-[#2A1F2E] text-xs font-bold text-[#FFFFFF] border border-[#E05A47]/40 transition-all flex-shrink-0 hover:border-[#F97316] hover:shadow-md hover:shadow-[#E05A47]/20"
          >
            <Layers className="w-3.5 h-3.5 text-[#FB923C]" />
            <span className="hidden sm:inline">16 IAs Conectadas</span>
            <span className="sm:hidden">16 IAs</span>
          </button>

          {/* Integrations Modal Button */}
          <button
            id="btn-header-integrations"
            onClick={onOpenIntegrations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1722] hover:bg-[#2A1F2E] text-xs font-bold text-[#FFFFFF] border border-[#EC4899]/40 transition-all flex-shrink-0 hover:border-[#EC4899] hover:shadow-md hover:shadow-[#EC4899]/20"
          >
            <Radio className="w-3.5 h-3.5 text-[#FB7185]" />
            <span>Automações</span>
          </button>

          {/* History Button (Desktop) */}
          <button
            id="btn-header-history-desktop"
            onClick={onOpenHistory}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1722] hover:bg-[#2A1F2E] text-xs font-bold text-[#FFFFFF] border border-[#10B981]/40 transition-all relative flex-shrink-0 hover:border-[#10B981]"
          >
            <History className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Histórico</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#E05A47] to-[#EC4899] text-[10px] font-bold text-white ml-1">
                {historyCount}
              </span>
            )}
          </button>

          {/* Keyboard Shortcuts Button */}
          {onOpenShortcuts && (
            <button
              id="btn-header-shortcuts"
              onClick={onOpenShortcuts}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F1722] hover:bg-[#2A1F2E] text-xs font-bold text-[#FFFFFF] border border-[#E05A47]/40 transition-all flex-shrink-0 hover:border-[#F97316]"
              title="Guia de Atalhos de Teclado (Ctrl + /)"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#FB923C]" />
              <span>Atalhos</span>
              <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#18131B] text-[#FB923C] border border-slate-700">
                Ctrl+/
              </kbd>
            </button>
          )}

          {/* PWA Install Button (Desktop) */}
          {isInstallable && (
            <button
              id="btn-pwa-install-desktop"
              onClick={onInstallPWA}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] hover:opacity-95 text-xs font-black text-white shadow-lg shadow-[#E05A47]/30 transition-all flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Instalar App</span>
            </button>
          )}
        </div>
      </div>

      {/* Corporate Sub-strip */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-[#E05A47]/20 flex items-center justify-between gap-3 text-[11px] text-[#E2E8F0] flex-wrap">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-[#FFFFFF] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#E05A47]" />
            Grupo Rimane
          </span>
          <span className="text-[#EC4899]/40">•</span>
          <span className="text-slate-300">CNPJ: 17.431.363/0001-84</span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 font-semibold flex-wrap">
          {autosaveNode}
          <span className="text-[#34D399] flex items-center gap-1.5 bg-[#10B981]/10 px-2 py-0.5 rounded-md border border-[#10B981]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            Sistema Fallback 100% Operacional
          </span>
        </div>
      </div>
    </header>
  );
};
