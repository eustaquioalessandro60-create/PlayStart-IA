import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  FileText, 
  Layout, 
  Search, 
  Check, 
  Zap, 
  X, 
  ArrowRight,
  ChevronRight,
  Cpu,
  Layers
} from 'lucide-react';
import { CustomEngineOverrides } from '../types';

export interface AICommandItem {
  id: string;
  command: string;
  aliases: string[];
  name: string;
  category: 'image' | 'video' | 'voice' | 'copy' | 'design' | 'research';
  categoryLabel: string;
  role: string;
  confidence: number;
  badge: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
}

export const AI_COMMANDS: AICommandItem[] = [
  {
    id: 'leonardo',
    command: '/leonardo',
    aliases: ['/leo', '/image'],
    name: 'Leonardo IA',
    category: 'image',
    categoryLabel: 'Imagem',
    role: 'Render de Imagens Hiper-realistas',
    confidence: 99,
    badge: 'Render 8K',
    colorClass: 'text-pink-400',
    bgClass: 'bg-pink-500/10 hover:bg-pink-500/20',
    borderClass: 'border-pink-500/30',
    description: 'Renderiza imagens foto-realistas com iluminação cinematográfica e detalhes 8K.',
  },
  {
    id: 'midjourney',
    command: '/midjourney',
    aliases: ['/mj', '/art'],
    name: 'Midjourney',
    category: 'image',
    categoryLabel: 'Imagem',
    role: 'Arte Conceitual e Estilos Visuais',
    confidence: 98,
    badge: 'Conceito Artístico',
    colorClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/10 hover:bg-indigo-500/20',
    borderClass: 'border-indigo-500/30',
    description: 'Estética futurista, ilustrações conceituais e artes visuais de alto impacto.',
  },
  {
    id: 'ideogram',
    command: '/ideogram',
    aliases: ['/typo', '/textimage'],
    name: 'Ideogram',
    category: 'image',
    categoryLabel: 'Imagem',
    role: 'Tipografia Integrada e Textos em Imagens',
    confidence: 97,
    badge: 'Tipografia Perfeita',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderClass: 'border-orange-500/30',
    description: 'Renderiza textos, títulos e logotipos nítidos diretamente na arte.',
  },
  {
    id: 'freepik',
    command: '/freepik',
    aliases: ['/vector', '/asset'],
    name: 'Freepik',
    category: 'image',
    categoryLabel: 'Imagem',
    role: 'Vetores e Modelos Gráficos',
    confidence: 96,
    badge: 'Vetores & Mockups',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10 hover:bg-cyan-500/20',
    borderClass: 'border-cyan-500/30',
    description: 'Elementos visuais modulares, mockups 3D e pacotes de identidade visual.',
  },
  {
    id: 'veo3',
    command: '/veo',
    aliases: ['/veo3', '/video'],
    name: 'Veo 3',
    category: 'video',
    categoryLabel: 'Vídeo',
    role: 'Geração de Vídeo Cinematográfico 4K',
    confidence: 99,
    badge: 'Vídeo 4K 60fps',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10 hover:bg-purple-500/20',
    borderClass: 'border-purple-500/30',
    description: 'Cria clipes dinâmicos com movimento de câmera profissional em alta definição.',
  },
  {
    id: 'kling',
    command: '/kling',
    aliases: ['/physics', '/motion'],
    name: 'Kling',
    category: 'video',
    categoryLabel: 'Vídeo',
    role: 'Física Dinâmica e Movimentos Complexos',
    confidence: 98,
    badge: 'Física Fluida',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 hover:bg-rose-500/20',
    borderClass: 'border-rose-500/30',
    description: 'Animações corporais precisas, transformações de cena e física realista.',
  },
  {
    id: 'capcut',
    command: '/capcut',
    aliases: ['/cuts', '/reels'],
    name: 'CapCut',
    category: 'video',
    categoryLabel: 'Vídeo',
    role: 'Cortes, Legendas e Transições Virais',
    confidence: 96,
    badge: 'Viral Cuts',
    colorClass: 'text-teal-400',
    bgClass: 'bg-teal-500/10 hover:bg-teal-500/20',
    borderClass: 'border-teal-500/30',
    description: 'Ajuste de ritmo, legendas dinâmicas sincronizadas e transições para TikTok/Reels.',
  },
  {
    id: 'elevenlabs',
    command: '/elevenlabs',
    aliases: ['/voice', '/audio'],
    name: 'ElevenLabs',
    category: 'voice',
    categoryLabel: 'Voz / Áudio',
    role: 'Sintetização de Voz Ultra-Realista',
    confidence: 99,
    badge: 'Voz Neural',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    borderClass: 'border-emerald-500/30',
    description: 'Locução emocional hiper-realista com cadência humana e entonação comercial.',
  },
  {
    id: 'musicgpt',
    command: '/musicgpt',
    aliases: ['/music', '/soundtrack'],
    name: 'MusicGPT',
    category: 'voice',
    categoryLabel: 'Voz / Áudio',
    role: 'Trilhas Sonoras e Efeitos Áudio',
    confidence: 95,
    badge: 'Trilha Original',
    colorClass: 'text-green-400',
    bgClass: 'bg-green-500/10 hover:bg-green-500/20',
    borderClass: 'border-green-500/30',
    description: 'Gera fundos musicais sci-fi, eletrônicos ou cinematográficos sob medida.',
  },
  {
    id: 'chatgpt',
    command: '/chatgpt',
    aliases: ['/gpt', '/copy'],
    name: 'ChatGPT',
    category: 'copy',
    categoryLabel: 'Copywriting',
    role: 'Copywriting e Roteiros Comerciais',
    confidence: 99,
    badge: 'Copy de Alta Conversão',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10 hover:bg-amber-500/20',
    borderClass: 'border-amber-500/30',
    description: 'Gera ganchos persuasivos, copies de venda e legendas com chamadas para ação.',
  },
  {
    id: 'claude',
    command: '/claude',
    aliases: ['/story', '/human'],
    name: 'Claude',
    category: 'copy',
    categoryLabel: 'Copywriting',
    role: 'Narrativa Longa e Contexto Humanizado',
    confidence: 98,
    badge: 'Storytelling Profundo',
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500/10 hover:bg-yellow-500/20',
    borderClass: 'border-yellow-500/30',
    description: 'Desenvolve roteiros humanizados com forte conexão emocional e clareza.',
  },
  {
    id: 'gemini',
    command: '/gemini',
    aliases: ['/gemini37', '/ai'],
    name: 'Gemini',
    category: 'research',
    categoryLabel: 'IA Central',
    role: 'Multimodal Central e Raciocínio Geral',
    confidence: 100,
    badge: 'Multi-Modal Core',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10 hover:bg-blue-500/20',
    borderClass: 'border-blue-500/30',
    description: 'Orquestra raciocínio multimodal, sincronizando imagens, áudios e legendas.',
  },
  {
    id: 'grok',
    command: '/grok',
    aliases: ['/trend', '/x'],
    name: 'Grok',
    category: 'research',
    categoryLabel: 'Pesquisa',
    role: 'Tendências em Tempo Real e Virais',
    confidence: 96,
    badge: 'Live Trends',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/10 hover:bg-red-500/20',
    borderClass: 'border-red-500/30',
    description: 'Identifica hashtags em ascensão e formatos virais em tempo real.',
  },
  {
    id: 'perplexity',
    command: '/perplexity',
    aliases: ['/facts', '/search'],
    name: 'Perplexity',
    category: 'research',
    categoryLabel: 'Pesquisa',
    role: 'Pesquisa e Checagem de Fatos',
    confidence: 98,
    badge: 'Fact-Check 100%',
    colorClass: 'text-sky-400',
    bgClass: 'bg-sky-500/10 hover:bg-sky-500/20',
    borderClass: 'border-sky-500/30',
    description: 'Valida fontes, estatísticas de mercado e dados confiáveis para o conteúdo.',
  },
  {
    id: 'canva',
    command: '/canva',
    aliases: ['/layout', '/design'],
    name: 'Canva Pro',
    category: 'design',
    categoryLabel: 'Design',
    role: 'Diagramação e Composição de Layouts',
    confidence: 97,
    badge: 'Composição Social',
    colorClass: 'text-cyan-300',
    bgClass: 'bg-cyan-500/10 hover:bg-cyan-500/20',
    borderClass: 'border-cyan-500/30',
    description: 'Enquadramentos harmônicos e paletas de cores calibradas para feeds sociais.',
  },
  {
    id: 'gamma',
    command: '/gamma',
    aliases: ['/deck', '/slides'],
    name: 'Gamma',
    category: 'design',
    categoryLabel: 'Design',
    role: 'Estruturação Visual e Decks',
    confidence: 95,
    badge: 'Estrutura Visual',
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10 hover:bg-violet-500/20',
    borderClass: 'border-violet-500/30',
    description: 'Organiza cards informativos e carrosséis com hierarquia de texto clara.',
  },
];

