import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  X, 
  Calendar, 
  Radio, 
  GitBranch, 
  Cpu, 
  Globe, 
  Copy, 
  Check, 
  Clock, 
  ExternalLink,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { CreationData, SocialNetwork } from '../types';
import { SmartScheduler } from './SmartScheduler';
import { SmartTimeSlot } from '../types/smartScheduler';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  creation: CreationData | null;
  selectedNetworks: SocialNetwork[];
  onDispatchSuccess: (dispatches: any[], scheduleType?: 'immediate' | 'scheduled', scheduledTime?: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  creation,
  selectedNetworks,
  onDispatchSuccess,
}) => {
  // Format default date to tomorrow at 18:00
  const getDefaultScheduledDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState<string>(getDefaultScheduledDate);
  const [selectedSmartSlotId, setSelectedSmartSlotId] = useState<string | null>(null);
  const [selectedSmartSlotLabel, setSelectedSmartSlotLabel] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [copiedNetwork, setCopiedNetwork] = useState<string | null>(null);

  if (!isOpen || !creation) return null;

  const handleSelectSmartSlot = (slot: SmartTimeSlot) => {
    setScheduleType('scheduled');
    setScheduledDate(slot.isoDateTime);
    setSelectedSmartSlotId(slot.id);
    setSelectedSmartSlotLabel(`${slot.dayLabel} às ${slot.time} • ${slot.label}`);
  };

  // Preset helpers
  const handleSetPreset = (preset: 'plus2h' | 'tomorrow9' | 'tomorrow18' | 'friday20' | 'weekend') => {
    setSelectedSmartSlotId(null);
    setSelectedSmartSlotLabel(null);
    const d = new Date();
    if (preset === 'plus2h') {
      d.setHours(d.getHours() + 2);
    } else if (preset === 'tomorrow9') {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
    } else if (preset === 'tomorrow18') {
      d.setDate(d.getDate() + 1);
      d.setHours(18, 0, 0, 0);
    } else if (preset === 'friday20') {
      const day = d.getDay();
      const distance = (5 + 7 - day) % 7 || 7;
      d.setDate(d.getDate() + distance);
      d.setHours(20, 0, 0, 0);
    } else if (preset === 'weekend') {
      const day = d.getDay();
      const distance = (6 + 7 - day) % 7 || 7;
      d.setDate(d.getDate() + distance);
      d.setHours(11, 0, 0, 0);
    }
    setScheduledDate(d.toISOString().slice(0, 16));
  };

  const handleExecuteDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/integrations/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creationId: creation.id,
          selectedNetworks,
          scheduleTime: scheduleType === 'immediate' ? 'immediate' : scheduledDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchResult(data);
        onDispatchSuccess(data.dispatches, scheduleType, scheduleType === 'scheduled' ? scheduledDate : undefined);
      }
    } catch (err) {
      console.error('Error dispatching:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCopyCaption = (network: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNetwork(network);
    setTimeout(() => setCopiedNetwork(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#18131C] border border-[#E05A47]/40 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl terracotta-glow overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#120E16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-sm shadow-[#E05A47]/30">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Disparo Multi-Redes & Integrações
              </h3>
              <p className="text-xs text-slate-400">
                Publicação automatizada via Six Nine, Hootsuite, GitHub e FlowRoute.
              </p>
            </div>
          </div>

          <button
            id="btn-close-dispatch-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18131C] text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-5">
          {/* Active Integrations Status Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Six Nine */}
            <div className="p-2.5 rounded-xl bg-[#120E16] border border-[#E05A47]/30 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Six Nine</span>
                <Radio className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <span className="text-[10px] text-[#FB923C]">Automação de Rede & Conexão</span>
              <span className="text-[9px] font-mono text-[#34D399]">Mesh Ativo • 18ms</span>
            </div>

            {/* Hootsuite */}
            <div className="p-2.5 rounded-xl bg-[#120E16] border border-[#F97316]/30 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Hootsuite</span>
                <Globe className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <span className="text-[10px] text-[#FB923C]">Agendamento & Publicação</span>
              <span className="text-[9px] font-mono text-[#34D399]">Webhook Sincronizado</span>
            </div>

            {/* GitHub */}
            <div className="p-2.5 rounded-xl bg-[#120E16] border border-[#EC4899]/30 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">GitHub</span>
                <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <span className="text-[10px] text-[#FB7185]">Repositório & Versões</span>
              <span className="text-[9px] font-mono text-[#34D399]">Branch: main</span>
            </div>

            {/* FlowRoute */}
            <div className="p-2.5 rounded-xl bg-[#120E16] border border-[#10B981]/30 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">FlowRoute</span>
                <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <span className="text-[10px] text-[#34D399]">Rota CDN & Tráfego</span>
              <span className="text-[9px] font-mono text-[#34D399]">14 Edge Nodes</span>
            </div>
          </div>

          {/* Target Networks Checklist */}
          <div className="bg-[#120E16] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300">
              Redes que receberão o conteúdo ({selectedNetworks.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedNetworks.map((net) => (
                <span
                  key={net}
                  className="px-2.5 py-1 rounded-lg bg-[#18131C] border border-[#E05A47]/30 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  {net}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule Mode Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">Tipo de Execução:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-schedule-immediate"
                onClick={() => setScheduleType('immediate')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  scheduleType === 'immediate'
                    ? 'bg-[#221825] border-[#E05A47] text-white terracotta-glow'
                    : 'bg-[#120E16] border-slate-800 text-slate-400'
                }`}
              >
                <Send className="w-4 h-4 text-[#FB923C]" />
                <div className="text-left">
                  <div className="text-xs font-bold">Publicação Imediata</div>
                  <div className="text-[10px] text-slate-400">Disparar agora em todas as redes</div>
                </div>
              </button>

              <button
                id="btn-schedule-scheduled"
                onClick={() => setScheduleType('scheduled')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  scheduleType === 'scheduled'
                    ? 'bg-[#221825] border-[#EC4899] text-white'
                    : 'bg-[#120E16] border-slate-800 text-slate-400'
                }`}
              >
                <Calendar className="w-4 h-4 text-[#FB7185]" />
                <div className="text-left">
                  <div className="text-xs font-bold">Agendar com Hootsuite</div>
                  <div className="text-[10px] text-slate-400">Programar data e melhor horário</div>
                </div>
              </button>
            </div>

            {scheduleType === 'scheduled' && (
              <div className="mt-2 p-3 sm:p-4 bg-[#120E16] border border-slate-800 rounded-xl flex flex-col gap-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FB923C]" />
                    <span className="text-xs font-semibold text-white">Data e Hora do Agendamento:</span>
                  </div>
                  <input
                    id="input-scheduled-datetime"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => {
                      setScheduledDate(e.target.value);
                      setSelectedSmartSlotId(null);
                      setSelectedSmartSlotLabel(null);
                    }}
                    className="bg-[#18131C] border border-[#E05A47]/40 focus:border-[#E05A47] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none ring-1 ring-[#E05A47]/20"
                  />
                </div>

                {/* Selected AI Slot Badge if active */}
                {selectedSmartSlotLabel && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#E05A47]/15 to-[#F97316]/15 border border-[#E05A47]/40 px-3 py-2 rounded-xl text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#FB923C] shrink-0" />
                    <span className="text-slate-300">
                      Horário otimizado por IA: <strong className="text-white font-semibold">{selectedSmartSlotLabel}</strong>
                    </span>
                  </div>
                )}

                {/* Smart Scheduler AI Recommendation Engine */}
                <SmartScheduler
                  creation={creation}
                  selectedNetworks={selectedNetworks}
                  onSelectSlot={handleSelectSmartSlot}
                  selectedSlotId={selectedSmartSlotId}
                  currentScheduledDate={scheduledDate}
                />

                {/* Quick Presets Manual Bar */}
                <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Atalhos manuais:</span>
                  <button
                    type="button"
                    onClick={() => handleSetPreset('plus2h')}
                    className="px-2 py-1 rounded bg-[#18131C] hover:bg-[#E05A47]/20 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
                  >
                    +2h Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset('tomorrow9')}
                    className="px-2 py-1 rounded bg-[#18131C] hover:bg-[#E05A47]/20 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
                  >
                    Amanhã 09:00 (Manhã)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset('tomorrow18')}
                    className="px-2 py-1 rounded bg-[#18131C] hover:bg-[#E05A47]/20 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
                  >
                    Amanhã 18:00 (Pico)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset('friday20')}
                    className="px-2 py-1 rounded bg-[#18131C] hover:bg-[#E05A47]/20 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
                  >
                    Sexta 20:00 (Viral)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset('weekend')}
                    className="px-2 py-1 rounded bg-[#18131C] hover:bg-[#E05A47]/20 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
                  >
                    Fim de Semana 11:00
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#FB923C] bg-[#E05A47]/10 p-2 rounded-lg border border-[#E05A47]/30">
                  <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>
                    Agendado para: <strong className="text-white">{new Date(scheduledDate).toLocaleString('pt-BR')}</strong> com fila inteligente Hootsuite & Six Nine.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Generated Captions Preview per Network */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">
              Legendas e Copy Geradas por IA:
            </label>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {selectedNetworks.map((net) => {
                const captionText = creation.captions?.[net] || `🚀 Conteúdo imperdível sobre ${creation.title}! #PlayStartIA #GrupoRimane`;
                const isCopied = copiedNetwork === net;

                return (
                  <div key={net} className="p-3 bg-[#120E16] border border-slate-800 rounded-xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FB923C]">{net}</span>
                      <button
                        id={`btn-copy-caption-${net.toLowerCase()}`}
                        onClick={() => handleCopyCaption(net, captionText)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copiado!' : 'Copiar Texto'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line line-clamp-3">
                      {captionText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispatch Execution Status Feed */}
          {dispatchResult && (
            <div className="p-4 bg-[#120E16] border border-[#10B981]/40 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#34D399] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>{dispatchResult.message}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                {dispatchResult.dispatches?.map((disp: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#18131C] border border-slate-800 flex justify-between">
                    <span className="text-[#FB923C]">{disp.network}:</span>
                    <span className="text-[#34D399]">{disp.hootsuiteId} ({disp.status})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#120E16] flex items-center justify-between">
          <button
            id="btn-cancel-dispatch"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#18131C] text-slate-300 hover:text-white text-xs font-semibold"
          >
            Fechar
          </button>

          <button
            id="btn-execute-dispatch-final"
            onClick={handleExecuteDispatch}
            disabled={isDispatching || selectedNetworks.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase hover:opacity-95 shadow-lg shadow-[#E05A47]/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{scheduleType === 'scheduled' ? 'Agendando Disparo...' : 'Disparando Redes...'}</span>
              </>
            ) : scheduleType === 'scheduled' ? (
              <>
                <Calendar className="w-4 h-4" />
                <span>AGENDAR DISPARO PROGRAMADO</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>DISPARAR NAS REDES SELECIONADAS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
