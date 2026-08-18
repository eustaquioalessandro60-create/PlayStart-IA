import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  X,
  Sparkles,
  Search,
  Check,
  Copy,
  ArrowRight,
  Flame,
  Target,
  Zap,
  TrendingUp,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Cpu,
  Tv,
  Smartphone,
  Tag,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import {
  PromptTemplate,
  PROMPT_TEMPLATES_LIBRARY,
  getContextualTemplateRecommendations,
} from '../data/promptTemplates';
import { SocialNetwork } from '../types';

interface PromptTemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  selectedNetworks: SocialNetwork[];
  onApplyTemplate: (templateText: string, mode: 'replace' | 'append', templateName: string) => void;
}

export const PromptTemplateLibraryModal: React.FC<PromptTemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  currentPrompt,
  selectedNetworks,
  onApplyTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCustomizerId, setActiveCustomizerId] = useState<string | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Contextual Analysis
  const { recommendedTemplate, rankedTemplates, contextReason } = useMemo(() => {
    return getContextualTemplateRecommendations(currentPrompt, selectedNetworks);
  }, [currentPrompt, selectedNetworks]);

  // Categories list
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'Todos os Templates', count: PROMPT_TEMPLATES_LIBRARY.length },
      { id: 'recommended', label: '🌟 Recomendados', count: 3 },
      { id: 'viral', label: 'Viral & Reels', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'viral').length },
      { id: 'sales', label: 'Vendas & Lançamento', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'sales').length },
      { id: 'urgency', label: 'Urgência & CTA', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'urgency').length },
      { id: 'authority', label: 'Autoridade & Dicas', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'authority').length },
      { id: 'ugc', label: 'UGC & Humanizado', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'ugc').length },
      { id: 'comparison', label: 'Antes x Depois', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'comparison').length },
      { id: 'b2b', label: 'B2B & Corporativo', count: PROMPT_TEMPLATES_LIBRARY.filter((t) => t.category === 'b2b').length },
    ];
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let list = selectedCategory === 'recommended' ? rankedTemplates.slice(0, 3) : rankedTemplates;

    if (selectedCategory !== 'all' && selectedCategory !== 'recommended') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.structureFormula.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return list;
  }, [rankedTemplates, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Template copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFieldChange = (templateId: string, fieldId: string, value: string) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [templateId]: {
        ...(prev[templateId] || {}),
        [fieldId]: value,
      },
    }));
  };

  const getComputedTemplateText = (template: PromptTemplate) => {
    const values = customFieldValues[template.id] || {};
    if (
      Object.keys(values).length > 0 &&
      Object.values(values).some((v) => typeof v === 'string' && v.trim() !== '')
    ) {
      return template.templateGenerator(values);
    }
    return template.rawTemplateText;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div
        id="prompt-template-library-panel"
        className="bg-[#18131C] border border-[#E05A47]/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl terracotta-glow overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#120E16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E05A47] via-[#F97316] to-[#EC4899] text-white shadow-md shadow-[#E05A47]/20 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Biblioteca de Templates & Padrões Estruturados
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#E05A47]/20 text-[#FB923C] border border-[#E05A47]/40 text-[10px] font-extrabold uppercase">
                  Context Aware
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Padrões validados com ganchos virais, storytelling e chamadas para ação de alta conversão.
              </p>
            </div>
          </div>

          <button
            id="btn-close-template-library"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18131C] text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smart Context Recommendation Banner */}
        <div className="bg-gradient-to-r from-[#E05A47]/15 via-[#F97316]/10 to-[#EC4899]/15 border-b border-[#E05A47]/30 p-3.5 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F97316]/20 text-[#FB923C] border border-[#F97316]/40 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#FB923C] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Recomendação Inteligente para o seu Contexto:
                </span>
                <span className="text-[11px] font-semibold text-[#34D399] bg-[#10B981]/15 px-2 py-0.2 rounded border border-[#10B981]/30">
                  {recommendedTemplate.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {contextReason} • Redes: <strong className="text-[#FB923C]">{recommendedTemplate.recommendedNetworks.join(', ')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              id="btn-apply-recommended-template"
              onClick={() => {
                onApplyTemplate(recommendedTemplate.rawTemplateText, 'replace', recommendedTemplate.name);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E05A47] to-[#F97316] hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-[#E05A47]/30 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Aplicar Recomendado</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-[#120E16]/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-md shadow-[#E05A47]/20 border border-transparent'
                      : 'bg-[#18131C] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar templates, ganchos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18131C] border border-slate-800 focus:border-[#E05A47] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none ring-1 ring-[#E05A47]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Templates Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 scrollbar-thin">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
              <BookOpen className="w-8 h-8 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">
                Nenhum template encontrado para "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-[#FB923C] hover:underline font-bold mt-1"
              >
                Limpar filtros de busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const isCustomizing = activeCustomizerId === template.id;
                const isTopRecommended = template.id === recommendedTemplate.id;
                const isCopied = copiedId === template.id;
                const finalPromptText = getComputedTemplateText(template);

                return (
                  <div
                    key={template.id}
                    id={`template-card-${template.id}`}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition-all relative ${
                      isTopRecommended
                        ? 'bg-gradient-to-b from-[#1E1722] to-[#141018] border-[#E05A47]/60 shadow-lg shadow-[#E05A47]/10'
                        : 'bg-[#141018] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Badges & Title */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              {template.name}
                            </h4>
                            {isTopRecommended && (
                              <span className="px-2 py-0.2 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 text-[9px] font-extrabold tracking-wider uppercase">
                                Melhor Match
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">
                            {template.categoryLabel} • Ideal para <strong className="text-slate-200">{template.idealFormat}</strong>
                          </span>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E05A47]/15 text-[#FB923C] border border-[#E05A47]/40 flex-shrink-0">
                          {template.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {template.description}
                      </p>

                      {/* Formula Blueprint */}
                      <div className="p-2 bg-[#0E0D12] rounded-lg border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                        <Layers className="w-3.5 h-3.5 text-[#FB923C] flex-shrink-0" />
                        <span className="truncate">{template.structureFormula}</span>
                      </div>

                      {/* Recommended Networks Pills & Est. Conversion */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[11px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-500 text-[10px]">Redes:</span>
                          {template.recommendedNetworks.map((net) => (
                            <span
                              key={net}
                              className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold"
                            >
                              {net}
                            </span>
                          ))}
                        </div>

                        <span className="text-[#34D399] font-bold text-[10px] flex items-center gap-1 bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                          <TrendingUp className="w-3 h-3" />
                          {template.estimatedConversionBoost}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Fields Customizer (Accordion) */}
                    {isCustomizing && (
                      <div className="p-3 bg-[#0E0D12] rounded-xl border border-[#E05A47]/30 flex flex-col gap-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-xs font-bold text-[#FB923C] flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5" />
                            Personalizar Variáveis do Template
                          </span>
                          <button
                            onClick={() => setActiveCustomizerId(null)}
                            className="text-[10px] text-slate-500 hover:text-white"
                          >
                            Fechar
                          </button>
                        </div>

                        <div className="flex flex-col gap-2">
                          {template.fields.map((field) => (
                            <div key={field.id} className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-300">
                                {field.label}:
                              </label>
                              <input
                                type="text"
                                placeholder={field.placeholder}
                                value={customFieldValues[template.id]?.[field.id] || ''}
                                onChange={(e) =>
                                  handleFieldChange(template.id, field.id, e.target.value)
                                }
                                className="bg-[#18131C] border border-slate-700 focus:border-[#E05A47] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none ring-1 ring-[#E05A47]/20"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Preview em Tempo Real:
                          </span>
                          <p className="text-[11px] text-slate-300 bg-[#18131C] p-2 rounded border border-slate-800 line-clamp-3 italic font-mono mt-1">
                            {finalPromptText}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCustomizerId(isCustomizing ? null : template.id)
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                            isCustomizing
                              ? 'bg-[#E05A47]/20 text-[#FB923C] border-[#E05A47]'
                              : 'bg-[#18131C] text-slate-300 hover:text-white border-slate-700 hover:border-slate-500'
                          }`}
                          title="Preencher campos personalizados antes de aplicar"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>{isCustomizing ? 'Ocultar Campos' : 'Personalizar'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyText(finalPromptText, template.id)}
                          className="p-1.5 rounded-lg bg-[#18131C] hover:bg-[#251D2A] text-slate-400 hover:text-white border border-slate-800 transition-colors"
                          title="Copiar texto do template"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-[#10B981]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentPrompt.trim().length > 0 && (
                          <button
                            id={`btn-append-template-${template.id}`}
                            onClick={() => {
                              onApplyTemplate(finalPromptText, 'append', template.name);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#1E1722] hover:bg-[#2A1F30] text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                            title="Anexar ao final do prompt existente"
                          >
                            + Anexar
                          </button>
                        )}

                        <button
                          id={`btn-use-template-${template.id}`}
                          onClick={() => {
                            onApplyTemplate(finalPromptText, 'replace', template.name);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E05A47] to-[#F97316] hover:opacity-95 text-white text-xs font-black shadow-md shadow-[#E05A47]/30 transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Usar Template</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer / Summary */}
        <div className="p-3.5 sm:px-6 border-t border-slate-800 bg-[#120E16] flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">
              {PROMPT_TEMPLATES_LIBRARY.length} Padrões Estruturados
            </span>
            <span>• Atalho rápido: <kbd className="font-mono text-[#FB923C] bg-[#18131C] px-1.5 py-0.5 rounded border border-slate-700">Alt + T</kbd></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#18131C] text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 hover:border-slate-500"
          >
            Fechar Biblioteca
          </button>
        </div>

        {/* Toast Feedback */}
        {feedbackToast && (
          <div className="absolute bottom-4 right-4 bg-[#10B981] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl animate-fadeIn flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};
