import { useEffect, useState, useCallback } from 'react';

export interface ShortcutHandlers {
  onGenerate?: () => void;
  onEnhancePrompt?: () => void;
  onToggleVoice?: () => void;
  onOpenCommands?: () => void;
  onGrammarCheck?: () => void;
  onOpenTemplates?: () => void;
  onOpenThemeController?: () => void;
  onOpenDispatch?: () => void;
  onOpenMatrix?: () => void;
  onOpenHistory?: () => void;
  onOpenShortcutsHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showFeedback = useCallback((message: string, shortcutKey: string) => {
    setLastTriggered(shortcutKey);
    setToastMessage(message);

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check modifier keys
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;

      const target = e.target as HTMLElement | null;
      const isInputOrTextarea = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      // 1. Ctrl + Enter / Cmd + Enter -> Gerar Imagem + Vídeo
      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onGenerate) {
          handlers.onGenerate();
          showFeedback('⚡ Gerando Imagem + Vídeo com 16 IAs...', 'Ctrl + Enter');
        }
        return;
      }

      // 2. Ctrl + E / Cmd + E -> Realçar / Melhorar Prompt
      if (isCtrlOrCmd && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onEnhancePrompt) {
          handlers.onEnhancePrompt();
          showFeedback('✨ Realçando prompt com Gemini LLM...', 'Ctrl + E');
        }
        return;
      }

      // 3. Alt + V or (Ctrl + Shift + V) -> Voice-to-Prompt (Gravar Ideia por Voz)
      if ((isAlt && (e.key === 'v' || e.key === 'V')) || (isCtrlOrCmd && isShift && (e.key === 'v' || e.key === 'V'))) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onToggleVoice) {
          handlers.onToggleVoice();
          showFeedback('🎙️ Alternando Voice-to-Prompt (Microfone)...', 'Alt + V');
        }
        return;
      }

      // 4. Ctrl + K / Cmd + K -> Paleta de Comandos de IA (/ Slash)
      if (isCtrlOrCmd && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenCommands) {
          handlers.onOpenCommands();
          showFeedback('⚡ Abrindo Comandos de IA (/)...', 'Ctrl + K');
        }
        return;
      }

      // 5. Ctrl + G / Cmd + G -> Revisão de Gramática & Tom
      if (isCtrlOrCmd && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onGrammarCheck) {
          handlers.onGrammarCheck();
          showFeedback('✍️ Analisando Tom & Gramática do Prompt...', 'Ctrl + G');
        }
        return;
      }

      // 6. Alt + T -> Templates de Prompt
      if (isAlt && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenTemplates) {
          handlers.onOpenTemplates();
          showFeedback('📚 Abrindo Templates Profissionais...', 'Alt + T');
        }
        return;
      }

      // 7. Alt + P or Alt + M -> Dynamic Theme Controller (Paletas Estéticas)
      if (isAlt && (e.key === 'p' || e.key === 'P' || e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenThemeController) {
          handlers.onOpenThemeController();
          showFeedback('🎨 Abrindo Dynamic Theme Controller...', 'Alt + P');
        }
        return;
      }

      // 7. Ctrl + D / Cmd + D -> Disparo Multi-Redes
      if (isCtrlOrCmd && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenDispatch) {
          handlers.onOpenDispatch();
          showFeedback('🚀 Abrindo Disparo Multi-Redes...', 'Ctrl + D');
        }
        return;
      }

      // 8. Ctrl + M / Cmd + M -> Matriz de 16 IAs
      if (isCtrlOrCmd && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenMatrix) {
          handlers.onOpenMatrix();
          showFeedback('🧠 Abrindo Matriz de 16 IAs...', 'Ctrl + M');
        }
        return;
      }

      // 9. Alt + H or (Ctrl + Shift + H) -> Gaveta de Histórico
      if ((isAlt && (e.key === 'h' || e.key === 'H')) || (isCtrlOrCmd && isShift && (e.key === 'h' || e.key === 'H'))) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenHistory) {
          handlers.onOpenHistory();
          showFeedback('📁 Abrindo Histórico de Criações...', 'Alt + H');
        }
        return;
      }

      // 10. Ctrl + / or (Shift + ?) or (Alt + /) -> Guia de Atalhos
      if (
        (isCtrlOrCmd && e.key === '/') ||
        (isShift && e.key === '?' && !isInputOrTextarea) ||
        (isAlt && e.key === '/')
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (handlers.onOpenShortcutsHelp) {
          handlers.onOpenShortcutsHelp();
          showFeedback('⌨️ Abrindo Guia de Atalhos de Teclado...', 'Ctrl + /');
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [handlers, showFeedback]);

  return {
    lastTriggered,
    toastMessage,
    clearToast: () => setToastMessage(null),
  };
}
