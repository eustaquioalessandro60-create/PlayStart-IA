import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Layers, 
  ArrowRight, 
  Info, 
  RefreshCw, 
  ChevronRight, 
  Flame, 
  Target, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { CreationData, SocialNetwork } from '../types';
import { SmartScheduleAnalysis, SmartTimeSlot } from '../types/smartScheduler';

interface SmartSchedulerProps {
  creation: CreationData;
  selectedNetworks: SocialNetwork[];
  activeFormat?: string;
  onSelectSlot: (slot: SmartTimeSlot) => void;
  selectedSlotId?: string | null;
  currentScheduledDate?: string;
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  creation,
  selectedNetworks,
  activeFormat = '9:16',
  onSelectSlot,
  selectedSlotId,
  currentScheduledDate,
}) => {
  const [analysis, setAnalysis] = useState<SmartScheduleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'slots' | 'networks'>('slots');
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchSmartSchedule = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch('/api/smart-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: creation.prompt,
          enhancedPrompt: creation.enhancedPrompt,
          title: creation.visualTheme?.title || creation.prompt,
          selectedNetworks,
          activeFormat: creation.activeFormat || activeFormat,
          captions: creation.captions || {},
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.error('Error fetching smart schedule:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartSchedule();
  }, [creation.id, selectedNetworks.join(',')]);

  return (
    <div className="bg-[#140F18] border border-[#E05A47]/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#E05A47] to-[#F97316] text-white shadow-md shadow-[#E05A47]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Smart Scheduler com IA
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-[#E05A47]/20 border border-[#E05A47]/40 text-[10px] font-bold text-[#FB923C] flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Análise em tempo real do formato & nicho para maximizar picos de audiência e retenção.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center bg-[#18131C] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('slots')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'slots'
                  ? 'bg-[#E05A47] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Horários de Pico
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('networks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'networks'
                  ? 'bg-[#E05A47] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Janelas por Rede
            </button>
          </div>

          <button
            type="button"
            onClick={fetchSmartSchedule}
            disabled={isLoading}
            title="Recalcular horários com IA"
            className="p-2 rounded-xl bg-[#18131C] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#E05A47]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !analysis && (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#E05A47]/20 border-t-[#E05A47] animate-spin" />
            <Sparkles className="w-4 h-4 text-[#FB923C] absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-white">
              Analisando engajamento e algoritmos sociais...
            </span>
            <span className="text-[11px] text-slate-400">
              Cruzando formato {creation.activeFormat || activeFormat} com métricas de retenção para {selectedNetworks.join(', ')}.
            </span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && !analysis && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center justify-between">
          <span>Não foi possível carregar a recomendação inteligente no momento.</span>
          <button
            type="button"
            onClick={fetchSmartSchedule}
            className="px-2.5 py-1 rounded-lg bg-red-500/20 text-white font-bold hover:bg-red-500/30"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Loaded Content */}
      {analysis && (
        <div className="flex flex-col gap-4">
          {/* AI Content Strategy HUD Bar */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#18131C] border border-slate-800/90 flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nicho Identificado:
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#E05A47]/15 border border-[#E05A47]/30 text-xs font-bold text-[#FB923C]">
                  {analysis.contentTypeDetected}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Urgência:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  analysis.contentUrgency === 'Alta' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {analysis.contentUrgency}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic border-t border-slate-800/60 pt-2">
              "{analysis.overallRecommendation}"
            </p>
          </div>

          {/* TAB 1: Optimal Slots Grid */}
          {activeTab === 'slots' && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#E05A47]" />
                  Horários Estratégicos Sugeridos (Clique para aplicar):
                </span>
                <span className="text-[10px] text-slate-400">
                  Baseado em +1.2M de interações sociais
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.optimalSlots.map((slot) => {
                  const isSelected = 
                    selectedSlotId === slot.id || 
                    currentScheduledDate === slot.isoDateTime;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => onSelectSlot(slot)}
                      className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#241727] to-[#1B1220] border-[#E05A47] terracotta-glow ring-1 ring-[#E05A47]'
                          : 'bg-[#18131C] border-slate-800 hover:border-[#E05A47]/50 hover:bg-[#1E1723]'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            slot.isPeakGoldenHour
                              ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-xs'
                              : 'bg-[#120E16] text-slate-300 border border-slate-700'
                          }`}>
                            {slot.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-[#34D399] flex items-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5" />
                            {slot.expectedEngagementBoost}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            {slot.confidenceScore}% match
                          </span>
                          {isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-[#E05A47] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-700 group-hover:border-[#E05A47]/50 transition-colors" />
                          )}
                        </div>
                      </div>

                      {/* Main Time & Day Display */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-white tracking-tight">
                              {slot.time}
                            </span>
                            <span className="text-xs font-bold text-[#FB923C] px-1.5 py-0.5 rounded bg-[#FB923C]/10 border border-[#FB923C]/20">
                              {slot.dayLabel}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-200 mt-0.5">
                            {slot.label}
                          </span>
                        </div>
                      </div>

                      {/* Audience Rationale */}
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {slot.audienceRationale}
                      </p>

                      {/* Footer: Target Networks & Action Button */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">Ideal:</span>
                          {slot.recommendedNetworks?.map((net) => (
                            <span
                              key={net}
                              className="px-1.5 py-0.5 rounded bg-[#120E16] text-[9px] font-medium text-slate-300 border border-slate-800"
                            >
                              {net}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSlot(slot);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#E05A47] text-white shadow-sm'
                              : 'bg-[#120E16] hover:bg-[#E05A47]/20 text-slate-300 hover:text-white border border-slate-700 hover:border-[#E05A47]/50'
                          }`}
                        >
                          {isSelected ? 'Selecionado' : 'Usar Horário'}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Per-Network Detailed Window Matrix */}
          {activeTab === 'networks' && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#FB7185]" />
                  Comportamento dos Algoritmos por Rede Social:
                </span>
                <span className="text-[10px] text-slate-400">
                  Atualizado em tempo real
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.networkSpecificTips.map((tip) => (
                  <div
                    key={tip.network}
                    className="p-3.5 rounded-xl bg-[#18131C] border border-slate-800 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#E05A47]" />
                        <span className="text-xs font-bold text-white">{tip.network}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-[#34D399]">
                        Potencial {tip.engagementMultiplier}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Janela de Pico:</span>
                        <strong className="text-white font-mono">{tip.peakWindow}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Melhores Dias:</span>
                        <span className="text-[#FB923C] font-medium">{tip.bestDay}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-[#120E16] border border-slate-800/80 text-[10.5px] text-slate-300 leading-relaxed">
                      💡 {tip.algorithmInsight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
