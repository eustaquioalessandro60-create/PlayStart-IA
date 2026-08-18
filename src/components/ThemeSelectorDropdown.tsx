import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Sliders, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeId } from '../types/themes';

interface ThemeSelectorDropdownProps {
  onOpenFullModal?: () => void;
}

export const ThemeSelectorDropdown: React.FC<ThemeSelectorDropdownProps> = ({
  onOpenFullModal,
}) => {
  const { currentTheme, themeId, availableThemes, setTheme, setIsThemeModalOpen } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="btn-theme-selector-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F1722] hover:bg-[#2A1F2E] text-xs font-bold text-[#FFFFFF] border border-[#E05A47]/40 transition-all flex-shrink-0 hover:border-[#F97316] hover:shadow-md hover:shadow-[#E05A47]/20"
        title="Alterar Tema Visual & Paleta Estética"
      >
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#FB923C]" />
          {/* Swatch dots */}
          <div className="flex items-center -space-x-1">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-sm"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
          </div>
        </div>

        <span className="hidden lg:inline text-slate-200">{currentTheme.name}</span>
        <span className="lg:hidden text-slate-200">Tema</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id="dropdown-theme-options"
          className="absolute right-0 mt-2 w-72 p-2.5 rounded-xl bg-[#121018]/95 backdrop-blur-xl border border-[#E05A47]/30 shadow-2xl z-50 animate-fadeIn flex flex-col gap-2 text-xs"
        >
          <div className="flex items-center justify-between px-1.5 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
              <span className="font-extrabold text-white uppercase text-[10px] tracking-wider">
                Paletas Estéticas ({availableThemes.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsThemeModalOpen(true);
                if (onOpenFullModal) onOpenFullModal();
              }}
              className="text-[10px] text-[#67E8F9] hover:underline flex items-center gap-0.5 font-semibold"
            >
              <Sliders className="w-3 h-3" />
              <span>Painel</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
            {availableThemes.map((theme) => {
              const isSelected = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  id={`btn-select-theme-${theme.id}`}
                  type="button"
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-[#E05A47]/15 border-[#E05A47]/50 text-white shadow-sm'
                      : 'bg-[#18131C] border-slate-800 hover:border-slate-700 hover:bg-[#201824] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Swatch mini bar */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate text-white">{theme.name}</span>
                        <span
                          className="text-[9px] px-1 py-0.2 rounded font-semibold uppercase"
                          style={{
                            backgroundColor: `${theme.colors.primary}20`,
                            color: theme.colors.primary,
                            border: `1px solid ${theme.colors.primary}40`,
                          }}
                        >
                          {theme.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">{theme.vibe}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#FB923C] flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between px-1">
            <span className="text-[10px] text-slate-400">Atalho rápido:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#18131C] text-[10px] font-mono text-slate-300 border border-slate-700">
              Alt + M
            </kbd>
          </div>
        </div>
      )}
    </div>
  );
};
