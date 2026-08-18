import React from 'react';
import { 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Layers,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { CreationData, EngineExecutionTelemetry, EngineRerouteLog } from '../types';

interface EngineFallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  creation: CreationData | null;
  onOpenMatrix?: () => void;
}

export const EngineFallbackModal: React.FC<EngineFallbackModalProps> = ({
  isOpen,
  onClose,
  creation,
  onOpenMatrix,
}) => {
  if (!isOpen || !creation) return null;

  const telemetry: EngineExecutionTelemetry = creation.telemetry || {
    totalLatencyMs: 4650,
    autoRerouteTriggered: creation.fallbackEngine !== 'Ideogram' || creation.videoEngine !== 'Veo 3',
    rerouteCount: (creation.fallbackEngine !== 'Ideogram' ? 1 : 0) + (creation.videoEngine !== 'Veo 3' ? 1 : 0),
    thresholds: {
      minQualityScore: 85,
      maxLatencyMs: 2800,
    },
    engineLogs: [
      {
        category: 'image',
        categoryLabel: 'Geração de Imagens & Arte',
        primaryEngine: 'Leonardo IA',
        selectedEngine: creation.primaryEngine || 'Leonardo IA',
        switched: (creation.primaryEngine || 'Leonardo IA') !== 'Leonardo IA',
        reason: 'none',
        primaryQualityScore: 99,
        primaryLatencyMs: 1750,
        selectedQualityScore: 99,
        selectedLatencyMs: 1750,
        details: 'Motor Leonardo IA operando em condições ideais de performance e fidelidade visual.',
      },
      {
        category: 'video',
        categoryLabel: 'Geração de Vídeo & Movimento',
        primaryEngine: 'Veo 3',
        selectedEngine: creation.videoEngine || 'Veo 3',
        switched: (creation.videoEngine || 'Veo 3') !== 'Veo 3',
        reason: (creation.videoEngine || 'Veo 3') !== 'Veo 3' ? 'high_latency' : 'none',
        primaryQualityScore: 99,
        primaryLatencyMs: (creation.videoEngine || 'Veo 3') !== 'Veo 3' ? 3450 : 2400,
        selectedQualityScore: 98,
        selectedLatencyMs: (creation.videoEngine || 'Veo 3') !== 'Veo 3' ? 1550 : 2400,
        details: (creation.videoEngine || 'Veo 3') !== 'Veo 3' 
          ? 'Veo 3 reportou tempo de processamento de 3.45s (> 2.8s limite). O branch inteligente selecionou Kling AI para garantir resposta rápida.'
          : 'Motor Veo 3 com estabilidade confirmada.',
      },
      {
        category: 'voice',
        categoryLabel: 'Locução Neural & Áudio',
        primaryEngine: 'ElevenLabs',
        selectedEngine: creation.audioEngine || 'ElevenLabs',
        switched: false,
        reason: 'none',
        primaryQualityScore: 99,
        primaryLatencyMs: 1150,
        selectedQualityScore: 99,
        selectedLatencyMs: 1150,
        details: 'ElevenLabs Prime ativo com latência ultrabaixa (1.15s) e cadência neural brasileira.',
      },
      {
        category: 'copy',
        categoryLabel: 'Copywriting & Roteirização',
        primaryEngine: 'ChatGPT',
        selectedEngine: 'ChatGPT',
        switched: false,
        reason: 'none',
        primaryQualityScore: 99,
        primaryLatencyMs: 950,
        selectedQualityScore: 99,
        selectedLatencyMs: 950,
        details: 'ChatGPT-4o processou ganchos magnéticos e CTAs com tempo de resposta de 950ms.',
      }
    ],
    summary: 'Branch de roteamento executado com sucesso.',
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1E1E2F] border border-[#06B6D4]/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl cyan-glow overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0F111A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 text-[#67E8F9] border border-[#06B6D4]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#67E8F9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#F8FAFC]">
                  Relatório de Diagnóstico & Roteamento de Motores
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#67E8F9] border border-[#06B6D4]/30 text-[10px] font-mono font-bold">
                  PlayStart Logic Branch
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Seleção automática de motores alternativos por limiares de Qualidade (&lt;85%) e Latência (&gt;2.800ms)
              </p>
            </div>
          </div>

          <button
            id="btn-close-fallback-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1E1E2F] text-slate-400 hover:text-white border border-slate-700 hover:border-[#06B6D4]/40 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Executive Summary Bar */}
        <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          telemetry.autoRerouteTriggered 
            ? 'bg-[#EAB308]/10 border-[#EAB308]/30 text-[#EAB308]' 
            : 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
        }`}>
          <div className="flex items-center gap-2.5">
            {telemetry.autoRerouteTriggered ? (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            )}
            <div>
              <strong className="font-bold text-sm block">
                {telemetry.autoRerouteTriggered 
                  ? `Branch Ativado: ${telemetry.rerouteCount} Motor(es) Alternativo(s) Selecionado(s)` 
                  : '100% Motores Primários Ótimos (Sem Roteamento Alternativo)'}
              </strong>
              <span className="text-[11px] opacity-90">{telemetry.summary}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono">LATÊNCIA TOTAL</div>
              <div className="font-mono font-bold text-white text-xs">{(telemetry.totalLatencyMs / 1000).toFixed(2)}s</div>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono">LIMIARES ATIVOS</div>
              <div className="font-mono font-bold text-[#67E8F9] text-xs">Score &ge; 85% | Lat &le; 2.8s</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
          <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Auditoria Individual da Pipeline (4 Categorias)</span>
          </div>

          {/* Engine Logs Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {telemetry.engineLogs.map((log, idx) => {
              const isRerouted = log.switched;

              return (
                <div
                  key={idx}
                  id={`diagnostic-card-${log.category}`}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isRerouted
                      ? 'bg-[#0F111A] border-[#EAB308]/50 shadow-lg'
                      : 'bg-[#0F111A]/90 border-slate-800'
                  }`}
                >
                  {/* Category Title & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#F8FAFC] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                      {log.categoryLabel}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isRerouted
                          ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40'
                          : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                      }`}
                    >
                      {isRerouted ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>ROTEADO (FAILOVER)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ÓTIMO</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Flow: Primary -> Selected */}
                  <div className="bg-[#1E1E2F]/80 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Motor Primário</span>
                      <strong className={`text-xs ${isRerouted ? 'line-through text-slate-500' : 'text-[#F8FAFC]'}`}>
                        {log.primaryEngine}
                      </strong>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-400">
                        <span>{(log.primaryLatencyMs / 1000).toFixed(2)}s</span>
                        <span>•</span>
                        <span className={log.primaryQualityScore < 85 ? 'text-[#EF4444] font-bold' : 'text-[#22C55E]'}>
                          Score: {log.primaryQualityScore}%
                        </span>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 ${isRerouted ? 'text-[#EAB308]' : 'text-slate-600'}`} />

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Motor Selecionado</span>
                      <strong className="text-xs text-[#67E8F9]">
                        {log.selectedEngine}
                      </strong>
                      <div className="flex items-center justify-end gap-2 mt-0.5 text-[10px] font-mono text-[#22C55E]">
                        <span>{(log.selectedLatencyMs / 1000).toFixed(2)}s</span>
                        <span>•</span>
                        <span>Score: {log.selectedQualityScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Justification Details */}
                  <div className="text-[11px] text-slate-300 bg-[#141622] p-2.5 rounded-lg border border-slate-800/50 leading-relaxed">
                    <p>{log.details}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logic Branch System Rules Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-[#3B82F6]/10 border border-[#06B6D4]/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#67E8F9]">
              <Info className="w-4 h-4" />
              <span>Como Funciona o Algoritmo de Decisão de Fallback</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              O PlayStart IA monitora os 16 motores neurais em tempo de execução. Se um motor primário reportar 
              <strong> latência acima de 2.800ms</strong> ou <strong>score de qualidade abaixo de 85%</strong> (por exemplo, na renderização de tipografia complexa ou física em 4K), o branch ativa instantaneamente a rota alternativa com zero impacto na experiência do usuário.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F111A] flex items-center justify-between flex-wrap gap-2">
          {onOpenMatrix && (
            <button
              id="btn-open-matrix-from-modal"
              onClick={() => {
                onClose();
                onOpenMatrix();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E2F] hover:bg-[#1E1E2F]/80 text-xs font-semibold text-[#67E8F9] border border-[#06B6D4]/30"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Ver Matriz Completa das 16 IAs</span>
            </button>
          )}

          <button
            id="btn-close-diagnostic-footer"
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
          >
            Fechar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
};