interface AICommandPaletteProps {
  isOpen: boolean;
  searchFilter: string;
  onSelectEngine: (command: AICommandItem) => void;
  onClose: () => void;
  selectedEngines: CustomEngineOverrides;
}

export const AICommandPalette: React.FC<AICommandPaletteProps> = ({
  isOpen,
  searchFilter,
  onSelectEngine,
  onClose,
  selectedEngines,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const paletteRef = useRef<HTMLDivElement | null>(null);

  // Filter commands based on search filter & active category
  const filteredCommands = useMemo(() => {
    let list = AI_COMMANDS;
    if (activeCategory !== 'all') {
      list = list.filter((cmd) => cmd.category === activeCategory);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().replace('/', '');
      list = list.filter(
        (cmd) =>
          cmd.command.toLowerCase().includes(q) ||
          cmd.name.toLowerCase().includes(q) ||
          cmd.categoryLabel.toLowerCase().includes(q) ||
          cmd.role.toLowerCase().includes(q) ||
          cmd.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }
    return list;
  }, [searchFilter, activeCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchFilter, activeCategory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filteredCommands.length > 0 && filteredCommands[selectedIndex]) {
          e.preventDefault();
          onSelectEngine(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onSelectEngine, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Todas (16)' },
    { id: 'image', label: '🎨 Imagem' },
    { id: 'video', label: '🎬 Vídeo' },
    { id: 'voice', label: '🎙️ Voz/Áudio' },
    { id: 'copy', label: '✍️ Copywriting' },
    { id: 'research', label: '🔍 Pesquisa' },
    { id: 'design', label: '📐 Design' },
  ];

  return (
    <div
      ref={paletteRef}
      id="ai-command-palette"
      className="absolute bottom-full left-0 right-0 mb-2 bg-[#1E1E2F] border border-[#06B6D4]/50 rounded-xl shadow-2xl z-50 overflow-hidden cyan-glow backdrop-blur-xl animate-fadeIn flex flex-col max-h-80"
    >
      {/* Palette Header */}
      <div className="p-2.5 bg-[#0F111A] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#06B6D4]/20 text-[#67E8F9] border border-[#06B6D4]/40">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#F8FAFC] tracking-wide flex items-center gap-1.5">
              <span>AI Command Palette</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#06B6D4]/20 text-[#67E8F9] font-mono">
                16 IAs Conectadas
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">↓</kbd> e <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Enter</kbd></span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-2.5 py-1.5 bg-[#141622] border-b border-slate-800/80 flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#06B6D4] text-slate-950 font-bold shadow-sm'
                : 'bg-[#1E1E2F] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Commands List */}
      <div className="overflow-y-auto flex-1 p-1.5 flex flex-col gap-1 divide-y divide-slate-800/40">
        {filteredCommands.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center gap-1.5">
            <Cpu className="w-5 h-5 text-slate-600" />
            <span>Nenhuma IA encontrada para "{searchFilter}"</span>
            <span className="text-[10px] text-slate-500">Tente /leonardo, /veo, /elevenlabs, /midjourney, /kling</span>
          </div>
        ) : (
          filteredCommands.map((cmd, idx) => {
            const isSelected = idx === selectedIndex;
            const isAssigned =
              selectedEngines[cmd.category] === cmd.name;

            return (
              <button
                key={cmd.id}
                id={`ai-command-item-${cmd.id}`}
                type="button"
                onClick={() => onSelectEngine(cmd)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-[#06B6D4]/15 border border-[#06B6D4]/60 text-white'
                    : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border font-mono font-bold text-xs ${cmd.borderClass} ${cmd.bgClass} ${cmd.colorClass}`}>
                    {cmd.category === 'image' && <ImageIcon className="w-4 h-4" />}
                    {cmd.category === 'video' && <Video className="w-4 h-4" />}
                    {cmd.category === 'voice' && <Mic className="w-4 h-4" />}
                    {cmd.category === 'copy' && <FileText className="w-4 h-4" />}
                    {cmd.category === 'research' && <Search className="w-4 h-4" />}
                    {cmd.category === 'design' && <Layout className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-xs text-[#67E8F9]">
                        {cmd.command}
                      </span>
                      <span className="text-xs font-bold text-[#F8FAFC] truncate">
                        {cmd.name}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${cmd.borderClass} ${cmd.colorClass} bg-black/30`}>
                        {cmd.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {cmd.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAssigned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Check className="w-3 h-3" />
                      Ativo
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono">
                    {cmd.confidence}%
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Palette Footer Tip */}
      <div className="px-3 py-1.5 bg-[#0F111A] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
        <span>Dica: Digite <strong>/</strong> em qualquer lugar do texto para abrir esta lista</span>
        <span className="text-[#06B6D4]">Grupo Rimane Multi-AI Orchestrator</span>
      </div>
    </div>
  );
};
