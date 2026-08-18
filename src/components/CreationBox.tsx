import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Mic, 
  MicOff, 
  Video, 
  Image as ImageIcon, 
  ArrowRight, 
  Loader2, 
  Check, 
  X, 
  Volume2, 
  AlertCircle,
  Radio,
  History,
  Copy,
  Edit3,
  Trash2,
  Plus,
  CornerDownLeft,
  CheckCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  Sliders,
  Keyboard,
  Hash,
  Zap
} from 'lucide-react';
import { SocialNetwork, CustomEngineOverrides, GrammarToneResult } from '../types';
import { AICommandPalette, AI_COMMANDS, AICommandItem } from './AICommandPalette';
import { GrammarToneModal } from './GrammarToneModal';
import { AIShortcutsBar } from './AIShortcutsBar';
import { HashtagsKeywordsSuggester } from './HashtagsKeywordsSuggester';
import { PromptTemplateLibraryModal } from './PromptTemplateLibraryModal';
import {
  PredictivePromptSuggester,
  PredictivePromptResponse,
} from './PredictivePromptSuggester';
import {
  PromptTemplate as StructuredPromptTemplate,
  PROMPT_TEMPLATES_LIBRARY,
  getContextualTemplateRecommendations,
} from '../data/promptTemplates';

export interface VoiceTranscriptItem {
  id: string;
  text: string;
  timestamp: string;
}

export interface PromptVersion {
  id: string;
  prompt: string;
  timestamp: string;
  source: 'manual' | 'ia-enhance' | 'template' | 'dictation';
  label: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  template: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'product-launch',
    name: 'Lançamento de Produto',
    category: 'Vendas & Lançamentos',
    badge: 'Alta Conversão',
    description: 'Apresenta problema, inovação tecnológica, benefícios e oferta de estreia.',
    template:
      '[LANÇAMENTO DE PRODUTO]\nProduto: [Nome do Produto/Serviço]\nPúblico-alvo: [Empreendedores / Criadores / Consumidores]\nProblema resolvido: [Principal dor do cliente]\nDiferencial tecnológico: [IA integrada / Alta performance / Economia de tempo]\nEstilo visual: Render 8K com iluminação neon ciano, 60fps cinematográfico e transições dinâmicas.\nChamada para Ação (CTA): Garanta sua vaga com condição exclusiva no link da bio!',
  },
  {
    id: 'viral-hook',
    name: 'Gancho Viral (Trend)',
    category: 'Viral & Reels/TikTok',
    badge: 'Engajamento 10x',
    description: 'Começa com curiosidade irresistível e cortes rápidos a cada 2 segundos.',
    template:
      '[GANCHO VIRAL 15s]\nGancho inicial (0-3s): "Você ainda faz [Ação antiga]? Veja o que acontece quando usa IA em 2026..."\nDesenvolvimento (3-12s): 3 passos ultra rápidos mostrando a tela em ação com zoom dinâmico.\nEncerramento (12-15s): "Comente \'PLAY\' que eu te envio o tutorial completo agora!"\nEstilo visual: Cores saturadas, legendas animadas em amarelo/ciano e efeitos sonoros sci-fi.',
  },
  {
    id: 'customer-testimonial',
    name: 'Depoimento & Prova Social',
    category: 'Autoridade & Prova',
    badge: 'Confiança',
    description: 'Transformação real de cliente com métricas comprovadas e validação.',
    template:
      '[DEPOIMENTO DE CLIENTE]\nCliente: [Nome do Cliente / Empresa parceira]\nResultado alcançado: [+300% de alcance orgânico em 14 dias com PlayStart IA]\nHistória: "Antes eu perdia 5 horas editando vídeos para cada rede social. Hoje com o Grupo Rimane, publico em 6 redes com 1 clique."\nEstilo visual: Enquadramento vertical 9:16 humanizado, cortes suaves, selo de verificado e áudio cristalino.',
  },
  {
    id: 'flash-offer',
    name: 'Oferta Relâmpago',
    category: 'Urgência & Escassez',
    badge: 'Vendas Rápidas',
    description: 'Cronômetro regressivo, bônus imperdível e motivo genuíno de escassez.',
    template:
      '[OFERTA RELÂMPAGO - ÚLTIMAS 24H]\nMotivo da promoção: [Celebração de novo marco / Lançamento do lote 1]\nBenefício exclusivo: [50% de desconto + 1 ano de acesso ao motor Veo 3 e Leonardo IA]\nEscassez: "Restam apenas 17 licenças com este valor promocional."\nEstilo visual: Fundo escuro com partículas de luz, contagem regressiva em destaque e badge de oferta especial.',
  },
  {
    id: 'expert-tip',
    name: 'Dica de Especialista',
    category: 'Conteúdo Educativo',
    badge: 'Autoridade',
    description: 'Passo a passo acionável que gera salvamentos e compartilhamentos.',
    template:
      '[DICA DE ESPECIALISTA - GUIA PRÁTICO]\nTítulo: 3 truques avançados para multiplicar seu alcance nas redes com IA.\nPasso 1: Gere multiformatos simultâneos (9:16, 16:9, 1:1) para não perder nenhum algoritmo.\nPasso 2: Use legendas com ganchos emocionais específicos por plataforma.\nPasso 3: Programe o disparo nos horários de pico.\nCTA: Salve este post para consultar quando for criar seu próximo conteúdo!',
  },
];

interface CreationBoxProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  onEnhancePrompt: () => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  generationStep: number;
  selectedNetworks: SocialNetwork[];
  customEngines?: CustomEngineOverrides;
  onCustomEnginesChange?: (engines: CustomEngineOverrides) => void;
  onOpenShortcutsHelp?: () => void;
}

const PROMPT_SUGGESTIONS = [
  'Lançamento de produto tecnológico inovador com holograma 3D',
  'Anúncio de alta conversão para promoção relâmpago de curso digital',
  'Vídeo institucional cinematográfico do Grupo Rimane com IA',
  'Tour imobiliário de luxo com iluminação golden hour e vista panorâmica',
  'Dicas rápidas de produtividade com inteligência artificial para o TikTok',
];

const GENERATION_STEPS = [
  { step: 1, label: 'Criando imagem base com Leonardo IA / Ideogram' },
  { step: 2, label: 'Gerando vídeo cinematográfico com Veo 3 / Kling' },
  { step: 3, label: 'Ajustando formatos automáticos para 6 redes sociais' },
];

