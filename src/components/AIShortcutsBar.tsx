import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  FileText, 
  Layout, 
  Cpu, 
  Check, 
  Info, 
  X, 
  ArrowRight, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CustomEngineOverrides } from '../types';
import { AI_COMMANDS, AICommandItem } from './AICommandPalette';

interface AIShortcutsBarProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  customEngines?: CustomEngineOverrides;
  onCustomEnginesChange?: (overrides: CustomEngineOverrides) => void;
  onSaveSnapshot?: (prompt: string, type: 'manual' | 'ia-enhance', label?: string) => void;
}

export interface EngineCapabilityDetail {
  id: string;
  command: string;
  name: string;
  category: 'image' | 'video' | 'voice' | 'copy' | 'design' | 'research';
  categoryLabel: string;
  badge: string;
  role: string;
  description: string;
  strengths: string[];
  recommendedPromptTip: string;
  idealFor: string[];
  latency: string;
  qualityScore: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const ENGINE_CAPABILITIES: Record<string, EngineCapabilityDetail> = {
  leonardo: {
    id: 'leonardo',
    command: '/leonardo',
    name: 'Leonardo IA',
    category: 'image',
    categoryLabel: 'Geração de Imagens',
    badge: 'Render 8K & PBR',
    role: 'Renderização de Imagens Foto-Realistas e Assets 3D',
    description: 'Especialista em iluminação cinematográfica, materiais hiper-detalhados e texturas volumétricas com fidelidade visual extrema.',
    strengths: [
      'Controle absoluto de iluminação volumétrica e lentes',
      'Texturas e microporos realistas em retratos humanos',
      'Geração de cenários futuristas e arquitetura premium'
    ],
    recommendedPromptTip: 'Combine com termos como "iluminação volumétrica ciano, profundidade de campo rasa f/1.4 e render 8K".',
    idealFor: ['Posts do Feed', 'Capas de Carrossel', 'Mockups de Produto', 'Banners Promocionais'],
    latency: '~1.8s',
    qualityScore: '99/100',
    colorClass: 'text-pink-400',
    bgClass: 'bg-pink-500/15',
    borderClass: 'border-pink-500/40',
  },
  midjourney: {
    id: 'midjourney',
    command: '/midjourney',
    name: 'Midjourney v6',
    category: 'image',
    categoryLabel: 'Arte Conceitual',
    badge: 'Estética Artística',
    role: 'Composições Artísticas, Surrealismo e Estilos Visuais Autênticos',
    description: 'Motor voltado para direção de arte sofisticada, composições dramáticas e ilustrações autorais que captam a atenção imediata.',
    strengths: [
      'Estética autoral única e paletas cromáticas harmônicas',
      'Excelente entendimento de estilos de pintura e fotografia analógica',
      'Enquadramentos dinâmicos com forte apelo emocional'
    ],
    recommendedPromptTip: 'Especifique a vibe artística, ex: "estética cyber-punk neo-noir com reflexos de neon molhados".',
    idealFor: ['Artes de Lançamento', 'Campanhas Conceituais', 'Capas de Destaques', 'Stories Visuais'],
    latency: '~2.2s',
    qualityScore: '98/100',
    colorClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/15',
    borderClass: 'border-indigo-500/40',
  },
  ideogram: {
    id: 'ideogram',
    command: '/ideogram',
    name: 'Ideogram v2',
    category: 'image',
    categoryLabel: 'Tipografia em Imagem',
    badge: 'Tipografia Nítida',
    role: 'Renderização de Textos e Títulos Integrados à Arte',
    description: 'O motor mais confiável para renderizar tipografias, logotipos, slogans e palavras em português diretamente dentro do design gráfico.',
    strengths: [
      'Ortografia precisa de textos renderizados na arte',
      'Integração natural entre fontes e elementos de fundo',
      'Ideal para pôsteres com headlines marcantes'
    ],
    recommendedPromptTip: 'Coloque as palavras exatas entre aspas no prompt, ex: texto escrito "PLAYSTART IA" em neon 3D.',
    idealFor: ['Cartazes de Eventos', 'Thumbnails com Texto', 'Anúncios de Ofertas', 'Logotipos Integrados'],
    latency: '~2.0s',
    qualityScore: '97/100',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/15',
    borderClass: 'border-orange-500/40',
  },
  freepik: {
    id: 'freepik',
    command: '/freepik',
    name: 'Freepik AI',
    category: 'image',
    categoryLabel: 'Vetores & Mockups',
    badge: 'Assets Gráficos',
    role: 'Criação de Vetores, Ícones e Elementos Gráficos Modulares',
    description: 'Gera composições vetoriais limpas, mockups de dispositivos e elementos gráficos prontos para marketing digital.',
    strengths: [
      'Composições limpas com fundo isolado ou gradiente suave',
      'Mockups ultra-nítidos de smartphones, telas e embalagens',
      'Elementos de interface visual flat e 3D'
    ],
    recommendedPromptTip: 'Use palavras como "mockup minimalista flutuante de smartphone, fundo gradiente limpo".',
    idealFor: ['Mockups de Apps', 'Ícones de Campanhas', 'Badges Promocionais', 'Gráficos Explicativos'],
    latency: '~1.5s',
    qualityScore: '96/100',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/15',
    borderClass: 'border-cyan-500/40',
  },
  veo3: {
    id: 'veo3',
    command: '/veo',
    name: 'Veo 3 (Google DeepMind)',
    category: 'video',
    categoryLabel: 'Geração de Vídeo',
    badge: 'Vídeo 4K 60fps',
    role: 'Geração de Vídeo Cinematográfico de Alta Fidelidade',
    description: 'Produz clipes de alta definição com movimentos de câmera complexos (dolly, panning, zoom), física precisa e iluminação dinâmica.',
    strengths: [
      'Movimentos de câmera realistas com fluidez de 60fps',
      'Consistência temporal e anatômica entre frames',
      'Efeitos de iluminação volumétrica em movimento'
    ],
    recommendedPromptTip: 'Defina o movimento da câmera, ex: "câmera em dolly in acelerando em direção ao produto com iluminação neon".',
    idealFor: ['Reels Dinâmicos', 'TikToks de Impacto', 'YouTube Shorts', 'Vídeos de Abertura'],
    latency: '~3.2s',
    qualityScore: '99/100',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/40',
  },
  kling: {
    id: 'kling',
    command: '/kling',
    name: 'Kling AI',
    category: 'video',
    categoryLabel: 'Física & Movimento',
    badge: 'Física Fluida',
    role: 'Simulação de Física Dinâmica e Movimentos Humanos Complexos',
    description: 'Especialista em animações corporais complexas, interações físicas de tecidos, líquidos e transformações de cena.',
    strengths: [
      'Reprodução realista de gestos humanos e expressões faciais',
      'Física precisa de gravidade, fluidos e partículas',
      'Transições de plano fluidas sem deformação'
    ],
    recommendedPromptTip: 'Descreva a ação detalhada, ex: "pessoa interagindo com holograma luminoso no ar em movimento natural".',
    idealFor: ['Vídeos Narrativos', 'Demonstrações de Ação', 'Animações de Personagens', 'Stories Cinemáticos'],
    latency: '~2.9s',
    qualityScore: '98/100',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/15',
    borderClass: 'border-rose-500/40',
  },
  capcut: {
    id: 'capcut',
    command: '/capcut',
    name: 'CapCut AI Suite',
    category: 'video',
    categoryLabel: 'Edição & Cortes Virais',
    badge: 'Viral Cuts',
    role: 'Sincronização de Cortes, Legendas Dinâmicas e Efeitos de Transição',
    description: 'Automatiza o ritmo de corte para retenção máxima, aplicando legendas animadas sincronizadas e transições dinâmicas de alta viralidade.',
    strengths: [
      'Geração e posicionamento de legendas animadas em destaque',
      'Cortes de ritmo rápido para retenção nos primeiros 3 segundos',
      'Efeitos de zoom punch e transições com som de impacto'
    ],
    recommendedPromptTip: 'Adicione "ritmo acelerado, cortes dinâmicos a cada 1.5 segundos e legendas destacadas em amarelo/ciano".',
    idealFor: ['Reels Virais', 'Vídeos de Resumo', 'TikTok Trends', 'Clipes Rápidos'],
    latency: '~1.6s',
    qualityScore: '96/100',
    colorClass: 'text-teal-400',
    bgClass: 'bg-teal-500/15',
    borderClass: 'border-teal-500/40',
  },
  elevenlabs: {
    id: 'elevenlabs',
    command: '/elevenlabs',
    name: 'ElevenLabs Prime',
    category: 'voice',
    categoryLabel: 'Locução Neural',
    badge: 'Voz Hiper-Realista',
    role: 'Sintetização de Voz Neural com Emoção e Entonação Comercial',
    description: 'A principal tecnologia do mundo em locução com cadência humana autêntica, pausas dramáticas naturais e sotaque brasileiro impecável.',
    strengths: [
      'Entonação expressiva, entusiasta, persuasiva ou misteriosa',
      'Sotaque e dicção em português brasileiro impecáveis',
      'Pausas e ênfases ajustadas para marketing'
    ],
    recommendedPromptTip: 'Indique a emoção desejada, ex: "locução jovem, enérgica e entusiasmada para anúncio comercial".',
    idealFor: ['Voz de Vídeos', 'Podcasts em Pílulas', 'Audiogramas', 'Mensagens de Campanha'],
    latency: '~1.2s',
    qualityScore: '99/100',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/40',
  },
  musicgpt: {
    id: 'musicgpt',
    command: '/musicgpt',
    name: 'MusicGPT Studio',
    category: 'voice',
    categoryLabel: 'Trilhas & Sonoplastia',
    badge: 'Trilha Original',
    role: 'Geração de Trilhas Sonoras Originais e Sound Effects',
    description: 'Compõe fundos musicais sob medida nos gêneros synthwave, trap, cinematográfico ou lo-fi, sem problemas de copyright.',
    strengths: [
      'Músicas 100% livres de direitos autorais para monetização',
      'Ajuste dinâmico de BPM e intensidade conforme o vídeo',
      'Camadas de sound design para elevar o impacto de transições'
    ],
    recommendedPromptTip: 'Especifique o gênero e ritmo, ex: "trilha eletrônica cyberpunk enérgica 128 BPM com graves profundos".',
    idealFor: ['Background de Reels', 'Trilhas de Abertura', 'Sound Design de Vídeo', 'Efeitos Sonoros'],
    latency: '~2.1s',
    qualityScore: '95/100',
    colorClass: 'text-green-400',
    bgClass: 'bg-green-500/15',
    borderClass: 'border-green-500/40',
  },
  chatgpt: {
    id: 'chatgpt',
    command: '/chatgpt',
    name: 'ChatGPT-4o (OpenAI)',
    category: 'copy',
    categoryLabel: 'Copywriting Persuasivo',
    badge: 'Alta Conversão',
    role: 'Redação de Ganchos Magnéticos, Copies de Venda e CTAs de Impacto',
    description: 'Especialista em frameworks comprovados de conversão (AIDA, PAS, BAB), criando textos afiados que geram cliques e compartilhamentos.',
    strengths: [
      'Ganchos (hooks) magnéticos para os 3 primeiros segundos',
      'Estruturação de chamadas para ação (CTAs) de alta conversão',
      'Adaptação de tom por nicho (comercial, fitness, tech, etc.)'
    ],
    recommendedPromptTip: 'Defina a persona e o objetivo, ex: "foco em copy para empresários que buscam automação de marketing".',
    idealFor: ['Legendas de Posts', 'Roteiros de Venda', 'Headlines de Anúncios', 'Copy de Carrosséis'],
    latency: '~1.1s',
    qualityScore: '99/100',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/40',
  },
  claude: {
    id: 'claude',
    command: '/claude',
    name: 'Claude 3.7 Sonnet',
    category: 'copy',
    categoryLabel: 'Storytelling Profundo',
    badge: 'Texto Humanizado',
    role: 'Narrativas Emocionais, Roteiros Profundos e Textos Humanizados',
    description: 'Reconhecido pela capacidade incomparável de produzir textos ricos em nuances, com vocabulário refinado e ritmo natural.',
    strengths: [
      'Textos humanizados sem clichês repetitivos de IA',
      'Storytelling envolvente com arcos narrativos cativantes',
      'Capacidade de manter contexto longo em carrosséis educativos'
    ],
    recommendedPromptTip: 'Peça uma abordagem narrativa, ex: "conte uma história de superação que conecte o cliente à solução".',
    idealFor: ['Carrosséis Educativos', 'Posts de Autoridade', 'Artigos para LinkedIn', 'Newsletters'],
    latency: '~1.4s',
    qualityScore: '98/100',
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500/15',
    borderClass: 'border-yellow-500/40',
  },
  gemini: {
    id: 'gemini',
    command: '/gemini',
    name: 'Gemini 3.7 Flash Multimodal',
    category: 'research',
    categoryLabel: 'IA Central & Multimodal',
    badge: 'Multi-Modal Core',
    role: 'Orquestração Multimodal Geral, Sincronia e Raciocínio Holístico',
    description: 'O motor central do PLAYSTART IA que conecta e alinha texto, imagem, áudio, formato e estratégia em uma única pipeline coerente.',
    strengths: [
      'Processamento multimodal simultâneo de texto e visuais',
      'Entendimento profundo de regras de cada rede social',
      'Velocidade ultrarrápida com raciocínio contextual ampliado'
    ],
    recommendedPromptTip: 'Use para geração completa integrada de todos os formatos com máxima coerência entre mídias.',
    idealFor: ['Campanhas Multicanais', 'Planejamento Completo', 'Adaptações Omnichannel', 'Revisão Geral'],
    latency: '~0.9s',
    qualityScore: '100/100',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/40',
  },
  grok: {
    id: 'grok',
    command: '/grok',
    name: 'Grok Live Engine',
    category: 'research',
    categoryLabel: 'Tendências em Tempo Real',
    badge: 'Live Trends',
    role: 'Monitoramento de Tendências do Momento e Formatos em Alta',
    description: 'Analisa o que está em alta nas redes agora, sugerindo ângulos polêmicos, memes inteligentes e hashtags em forte ascensão.',
    strengths: [
      'Identificação de assuntos quentes (trending topics) em tempo real',
      'Linguagem descontraída, perspicaz e bem-humorada',
      'Excelente para tweets e comentários de alto engajamento'
    ],
    recommendedPromptTip: 'Adicione "aproveite as últimas tendências e adicione um toque espirituoso e provocativo".',
    idealFor: ['Threads no X', 'Posts de Oportunidade', 'Hashtags Virais', 'Comentários de Engajamento'],
    latency: '~1.5s',
    qualityScore: '96/100',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/15',
    borderClass: 'border-red-500/40',
  },
  perplexity: {
    id: 'perplexity',
    command: '/perplexity',
    name: 'Perplexity Pro',
    category: 'research',
    categoryLabel: 'Pesquisa & Fact-Checking',
    badge: 'Fact-Check 100%',
    role: 'Pesquisa e Validação de Dados com Fontes Confiáveis',
    description: 'Garante que estatísticas, dados de mercado, citações e informações técnicas mencionadas no conteúdo sejam 100% verificadas.',
    strengths: [
      'Validação de dados com fontes e links confiáveis',
      'Eliminação de alucinações em números e pesquisas',
      'Estruturação de resumos analíticos com respaldo técnico'
    ],
    recommendedPromptTip: 'Peça para fundamentar com dados reais, ex: "inclua dados de mercado sobre crescimento de IA em 2026".',
    idealFor: ['Posts com Dados', 'Infográficos Confiáveis', 'Artigos Técnicos', 'Comparações de Mercado'],
    latency: '~1.7s',
    qualityScore: '98/100',
    colorClass: 'text-sky-400',
    bgClass: 'bg-sky-500/15',
    borderClass: 'border-sky-500/40',
  },
  canva: {
    id: 'canva',
    command: '/canva',
    name: 'Canva Pro Layouts',
    category: 'design',
    categoryLabel: 'Diagramação de Redes',
    badge: 'Composição Social',
    role: 'Diagramação Visual, Alinhamento de Grids e Paletas de Cores',
    description: 'Otimiza espaçamentos, regras de terços, zonas seguras para stories e contraste de elementos visuais para feed.',
    strengths: [
      'Respeito rigoroso às zonas seguras (safe zones) de stories e reels',
      'Harmonização de contrastes e paletas cromáticas para legibilidade',
      'Estruturas de carrossel com continuidade fluida entre lâminas'
    ],
    recommendedPromptTip: 'Especifique o grid, ex: "diagramação limpa com margens generosas e foco visual centralizado".',
    idealFor: ['Carrosséis Contínuos', 'Stories Promocionais', 'Encartes Digitais', 'Headers'],
    latency: '~1.3s',
    qualityScore: '97/100',
    colorClass: 'text-cyan-300',
    bgClass: 'bg-cyan-500/15',
    borderClass: 'border-cyan-500/40',
  },
  gamma: {
    id: 'gamma',
    command: '/gamma',
    name: 'Gamma Visual Cards',
    category: 'design',
    categoryLabel: 'Estruturação Visual',
    badge: 'Cards & Decks',
    role: 'Formatação de Cards Informativos e Slides Estruturados',
    description: 'Transforma ideias complexas em blocos visuais sintetizados, cartões explicativos e decks com estética moderna.',
    strengths: [
      'Hierarquia visual clara dividida em tópicos digeríveis',
      'Excelente para carrosséis de passo a passo (Step by Step)',
      'Cards limpos com destaque para métricas e conceitos-chave'
    ],
    recommendedPromptTip: 'Peça formato estruturado, ex: "divida em 4 passos lógicos com numeração e destaque visual".',
    idealFor: ['Carrosséis Informativos', 'Guias Rápidos', 'Resumos Visuais', 'Pitches'],
    latency: '~1.6s',
    qualityScore: '95/100',
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/15',
    borderClass: 'border-violet-500/40',
  }
};

const CATEGORIES = [
  { id: 'all', label: 'Todos (16)' },
  { id: 'image', label: 'Imagem (4)' },
  { id: 'video', label: 'Vídeo (3)' },
  { id: 'voice', label: 'Voz (2)' },
  { id: 'copy', label: 'Copy (2)' },
  { id: 'research', label: 'Pesquisa (3)' },
  { id: 'design', label: 'Design (2)' },
];

export const AIShortcutsBar: React.FC<AIShortcutsBarProps> = ({
  prompt,
  onPromptChange,
  customEngines = {},
  onCustomEnginesChange,
  onSaveSnapshot,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeEngineModal, setActiveEngineModal] = useState<EngineCapabilityDetail | null>(null);

  // Filter commands by category
  const visibleCommands = React.useMemo(() => {
    if (selectedCategory === 'all') return AI_COMMANDS;
    return AI_COMMANDS.filter((cmd) => cmd.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelectEngineShortcut = (cmd: AICommandItem, openModal: boolean = true) => {
    // 1. Insert command into prompt if not already present
    const cmdStr = cmd.command;
    let newPrompt = prompt.trim();

    if (!newPrompt.includes(cmdStr)) {
      newPrompt = newPrompt ? `${newPrompt} ${cmdStr}` : cmdStr;
      onPromptChange(newPrompt);
      if (onSaveSnapshot) {
        onSaveSnapshot(newPrompt, 'manual', `Atalho ${cmdStr}`);
      }
    }

    // 2. Set custom engine override in state
    if (onCustomEnginesChange) {
      onCustomEnginesChange({
        ...customEngines,
        [cmd.category]: cmd.name,
      });
    }

    // 3. Open detailed capability explanation modal if requested
    if (openModal) {
      const detail = ENGINE_CAPABILITIES[cmd.id] || {
        id: cmd.id,
        command: cmd.command,
        name: cmd.name,
        category: cmd.category,
        categoryLabel: cmd.categoryLabel,
        badge: cmd.badge,
        role: cmd.role,
        description: cmd.description,
        strengths: ['Alta precisão no mecanismo', 'Otimizado para redes sociais'],
        recommendedPromptTip: `Use ${cmd.command} para direcionar este componente.`,
        idealFor: ['Posts', 'Stories', 'Reels'],
        latency: '~1.5s',
        qualityScore: `${cmd.confidence}/100`,
        colorClass: cmd.colorClass,
        bgClass: cmd.bgClass,
        borderClass: cmd.borderClass,
      };
      setActiveEngineModal(detail);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'image': return <ImageIcon className="w-3 h-3 text-pink-400" />;
      case 'video': return <Video className="w-3 h-3 text-purple-400" />;
      case 'voice': return <Mic className="w-3 h-3 text-emerald-400" />;
      case 'copy': return <FileText className="w-3 h-3 text-amber-400" />;
      case 'research': return <Cpu className="w-3 h-3 text-blue-400" />;
      case 'design': return <Layout className="w-3 h-3 text-cyan-400" />;
      default: return <Terminal className="w-3 h-3 text-[#06B6D4]" />;
    }
  };

  return (
    <div 
      id="ai-shortcuts-floating-bar"
      className="my-2 p-2.5 sm:p-3 bg-[#18131C]/95 border border-[#E05A47]/30 rounded-xl shadow-lg backdrop-blur-md transition-all flex flex-col gap-2 relative z-20"
    >
      {/* Bar Header: Title, Category Pills & Collapse Toggle */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#E05A47] to-[#F97316] text-white flex items-center justify-center shadow-sm shadow-[#E05A47]/30">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#FFFFFF]">
                AI Shortcuts Bar
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#EC4899]/20 text-[#FB7185] border border-[#EC4899]/40 font-bold">
                16 IAs
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Clique para injetar o comando e abrir a especificação técnica da IA
            </p>
          </div>
        </div>

        {/* Categories & Toggle Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`btn-shortcut-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-sm shadow-[#E05A47]/30'
                    : 'bg-[#120E16] text-slate-400 hover:text-white border border-slate-800 hover:border-[#E05A47]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            type="button"
            id="btn-toggle-ai-shortcuts-bar"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-[#120E16] text-slate-400 hover:text-white border border-slate-800 transition-colors ml-1"
            title={isExpanded ? 'Recolher Barra de Atalhos' : 'Expandir Barra de Atalhos'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Shortcuts Grid */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 pt-1 border-t border-slate-800/80 animate-fadeIn">
          {visibleCommands.map((cmd) => {
            const isSelected = customEngines && customEngines[cmd.category] === cmd.name;
            const isPromptActive = prompt.includes(cmd.command);

            return (
              <button
                key={cmd.id}
                id={`btn-shortcut-engine-${cmd.id}`}
                type="button"
                onClick={() => handleSelectEngineShortcut(cmd, true)}
                className={`group relative p-2 rounded-lg border text-left flex flex-col justify-between gap-1 transition-all duration-150 ${
                  isSelected || isPromptActive
                    ? 'bg-[#221825] border-[#E05A47] shadow-md shadow-[#E05A47]/20 ring-1 ring-[#F97316]/50'
                    : 'bg-[#120E16] border-slate-800 hover:border-[#E05A47]/50 hover:bg-[#18131C]'
                }`}
                title={`Clique para adicionar ${cmd.command} e ver capacidades`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(cmd.category)}
                    <span className="font-mono text-[11px] font-bold text-[#FFFFFF] group-hover:text-[#FB923C] transition-colors">
                      {cmd.command}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-3 h-3 text-[#10B981] flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-slate-400 truncate group-hover:text-slate-200">
                    {cmd.name}
                  </span>
                  <span className="text-[9px] text-[#FB7185] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-2.5 h-2.5" />
                  </span>
                </div>

                {/* Sub badge */}
                <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                  <span>{cmd.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Engine Capability Details Modal */}
      {activeEngineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div 
            id="engine-capability-modal-panel"
            className="bg-[#1E1E2F] border border-[#06B6D4]/50 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F111A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border flex items-center justify-center ${activeEngineModal.bgClass} ${activeEngineModal.borderClass}`}>
                  <Terminal className={`w-5 h-5 ${activeEngineModal.colorClass}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#F8FAFC]">
                      {activeEngineModal.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#67E8F9]">
                      {activeEngineModal.command}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {activeEngineModal.categoryLabel} • {activeEngineModal.badge}
                  </p>
                </div>
              </div>

              <button
                id="btn-close-engine-capability-modal"
                onClick={() => setActiveEngineModal(null)}
                className="p-1.5 rounded-lg bg-[#1E1E2F] text-slate-400 hover:text-white border border-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 scrollbar-thin">
              {/* Role & Core Description */}
              <div className="p-3.5 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
                  Especialidade do Motor:
                </span>
                <span className="text-xs font-bold text-[#F8FAFC]">
                  {activeEngineModal.role}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  {activeEngineModal.description}
                </p>
              </div>

              {/* Quality & Latency Specs */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Score de Qualidade
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-emerald-400">
                      {activeEngineModal.qualityScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">calibrado</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Latência Média de Render
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#67E8F9]">
                      {activeEngineModal.latency}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">tempo de resposta</span>
                  </div>
                </div>
              </div>

              {/* Strengths List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Principais Fortalezas Técnicas:
                </span>
                <div className="flex flex-col gap-1.5">
                  {activeEngineModal.strengths.map((st, i) => (
                    <div 
                      key={i}
                      className="p-2.5 bg-[#0F111A] rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Prompt Tip */}
              <div className="p-3.5 bg-gradient-to-r from-[#06B6D4]/10 to-[#3B82F6]/10 rounded-xl border border-[#06B6D4]/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#67E8F9]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#67E8F9]">
                    Dica de Otimização de Prompt:
                  </span>
                </div>
                <p className="text-xs text-[#F8FAFC] italic">
                  "{activeEngineModal.recommendedPromptTip}"
                </p>
              </div>

              {/* Recommended Formats */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Melhores Formatos de Saída:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeEngineModal.idealFor.map((fmt, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#141622] text-slate-300 border border-slate-800 text-[11px] font-medium"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-800 bg-[#0F111A] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">
                  {activeEngineModal.command} inserido no prompt
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-apply-engine-and-tip"
                  type="button"
                  onClick={() => {
                    const tipText = activeEngineModal.recommendedPromptTip.replace(/^"|"$/g, '');
                    const newPrompt = prompt.includes(tipText)
                      ? prompt
                      : `${prompt.trim()} ${activeEngineModal.command} ${tipText}`.trim();
                    onPromptChange(newPrompt);
                    if (onSaveSnapshot) {
                      onSaveSnapshot(newPrompt, 'manual', `Dica ${activeEngineModal.name}`);
                    }
                    setActiveEngineModal(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#06B6D4]/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inserir c/ Dica de Prompt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEngineModal(null)}
                  className="px-3 py-2 rounded-xl bg-[#1E1E2F] hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Pronto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
