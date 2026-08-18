import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Hash,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Target,
  Palette,
  Key,
  Flame,
  Plus,
  Minus,
  CheckCheck,
  Layers,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Sliders
} from 'lucide-react';
import { HashtagsKeywordsResult, HashtagSuggestion, KeywordSuggestion, SocialNetwork, CustomEngineOverrides } from '../types';

interface HashtagsKeywordsSuggesterProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  selectedNetworks: SocialNetwork[];
  customEngines?: CustomEngineOverrides;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export const HashtagsKeywordsSuggester: React.FC<HashtagsKeywordsSuggesterProps> = ({
  prompt,
  onPromptChange,
  selectedNetworks,
  customEngines,
  textareaRef,
}) => {
  const [data, setData] = useState<HashtagsKeywordsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'niche' | 'visual' | 'keywords'>('all');
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [lastFetchedPrompt, setLastFetchedPrompt] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions from Gemini API backend
  const fetchSuggestions = useCallback(
    async (promptToAnalyze: string, isManual = false) => {
      const trimmed = (promptToAnalyze || '').trim();
      if (!trimmed || trimmed.length < 5) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/suggest-hashtags-keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: trimmed,
            selectedNetworks,
            customEngines,
          }),
        });

        if (response.ok) {
          const result: HashtagsKeywordsResult = await response.json();
          setData(result);
          setLastFetchedPrompt(trimmed);
        } else {
          console.warn('API error fetching hashtag suggestions:', response.statusText);
        }
      } catch (err) {
        console.error('Failed to fetch hashtags and keywords from Gemini:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedNetworks, customEngines]
  );

  // Auto-suggestion debounce on prompt change
  useEffect(() => {
    if (!autoSuggestEnabled) return;
    const trimmed = prompt.trim();
    if (trimmed.length < 8) return;

    // Only auto-trigger if there is a meaningful difference in the prompt
    if (
      Math.abs(trimmed.length - lastFetchedPrompt.length) >= 6 ||
      (!lastFetchedPrompt && trimmed.length >= 8)
    ) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(trimmed, false);
      }, 1200);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [prompt, autoSuggestEnabled, lastFetchedPrompt, fetchSuggestions]);

  // Initial load if prompt is already present
  useEffect(() => {
    if (prompt.trim().length >= 8 && !data && !isLoading) {
      fetchSuggestions(prompt, false);
    }
  }, []);

  // Check if a hashtag is currently present in the prompt
  const isTagInPrompt = (tag: string): boolean => {
    const cleanTag = tag.trim().toLowerCase();
    const cleanPrompt = prompt.toLowerCase();
    return cleanPrompt.includes(cleanTag);
  };

  // Check if a keyword is in the prompt
  const isKeywordInPrompt = (keyword: string): boolean => {
    const cleanKw = keyword.trim().toLowerCase();
    const cleanPrompt = prompt.toLowerCase();
    return cleanPrompt.includes(cleanKw);
  };

  // Toggle hashtag insertion/removal
  const handleToggleHashtag = (tag: string) => {
    const cleanTag = tag.trim();
    if (isTagInPrompt(cleanTag)) {
      // Remove hashtag safely
      const regex = new RegExp(`(^|\\s)${escapeRegExp(cleanTag)}(\\s|$)`, 'gi');
      const updated = prompt.replace(regex, ' ').replace(/\s{2,}/g, ' ').trim();
      onPromptChange(updated);
    } else {
      // Append hashtag
      const separator = prompt.length > 0 && !prompt.endsWith(' ') ? ' ' : '';
      onPromptChange(`${prompt}${separator}${cleanTag}`);
    }
  };

  // Toggle keyword insertion/removal
  const handleToggleKeyword = (keyword: string) => {
    const cleanKw = keyword.trim();
    if (isKeywordInPrompt(cleanKw)) {
      const regex = new RegExp(`(^|\\s*,?\\s*)${escapeRegExp(cleanKw)}(\\s*,?\\s*|$)`, 'gi');
      const updated = prompt.replace(regex, ', ').replace(/\s{2,}/g, ' ').replace(/^,\s*|,\s*$/g, '').trim();
      onPromptChange(updated);
    } else {
      const endsWithPunct = /[.,;]$/.test(prompt.trim());
      const separator = prompt.length === 0 ? '' : endsWithPunct ? ' ' : ', ';
      onPromptChange(`${prompt.trim()}${separator}${cleanKw}`);
    }
  };

  // Insert all trending hashtags at once
  const handleInsertAllTrending = () => {
    if (!data?.hashtags) return;
    const trending = data.hashtags.filter(
      (h) => (h.category === 'trending' || h.category === 'brand') && !isTagInPrompt(h.tag)
    );
    if (trending.length === 0) return;

    const tagsToAdd = trending.map((h) => h.tag).join(' ');
    const separator = prompt.length > 0 && !prompt.endsWith(' ') ? ' ' : '';
    onPromptChange(`${prompt}${separator}${tagsToAdd}`);
  };

  // Insert all keywords
  const handleInsertAllKeywords = () => {
    if (!data?.keywords) return;
    const keywordsToAdd = data.keywords
      .filter((k) => !isKeywordInPrompt(k.keyword))
      .map((k) => k.keyword)
      .join(', ');
    if (!keywordsToAdd) return;

    const separator = prompt.length > 0 ? (/[.,;]$/.test(prompt.trim()) ? ' ' : ', ') : '';
    onPromptChange(`${prompt.trim()}${separator}${keywordsToAdd}`);
  };

  // Copy all hashtags to clipboard
  const handleCopyAllHashtags = async () => {
    if (!data?.hashtags || data.hashtags.length === 0) return;
    const text = data.hashtags.map((h) => h.tag).join(' ');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStatus('Hashtags copiadas!');
      setTimeout(() => setCopiedStatus(null), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  // Insert recommended hook
  const handleInsertHook = (hook: string) => {
    if (!hook) return;
    if (prompt.includes(hook)) return;
    const newText = prompt.trim() ? `${hook}\n\n${prompt}` : hook;
    onPromptChange(newText);
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Filter hashtags by active tab
  const filteredHashtags = (data?.hashtags || []).filter((h) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return h.category === 'trending' || h.category === 'brand';
    if (activeTab === 'niche') return h.category === 'niche' || h.category === 'strategy';
    if (activeTab === 'visual') return h.category === 'visual';
    return true;
  });

  const allHashtagsCount = data?.hashtags?.length || 0;
  const inPromptCount = (data?.hashtags || []).filter((h) => isTagInPrompt(h.tag)).length;

  return (
    <div
      id="container-hashtags-keywords-suggester"
      className="w-full bg-[#15101A] border border-[#E05A47]/30 rounded-xl p-3 sm:p-4 mt-3 transition-all duration-300 shadow-md"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#E05A47]/20 to-[#F97316]/20 border border-[#E05A47]/40 text-[#FB923C]">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                #Hashtags & Keywords Inteligentes
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1F1722] text-[#FB7185] border border-[#EC4899]/40">
                  Gemini LLM
                </span>
              </span>
            </div>
            {data?.nicheDetected && (
              <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                <Target className="w-3 h-3 text-[#34D399]" />
                <span>Nicho detectado:</span>
                <strong className="text-[#34D399] font-medium">{data.nicheDetected}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active in Prompt Indicator */}
          {allHashtagsCount > 0 && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1F1722] border border-slate-700 text-slate-300 hidden sm:inline-block"
              title="Hashtags já inclusas no seu prompt"
            >
              {inPromptCount}/{allHashtagsCount} no prompt
            </span>
          )}

          {/* Refresh / Regenerate button */}
          <button
            type="button"
            id="btn-refresh-hashtags-gemini"
            onClick={() => fetchSuggestions(prompt, true)}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1F1722] hover:bg-[#E05A47]/20 text-[#FB923C] text-xs font-bold border border-[#E05A47]/30 hover:border-[#E05A47] transition-all disabled:opacity-40"
            title="Analisar contexto do prompt e gerar novas hashtags com Gemini"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-[#E05A47]' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Gerando...' : 'Sugerir com IA'}</span>
          </button>

          {/* Auto-suggest Toggle */}
          <button
            type="button"
            id="btn-toggle-autosuggest"
            onClick={() => setAutoSuggestEnabled((prev) => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
              autoSuggestEnabled
                ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/40'
                : 'bg-[#1F1722] text-slate-400 border-slate-700'
            }`}
            title={
              autoSuggestEnabled
                ? 'Auto-sugestão ativa: atualiza hashtags conforme você digita o prompt'
                : 'Auto-sugestão pausada: clique em Sugerir com IA para atualizar'
            }
          >
            <Zap className={`w-3 h-3 ${autoSuggestEnabled ? 'text-[#34D399]' : 'text-slate-500'}`} />
            <span className="text-[10px] hidden md:inline">Auto</span>
          </button>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            id="btn-toggle-hashtags-expand"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-lg bg-[#1F1722] hover:bg-[#251D29] text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title={isExpanded ? 'Recolher painel de hashtags' : 'Expandir painel de hashtags'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
          {/* Category Tabs & Quick Batch Actions */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <button
                type="button"
                id="btn-tab-hashtags-all"
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-sm'
                    : 'bg-[#1F1722] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                Todas ({allHashtagsCount})
              </button>

              <button
                type="button"
                id="btn-tab-hashtags-trending"
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'trending'
                    ? 'bg-[#E05A47] text-white shadow-sm'
                    : 'bg-[#1F1722] text-[#FB923C] hover:bg-[#E05A47]/10 border border-slate-800'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Em Alta</span>
              </button>

              <button
                type="button"
                id="btn-tab-hashtags-niche"
                onClick={() => setActiveTab('niche')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'niche'
                    ? 'bg-[#34D399] text-[#0E0D12] shadow-sm'
                    : 'bg-[#1F1722] text-[#34D399] hover:bg-[#10B981]/10 border border-slate-800'
                }`}
              >
                <Target className="w-3 h-3" />
                <span>Nicho</span>
              </button>

              <button
                type="button"
                id="btn-tab-hashtags-visual"
                onClick={() => setActiveTab('visual')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'visual'
                    ? 'bg-[#EC4899] text-white shadow-sm'
                    : 'bg-[#1F1722] text-[#FB7185] hover:bg-[#EC4899]/10 border border-slate-800'
                }`}
              >
                <Palette className="w-3 h-3" />
                <span>Estética 8K</span>
              </button>

              <button
                type="button"
                id="btn-tab-keywords"
                onClick={() => setActiveTab('keywords')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  activeTab === 'keywords'
                    ? 'bg-[#F59E0B] text-[#0E0D12] shadow-sm'
                    : 'bg-[#1F1722] text-[#FBBF24] hover:bg-[#F59E0B]/10 border border-slate-800'
                }`}
              >
                <Key className="w-3 h-3" />
                <span>Keywords ({data?.keywords?.length || 0})</span>
              </button>
            </div>

            {/* Batch Helper Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="btn-insert-trending-hashtags"
                onClick={handleInsertAllTrending}
                disabled={!data?.hashtags || data.hashtags.length === 0}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#18131C] hover:bg-[#E05A47]/20 text-[#FB923C] text-[11px] font-bold border border-[#E05A47]/30 transition-all disabled:opacity-40"
                title="Inserir todas as hashtags em alta no prompt"
              >
                <Plus className="w-3 h-3" />
                <span>+ Em Alta</span>
              </button>

              <button
                type="button"
                id="btn-copy-all-hashtags"
                onClick={handleCopyAllHashtags}
                disabled={!data?.hashtags || data.hashtags.length === 0}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#18131C] hover:bg-[#EC4899]/20 text-[#FB7185] text-[11px] font-bold border border-[#EC4899]/30 transition-all disabled:opacity-40"
                title="Copiar todas as hashtags para a área de transferência"
              >
                {copiedStatus ? (
                  <>
                    <Check className="w-3 h-3 text-[#34D399]" />
                    <span className="text-[#34D399] font-bold">{copiedStatus}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar #</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && !data && (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin text-[#E05A47]" />
              <span className="text-xs font-mono">Analisando contexto semântico com Gemini LLM...</span>
            </div>
          )}

          {/* Empty Prompt Warning */}
          {!prompt.trim() && !data && (
            <div className="py-4 px-3 rounded-lg bg-[#1A1420] border border-dashed border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Digite sua ideia de criação no campo acima para o <strong className="text-[#FB923C]">Gemini</strong> sugerir automaticamente as melhores hashtags e palavras-chave de alta conversão.
              </p>
            </div>
          )}

          {/* HASHTAGS DISPLAY GRID (When not on keywords tab) */}
          {activeTab !== 'keywords' && data?.hashtags && data.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filteredHashtags.map((item, idx) => {
                const inPrompt = isTagInPrompt(item.tag);
                return (
                  <button
                    key={`${item.tag}-${idx}`}
                    type="button"
                    id={`chip-hashtag-${item.tag.replace('#', '')}`}
                    onClick={() => handleToggleHashtag(item.tag)}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all transform active:scale-95 ${
                      inPrompt
                        ? 'bg-[#10B981]/25 text-[#34D399] border border-[#10B981] shadow-sm shadow-[#10B981]/20 font-extrabold'
                        : item.category === 'trending' || item.category === 'brand'
                        ? 'bg-[#1A1420] hover:bg-[#E05A47]/20 text-[#FB923C] border border-[#E05A47]/40 hover:border-[#E05A47]'
                        : item.category === 'visual'
                        ? 'bg-[#1A1420] hover:bg-[#EC4899]/20 text-[#FB7185] border border-[#EC4899]/40 hover:border-[#EC4899]'
                        : 'bg-[#1A1420] hover:bg-[#34D399]/20 text-slate-200 border border-slate-700 hover:border-[#34D399]'
                    }`}
                    title={
                      inPrompt
                        ? `Clique para remover ${item.tag} do prompt`
                        : `Clique para inserir ${item.tag} no prompt (${item.reach || 'Relevante'})`
                    }
                  >
                    <span className="font-mono">{item.tag}</span>

                    {/* Status Badge */}
                    {inPrompt ? (
                      <Check className="w-3 h-3 text-[#34D399]" />
                    ) : (
                      <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    )}

                    {/* Reach Label Chip */}
                    {item.reach && (
                      <span className="text-[9px] px-1 rounded bg-[#0E0D12] text-slate-400 font-normal border border-slate-800">
                        {item.reach}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* KEYWORDS DISPLAY GRID (Keywords Tab or Keywords Strip) */}
          {(activeTab === 'keywords' || activeTab === 'all') && data?.keywords && data.keywords.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3 h-3 text-[#FBBF24]" />
                  <span>Palavras-Chave de Direção & SEO</span>
                </span>
                <button
                  type="button"
                  onClick={handleInsertAllKeywords}
                  className="text-[10px] text-[#FBBF24] hover:underline font-bold"
                >
                  + Inserir Todas Keywords
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {data.keywords.map((kw, kIdx) => {
                  const inPrompt = isKeywordInPrompt(kw.keyword);
                  return (
                    <button
                      key={`kw-${kIdx}`}
                      type="button"
                      id={`chip-keyword-${kIdx}`}
                      onClick={() => handleToggleKeyword(kw.keyword)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
                        inPrompt
                          ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981] font-bold'
                          : 'bg-[#1C1624] hover:bg-[#F59E0B]/15 text-slate-300 hover:text-white border border-slate-800 hover:border-[#F59E0B]/50'
                      }`}
                      title={
                        inPrompt
                          ? `Remover "${kw.keyword}"`
                          : `Adicionar termo "${kw.keyword}" (${kw.type}) ao prompt`
                      }
                    >
                      <span>{kw.keyword}</span>
                      <span className="text-[9px] px-1 rounded bg-[#120E16] text-[#FBBF24] border border-slate-800">
                        {kw.type}
                      </span>
                      {inPrompt ? (
                        <Check className="w-3 h-3 text-[#34D399]" />
                      ) : (
                        <Plus className="w-3 h-3 text-slate-500 hover:text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Audience Insight & Hook Box */}
          {data?.audienceInsight && (
            <div className="p-2.5 rounded-lg bg-[#18131C] border border-[#E05A47]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-[#FB923C]">Dica de Audiência:</strong> {data.audienceInsight}
                </span>
              </div>
              {data.recommendedHook && (
                <button
                  type="button"
                  id="btn-insert-recommended-hook"
                  onClick={() => handleInsertHook(data.recommendedHook!)}
                  className="px-2 py-0.5 rounded bg-[#E05A47]/20 hover:bg-[#E05A47]/40 text-[#FB923C] text-[11px] font-bold border border-[#E05A47]/40 transition-colors flex-shrink-0 flex items-center gap-1"
                  title="Inserir gancho recomendado no início do prompt"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Inserir Gancho</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
