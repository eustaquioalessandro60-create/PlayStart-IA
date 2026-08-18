import React from 'react';
import { 
  Keyboard, 
  X, 
  Sparkles, 
  Wand2, 
  Mic, 
  Send, 
  Layers, 
  RotateCcw, 
  CheckCheck, 
  Terminal, 
  BookOpen, 
  Command,
  CornerDownLeft,
  Palette
} from 'lucide-react';

export interface ShortcutItem {
  id: string;
  category: 'create' | 'prompt' | 'modals' | 'general';
  name: string;
  description: string;
  keys: string[];
  actionName: string;
  icon: React.ReactNode;
}

export const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  {
    id: 'shortcut-generate',
    category: 'create',
    name: 'Gerar Imagem + Vídeo',
    description: 'Dispara a geração completa pelas 16 IAs conectadas com fallback automático.',
    keys: ['Ctrl', 'Enter'],
    actionName: 'Gerar Agora',
    icon: <Wand2 className="w-4 h-4 text-[#FB923C]" />,
  },
  {
    id: 'shortcut-enhance',
    category: 'prompt',
    name: 'Melhorar / Realçar Prompt',
    description: 'Otimiza a engenharia de prompt com Gemini LLM para máxima conversão.',
    keys: ['Ctrl', 'E'],
    actionName: 'Otimizar Prompt',
    icon: <Sparkles className="w-4 h-4 text-[#F97316]" />,
  },
  {
    id: 'shortcut-voice',
    category: 'create',
    name: 'Voice-to-Prompt (Gravar Ideia)',
    description: 'Inicia ou encerra a gravação de áudio por voz com Web Speech API.',
    keys: ['Alt', 'V'],
    actionName: 'Microfone On/Off',
    icon: <Mic className="w-4 h-4 text-[#FB7185]" />,
  },
  {
    id: 'shortcut-commands',
    category: 'prompt',
    name: 'Comandos de IA (/ Slash)',
    description: 'Abre a paleta de 16 motores neurais para injetar no texto.',
    keys: ['Ctrl', 'K'],
    actionName: 'Paleta de Comandos',
    icon: <Terminal className="w-4 h-4 text-[#FB923C]" />,
  },
  {
    id: 'shortcut-grammar',
    category: 'prompt',
    name: 'Revisão de Tom & Gramática',
    description: 'Analisa e aprimora tom de voz, clareza, ortografia e persuasão.',
    keys: ['Ctrl', 'G'],
    actionName: 'Revisar Texto',
    icon: <CheckCheck className="w-4 h-4 text-[#34D399]" />,
  },
  {
    id: 'shortcut-hashtags',
    category: 'prompt',
    name: 'Hashtags & Keywords com IA',
    description: 'Sugere automaticamente hashtags virais, de nicho e termos de direção de arte.',
    keys: ['Alt', 'H'],
    actionName: 'Hashtags IA',
    icon: <Sparkles className="w-4 h-4 text-[#FB923C]" />,
  },
  {
    id: 'shortcut-templates',
    category: 'prompt',
    name: 'Biblioteca de Templates',
    description: 'Abre modelos prontos de alta conversão (Lançamento, Viral, etc.).',
    keys: ['Alt', 'T'],
    actionName: 'Abrir Templates',
    icon: <BookOpen className="w-4 h-4 text-[#FB7185]" />,
  },
  {
    id: 'shortcut-theme',
    category: 'modals',
    name: 'Dynamic Theme Controller',
    description: 'Alterna entre paletas estéticas (Cyberpunk, Terracotta, Corporate, etc.) e customiza variáveis CSS.',
    keys: ['Alt', 'P'],
    actionName: 'Paleta Visual',
    icon: <Palette className="w-4 h-4 text-[#FB923C]" />,
  },
  {
    id: 'shortcut-dispatch',
    category: 'modals',
    name: 'Disparo Multi-Redes',
    description: 'Abre modal para publicação simultânea ou agendamento via Hootsuite.',
    keys: ['Ctrl', 'D'],
    actionName: 'Disparar Redes',
    icon: <Send className="w-4 h-4 text-[#FB923C]" />,
  },
  {
    id: 'shortcut-matrix',
    category: 'modals',
    name: 'Matriz de 16 IAs',
    description: 'Exibe a telemetria, latência e status dos motores de imagem, vídeo e áudio.',
    keys: ['Ctrl', 'M'],
    actionName: 'Ver 16 IAs',
    icon: <Layers className="w-4 h-4 text-[#FB923C]" />,
  },
  {
    id: 'shortcut-history',
    category: 'modals',
    name: 'Gaveta de Histórico',
    description: 'Navega pelas criações anteriores, tags e downloads multiformato.',
    keys: ['Alt', 'H'],
    actionName: 'Abrir Histórico',
    icon: <RotateCcw className="w-4 h-4 text-[#34D399]" />,
  },
  {
    id: 'shortcut-help',
    category: 'general',
    name: 'Guia de Atalhos',
    description: 'Exibe esta central de atalhos rápidos de teclado.',
    keys: ['Ctrl', '/'],
    actionName: 'Abrir Ajuda',
    icon: <Keyboard className="w-4 h-4 text-white" />,
  },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastTriggeredShortcut?: string | null;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  lastTriggeredShortcut,
}) => {
  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const formatKey = (k: string) => {
    if (k === 'Ctrl') return isMac ? '⌘ Cmd' : 'Ctrl';
    if (k === 'Alt') return isMac ? '⌥ Option' : 'Alt';
    if (k === 'Enter') return '↵ Enter';
    if (k === 'Shift') return '⇧ Shift';
    return k;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#18131C] border border-[#E05A47]/40 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl terracotta-glow overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#120E16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-sm shadow-[#E05A47]/30">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Atalhos de Teclado Globais
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E05A47]/20 text-[#FB923C] border border-[#E05A47]/40">
                  {KEYBOARD_SHORTCUTS.length} atalhos ativos
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Aumente sua velocidade de criação no PLAYSTART IA navegando e executando sem tirar as mãos do teclado.
              </p>
            </div>
          </div>

          <button
            id="btn-close-keyboard-shortcuts-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18131C] text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Shortcut Notification Strip if triggered recently */}
        {lastTriggeredShortcut && (
          <div className="bg-[#E05A47]/15 border-b border-[#E05A47]/40 px-4 py-2 flex items-center justify-between text-xs text-[#FB923C] animate-fadeIn">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              Atalho acionado recentemente: <strong className="text-white">{lastTriggeredShortcut}</strong>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Executado</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6">
          {/* Quick Tip */}
          <div className="p-3 rounded-xl bg-[#120E16] border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-[#FB923C] flex-shrink-0" />
              <span>
                Todos os atalhos funcionam globalmente no app, inclusive enquanto você digita no campo de prompt!
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-mono text-[#10B981] px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30">
              Pronto para Uso
            </span>
          </div>

          {/* Shortcuts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {KEYBOARD_SHORTCUTS.map((sc) => {
              const isHighlight =
                sc.id === 'shortcut-generate' || sc.id === 'shortcut-enhance' || sc.id === 'shortcut-voice';

              return (
                <div
                  key={sc.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                    isHighlight
                      ? 'bg-[#150F18] border-[#E05A47]/40 hover:border-[#E05A47] shadow-sm'
                      : 'bg-[#120E16] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#18131C] border border-slate-700 mt-0.5">
                      {sc.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {sc.name}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug">{sc.description}</p>
                    </div>
                  </div>

                  {/* Key Combo Badges */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {sc.keys.map((k, idx) => (
                      <React.Fragment key={idx}>
                        <kbd className="px-2 py-1 rounded-md bg-[#1F1722] text-[#FFFFFF] font-mono font-bold text-xs border border-[#E05A47]/40 shadow-sm">
                          {formatKey(k)}
                        </kbd>
                        {idx < sc.keys.length - 1 && <span className="text-slate-500 text-xs">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#120E16] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Dica: Pressione <kbd className="px-1.5 py-0.5 rounded bg-[#18131C] border border-slate-700 font-mono text-[10px] text-white">Esc</kbd> para fechar qualquer janela aberta.
          </div>

          <button
            id="btn-close-shortcuts-footer"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white font-extrabold text-xs hover:opacity-90 shadow-md shadow-[#E05A47]/30 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
