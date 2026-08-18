import React from 'react';
import { 
  CheckCheck, 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Flame, 
  Target, 
  Film, 
  Copy, 
  Layers, 
  AlertCircle,
  Lightbulb,
  SlidersHorizontal,
  ThumbsUp
} from 'lucide-react';
import { GrammarToneResult, ToneVariation } from '../types';

interface GrammarToneModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GrammarToneResult | null;
  onApplyPrompt: (newPrompt: string, label: string) => void;
}

export const GrammarToneModal: React.FC<GrammarToneModalProps> = ({
  isOpen,
  onClose,
  result,
  onApplyPrompt,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen || !result) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        id="grammar-tone-modal-panel"
        className="bg-[#1E1E2F] border border-[#06B6D4]/50 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F111A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#06B6D4]/15 text-[#67E8F9] border border-[#06B6D4]/30 shadow-md shadow-[#06B6D4]/10">
              <CheckCheck className="w-5 h-5 text-[#06B6D4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Revisão de Gramática, Tom & Clareza
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#67E8F9] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini LLM
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Diagnóstico linguístico e sugestões de alto engajamento antes da geração
              </p>
            </div>
          </div>

          <button
            id="btn-close-grammar-tone-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1E1E2F] text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5 scrollbar-thin">
          {/* 1. Metric Scores Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Grammar Score */}
            <div className="p-3 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Gramática & Sintaxe
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-black ${getScoreColor(result.grammarScore).split(' ')[0]}`}>
                  {result.grammarScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">precisão</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${result.grammarScore}%` }} 
                />
              </div>
            </div>

            {/* Clarity Score */}
            <div className="p-3 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Índice de Clareza
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-black ${getScoreColor(result.clarityScore).split(' ')[0]}`}>
                  {result.clarityScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">nítido p/ IA</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-[#06B6D4] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${result.clarityScore}%` }} 
                />
              </div>
            </div>

            {/* Engagement Score */}
            <div className="p-3 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Potencial Engajamento
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-black ${getScoreColor(result.engagementScore).split(' ')[0]}`}>
                  {result.engagementScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium">retenção</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-purple-400 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${result.engagementScore}%` }} 
                />
              </div>
            </div>

            {/* Detected Tone */}
            <div className="p-3 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tom Detectado
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-[#67E8F9] line-clamp-1">
                  {result.detectedTone || 'Equilibrado'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">
                Identificado automaticamente
              </span>
            </div>
          </div>

          {/* 2. Diagnostic Summary & Points of Improvement */}
          <div className="p-3.5 sm:p-4 bg-[#0F111A] rounded-xl border border-[#06B6D4]/30 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#06B6D4] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-[#F8FAFC]">
                  Análise do Revisor de IA:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.summaryCritique}
                </p>
              </div>
            </div>

            {result.improvementsList && result.improvementsList.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Melhorias Identificadas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {result.improvementsList.map((imp, idx) => (
                    <div 
                      key={idx}
                      className="p-2 bg-[#141622] rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-[#06B6D4] font-bold">•</span>
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Direct Grammar Correction (Side-by-Side Comparison) */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              Correção Gramatical & Sintática Direta:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Original */}
              <div className="p-3.5 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col justify-between gap-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Prompt Original
                  </span>
                  <p className="text-xs text-slate-400 italic">
                    "{result.originalPrompt}"
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {result.originalPrompt.length} caracteres
                </span>
              </div>

              {/* Corrected */}
              <div className="p-3.5 bg-[#0F111A] rounded-xl border border-emerald-500/40 flex flex-col justify-between gap-2.5 shadow-md shadow-emerald-500/5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Versão Gramaticalmente Polida
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                      100% Correta
                    </span>
                  </div>
                  <p className="text-xs text-[#F8FAFC] font-medium">
                    "{result.correctedPrompt}"
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleCopy(result.correctedPrompt, 'corrected')}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'corrected' ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    id="btn-apply-corrected-prompt"
                    type="button"
                    onClick={() => {
                      onApplyPrompt(result.correctedPrompt, 'Correção Gramatical');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aplicar Correção Direta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Tone & Engagement Variations */}
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#06B6D4]" />
                Variações de Tom & Estilo (Sugestões de Engajamento):
              </span>
              <span className="text-[11px] text-slate-400">
                Escolha o tom ideal para sua campanha
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.toneSuggestions && result.toneSuggestions.map((variant) => {
                const isClarity = variant.id.includes('clarity');
                const isEngagement = variant.id.includes('engagement') || variant.id.includes('viral');
                const isCinematic = variant.id.includes('cinematic') || variant.id.includes('premium');

                const borderClass = isClarity
                  ? 'border-cyan-500/40 hover:border-cyan-400'
                  : isEngagement
                  ? 'border-purple-500/40 hover:border-purple-400'
                  : 'border-amber-500/40 hover:border-amber-400';

                const badgeBg = isClarity
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : isEngagement
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                const Icon = isClarity ? Target : isEngagement ? Flame : Film;

                return (
                  <div
                    key={variant.id}
                    id={`card-tone-${variant.id}`}
                    className={`bg-[#0F111A] border rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-all shadow-md ${borderClass}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeBg}`}>
                          <Icon className="w-3 h-3" />
                          {variant.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[120px]">
                          {variant.tone}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {variant.text}
                      </p>

                      <div className="p-2.5 bg-[#141622] rounded-lg border border-slate-800 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Prompt Sugerido:
                        </span>
                        <p className="text-xs text-[#F8FAFC] font-medium line-clamp-4 leading-relaxed">
                          "{variant.prompt}"
                        </p>
                      </div>

                      {variant.keyChanges && (
                        <span className="text-[10px] text-slate-400 italic">
                          ⚡ {variant.keyChanges}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleCopy(variant.prompt, variant.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === variant.id ? 'Copiado!' : 'Copiar'}</span>
                      </button>

                      <button
                        id={`btn-apply-tone-${variant.id}`}
                        type="button"
                        onClick={() => {
                          onApplyPrompt(variant.prompt, `Tom: ${variant.tone}`);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-[#06B6D4]/20 transition-all"
                      >
                        <span>Usar Este Tom</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#0F111A] flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">
            PLAYSTART IA • As alterações aplicadas criam automaticamente um ponto no histórico de versões.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#1E1E2F] hover:bg-slate-800 text-slate-300 font-semibold border border-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
