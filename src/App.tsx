import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { PreviewArea } from './components/PreviewArea';
import { CreationBox } from './components/CreationBox';
import { SocialSelector } from './components/SocialSelector';
import { AIEnginesMatrix } from './components/AIEnginesMatrix';
import { MultiFormatModal } from './components/MultiFormatModal';
import { DispatchModal } from './components/DispatchModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { IntegrationsStatus } from './components/IntegrationsStatus';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PerformanceInsights } from './components/PerformanceInsights';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AutosaveStatusBadge } from './components/AutosaveStatusBadge';
import { ThemeControllerModal } from './components/ThemeControllerModal';
import { useTheme } from './context/ThemeContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutosaveCreation, loadAutosavedCreation } from './hooks/useAutosaveCreation';
import { AspectRatio, CreationData, SocialNetwork, CustomEngineOverrides } from './types';
import { Sparkles, Send, Layers, Radio, ShieldCheck, ArrowRight, Keyboard, X, Save } from 'lucide-react';

export default function App() {
  // Load saved draft prompt and selected networks from LocalStorage to prevent data loss on refresh
  const [prompt, setPrompt] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('playstart_draft_prompt');
      if (saved && saved.trim().length > 0) {
        return saved;
      }
    } catch (e) {}
    return 'Lançamento da nova linha de produtos digitais com IA integrada';
  });

  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetwork[]>(() => {
    try {
      const saved = localStorage.getItem('playstart_draft_networks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Kwai', 'Turistas'];
  });

  const [activeFormat, setActiveFormat] = useState<AspectRatio>('9:16');
  
  // Current active creation displayed in Preview (Restored from LocalStorage autosave if available)
  const [currentCreation, setCurrentCreation] = useState<CreationData | null>(() => {
    const saved = loadAutosavedCreation();
    if (saved) {
      return saved;
    }
    return {
      id: 'init-demo-1',
      prompt: 'Lançamento da nova linha de produtos digitais com IA integrada',
      enhancedPrompt: 'Render cinematográfico 8K com iluminação volumétrica ciano neon, render 3D hiper-detalhado, movimentos de câmera suaves em 60fps, estilo futurista e ultra moderno para alta conversão.',
      title: 'PLAYSTART IA • LANÇAMENTO',
      createdAt: new Date().toISOString(),
      status: 'Pronto',
      selectedNetworks: ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Kwai', 'Turistas'],
      activeFormat: '9:16',
      primaryEngine: 'Leonardo IA',
      fallbackEngine: 'Ideogram',
      videoEngine: 'Veo 3',
      audioEngine: 'ElevenLabs',
      captions: {
        Instagram: '🚀 O futuro chegou com o PlayStart IA! Todas as ferramentas que você precisa em uma única plataforma integrada. #PlayStartIA #GrupoRimane',
        TikTok: 'Crie vídeos virais automáticos em segundos com IA ⚡️ #PlayStart #Tech #Trend',
        YouTube: 'Conheça o PLAYSTART IA: a plataforma completa para criação, multiformatos e automação de redes.',
        Facebook: 'Transforme os resultados da sua empresa com inteligência artificial de ponta desenvolvida pelo Grupo Rimane.',
        Kwai: 'Olha o poder dessa inteligência artificial em ação! 😱 #PlayStart',
        Turistas: 'Experiências exclusivas e roteiros inovadores com o poder da tecnologia digital.',
      },
      visualTheme: {
        title: 'PLAYSTART IA',
        subtitle: 'TODAS AS IAS EM UM SÓ LUGAR',
        tags: ['#PlayStartIA', '#GrupoRimane', '#Inovacao', '#ViralMedia'],
        motionStyle: 'Cinematic Cyber Pan',
        palette: ['#06B6D4', '#3B82F6', '#0F111A', '#67E8F9'],
        bgPattern: 'cyber-grid',
      },
    };
  });

  // LocalStorage Autosave Engine: Saves every 5s & immediately on tag edits
  const {
    lastSavedAt,
    saveCount,
    lastReason,
    isSaving: isAutosaving,
    triggerImmediateSave,
    saveNow,
  } = useAutosaveCreation({
    currentCreation,
    setCurrentCreation,
    intervalMs: 5000,
  });

  const [history, setHistory] = useState<CreationData[]>([]);
  const [customEngines, setCustomEngines] = useState<CustomEngineOverrides>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(1);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Modals state
  const [isMultiFormatModalOpen, setIsMultiFormatModalOpen] = useState<boolean>(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [isAIEnginesOpen, setIsAIEnginesOpen] = useState<boolean>(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const { setIsThemeModalOpen } = useTheme();

  // Global Keyboard Shortcuts Manager Hook
  const { lastTriggered, toastMessage, clearToast } = useKeyboardShortcuts({
    onGenerate: () => {
      if (!isGenerating && prompt.trim()) {
        handleGenerate();
      }
    },
    onEnhancePrompt: () => {
      if (!isEnhancing && !isGenerating && prompt.trim()) {
        handleEnhancePrompt();
      }
    },
    onOpenDispatch: () => setIsDispatchModalOpen(true),
    onOpenMatrix: () => setIsAIEnginesOpen(true),
    onOpenHistory: () => setIsHistoryOpen(true),
    onOpenShortcutsHelp: () => setIsShortcutsModalOpen((prev) => !prev),
    onOpenThemeController: () => setIsThemeModalOpen(true),
  });

  // PWA state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  // Automatically synchronize prompt state to LocalStorage for PWA refresh resilience
  useEffect(() => {
    try {
      if (prompt !== undefined) {
        localStorage.setItem('playstart_draft_prompt', prompt);
      }
    } catch (e) {}
  }, [prompt]);

  // Automatically synchronize selected networks state to LocalStorage
  useEffect(() => {
    try {
      if (selectedNetworks && selectedNetworks.length > 0) {
        localStorage.setItem('playstart_draft_networks', JSON.stringify(selectedNetworks));
      }
    } catch (e) {}
  }, [selectedNetworks]);

  // Load history on mount
  useEffect(() => {
    fetchHistory();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          setHistory(data.history);
        }
      }
    } catch (err) {
      console.warn('Using local history state:', err);
    }
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('Para instalar o PWA: No Chrome/Edge clique no ícone de instalar na barra de endereços, ou no Safari clique em "Compartilhar > Adicionar à Tela de Início".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleToggleNetwork = (network: SocialNetwork) => {
    if (selectedNetworks.includes(network)) {
      if (selectedNetworks.length === 1) {
        return; // Keep at least one
      }
      setSelectedNetworks(selectedNetworks.filter((n) => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
    }
  };

  const handleSelectAllNetworks = () => {
    setSelectedNetworks(['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Kwai', 'Turistas']);
  };

  const handleSelectVerticalOnly = () => {
    setSelectedNetworks(['Instagram', 'TikTok', 'Kwai', 'Turistas']);
    setActiveFormat('9:16');
  };

  // Enhance prompt with IA (Gemini)
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, selectedNetworks, customEngines }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enhancedPrompt) {
          setPrompt(data.enhancedPrompt);
        }
      }
    } catch (err) {
      console.error('Error enhancing prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Image + Video with 16 AI Fallback Chain
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenerationStep(1);

    // Step animation sequence
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2400);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          selectedNetworks,
          activeFormat,
          customEngines,
        }),
      });

      const data = await res.json();
      if (data.success && data.creation) {
        setCurrentCreation(data.creation);
        setHistory((prev) => [data.creation, ...prev.filter((p) => p.id !== data.creation.id)]);
        triggerImmediateSave(data.creation, 'generation');
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setGenerationStep(1);
    }
  };

  const handleShare = async () => {
    if (!currentCreation) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentCreation.title,
          text: currentCreation.captions?.Instagram || currentCreation.prompt,
          url: window.location.href,
        });
      } catch (err) {
        // Ignored if user cancels share dialog
      }
    } else {
      navigator.clipboard.writeText(
        `${currentCreation.title}\n\n${currentCreation.captions?.Instagram || currentCreation.prompt}\n\nGerado por PLAYSTART IA (Grupo Rimane)`
      );
      alert('Link e legenda copiados para a área de transferência!');
    }
  };

  const handleDispatchSuccess = (
    dispatches: any[],
    scheduleType?: 'immediate' | 'scheduled',
    scheduledTime?: string
  ) => {
    if (currentCreation) {
      const isScheduled = scheduleType === 'scheduled';
      const updatedCreation: CreationData = {
        ...currentCreation,
        status: isScheduled ? 'Agendado' : 'Disparado',
        scheduledFor: scheduledTime,
        dispatches,
      };
      setCurrentCreation(updatedCreation);
      setHistory((prev) =>
        prev.map((item) => (item.id === updatedCreation.id ? updatedCreation : item))
      );
      triggerImmediateSave(updatedCreation, 'lifecycle');
    }
  };

  const handleDeleteHistory = async (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch (e) {
      // Ignored
    }
  };

  const handleUpdateTags = async (id: string, tags: string[]) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, userTags: tags } : item))
    );
    if (currentCreation && currentCreation.id === id) {
      const updatedCreation: CreationData = { ...currentCreation, userTags: tags };
      setCurrentCreation(updatedCreation);
      // Immediate Autosave in LocalStorage to guarantee no data loss on browser crash
      triggerImmediateSave(updatedCreation, 'tag_edit');
    }
    try {
      await fetch(`/api/history/${id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags }),
      });
    } catch (e) {
      console.warn('Error updating tags on server:', e);
    }
  };

  const handleBatchDelete = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setHistory((prev) => prev.filter((item) => !idSet.has(item.id)));
    if (currentCreation && idSet.has(currentCreation.id)) {
      // Keep active creation in preview or update reference
    }
    try {
      await fetch('/api/history/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
    } catch (e) {
      console.warn('Error in batch delete on server:', e);
    }
  };

  const handleBatchRetag = async (
    ids: string[],
    tags: string[],
    mode: 'add' | 'replace' | 'remove' = 'add'
  ) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    const cleanTags = tags.map((t) => t.trim()).filter(Boolean);

    setHistory((prev) =>
      prev.map((item) => {
        if (!idSet.has(item.id)) return item;
        const current = item.userTags || [];
        let updated: string[];
        if (mode === 'replace') {
          updated = [...cleanTags];
        } else if (mode === 'remove') {
          const toRemove = new Set(cleanTags);
          updated = current.filter((t) => !toRemove.has(t));
        } else {
          updated = Array.from(new Set([...current, ...cleanTags]));
        }
        return { ...item, userTags: updated };
      })
    );

    if (currentCreation && idSet.has(currentCreation.id)) {
      const current = currentCreation.userTags || [];
      let updated: string[];
      if (mode === 'replace') {
        updated = [...cleanTags];
      } else if (mode === 'remove') {
        const toRemove = new Set(cleanTags);
        updated = current.filter((t) => !toRemove.has(t));
      } else {
        updated = Array.from(new Set([...current, ...cleanTags]));
      }
      const updatedCreation: CreationData = { ...currentCreation, userTags: updated };
      setCurrentCreation(updatedCreation);
      // Immediate Autosave in LocalStorage on batch retag
      triggerImmediateSave(updatedCreation, 'tag_edit');
    }

    try {
      await fetch('/api/history/batch-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, tags: cleanTags, mode }),
      });
    } catch (e) {
      console.warn('Error in batch retag on server:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0D12] text-[#FFFFFF] flex flex-col selection:bg-[#E05A47] selection:text-white cyber-grid-bg relative">
      {/* Shortcut Action Toast HUD Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 bg-[#18131C] border border-[#E05A47] text-white px-4 py-2.5 rounded-xl shadow-2xl terracotta-glow flex items-center gap-3 animate-fadeIn">
          <div className="p-1 rounded-md bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">{toastMessage}</span>
            {lastTriggered && (
              <span className="text-[10px] font-mono text-[#FB923C]">
                Atalho executado: <strong>{lastTriggered}</strong>
              </span>
            )}
          </div>
          <button
            onClick={clearToast}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header with Autosave Status */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        onOpenAIEngines={() => setIsAIEnginesOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        isInstallable={isInstallable}
        onInstallPWA={handleInstallPWA}
        historyCount={history.length}
        isOnline={isOnline}
        autosaveNode={
          <AutosaveStatusBadge
            lastSavedAt={lastSavedAt}
            saveCount={saveCount}
            lastReason={lastReason}
            isSaving={isAutosaving}
            onSaveNow={saveNow}
          />
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6">
        {/* PWA Install Banner */}
        {isInstallable && !isBannerDismissed && (
          <PWAInstallBanner
            isInstallable={isInstallable}
            onInstall={handleInstallPWA}
            onDismiss={() => setIsBannerDismissed(true)}
          />
        )}

        {/* 1. Área de Preview (topo, bem grande) */}
        <PreviewArea
          creation={currentCreation}
          activeFormat={activeFormat}
          onFormatChange={setActiveFormat}
          onOpenMultiFormatModal={() => setIsMultiFormatModalOpen(true)}
          onShare={handleShare}
          onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
          onOpenMatrix={() => setIsAIEnginesOpen(true)}
          onRetry={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* 2. Caixa de Criação (embaixo do preview) */}
        <CreationBox
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          onEnhancePrompt={handleEnhancePrompt}
          isGenerating={isGenerating}
          isEnhancing={isEnhancing}
          generationStep={generationStep}
          selectedNetworks={selectedNetworks}
          customEngines={customEngines}
          onCustomEnginesChange={setCustomEngines}
          onOpenShortcutsHelp={() => setIsShortcutsModalOpen(true)}
        />

        {/* 3. Seletor de Redes Sociais + Formato */}
        <SocialSelector
          selectedNetworks={selectedNetworks}
          onToggleNetwork={handleToggleNetwork}
          onSelectAll={handleSelectAllNetworks}
          onSelectVerticalOnly={handleSelectVerticalOnly}
          activeFormat={activeFormat}
          onFormatChange={setActiveFormat}
        />

        {/* 4. Bottom Main Action Strip: DISPARAR NAS REDES SELECIONADAS */}
        <div className="w-full bg-[#18131C] rounded-2xl border border-[#E05A47]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 terracotta-glow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E05A47] to-[#F97316] p-[2px] flex-shrink-0">
              <div className="w-full h-full bg-[#120E16] rounded-[10px] flex items-center justify-center text-[#FB923C]">
                <Send className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#FFFFFF] tracking-tight">
                Pronto para Publicar em Escala?
              </h3>
              <p className="text-xs text-slate-300">
                Disparo simultâneo via <strong className="text-[#FB923C]">Six Nine</strong>,{' '}
                <strong className="text-[#FB7185]">Hootsuite</strong>,{' '}
                <strong className="text-[#34D399]">GitHub</strong> e{' '}
                <strong className="text-[#FB923C]">FlowRoute</strong>.
              </p>
            </div>
          </div>

          <button
            id="btn-trigger-dispatch-modal"
            onClick={() => setIsDispatchModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] hover:opacity-95 text-[#FFFFFF] font-extrabold text-sm sm:text-base tracking-wide uppercase terracotta-glow flex items-center justify-center gap-2.5 transition-all shadow-xl flex-shrink-0"
          >
            <Send className="w-5 h-5" />
            <span>DISPARAR NAS REDES SELECIONADAS</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/30 text-[10px] font-mono text-white/90 border border-white/30 ml-1">
              Ctrl+D
            </kbd>
          </button>
        </div>

        {/* 5. Performance Insights & Métricas de IA (Recharts) */}
        <PerformanceInsights history={history} />
      </main>

      {/* Corporate Footer */}
      <footer className="mt-8 border-t border-slate-800/80 bg-[#0E0D12] py-6 px-3 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-bold text-[#FFFFFF]">PLAYSTART IA</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Empresa: Grupo Rimane</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>CNPJ: 17.431.363/0001-84</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
            <button
              id="btn-footer-shortcuts"
              onClick={() => setIsShortcutsModalOpen(true)}
              className="text-[#FB923C] hover:text-white flex items-center gap-1 transition-colors font-bold"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Atalhos (Ctrl + /)</span>
            </button>
            <span>•</span>
            <button
              id="btn-footer-ai-matrix"
              onClick={() => setIsAIEnginesOpen(true)}
              className="text-slate-300 hover:text-[#FB923C] transition-colors"
            >
              16 IAs Conectadas
            </button>
            <span>•</span>
            <button
              id="btn-footer-integrations"
              onClick={() => setIsIntegrationsOpen(true)}
              className="text-slate-300 hover:text-[#FB7185] transition-colors"
            >
              Integrações
            </button>
            <span>•</span>
            <button
              id="btn-footer-history"
              onClick={() => setIsHistoryOpen(true)}
              className="text-slate-300 hover:text-[#34D399] transition-colors"
            >
              Histórico
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ThemeControllerModal />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        lastTriggeredShortcut={lastTriggered}
      />

      <MultiFormatModal
        isOpen={isMultiFormatModalOpen}
        onClose={() => setIsMultiFormatModalOpen(false)}
        creation={currentCreation}
        onSelectFormat={setActiveFormat}
      />

      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        creation={currentCreation}
        selectedNetworks={selectedNetworks}
        onDispatchSuccess={handleDispatchSuccess}
      />

      <AIEnginesMatrix
        isOpen={isAIEnginesOpen}
        onClose={() => setIsAIEnginesOpen(false)}
        activeEngines={{
          image: currentCreation?.primaryEngine || 'Leonardo IA',
          video: currentCreation?.videoEngine || 'Veo 3',
          voice: currentCreation?.audioEngine || 'ElevenLabs',
        }}
      />

      <IntegrationsStatus
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectCreation={(item) => {
          setCurrentCreation(item);
          setActiveFormat(item.activeFormat);
          setSelectedNetworks(item.selectedNetworks);
          triggerImmediateSave(item, 'lifecycle');
        }}
        onDeleteCreation={handleDeleteHistory}
        onUpdateTags={handleUpdateTags}
        onBatchDelete={handleBatchDelete}
        onBatchRetag={handleBatchRetag}
      />
    </div>
  );
}
