import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Cpu, 
  Zap, 
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AIEngine } from '../types';

interface AIEnginesMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  activeEngines?: {
    image: string;
    video: string;
    voice: string;
  };
}

export const AI_ENGINES_LIST: AIEngine[] = [
  { id: 'leonardo', name: 'Leonardo IA', category: 'image', status: 'active', role: 'Render de Imagens Hiper-realistas', fallbackTarget: 'Ideogram', confidence: 99 },
  { id: 'midjourney', name: 'Midjourney', category: 'image', status: 'online', role: 'Arte Conceitual e Estilos Visuais', fallbackTarget: 'Leonardo IA', confidence: 98 },
  { id: 'ideogram', name: 'Ideogram', category: 'image', status: 'fallback', role: 'Tipografia Integrada e Textos em Imagens', fallbackTarget: 'Freepik', confidence: 97 },
  { id: 'freepik', name: 'Freepik', category: 'image', status: 'standby', role: 'Vetores e Modelos Gráficos', fallbackTarget: 'Canva Pro', confidence: 96 },
  { id: 'canva', name: 'Canva Pro', category: 'design', status: 'online', role: 'Diagramação e Composição de Layouts', fallbackTarget: 'Gamma', confidence: 97 },
  { id: 'veo3', name: 'Veo 3', category: 'video', status: 'active', role: 'Geração de Vídeo Cinematográfico 4K', fallbackTarget: 'Kling', confidence: 99 },
  { id: 'kling', name: 'Kling', category: 'video', status: 'fallback', role: 'Física Dinâmica e Movimentos Complexos', fallbackTarget: 'CapCut', confidence: 98 },
  { id: 'capcut', name: 'CapCut', category: 'video', status: 'online', role: 'Cortes, Legendas e Transições Virais', fallbackTarget: 'Veo 3', confidence: 96 },
  { id: 'elevenlabs', name: 'ElevenLabs', category: 'voice', status: 'active', role: 'Sintetização de Voz Ultra-Realista', fallbackTarget: 'Gemini Audio', confidence: 99 },
  { id: 'musicgpt', name: 'MusicGPT', category: 'voice', status: 'online', role: 'Trilhas Sonoras e Efeitos Áudio', fallbackTarget: 'ElevenLabs', confidence: 95 },
  { id: 'chatgpt', name: 'ChatGPT', category: 'copy', status: 'online', role: 'Copywriting e Roteiros Comerciais', fallbackTarget: 'Claude', confidence: 99 },
  { id: 'claude', name: 'Claude', category: 'copy', status: 'online', role: 'Narrativa Longa e Contexto Humanizado', fallbackTarget: 'Gemini', confidence: 98 },
  { id: 'gemini', name: 'Gemini', category: 'research', status: 'active', role: 'Multimodal Central e Raciocínio Geral', fallbackTarget: 'ChatGPT', confidence: 100 },
  { id: 'grok', name: 'Grok', category: 'research', status: 'online', role: 'Tendências em Tempo Real e Virais', fallbackTarget: 'Perplexity', confidence: 96 },
  { id: 'perplexity', name: 'Perplexity', category: 'research', status: 'online', role: 'Pesquisa e Checagem de Fatos', fallbackTarget: 'Gemini', confidence: 98 },
  { id: 'gamma', name: 'Gamma', category: 'design', status: 'standby', role: 'Estruturação Visual e Decks', fallbackTarget: 'Canva Pro', confidence: 95 },
];

export const AIEnginesMatrix: React.FC<AIEnginesMatrixProps> = ({
  isOpen,
  onClose,
  activeEngines,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1E1E2F] border border-[#06B6D4]/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl cyan-glow overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0F111A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#06B6D4]/10 text-[#67E8F9] border border-[#06B6D4]/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Matriz Neural das 16 IAs Conectadas
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Sistema de Fallback Automático — Se uma IA falhar, outra assume instantaneamente.
              </p>
            </div>
          </div>

          <button
            id="btn-close-ai-matrix"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1E1E2F] text-slate-400 hover:text-white border border-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Fallback Flow Banner */}
        <div className="p-3 bg-[#06B6D4]/10 border-b border-[#06B6D4]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#67E8F9]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#22C55E]" />
            <span>
              <strong>Algoritmo de Roteamento Inteligente:</strong> 16 motores sincronizados sem necessidade de configuração manual.
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>Zero downtime garantido</span>
          </div>
        </div>

        {/* Grid of 16 Engines */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {AI_ENGINES_LIST.map((engine) => {
            const isCurrentlyRunning =
              activeEngines?.image === engine.name ||
              activeEngines?.video === engine.name ||
              activeEngines?.voice === engine.name;

            return (
              <div
                key={engine.id}
                id={`card-ai-engine-${engine.id}`}
                className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                  isCurrentlyRunning
                    ? 'bg-[#0F111A] border-[#06B6D4] cyan-glow-subtle'
                    : 'bg-[#0F111A]/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Title + Status */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#F8FAFC] truncate">
                    {engine.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isCurrentlyRunning
                        ? 'bg-[#06B6D4] text-[#0F111A]'
                        : engine.status === 'active'
                        ? 'bg-[#22C55E]/20 text-[#22C55E]'
                        : engine.status === 'fallback'
                        ? 'bg-[#EAB308]/20 text-[#EAB308]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCurrentlyRunning ? 'RODANDO' : engine.status.toUpperCase()}
                  </span>
                </div>

                {/* Role Description */}
                <p className="text-[11px] text-slate-400 leading-tight">
                  {engine.role}
                </p>

                {/* Fallback Connection */}
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    Fallback ➜ <strong className="text-[#67E8F9]">{engine.fallbackTarget}</strong>
                  </span>
                  <span className="text-[#22C55E] font-mono">{engine.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F111A] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Grupo Rimane • PLAYSTART IA Architecture
          </span>
          <button
            id="btn-close-ai-matrix-footer"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#06B6D4] text-[#0F111A] font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
