import React, { useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Eye,
  Sliders,
  Flame,
  Zap,
  Briefcase,
  ShieldCheck,
  Sun,
  Layers,
  CheckCircle2,
  Brush,
  Copy
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeConfig, ThemeId } from '../types/themes';

const PRESET_ACCENTS = [
  { label: 'Terracota Original', color: '#E05A47' },
  { label: 'Laranja Pôr do Sol', color: '#F97316' },
  { label: 'Rosa Neon', color: '#EC4899' },
  { label: 'Ciano Elétrico', color: '#06B6D4' },
  { label: 'Azul Royal', color: '#2563EB' },
  { label: 'Verde Esmeralda', color: '#10B981' },
  { label: 'Dourado Âmbar', color: '#F59E0B' },
  { label: 'Roxo Ametista', color: '#8B5CF6' },
  { label: 'Vermelho Carmesim', color: '#EF4444' },
  { label: 'Branco Puro', color: '#FFFFFF' },
];

export const ThemeControllerModal: React.FC = () => {
  const {
    currentTheme,
    themeId,
    availableThemes,
    customAccentColor,
    setTheme,
    setCustomAccentColor,
    resetTheme,
    isThemeModalOpen,
    setIsThemeModalOpen,
  } = useTheme();

  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'palettes' | 'customizer'>('palettes');

  if (!isThemeModalOpen) return null;

  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#06B6D4]" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-[#3B82F6]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[#10B981]" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-[#F59E0B]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#8B5CF6]" />;
      default:
        return <Flame className="w-4 h-4 text-[#E05A47]" />;
    }
  };

  const handleCopyCSSVariables = () => {
    const cssText = `:root {
  --theme-primary: ${currentTheme.colors.primary};
  --theme-secondary: ${currentTheme.colors.secondary};
  --theme-accent: ${currentTheme.colors.accent};
  --theme-bg: ${currentTheme.colors.background};
  --theme-bg-surface: ${currentTheme.colors.backgroundSurface};
  --theme-bg-card: ${currentTheme.colors.backgroundCard};
  --theme-border: ${currentTheme.colors.border};
  --theme-glow: ${currentTheme.colors.glowColor};
}`;
    navigator.clipboard.writeText(cssText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        id="theme-controller-modal"
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0E0D14] border border-[#E05A47]/40 shadow-2xl shadow-black/80 overflow-hidden"
        style={{ borderColor: currentTheme.colors.primary }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#14111A]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl p-[2px] flex items-center justify-center shadow-lg"
              style={{ background: currentTheme.colors.gradientBrand }}
            >
              <div className="w-full h-full bg-[#120F18] rounded-[10px] flex items-center justify-center">
                <Palette className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Dynamic Theme Controller</h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${currentTheme.colors.primary}20`,
                    color: currentTheme.colors.primary,
                    border: `1px solid ${currentTheme.colors.primary}40`,
                  }}
                >
                  {currentTheme.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalize a identidade estética, variáveis CSS e atmosfera visual do PlayStart IA em tempo real.
              </p>
            </div>
          </div>

          <button
            id="btn-close-theme-modal"
            type="button"
            onClick={() => setIsThemeModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#100D16] border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('palettes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'palettes'
                ? 'bg-[#1F1722] text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
            <span>Paletas Temáticas ({availableThemes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'customizer'
                ? 'bg-[#1F1722] text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brush className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Customizar Acentos & CSS</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'palettes' ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selecione uma Paleta Estética
                </span>
                <span className="text-xs text-slate-400">
                  Atualização instantânea em toda a interface
                </span>
              </div>

              {/* Themes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {availableThemes.map((theme) => {
                  const isSelected = theme.id === themeId;
                  return (
                    <div
                      key={theme.id}
                      id={`theme-card-${theme.id}`}
                      onClick={() => setTheme(theme.id)}
                      className={`group cursor-pointer p-4 rounded-xl transition-all flex flex-col justify-between gap-3 border ${
                        isSelected
                          ? 'bg-[#1B1522] shadow-xl ring-2'
                          : 'bg-[#14111A] hover:bg-[#1C1724] border-slate-800 hover:border-slate-700'
                      }`}
                      style={{
                        borderColor: isSelected ? theme.colors.primary : undefined,
                        boxShadow: isSelected ? `0 0 20px -3px ${theme.colors.glowColor}` : undefined,
                      }}
                    >
                      {/* Top Info */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${theme.colors.primary}20` }}
                            >
                              {getThemeIcon(theme.iconName)}
                            </div>
                            <span className="text-sm font-bold text-white group-hover:text-white">
                              {theme.name}
                            </span>
                          </div>

                          {isSelected && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                              style={{
                                backgroundColor: `${theme.colors.primary}25`,
                                color: theme.colors.primary,
                                border: `1px solid ${theme.colors.primary}50`,
                              }}
                            >
                              <Check className="w-3 h-3" />
                              <span>Ativo</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                          {theme.description}
                        </p>
                      </div>

                      {/* Color Palette Strip */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-medium">Cores do Tema</span>
                          <span className="text-[9px] text-slate-400 font-mono">{theme.vibe}</span>
                        </div>

                        {/* Gradient Bar */}
                        <div
                          className="w-full h-3 rounded-md shadow-inner"
                          style={{ background: theme.colors.gradientBrand }}
                        />

                        {/* Swatches Array */}
                        <div className="grid grid-cols-5 gap-1.5">
                          <div
                            className="h-6 rounded flex items-center justify-center text-[9px] font-bold border border-black/20"
                            style={{ backgroundColor: theme.colors.primary, color: '#000' }}
                            title={`Primary: ${theme.colors.primary}`}
                          >
                            P
                          </div>
                          <div
                            className="h-6 rounded flex items-center justify-center text-[9px] font-bold border border-black/20"
                            style={{ backgroundColor: theme.colors.secondary, color: '#000' }}
                            title={`Secondary: ${theme.colors.secondary}`}
                          >
                            S
                          </div>
                          <div
                            className="h-6 rounded flex items-center justify-center text-[9px] font-bold border border-black/20"
                            style={{ backgroundColor: theme.colors.accent, color: '#000' }}
                            title={`Accent: ${theme.colors.accent}`}
                          >
                            A
                          </div>
                          <div
                            className="h-6 rounded flex items-center justify-center text-[9px] font-bold text-white border border-white/10"
                            style={{ backgroundColor: theme.colors.backgroundSurface }}
                            title={`Surface: ${theme.colors.backgroundSurface}`}
                          >
                            Sur
                          </div>
                          <div
                            className="h-6 rounded flex items-center justify-center text-[9px] font-bold text-white border border-white/10"
                            style={{ backgroundColor: theme.colors.background }}
                            title={`Background: ${theme.colors.background}`}
                          >
                            BG
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Custom Accent Color Presets */}
              <div className="p-4 rounded-xl bg-[#14111A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brush className="w-4 h-4 text-[#FB923C]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Cor de Destaque Personalizada (Accent Override)
                    </span>
                  </div>
                  {customAccentColor && (
                    <button
                      type="button"
                      onClick={() => setCustomAccentColor(null)}
                      className="text-[11px] text-[#EC4899] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurar Padrão da Paleta</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Substitua a cor primária global da interface mantendo a harmonia da paleta selecionada.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {PRESET_ACCENTS.map((preset) => {
                    const isSelected = customAccentColor === preset.color || (!customAccentColor && currentTheme.colors.primary === preset.color);
                    return (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => setCustomAccentColor(preset.color)}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-left ${
                          isSelected
                            ? 'bg-[#1F1722] border-white text-white shadow-md'
                            : 'bg-[#18131C] border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border border-black/30"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="text-[11px] font-semibold truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CSS Variables Export / Preview */}
              <div className="p-4 rounded-xl bg-[#14111A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Variáveis CSS Injetadas no :root
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCSSVariables}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-semibold"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copiado!' : 'Copiar CSS'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#0A090E] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                  <p><span className="text-[#EC4899]">--theme-primary:</span> <span style={{ color: currentTheme.colors.primary }}>{currentTheme.colors.primary}</span>;</p>
                  <p><span className="text-[#EC4899]">--theme-secondary:</span> <span style={{ color: currentTheme.colors.secondary }}>{currentTheme.colors.secondary}</span>;</p>
                  <p><span className="text-[#EC4899]">--theme-accent:</span> <span style={{ color: currentTheme.colors.accent }}>{currentTheme.colors.accent}</span>;</p>
                  <p><span className="text-[#EC4899]">--theme-bg:</span> <span className="text-slate-400">{currentTheme.colors.background}</span>;</p>
                  <p><span className="text-[#EC4899]">--theme-border:</span> <span className="text-slate-400">{currentTheme.colors.border}</span>;</p>
                  <p><span className="text-[#EC4899]">--theme-glow:</span> <span className="text-slate-400">{currentTheme.colors.glowColor}</span>;</p>
                </div>
              </div>
            </div>
          )}

          {/* Live Component Preview Sandbox */}
          <div className="p-4 rounded-xl bg-[#14111A] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Live Component Sandbox (Preview em Tempo Real)
              </span>
            </div>

            <div
              className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
              style={{
                backgroundColor: currentTheme.colors.backgroundSurface,
                borderColor: currentTheme.colors.border,
                boxShadow: `0 0 25px -5px ${currentTheme.colors.glowColor}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md font-bold text-black"
                  style={{ background: currentTheme.colors.gradientBrand }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Card Interativo Estilizado</h4>
                  <p className="text-xs text-slate-400">
                    Componentes reagem dinamicamente à paleta <strong style={{ color: currentTheme.colors.primary }}>{currentTheme.name}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold uppercase"
                  style={{
                    backgroundColor: `${currentTheme.colors.primary}25`,
                    color: currentTheme.colors.primary,
                    border: `1px solid ${currentTheme.colors.primary}60`,
                  }}
                >
                  Badge Ativa
                </span>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg transition-transform active:scale-95"
                  style={{
                    background: currentTheme.colors.gradientBrand,
                    boxShadow: `0 0 15px -3px ${currentTheme.colors.glowColor}`,
                  }}
                >
                  Botão de Ação
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#120F18] border-t border-slate-800">
          <button
            type="button"
            onClick={resetTheme}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Tema Padrão</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-apply-theme-confirm"
              onClick={() => setIsThemeModalOpen(false)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5"
              style={{
                background: currentTheme.colors.gradientBrand,
                boxShadow: `0 0 15px -3px ${currentTheme.colors.glowColor}`,
              }}
            >
              <Check className="w-4 h-4" />
              <span>Concluir & Aplicar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
