import React from 'react';
import {
  Sparkles,
  Zap,
  Check,
  X,
  ChevronRight,
  Sliders,
  Video,
  Layers,
  ArrowUpRight,
  Flame,
  Camera,
  MessageSquare
} from 'lucide-react';

export interface PredictiveCompletionItem {
  id: string;
  type: 'natural' | 'visual_8k' | 'viral_hook' | 'high_cta' | string;
  label: string;
  completionText: string;
  category: string;
}

export interface PredictivePromptResponse {
  inlineGhostText?: string;
  completions: PredictiveCompletionItem[];
  detectedIntent?: string;
}

interface PredictivePromptSuggesterProps {
  currentPrompt: string;
  predictiveData: PredictivePromptResponse | null;
  isLoading: boolean;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  onAcceptCompletion: (completionText: string, label: string) => void;
  onDismiss: () => void;
}

export const PredictivePromptSuggester: React.FC<PredictivePromptSuggesterProps> = ({
  currentPrompt,
  predictiveData,
  isLoading,
  isEnabled,
  onToggleEnabled,
  onAcceptCompletion,
  onDismiss,
}) => {
  if (!isEnabled) {
    return (
      <div className="flex items-center justify-end px-2 py-1">
        <button
          type="button"
          onClick={onToggleEnabled}
          id="btn-enable-predictive-prompting"
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#06B6D4] transition-colors py-0.5 px-2 rounded bg-[#18131C] border border-slate-800 hover:border-[#06B6D4]/40"
          title="Ativar Escrita Preditiva em Tempo Real com IA"
        >
          <Zap className="w-3 h-3 text-slate-500" />
          <span>Ativar Preditivo IA (Pausa de Digitação)</span>
        </button>
      </div>
    );
  }

  // If loading and prompt is long enough
  if (isLoading && currentPrompt.trim().length >= 5) {
    return (
      <div
        id="predictive-prompt-loading-strip"
        className="mx-1 my-1.5 px-3 py-1.5 rounded-lg bg-[#0F111A]/90 border border-[#06B6D4]/30 flex items-center justify-between gap-2 text-xs animate-pulse text-slate-300"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4] animate-spin" />
          <span className="text-[11px] font-medium text-[#67E8F9]">
            PlayStart IA analisando intenção e gerando continuações preditivas...
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Gemini 3.7 Flash</span>
      </div>
    );
  }

  // If there are no completions or prompt is empty, show minimal idle state
  if (!predictiveData || !predictiveData.completions || predictiveData.completions.length === 0) {
    return null;
  }

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'visual_8k':
        return <Camera className="w-3 h-3 text-[#38BDF8]" />;
      case 'viral_hook':
        return <Flame className="w-3 h-3 text-[#FB7185]" />;
      case 'high_cta':
        return <Zap className="w-3 h-3 text-[#FBBF24]" />;
      default:
        return <MessageSquare className="w-3 h-3 text-[#34D399]" />;
    }
  };

  const getCategoryBadgeClass = (type: string) => {
    switch (type) {
      case 'visual_8k':
        return 'bg-[#0284C7]/15 text-[#38BDF8] border-[#0284C7]/30';
      case 'viral_hook':
        return 'bg-[#E11D48]/15 text-[#FB7185] border-[#E11D48]/30';
      case 'high_cta':
        return 'bg-[#D97706]/15 text-[#FBBF24] border-[#D97706]/30';
      default:
        return 'bg-[#059669]/15 text-[#34D399] border-[#059669]/30';
    }
  };

  return (
    <div
      id="predictive-prompt-container"
      className="mx-1 my-1.5 p-2.5 rounded-xl bg-gradient-to-br from-[#12111E] via-[#161224] to-[#1D1426] border border-[#06B6D4]/30 shadow-lg animate-fadeIn flex flex-col gap-2"
    >
      {/* Header Bar with Intent & Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#06B6D4]/15 border border-[#06B6D4]/40 text-[#67E8F9] text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#67E8F9] animate-pulse" />
            <span>Escrita Preditiva IA</span>
          </div>

          {predictiveData.detectedIntent && (
            <span className="text-[11px] text-slate-300 hidden sm:inline-flex items-center gap-1">
              <span className="text-slate-500">Nicho:</span>
              <strong className="text-white font-semibold">{predictiveData.detectedIntent}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {predictiveData.inlineGhostText && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-[#18131C] px-1.5 py-0.5 rounded border border-slate-700">
              Pressione <kbd className="text-[#67E8F9] font-bold">Tab</kbd> para autocompletar
            </span>
          )}

          <button
            type="button"
            onClick={onToggleEnabled}
            id="btn-toggle-predictive-feature"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-[10px] flex items-center gap-1"
            title="Pausar / Desativar sugestões preditivas"
          >
            <Sliders className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={onDismiss}
            id="btn-dismiss-predictive"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar sugestões preditivas atuais"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Fast Ghost Completion Pill (If available) */}
      {predictiveData.inlineGhostText && (
        <div
          id="predictive-ghost-suggestion-pill"
          onClick={() =>
            onAcceptCompletion(
              predictiveData.inlineGhostText!,
              'Autocompletar com Tab'
            )
          }
          className="group cursor-pointer px-2.5 py-1.5 rounded-lg bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/30 hover:border-[#06B6D4]/60 transition-all flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#06B6D4]/20 text-[#67E8F9] uppercase flex-shrink-0">
              Tab / Clique
            </span>
            <span className="text-xs text-slate-200 group-hover:text-white truncate">
              <span className="opacity-50">{currentPrompt.slice(-25)}</span>
              <strong className="text-[#67E8F9] font-semibold">
                {predictiveData.inlineGhostText}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#67E8F9] font-bold flex-shrink-0">
            <span>Aceitar</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      )}

      {/* Grid of 3-4 Strategic Predictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {predictiveData.completions.map((item) => (
          <div
            key={item.id}
            id={`predictive-item-${item.id}`}
            onClick={() => onAcceptCompletion(item.completionText, item.label)}
            className="group cursor-pointer p-2 rounded-lg bg-[#18131C]/90 hover:bg-[#231A2B] border border-slate-800 hover:border-[#06B6D4]/50 transition-all flex flex-col justify-between gap-1.5 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getCategoryBadgeClass(
                  item.type
                )}`}
              >
                {getCategoryIcon(item.type)}
                <span>{item.category}</span>
              </span>

              <span className="text-[10px] text-slate-400 group-hover:text-[#67E8F9] font-semibold flex items-center gap-0.5">
                <span>+ Inserir</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

            <p className="text-[11px] text-slate-300 group-hover:text-white line-clamp-2 leading-relaxed font-normal">
              "{item.completionText}"
            </p>

            <span className="text-[10px] text-slate-400 font-medium truncate">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