export const CreationBox: React.FC<CreationBoxProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  onEnhancePrompt,
  isGenerating,
  isEnhancing,
  generationStep,
  selectedNetworks,
  customEngines = {},
  onCustomEnginesChange,
  onOpenShortcutsHelp,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [speechLang, setSpeechLang] = useState<'pt-BR' | 'en-US' | 'es-ES'>('pt-BR');
  const [speechMode, setSpeechMode] = useState<'append' | 'replace'>('append');

  // AI Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [commandSearchFilter, setCommandSearchFilter] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const safeEngines: CustomEngineOverrides = customEngines || {};

  // Handlers for shortcuts inside textarea
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isAlt = e.altKey;

    // Tab key -> accept predictive completion if present and command palette is not open
    if (
      e.key === 'Tab' &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !isCommandPaletteOpen
    ) {
      if (predictiveData?.inlineGhostText && isPredictiveEnabled) {
        e.preventDefault();
        handleAcceptPredictiveCompletion(
          predictiveData.inlineGhostText,
          'Autocompletar Tab'
        );
        return;
      }
    }

    // Escape key -> dismiss predictive completion
    if (e.key === 'Escape') {
      if (predictiveData) {
        setPredictiveData(null);
      }
    }

    // Ctrl + Enter -> Gerar Imagem + Vídeo
    if (isCtrlOrCmd && e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
      return;
    }

    // Ctrl + E -> Realçar prompt com IA
    if (isCtrlOrCmd && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      onEnhancePrompt();
      return;
    }

    // Ctrl + K -> Abrir Comandos IA
    if (isCtrlOrCmd && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      setCommandSearchFilter('');
      setIsCommandPaletteOpen((prev) => !prev);
      return;
    }

    // Ctrl + G -> Revisão de Tom & Gramática
    if (isCtrlOrCmd && (e.key === 'g' || e.key === 'G')) {
      e.preventDefault();
      handleRunGrammarToneCheck();
      return;
    }

    // Alt + V -> Voice-to-Prompt
    if (isAlt && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      handleToggleVoiceInput();
      return;
    }

    // Alt + T -> Templates
    if (isAlt && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      setIsTemplatesModalOpen((prev) => !prev);
      return;
    }

    // Ctrl + / -> Guia de Atalhos
    if (isCtrlOrCmd && e.key === '/') {
      e.preventDefault();
      if (onOpenShortcutsHelp) {
        onOpenShortcutsHelp();
      }
      return;
    }
  };

  // Voice Transcripts Log State (Last 3 transcripts)
  const [voiceTranscripts, setVoiceTranscripts] = useState<VoiceTranscriptItem[]>(() => {
    try {
      const saved = localStorage.getItem('playstart_voice_transcripts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 3);
        }
      }
    } catch (e) {
      console.warn('Failed to load transcripts from localStorage', e);
    }
    return [
      {
        id: 'default-sample-1',
        text: 'Vídeo futurista para Instagram e TikTok com efeitos holográficos e narração rápida',
        timestamp: 'Exemplo recente',
      },
    ];
  });

  const [editingTranscriptId, setEditingTranscriptId] = useState<string | null>(null);
  const [editingTranscriptText, setEditingTranscriptText] = useState<string>('');
  const [copiedTranscriptId, setCopiedTranscriptId] = useState<string | null>(null);
  const [isTranscriptLogOpen, setIsTranscriptLogOpen] = useState<boolean>(true);

  // Prompt Templates & Version Auto-Save State
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState<boolean>(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState<boolean>(false);
  const [copiedVersionId, setCopiedVersionId] = useState<string | null>(null);

  // Grammar & Tone Check State (LLM Review)
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState<boolean>(false);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState<boolean>(false);
  const [grammarResult, setGrammarResult] = useState<GrammarToneResult | null>(null);

  // Predictive Prompting State (Real-time completion on typing pause)
  const [isPredictiveEnabled, setIsPredictiveEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('playstart_predictive_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [predictiveData, setPredictiveData] = useState<PredictivePromptResponse | null>(null);
  const [isPredictiveLoading, setIsPredictiveLoading] = useState<boolean>(false);
  const predictiveAbortControllerRef = useRef<AbortController | null>(null);
  const predictiveDebounceTimerRef = useRef<any>(null);

  // Snapshot the last 5 versions of the prompt into LocalStorage
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>(() => {
    try {
      const saved = localStorage.getItem('playstart_prompt_versions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      console.warn('Failed to load prompt versions', e);
    }
    return [
      {
        id: 'v-init-1',
        prompt: prompt || 'Lançamento da nova linha de produtos digitais com IA integrada',
        timestamp: 'Inicial',
        source: 'manual',
        label: 'Versão Inicial',
      },
    ];
  });

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const promptBeforeDictationRef = useRef<string>('');
  const currentSessionTranscriptRef = useRef<string>('');
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const autoSaveTimerRef = useRef<any>(null);

  // Save a new version snapshot (max 5)
  const savePromptSnapshot = (
    text: string,
    source: 'manual' | 'ia-enhance' | 'template' | 'dictation',
    label?: string
  ) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 5) return;

    const sourceLabels = {
      manual: 'Edição Manual',
      'ia-enhance': 'IA Otimizado (Gemini)',
      template: 'Template Injetado',
      dictation: 'Transcrição de Voz',
    };

    const newVersion: PromptVersion = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      prompt: trimmed,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      source,
      label: label || sourceLabels[source],
    };

    setPromptVersions((prev) => {
      // Don't add if identical to latest
      if (prev.length > 0 && prev[0].prompt.trim() === trimmed) {
        return prev;
      }
      const updated = [newVersion, ...prev.filter(v => v.prompt.trim() !== trimmed)].slice(0, 5);
      try {
        localStorage.setItem('playstart_prompt_versions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Revert prompt to a previous version
  const handleRevertVersion = (version: PromptVersion) => {
    // Snapshot current prompt before reverting
    if (prompt.trim() && prompt.trim() !== version.prompt.trim()) {
      savePromptSnapshot(prompt, 'manual', 'Antes de Reverter');
    }
    onPromptChange(version.prompt);
    setIsVersionsModalOpen(false);
  };

  // Toggle predictive prompting on/off
  const handleTogglePredictive = () => {
    setIsPredictiveEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('playstart_predictive_enabled', JSON.stringify(next));
      } catch (e) {}
      if (!next) {
        setPredictiveData(null);
      }
      return next;
    });
  };

  // Apply a predictive completion phrase seamlessly into the prompt
  const handleAcceptPredictiveCompletion = (
    completionText: string,
    label: string = 'Sugestão Preditiva'
  ) => {
    if (!completionText) return;
    if (prompt.trim()) {
      savePromptSnapshot(prompt, 'manual', 'Antes da Predição');
    }

    const current = prompt.trim();
    let newPrompt = '';
    if (
      completionText.startsWith(' ') ||
      completionText.startsWith(',') ||
      completionText.startsWith('.')
    ) {
      newPrompt = `${current}${completionText}`;
    } else {
      newPrompt = `${current} ${completionText}`;
    }

    onPromptChange(newPrompt);
    savePromptSnapshot(newPrompt, 'ia-enhance', `Preditivo: ${label}`);
    setPredictiveData(null);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Trigger predictive prompting after user pauses typing (700ms)
  useEffect(() => {
    if (!isPredictiveEnabled || !prompt || prompt.trim().length < 5 || isGenerating) {
      if (!prompt || prompt.trim().length < 5) {
        setPredictiveData(null);
      }
      return;
    }

    if (predictiveDebounceTimerRef.current) {
      clearTimeout(predictiveDebounceTimerRef.current);
    }

    predictiveDebounceTimerRef.current = setTimeout(async () => {
      if (predictiveAbortControllerRef.current) {
        predictiveAbortControllerRef.current.abort();
      }
      predictiveAbortControllerRef.current = new AbortController();

      setIsPredictiveLoading(true);
      try {
        const res = await fetch('/api/predictive-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            selectedNetworks,
            currentFormat: '9:16 Vertical',
          }),
          signal: predictiveAbortControllerRef.current.signal,
        });

        if (res.ok) {
          const data = await res.json();
          setPredictiveData(data);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Predictive prompting error:', err);
        }
      } finally {
        setIsPredictiveLoading(false);
      }
    }, 700);

    return () => {
      if (predictiveDebounceTimerRef.current) {
        clearTimeout(predictiveDebounceTimerRef.current);
      }
    };
  }, [prompt, isPredictiveEnabled, selectedNetworks, isGenerating]);

  // Contextual Template Recommendations
  const contextualSuggestion = useMemo(() => {
    return getContextualTemplateRecommendations(prompt, selectedNetworks);
  }, [prompt, selectedNetworks]);

  // Apply a template from the Structured Template Library into the prompt field with snapshot
  const handleApplyTemplateLibrary = (
    templateText: string,
    mode: 'replace' | 'append' = 'replace',
    templateName: string = 'Template Estruturado'
  ) => {
    if (prompt.trim()) {
      savePromptSnapshot(prompt, 'manual', 'Antes do Template');
    }
    const updatedPrompt =
      mode === 'append' && prompt.trim().length > 0
        ? `${prompt.trim()}\n\n${templateText}`.trim()
        : templateText;

    onPromptChange(updatedPrompt);
    savePromptSnapshot(updatedPrompt, 'template', `Template: ${templateName}`);
    setIsTemplatesModalOpen(false);
  };

  // Apply legacy or direct template into the prompt field and snapshot
  const handleApplyTemplate = (templateItem: PromptTemplate) => {
    handleApplyTemplateLibrary(templateItem.template, 'replace', templateItem.name);
  };

  // Run LLM Grammar, Tone & Clarity Check
  const handleRunGrammarToneCheck = async () => {
    if (!prompt.trim() || isCheckingGrammar || isGenerating) return;
    setIsCheckingGrammar(true);
    try {
      const res = await fetch('/api/grammar-tone-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          selectedNetworks,
        }),
      });

      if (res.ok) {
        const data: GrammarToneResult = await res.json();
        setGrammarResult(data);
        setIsGrammarModalOpen(true);
      } else {
        console.warn('Grammar check request failed');
      }
    } catch (err) {
      console.error('Error during grammar and tone check:', err);
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  // Apply a prompt suggested by the Grammar & Tone Check
  const handleApplyGrammarPrompt = (newPrompt: string, label: string) => {
    if (prompt.trim() && prompt.trim() !== newPrompt.trim()) {
      savePromptSnapshot(prompt, 'manual', 'Antes da Revisão');
    }
    onPromptChange(newPrompt);
    savePromptSnapshot(newPrompt, 'ia-enhance', label);
  };

  // Debounced auto-save version snapshot on manual input
  useEffect(() => {
    if (!prompt || prompt.length < 10) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      savePromptSnapshot(prompt, 'manual');
    }, 4000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [prompt]);

  // Add a new transcribed snippet to the 3-item log
  const addTranscriptSnippet = (newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed || trimmed.length < 2) return;

    const newItem: VoiceTranscriptItem = {
      id: `vt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setVoiceTranscripts((prev) => {
      // Avoid duplicate consecutive identical text
      if (prev.length > 0 && prev[0].text.trim().toLowerCase() === trimmed.toLowerCase()) {
        return prev;
      }
      const updated = [newItem, ...prev.filter(item => item.id !== newItem.id)].slice(0, 3);
      try {
        localStorage.setItem('playstart_voice_transcripts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Start editing a transcript
  const handleStartEdit = (item: VoiceTranscriptItem) => {
    setEditingTranscriptId(item.id);
    setEditingTranscriptText(item.text);
  };

  // Save edited transcript
  const handleSaveEdit = (id: string) => {
    const trimmed = editingTranscriptText.trim();
    if (!trimmed) {
      handleDeleteTranscript(id);
      return;
    }

    setVoiceTranscripts((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, text: trimmed } : item
      );
      try {
        localStorage.setItem('playstart_voice_transcripts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setEditingTranscriptId(null);
    setEditingTranscriptText('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTranscriptId(null);
    setEditingTranscriptText('');
  };

  // Delete transcript
  const handleDeleteTranscript = (id: string) => {
    setVoiceTranscripts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('playstart_voice_transcripts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (editingTranscriptId === id) {
      setEditingTranscriptId(null);
    }
  };

  // Copy transcript to clipboard
  const handleCopyTranscript = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTranscriptId(id);
      setTimeout(() => {
        setCopiedTranscriptId(null);
      }, 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  // Insert transcript into the main prompt field
  const handleApplyToPrompt = (text: string, mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      onPromptChange(text);
    } else {
      const current = prompt.trim();
      if (!current) {
        onPromptChange(text);
      } else {
        onPromptChange(`${current} ${text}`);
      }
    }
  };

  // Clear all transcripts
  const handleClearAllTranscripts = () => {
    setVoiceTranscripts([]);
    try {
      localStorage.removeItem('playstart_voice_transcripts');
    } catch (e) {}
  };

  // Check speech recognition support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Audio tone generator for start/stop feedback
  const playAudioCue = (type: 'start' | 'stop') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } else {
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch (e) {
      // Audio context autoplay restrictions or unavailable
    }
  };

  // Start Visualizer using microphone stream
  const startAudioVisualizer = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVisualizer = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume level
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const currentLevel = Math.min(100, Math.round((avg / 128) * 100));
          setAudioLevel(currentLevel);

          // Draw real-time dynamic audio waveform on the canvas overlay
          const canvas = waveformCanvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const width = canvas.width;
              const height = canvas.height;
              ctx.clearRect(0, 0, width, height);

              const time = Date.now() / 200;
              const barCount = 32;
              const barWidth = width / barCount;

              // 1. Draw glowing frequency bars
              for (let i = 0; i < barCount; i++) {
                const dataIndex = Math.floor((i / barCount) * dataArray.length);
                const freq = dataArray[dataIndex] || 0;
                const normalized = Math.max(0.08, freq / 255);
                const barHeight = normalized * height * 0.75;
                const x = i * barWidth;
                const y = height - barHeight;

                const grad = ctx.createLinearGradient(0, height, 0, y);
                grad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
                grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.45)');
                grad.addColorStop(1, 'rgba(103, 232, 249, 0.85)');

                ctx.fillStyle = grad;
                ctx.fillRect(x + 1.5, y, barWidth - 3, barHeight);
              }

              // 2. Draw dynamic central neon sine wave
              ctx.beginPath();
              ctx.strokeStyle = '#67E8F9';
              ctx.lineWidth = 2;
              ctx.shadowBlur = 12;
              ctx.shadowColor = '#06B6D4';

              for (let i = 0; i < width; i += 4) {
                const freqSample = dataArray[Math.floor((i / width) * dataArray.length)] || 20;
                const amp = (freqSample / 255) * (height * 0.35);
                const y = height * 0.5 + Math.sin(i * 0.05 + time) * amp;

                if (i === 0) {
                  ctx.moveTo(i, y);
                } else {
                  ctx.lineTo(i, y);
                }
              }
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }

          animFrameRef.current = requestAnimationFrame(updateVisualizer);
        };

        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      }
    } catch (err) {
      console.warn('Microphone stream for visualizer not permitted or unavailable:', err);
    }
  };

  // Stop Visualizer and release mic tracks
  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Toggle Voice Input
  const handleToggleVoiceInput = () => {
    setSpeechError(null);

    if (isListening) {
      stopListening(true);
      return;
    }

    startListening();
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Reconhecimento de voz não é suportado pelo seu navegador atual. Use o Google Chrome, Edge ou Safari para ditar por voz.');
      return;
    }

    try {
      promptBeforeDictationRef.current = prompt;
      setInterimTranscript('');
      
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        currentSessionTranscriptRef.current = '';
        playAudioCue('start');
        startAudioVisualizer();
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTrans += text + ' ';
          } else {
            interimTrans += text;
          }
        }

        const dictatedSoFar = (finalTrans + ' ' + interimTrans).trim();
        if (dictatedSoFar) {
          currentSessionTranscriptRef.current = dictatedSoFar;
        }

        const base = speechMode === 'replace' ? '' : promptBeforeDictationRef.current.trim();
        const combined = base ? `${base} ${dictatedSoFar}`.trim() : dictatedSoFar;

        setInterimTranscript(interimTrans || finalTrans);
        onPromptChange(combined);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setSpeechError('Permissão do microfone negada. Clique no ícone de cadeado do navegador para autorizar o microfone.');
        } else if (event.error === 'no-speech') {
          // No speech detected yet, continue listening unless manual stop
          return;
        } else if (event.error === 'network') {
          setSpeechError('Falha de conexão com o serviço de voz. Verifique sua conexão com a internet.');
        }
        stopListening(false);
      };

      recognition.onend = () => {
        // If user didn't explicitly stop, end cleanly and save snippet
        if (isListening) {
          stopListening(true);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Não foi possível iniciar o microfone. Verifique as permissões de áudio.');
      setIsListening(false);
      stopAudioVisualizer();
    }
  };

  const stopListening = (keepChanges = true) => {
    setIsListening(false);
    playAudioCue('stop');
    stopAudioVisualizer();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      recognitionRef.current = null;
    }

    if (!keepChanges) {
      onPromptChange(promptBeforeDictationRef.current);
    } else {
      if (currentSessionTranscriptRef.current) {
        addTranscriptSnippet(currentSessionTranscriptRef.current);
      }
    }
    setInterimTranscript('');
    currentSessionTranscriptRef.current = '';
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <section className="w-full bg-[#18131C] rounded-2xl border border-[#E05A47]/30 p-4 sm:p-6 terracotta-glow flex flex-col gap-4 shadow-xl shadow-black/40">
      {/* Box Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#E05A47] to-[#F97316] text-white shadow-md shadow-[#E05A47]/30">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#FFFFFF] tracking-tight">
              Caixa de Criação Inteligente
            </h2>
            <p className="text-xs text-[#E2E8F0]">
              Descreva sua ideia, dite pelo microfone ou escolha uma inspiração. As 16 IAs geram a imagem e o vídeo de uma só vez!
            </p>
          </div>
        </div>

        {/* Selected Networks Count */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#221825] border border-[#EC4899]/30 text-xs font-bold text-[#FB7185]">
          <span>{selectedNetworks.length} Redes Selecionadas</span>
        </div>
      </div>

      {/* Voice Dictation Live Banner (when active) */}
      {isListening && (
        <div className="bg-[#201524] border border-[#E05A47] rounded-xl p-3.5 palette-multi-glow flex flex-col gap-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Animated Sound Wave & Status */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#EC4899]/20 text-[#FB7185] border border-[#EC4899]/50 flex-shrink-0 animate-pulse">
                <Mic className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E05A47] rounded-full animate-ping" />
              </div>

              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FFFFFF]">
                    Voice-to-Prompt: Gravando sua ideia em tempo real...
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E05A47]/20 text-[#FB923C] border border-[#E05A47]/40 font-bold">
                    AO VIVO
                  </span>
                </div>
                <p className="text-xs text-[#FB923C] truncate italic max-w-xs sm:max-w-md">
                  {interimTranscript ? `"${interimTranscript}"` : 'Fale agora: descreva o tema, detalhes visuais e tom do anúncio...'}
                </p>
              </div>
            </div>

            {/* Center: Live Equalizer Bars reacting to audio level */}
            <div className="flex items-center gap-1 h-5 px-3 py-1 bg-[#150E18] rounded-lg border border-slate-800">
              {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.3].map((factor, idx) => {
                const heightMultiplier = Math.max(0.15, (audioLevel / 100) * factor);
                const heightPercent = Math.min(100, Math.max(15, Math.round(heightMultiplier * 100)));
                const barColor = idx % 3 === 0 ? 'bg-[#E05A47]' : idx % 3 === 1 ? 'bg-[#F97316]' : 'bg-[#EC4899]';
                return (
                  <div
                    key={idx}
                    className={`w-1 ${barColor} rounded-full transition-all duration-75`}
                    style={{ height: `${heightPercent}%` }}
                  />
                );
              })}
            </div>

            {/* Right: Quick Stop / Cancel Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                id="btn-voice-cancel"
                onClick={() => stopListening(false)}
                className="p-1.5 rounded-lg bg-[#18131C] text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-colors"
                title="Descartar Ditado"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                id="btn-voice-done"
                onClick={() => stopListening(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] text-white text-xs font-bold hover:opacity-90 shadow-md transition-all"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Concluir Ditado</span>
              </button>
            </div>
          </div>

          {/* Voice Settings Bar: Language & Mode */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-2 flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300">Idioma:</span>
              {(['pt-BR', 'en-US', 'es-ES'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSpeechLang(lang)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                    speechLang === lang
                      ? 'bg-[#E05A47] text-white font-bold shadow-sm shadow-[#E05A47]/40'
                      : 'bg-[#18131C] text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {lang === 'pt-BR' ? '🇧🇷 PT-BR' : lang === 'en-US' ? '🇺🇸 EN-US' : '🇪🇸 ES-ES'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-300">Modo de Inserção:</span>
              <button
                type="button"
                onClick={() => setSpeechMode('append')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  speechMode === 'append'
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]'
                    : 'bg-[#18131C] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                + Anexar ao Texto
              </button>
              <button
                type="button"
                onClick={() => setSpeechMode('replace')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  speechMode === 'replace'
                    ? 'bg-[#EC4899]/20 text-[#FB7185] border border-[#EC4899]'
                    : 'bg-[#18131C] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                Substituir Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speech Error Banner */}
      {speechError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-slate-400 hover:text-white p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Large Prompt Input Area with Dynamic Waveform & Pulsating Glow */}
      <div 
        id="prompt-input-wrapper"
        style={
          isListening
            ? {
                boxShadow: `0 0 ${18 + (audioLevel / 100) * 25}px rgba(224, 90, 71, ${0.45 + (audioLevel / 100) * 0.45}), inset 0 0 20px rgba(236, 72, 153, 0.18)`,
              }
            : undefined
        }
        className={`relative flex flex-col bg-[#120E16] rounded-xl border transition-all duration-200 p-3 overflow-hidden ${
          isListening 
            ? 'border-[#E05A47] mic-active-glow ring-2 ring-[#EC4899]/40' 
            : 'border-slate-800 focus-within:border-[#E05A47] focus-within:ring-1 focus-within:ring-[#F97316]/50'
        }`}
      >
        {/* Real-time Audio Waveform Canvas (visible while microphone is active) */}
        {isListening && (
          <canvas
            ref={waveformCanvasRef}
            width={600}
            height={90}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0"
          />
        )}

        {/* Live Microphone Pulsating Glow Overlay & Status Pill */}
        {isListening && (
          <div className="relative z-10 mb-2 flex items-center justify-between bg-[#221825]/90 backdrop-blur-sm border border-[#E05A47]/40 rounded-lg px-2.5 py-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-bold text-[#FFFFFF] tracking-wide text-[11px]">
                MICROFONE ATIVO • SISTEMA OUVINDO
              </span>
            </div>

            {/* Pulsating Mini Waveform Equalizer */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-[#FB923C] mr-1">
                {audioLevel > 0 ? `${audioLevel}%` : 'Aguardando voz'}
              </span>
              {[0.5, 1.1, 0.7, 1.4, 0.9, 1.3, 0.6].map((mult, i) => {
                const barHeight = Math.max(3, Math.min(16, Math.round((audioLevel / 100) * mult * 16)));
                return (
                  <div
                    key={i}
                    className="w-1 bg-[#F97316] rounded-full transition-all duration-75"
                    style={{ height: `${barHeight}px` }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Prompt Top Toolbar with Template Library, Version Auto-Save and AI Command Palette */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-800/80 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* AI Command Palette Trigger Button */}
            <button
              id="btn-open-ai-command-palette"
              type="button"
              onClick={() => {
                setCommandSearchFilter('');
                setIsCommandPaletteOpen(!isCommandPaletteOpen);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                isCommandPaletteOpen
                  ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white border-[#F97316] shadow-md shadow-[#E05A47]/30'
                  : 'bg-[#1F1722] text-[#FB923C] border-[#F97316]/40 hover:border-[#F97316] hover:bg-[#F97316]/10'
              }`}
              title="Abrir paleta de motores com / (Ctrl + K)"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>/ Comandos IA</span>
              <kbd className="hidden sm:inline-block px-1 rounded bg-[#18131C] text-[9px] font-mono border border-slate-700 text-slate-400">
                Ctrl+K
              </kbd>
            </button>

            {/* Real-time Predictive Prompting Toggle Button */}
            <button
              id="btn-predictive-prompting-toggle"
              type="button"
              onClick={handleTogglePredictive}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isPredictiveEnabled
                  ? 'bg-[#06B6D4]/20 text-[#67E8F9] border-[#06B6D4]/60 shadow-sm shadow-[#06B6D4]/20'
                  : 'bg-[#1F1722] text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Ativar/Desativar Escrita Preditiva IA em tempo real com Gemini (Tab para autocompletar)"
            >
              <Zap className={`w-3.5 h-3.5 ${isPredictiveEnabled ? 'text-[#67E8F9] animate-pulse' : 'text-slate-500'}`} />
              <span>Preditivo {isPredictiveEnabled ? 'Ligado' : 'Desligado'}</span>
            </button>

            {/* Templates Library Button */}
            <button
              id="btn-open-prompt-templates"
              type="button"
              onClick={() => setIsTemplatesModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isTemplatesModalOpen
                  ? 'bg-[#EC4899]/20 text-[#FB7185] border-[#EC4899] shadow-sm shadow-[#EC4899]/20'
                  : 'bg-[#1F1722] text-slate-300 border-slate-700 hover:border-[#EC4899]/50 hover:text-[#FB7185]'
              }`}
              title="Biblioteca de Padrões Estruturados & Ganchos Virais (Alt + T)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Templates ({PROMPT_TEMPLATES_LIBRARY.length})</span>
              <kbd className="hidden sm:inline-block px-1 rounded bg-[#18131C] text-[9px] font-mono border border-slate-700 text-slate-400">
                Alt+T
              </kbd>
            </button>

            {/* Version Auto-Save History Button */}
            <button
              id="btn-open-prompt-versions"
              type="button"
              onClick={() => setIsVersionsModalOpen(!isVersionsModalOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isVersionsModalOpen
                  ? 'bg-[#F97316]/20 text-[#FB923C] border-[#F97316]'
                  : 'bg-[#1F1722] text-slate-300 border-slate-700 hover:border-[#F97316]/50 hover:text-[#FB923C]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Versões ({promptVersions.length}/5)</span>
            </button>

            {/* Grammar & Tone Check Button (Top Toolbar) */}
            <button
              id="btn-grammar-tone-check-top"
              type="button"
              onClick={handleRunGrammarToneCheck}
              disabled={isCheckingGrammar || isGenerating || !prompt.trim()}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 ${
                isGrammarModalOpen
                  ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981] shadow-sm shadow-[#10B981]/20'
                  : 'bg-[#1F1722] text-slate-300 border-slate-700 hover:border-[#10B981]/50 hover:text-[#34D399]'
              }`}
              title="Revisar gramática, tom, clareza e impacto com Gemini LLM (Ctrl + G)"
            >
              {isCheckingGrammar ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#10B981]" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" />
              )}
              <span>{isCheckingGrammar ? 'Revisando...' : 'Tom & Gramática'}</span>
              <kbd className="hidden sm:inline-block px-1 rounded bg-[#18131C] text-[9px] font-mono border border-slate-700 text-slate-400">
                Ctrl+G
              </kbd>
            </button>

            {/* Quick Hashtags Focus Button */}
            <button
              id="btn-hashtags-top-shortcut"
              type="button"
              onClick={() => {
                const el = document.getElementById('container-hashtags-keywords-suggester');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-[#1F1722] text-[#FB923C] border-[#E05A47]/40 hover:border-[#E05A47] hover:bg-[#E05A47]/10 transition-all"
              title="Ir para sugestões de #Hashtags e Keywords com Gemini"
            >
              <Hash className="w-3.5 h-3.5 text-[#FB923C]" />
              <span># Hashtags IA</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Keyboard Shortcuts Trigger */}
            {onOpenShortcutsHelp && (
              <button
                type="button"
                id="btn-toolbar-shortcuts-help"
                onClick={onOpenShortcutsHelp}
                className="flex items-center gap-1 text-[11px] font-medium text-[#FB923C] hover:text-white px-2 py-0.5 rounded bg-[#18131C] border border-[#E05A47]/30 hover:border-[#E05A47] transition-colors"
                title="Ver lista de atalhos rápidos globais (Ctrl + /)"
              >
                <Keyboard className="w-3 h-3 text-[#FB923C]" />
                <span className="hidden md:inline">Atalhos</span>
                <kbd className="text-[9px] font-mono text-slate-400 px-1 bg-[#120E16] rounded border border-slate-800">
                  Ctrl+/
                </kbd>
              </button>
            )}

            <span className="text-[10px] text-slate-400 font-mono">
              {prompt.length} caracteres
            </span>
          </div>
        </div>

        {/* Active Custom Engines Badges Strip (When custom engines are configured) */}
        {safeEngines && Object.keys(safeEngines).length > 0 && (
          <div className="p-2 bg-[#0F111A]/90 border border-[#06B6D4]/30 rounded-lg flex items-center justify-between gap-2 flex-wrap text-xs my-1 animate-fadeIn">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#06B6D4]" />
                Mecanismos Customizados:
              </span>

              {safeEngines.image && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-300 border border-pink-500/30 text-[11px] font-medium">
                  <ImageIcon className="w-3 h-3" />
                  <span>Imagem: <strong>{safeEngines.image}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomEnginesChange) {
                        const updated = { ...safeEngines };
                        delete updated.image;
                        onCustomEnginesChange(updated);
                      }
                    }}
                    className="hover:text-white p-0.5 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}

              {safeEngines.video && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-medium">
                  <Video className="w-3 h-3" />
                  <span>Vídeo: <strong>{safeEngines.video}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomEnginesChange) {
                        const updated = { ...safeEngines };
                        delete updated.video;
                        onCustomEnginesChange(updated);
                      }
                    }}
                    className="hover:text-white p-0.5 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}

              {safeEngines.voice && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                  <Mic className="w-3 h-3" />
                  <span>Voz: <strong>{safeEngines.voice}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomEnginesChange) {
                        const updated = { ...safeEngines };
                        delete updated.voice;
                        onCustomEnginesChange(updated);
                      }
                    }}
                    className="hover:text-white p-0.5 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}

              {safeEngines.copy && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-medium">
                  <FileText className="w-3 h-3" />
                  <span>Copy: <strong>{safeEngines.copy}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomEnginesChange) {
                        const updated = { ...safeEngines };
                        delete updated.copy;
                        onCustomEnginesChange(updated);
                      }
                    }}
                    className="hover:text-white p-0.5 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}

              {safeEngines.research && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-medium">
                  <Cpu className="w-3 h-3" />
                  <span>Pesquisa: <strong>{safeEngines.research}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomEnginesChange) {
                        const updated = { ...safeEngines };
                        delete updated.research;
                        onCustomEnginesChange(updated);
                      }
                    }}
                    className="hover:text-white p-0.5 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}

              {safeEngines.design && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium">
                  <Layers className="w-3 h-3" />
                  <span>Design: <strong>{safeEngines.design}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onCustomEnginesChange) {
                        const updated = { ...safeEngines };
                        delete updated.design;
                        onCustomEnginesChange(updated);
                      }
                    }}
                    className="hover:text-white p-0.5 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (onCustomEnginesChange) {
                  onCustomEnginesChange({});
                }
              }}
              className="text-[10px] text-slate-400 hover:text-red-400 transition-colors underline"
            >
              Restaurar Padrão Automático
            </button>
          </div>
        )}

        {/* Prompt Versions Dropdown / Panel */}
        {isVersionsModalOpen && (
          <div className="p-3 bg-[#0F111A] border border-[#3B82F6]/40 rounded-xl flex flex-col gap-3 my-2 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#93C5FD]" />
                <span className="text-xs font-bold text-[#F8FAFC]">
                  Histórico de Versões do Prompt (Últimas 5)
                </span>
              </div>
              <button
                onClick={() => setIsVersionsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Snapshots automáticos salvos no LocalStorage para reverter a qualquer momento:
            </p>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {promptVersions.map((ver, idx) => {
                const isCurrent = ver.prompt.trim() === prompt.trim();
                const isCopied = copiedVersionId === ver.id;

                return (
                  <div
                    key={ver.id}
                    className={`p-2.5 rounded-lg border flex flex-col gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-[#1E1E2F] border-[#3B82F6]/60'
                        : 'bg-[#1E1E2F]/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0F111A] text-[#93C5FD]">
                          v{promptVersions.length - idx}
                        </span>
                        <span className="text-xs font-semibold text-[#F8FAFC]">{ver.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono">🕒 {ver.timestamp}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                            Versão Atual
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ver.prompt);
                            setCopiedVersionId(ver.id);
                            setTimeout(() => setCopiedVersionId(null), 2000);
                          }}
                          className="px-2 py-0.5 rounded bg-[#0F111A] text-slate-400 hover:text-white text-[10px] border border-slate-800"
                        >
                          {isCopied ? 'Copiado!' : 'Copiar'}
                        </button>

                        {!isCurrent && (
                          <button
                            id={`btn-revert-version-${ver.id}`}
                            onClick={() => handleRevertVersion(ver)}
                            className="px-2.5 py-0.5 rounded bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#93C5FD] hover:text-white text-[10px] font-bold border border-[#3B82F6]/40 transition-colors"
                          >
                            Reverter para esta versão
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 italic bg-[#0F111A]/50 p-1.5 rounded">
                      "{ver.prompt}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative">
          {/* AI Command Palette Popover */}
          <AICommandPalette
            isOpen={isCommandPaletteOpen}
            searchFilter={commandSearchFilter}
            onSelectEngine={(cmd) => {
              const textarea = textareaRef.current;
              const cursor = textarea?.selectionStart ?? prompt.length;
              const textBeforeCursor = prompt.slice(0, cursor);
              const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

              let newPrompt = prompt;
              if (lastSlashIndex !== -1) {
                const textAfterCursor = prompt.slice(cursor);
                const beforeSlash = prompt.slice(0, lastSlashIndex);
                newPrompt = `${beforeSlash}${cmd.command} ${textAfterCursor}`.trim();
              } else {
                newPrompt = `${prompt} ${cmd.command}`.trim();
              }

              onPromptChange(newPrompt);
              setIsCommandPaletteOpen(false);

              if (onCustomEnginesChange) {
                onCustomEnginesChange({
                  ...(customEngines || {}),
                  [cmd.category]: cmd.name,
                });
              }

              savePromptSnapshot(newPrompt, 'manual', `Motor: ${cmd.name} (${cmd.command})`);
            }}
            onClose={() => setIsCommandPaletteOpen(false)}
            selectedEngines={customEngines || {}}
          />

          <textarea
            ref={textareaRef}
            id="input-prompt-main"
            rows={3}
            value={prompt}
            onKeyDown={handleTextareaKeyDown}
            onChange={(e) => {
              const val = e.target.value;
              const cursor = e.target.selectionStart || val.length;
              onPromptChange(val);

              // Check if user is typing a slash command
              const textBeforeCursor = val.slice(0, cursor);
              const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

              if (lastSlashIndex !== -1) {
                const textAfterSlash = textBeforeCursor.slice(lastSlashIndex + 1);
                if (!/\s/.test(textAfterSlash)) {
                  setCommandSearchFilter(textAfterSlash);
                  setIsCommandPaletteOpen(true);
                  return;
                }
              }

              if (isCommandPaletteOpen) {
                setIsCommandPaletteOpen(false);
              }
            }}
            placeholder="Ex: Anúncio futurista de lançamento /leonardo /veo /elevenlabs com iluminação neon e 60fps... (Pressione Ctrl+Enter para gerar ou Ctrl+E para melhorar)"
            className="relative z-10 w-full bg-transparent text-sm sm:text-base text-[#FFFFFF] placeholder-slate-400 focus:outline-none resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Real-time Predictive Prompting Suggester (Triggered on typing pause) */}
        <PredictivePromptSuggester
          currentPrompt={prompt}
          predictiveData={predictiveData}
          isLoading={isPredictiveLoading}
          isEnabled={isPredictiveEnabled}
          onToggleEnabled={handleTogglePredictive}
          onAcceptCompletion={handleAcceptPredictiveCompletion}
          onDismiss={() => setPredictiveData(null)}
        />

        {/* Dynamic Context-Aware Prompt Suggestion Pill */}
        <div
          id="contextual-prompt-suggestion-strip"
          className="px-3 py-1.5 bg-gradient-to-r from-[#E05A47]/15 via-[#F97316]/10 to-[#EC4899]/15 border border-[#E05A47]/30 rounded-lg flex items-center justify-between gap-2 flex-wrap text-xs animate-fadeIn my-1 shadow-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#E05A47]/20 text-[#FB923C] border border-[#E05A47]/40 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-[#FB923C] animate-pulse" />
              Sugestão IA
            </span>
            <span className="text-slate-300 text-[11px] truncate">
              {contextualSuggestion.contextReason}: <strong className="text-white font-bold">{contextualSuggestion.recommendedTemplate.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              id="btn-apply-context-pill"
              onClick={() =>
                handleApplyTemplateLibrary(
                  contextualSuggestion.recommendedTemplate.rawTemplateText,
                  'replace',
                  contextualSuggestion.recommendedTemplate.name
                )
              }
              className="px-2.5 py-1 rounded bg-[#E05A47]/20 hover:bg-[#E05A47]/30 text-[#FB923C] hover:text-white border border-[#E05A47]/40 hover:border-[#E05A47] text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
              title={`Aplicar padrão ${contextualSuggestion.recommendedTemplate.name}`}
            >
              <span>Aplicar</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              id="btn-open-library-from-pill"
              onClick={() => setIsTemplatesModalOpen(true)}
              className="text-[11px] text-slate-400 hover:text-white font-semibold transition-colors underline"
            >
              Biblioteca ({PROMPT_TEMPLATES_LIBRARY.length})
            </button>
          </div>
        </div>

        {/* Floating AI Shortcuts Bar (16 Integrated Engines with Spec & Capabilities) */}
        <AIShortcutsBar
          prompt={prompt}
          onPromptChange={onPromptChange}
          customEngines={customEngines}
          onCustomEnginesChange={onCustomEnginesChange}
          onSaveSnapshot={savePromptSnapshot}
        />

        {/* Prompt Bottom Action Bar */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-800/80 flex-wrap gap-2">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full sm:max-w-md">
            <span className="text-[11px] text-slate-400 font-bold flex-shrink-0">Inspirações:</span>
            {PROMPT_SUGGESTIONS.slice(0, 3).map((sug, idx) => (
              <button
                key={idx}
                id={`btn-suggestion-${idx}`}
                onClick={() => onPromptChange(sug)}
                className="px-2.5 py-0.5 rounded-full bg-[#18131C] hover:bg-[#221825] text-[10px] font-medium text-slate-300 hover:text-[#FB923C] border border-slate-800 hover:border-[#F97316]/40 whitespace-nowrap transition-colors"
              >
                {sug.slice(0, 22)}...
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Voice Microphone Input Button (Voice-to-Prompt) */}
            <button
              id="btn-voice-to-prompt"
              onClick={handleToggleVoiceInput}
              disabled={isGenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isListening
                  ? 'bg-[#E05A47]/20 text-[#FB923C] border-[#E05A47] animate-pulse shadow-md shadow-[#E05A47]/30'
                  : 'bg-[#18131C] text-[#FB7185] border-[#EC4899]/40 hover:border-[#EC4899] hover:bg-[#EC4899]/15 hover:shadow-md hover:shadow-[#EC4899]/15'
              }`}
              title={isListening ? 'Parar Gravação de Voz (Alt + V)' : 'Voice-to-Prompt: Gravar Ideia por Voz com Web Speech API (Alt + V)'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span>Parar Voz</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Voice-to-Prompt</span>
                  <kbd className="hidden sm:inline-block px-1 rounded bg-[#120E16] text-[9px] font-mono border border-[#EC4899]/40 text-[#FB7185]">
                    Alt+V
                  </kbd>
                </>
              )}
            </button>

            {/* Grammar & Tone Check Quick Action Button */}
            <button
              id="btn-grammar-tone-check"
              type="button"
              onClick={handleRunGrammarToneCheck}
              disabled={isCheckingGrammar || isGenerating || !prompt.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18131C] hover:bg-[#10B981]/15 text-xs font-bold text-[#34D399] border border-[#10B981]/40 hover:border-[#10B981] transition-all disabled:opacity-40"
              title="Revisar gramática, tom e clareza com IA antes de gerar (Ctrl + G)"
            >
              {isCheckingGrammar ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#10B981]" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" />
              )}
              <span>{isCheckingGrammar ? 'Revisando...' : 'Revisar Gramática'}</span>
              <kbd className="hidden sm:inline-block px-1 rounded bg-[#120E16] text-[9px] font-mono border border-[#10B981]/40 text-[#34D399]">
                Ctrl+G
              </kbd>
            </button>

            {/* Melhorar prompt com IA */}
            <button
              id="btn-enhance-prompt-ai"
              onClick={onEnhancePrompt}
              disabled={isEnhancing || isGenerating || !prompt.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18131C] hover:bg-[#F97316]/15 text-xs font-bold text-[#FB923C] border border-[#F97316]/40 hover:border-[#F97316] transition-all disabled:opacity-40 shadow-sm"
              title="Melhorar e enriquecer prompt com Gemini LLM (Ctrl + E)"
            >
              {isEnhancing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              )}
              <span>{isEnhancing ? 'Otimizando...' : 'Melhorar com IA'}</span>
              <kbd className="hidden sm:inline-block px-1 rounded bg-[#120E16] text-[9px] font-mono border border-[#F97316]/40 text-[#FB923C]">
                Ctrl+E
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-suggested Hashtags and Keywords with Gemini API */}
      <HashtagsKeywordsSuggester
        prompt={prompt}
        onPromptChange={onPromptChange}
        selectedNetworks={selectedNetworks}
        customEngines={customEngines}
        textareaRef={textareaRef}
      />

      {/* Voice Transcript Log (Last 3 Transcripts with Quick Editing & Injection) */}
      <div className="w-full bg-[#120E16] rounded-xl border border-[#E05A47]/20 p-3 sm:p-4 flex flex-col gap-3">
        {/* Log Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EC4899]/15 text-[#FB7185] border border-[#EC4899]/30">
              <History className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#FFFFFF]">
                Histórico de Transcrições de Voz
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#18131C] text-[#FB7185] border border-[#EC4899]/30 font-bold">
                {voiceTranscripts.length}/3 snippets
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {voiceTranscripts.length > 0 && (
              <button
                id="btn-clear-transcript-log"
                onClick={handleClearAllTranscripts}
                className="text-[11px] font-bold text-slate-400 hover:text-red-400 transition-colors px-1.5 py-0.5 rounded hover:bg-red-500/10"
                title="Limpar histórico de ditados"
              >
                Limpar
              </button>
            )}
            <button
              id="btn-toggle-transcript-log"
              onClick={() => setIsTranscriptLogOpen(!isTranscriptLogOpen)}
              className="p-1 text-slate-400 hover:text-[#FB7185] transition-colors rounded hover:bg-[#18131C]"
              title={isTranscriptLogOpen ? 'Recolher histórico' : 'Expandir histórico'}
            >
              {isTranscriptLogOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Log Snippets List */}
        {isTranscriptLogOpen && (
          <div className="flex flex-col gap-2.5 pt-1">
            {voiceTranscripts.length === 0 ? (
              <div className="py-4 px-3 rounded-lg bg-[#18131C]/60 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center gap-1.5">
                <Mic className="w-5 h-5 text-slate-500" />
                <p className="text-xs text-slate-300">
                  Nenhum ditado registrado ainda.
                </p>
                <p className="text-[11px] text-slate-400">
                  Clique em <strong className="text-[#FB7185]">"Voice-to-Prompt"</strong> para transcrever suas ideias em tempo real.
                </p>
              </div>
            ) : (
              voiceTranscripts.map((item, index) => {
                const isEditing = editingTranscriptId === item.id;
                const isCopied = copiedTranscriptId === item.id;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col gap-2 p-2.5 sm:p-3 rounded-lg bg-[#18131C]/80 border border-slate-800 hover:border-[#EC4899]/40 transition-all"
                  >
                    {/* Snippet Header Row */}
                    <div className="flex items-center justify-between flex-wrap gap-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#221825] text-[#FB7185] font-mono text-[10px] border border-[#EC4899]/30 font-bold">
                          #{index + 1}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          🕒 {item.timestamp}
                        </span>
                      </div>

                      {/* Snippet Action Buttons */}
                      <div className="flex items-center gap-1">
                        {/* Copy button */}
                        <button
                          id={`btn-copy-transcript-${item.id}`}
                          onClick={() => handleCopyTranscript(item.id, item.text)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#18131C] hover:bg-[#10B981]/15 text-slate-300 hover:text-[#34D399] border border-slate-800 transition-colors text-[10px] font-bold"
                          title="Copiar texto"
                        >
                          {isCopied ? (
                            <>
                              <CheckCheck className="w-3 h-3 text-[#10B981]" />
                              <span className="text-[#34D399]">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#10B981]" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        {/* Edit toggle button */}
                        {!isEditing && (
                          <button
                            id={`btn-edit-transcript-${item.id}`}
                            onClick={() => handleStartEdit(item)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#18131C] hover:bg-[#F97316]/15 text-slate-300 hover:text-[#FB923C] border border-slate-800 transition-colors text-[10px] font-bold"
                            title="Editar manualmente este ditado"
                          >
                            <Edit3 className="w-3 h-3 text-[#F97316]" />
                            <span>Editar</span>
                          </button>
                        )}

                        {/* Quick Replace in Prompt */}
                        <button
                          id={`btn-use-prompt-replace-${item.id}`}
                          onClick={() => handleApplyToPrompt(item.text, 'replace')}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#E05A47]/15 hover:bg-[#E05A47]/25 text-[#FB923C] font-bold border border-[#E05A47]/40 transition-colors text-[10px]"
                          title="Substituir texto atual do prompt por este ditado"
                        >
                          <RotateCcw className="w-3 h-3 text-[#E05A47]" />
                          <span>Substituir</span>
                        </button>

                        {/* Quick Append to Prompt */}
                        <button
                          id={`btn-use-prompt-append-${item.id}`}
                          onClick={() => handleApplyToPrompt(item.text, 'append')}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#EC4899]/15 hover:bg-[#EC4899]/25 text-[#FB7185] font-bold border border-[#EC4899]/40 transition-colors text-[10px]"
                          title="Adicionar ao final do prompt atual"
                        >
                          <Plus className="w-3 h-3 text-[#EC4899]" />
                          <span>+ Anexar</span>
                        </button>

                        {/* Delete button */}
                        <button
                          id={`btn-delete-transcript-${item.id}`}
                          onClick={() => handleDeleteTranscript(item.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remover este snippet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Snippet Content: View vs Edit Mode */}
                    {isEditing ? (
                      <div className="flex flex-col gap-2 pt-1">
                        <textarea
                          id={`input-edit-transcript-${item.id}`}
                          rows={2}
                          value={editingTranscriptText}
                          onChange={(e) => setEditingTranscriptText(e.target.value)}
                          className="w-full p-2 bg-[#120E16] text-xs text-[#FFFFFF] rounded-lg border border-[#E05A47]/50 focus:outline-none focus:border-[#E05A47] resize-none"
                          autoFocus
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`btn-cancel-edit-transcript-${item.id}`}
                            onClick={handleCancelEdit}
                            className="px-2.5 py-1 rounded bg-[#18131C] text-slate-400 hover:text-white text-[11px] border border-slate-700"
                          >
                            Cancelar
                          </button>
                          <button
                            id={`btn-save-edit-transcript-${item.id}`}
                            onClick={() => handleSaveEdit(item.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white text-[11px] font-bold shadow hover:opacity-90"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Salvar Edição</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#E2E8F0] bg-[#120E16]/80 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-normal select-text">
                        "{item.text}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Main Big Action Button: GERAR IMAGEM + VÍDEO */}
      <button
        id="btn-generate-image-video-main"
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        title="Gerar Imagem + Vídeo com 16 IAs (Ctrl + Enter)"
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] hover:opacity-95 text-[#FFFFFF] font-black text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-[#E05A47]/30 palette-multi-glow transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99] border border-white/20 relative group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-white" />
            <span>Processando com 16 IAs Conectadas...</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-5 h-5 text-white" />
              <span className="text-white/80 font-black">+</span>
              <Video className="w-5 h-5 text-white" />
            </div>
            <span>GERAR IMAGEM + VÍDEO</span>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-black/30 text-white/90 text-xs font-mono font-bold border border-white/30 ml-1">
              Ctrl+Enter
            </kbd>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Generation Multi-Step Live Progress Indicator */}
      {isGenerating && (
        <div className="w-full bg-[#120E16] rounded-xl border border-[#E05A47]/30 p-3.5 flex flex-col gap-2.5 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-xs font-bold text-[#FB923C]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
              Executando Pipeline de Fallback Neural
            </span>
            <span className="font-mono text-[#FB7185]">Passo {generationStep} de 3</span>
          </div>

          {/* Step Bars */}
          <div className="grid grid-cols-3 gap-2">
            {GENERATION_STEPS.map((step) => {
              const isCompleted = generationStep > step.step;
              const isCurrent = generationStep === step.step;

              return (
                <div key={step.step} className="flex flex-col gap-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-[#10B981]'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] animate-pulse'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold truncate ${
                      isCurrent ? 'text-[#FB923C]' : isCompleted ? 'text-[#34D399]' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Prompt Template Library Modal */}
      <PromptTemplateLibraryModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        currentPrompt={prompt}
        selectedNetworks={selectedNetworks}
        onApplyTemplate={handleApplyTemplateLibrary}
      />

      {/* Grammar & Tone Check Modal */}
      <GrammarToneModal
        isOpen={isGrammarModalOpen}
        onClose={() => setIsGrammarModalOpen(false)}
        result={grammarResult}
        onApplyPrompt={handleApplyGrammarPrompt}
      />
    </section>
  );
};

