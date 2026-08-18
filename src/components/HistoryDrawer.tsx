import React, { useState, useMemo } from 'react';
import { 
  History, 
  X, 
  Clock, 
  CheckCircle2, 
  Send, 
  Eye, 
  Trash2, 
  Calendar, 
  Tag as TagIcon, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  Sparkles,
  Flame,
  Target,
  FlaskConical,
  Megaphone,
  CheckSquare,
  Square,
  ListChecks,
  AlertTriangle,
  RotateCcw,
  Layers,
  Minus,
  HelpCircle,
  Download,
  FileJson
} from 'lucide-react';
import { CreationData } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CreationData[];
  onSelectCreation: (creation: CreationData) => void;
  onDeleteCreation: (id: string) => void;
  onUpdateTags?: (id: string, tags: string[]) => void;
  onBatchDelete?: (ids: string[]) => void;
  onBatchRetag?: (ids: string[], tags: string[], mode: 'add' | 'replace' | 'remove') => void;
}

// Predefined recommended tags with icons and color schemes
const PREDEFINED_TAGS: Array<{
  name: string;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = [
  {
    name: 'Campaign',
    icon: <Megaphone className="w-3 h-3 text-purple-400" />,
    bgClass: 'bg-purple-500/15 hover:bg-purple-500/25',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500/40',
  },
  {
    name: 'Test',
    icon: <FlaskConical className="w-3 h-3 text-amber-400" />,
    bgClass: 'bg-amber-500/15 hover:bg-amber-500/25',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/40',
  },
  {
    name: 'Viral',
    icon: <Flame className="w-3 h-3 text-rose-400" />,
    bgClass: 'bg-rose-500/15 hover:bg-rose-500/25',
    textClass: 'text-rose-300',
    borderClass: 'border-rose-500/40',
  },
  {
    name: 'Lançamento',
    icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
    bgClass: 'bg-cyan-500/15 hover:bg-cyan-500/25',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-500/40',
  },
  {
    name: 'Institucional',
    icon: <Target className="w-3 h-3 text-blue-400" />,
    bgClass: 'bg-blue-500/15 hover:bg-blue-500/25',
    textClass: 'text-blue-300',
    borderClass: 'border-blue-500/40',
  },
];

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectCreation,
  onDeleteCreation,
  onUpdateTags,
  onBatchDelete,
  onBatchRetag,
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openTagEditorId, setOpenTagEditorId] = useState<string | null>(null);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  // Batch Edit Mode States
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkRetagModalOpen, setIsBulkRetagModalOpen] = useState<boolean>(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);
  const [bulkRetagMode, setBulkRetagMode] = useState<'add' | 'replace' | 'remove'>('add');
  const [bulkSelectedTags, setBulkSelectedTags] = useState<string[]>([]);
  const [bulkCustomTagInput, setBulkCustomTagInput] = useState<string>('');
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Extract all unique tags present across all creations
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    PREDEFINED_TAGS.forEach((pt) => tagSet.add(pt.name));
    
    history.forEach((item) => {
      if (item.userTags) {
        item.userTags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [history]);

  // Compute count of items per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach((item) => {
      if (item.userTags) {
        item.userTags.forEach((t) => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });
    return counts;
  }, [history]);

  // Filter items by active tag and search query
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // 1. Tag filter
      if (selectedTagFilter) {
        const itemTags = item.userTags || [];
        if (!itemTags.includes(selectedTagFilter)) {
          return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesPrompt = item.prompt?.toLowerCase().includes(q);
        const matchesTags = item.userTags?.some((t) => t.toLowerCase().includes(q));
        const matchesNetwork = item.selectedNetworks?.some((n) => n.toLowerCase().includes(q));
        if (!matchesTitle && !matchesPrompt && !matchesTags && !matchesNetwork) {
          return false;
        }
      }

      return true;
    });
  }, [history, selectedTagFilter, searchQuery]);

  if (!isOpen) return null;

  // Helper to get styling for a given tag
  const getTagStyle = (tagName: string) => {
    const found = PREDEFINED_TAGS.find(
      (pt) => pt.name.toLowerCase() === tagName.toLowerCase()
    );
    if (found) {
      return {
        bg: found.bgClass,
        text: found.textClass,
        border: found.borderClass,
        icon: found.icon,
      };
    }
    return {
      bg: 'bg-emerald-500/15 hover:bg-emerald-500/25',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      icon: <TagIcon className="w-2.5 h-2.5 text-emerald-400" />,
    };
  };

  const handleToggleTag = (creation: CreationData, tagToToggle: string) => {
    if (!onUpdateTags) return;
    const currentTags = creation.userTags || [];
    let updatedTags: string[];
    if (currentTags.includes(tagToToggle)) {
      updatedTags = currentTags.filter((t) => t !== tagToToggle);
    } else {
      updatedTags = [...currentTags, tagToToggle];
    }
    onUpdateTags(creation.id, updatedTags);
  };

  const handleAddCustomTag = (creation: CreationData) => {
    const trimmed = customTagInput.trim();
    if (!trimmed || !onUpdateTags) return;
    const currentTags = creation.userTags || [];
    if (!currentTags.includes(trimmed)) {
      onUpdateTags(creation.id, [...currentTags, trimmed]);
    }
    setCustomTagInput('');
  };

  const handleRemoveTag = (creation: CreationData, tagToRemove: string) => {
    if (!onUpdateTags) return;
    const currentTags = creation.userTags || [];
    const updated = currentTags.filter((t) => t !== tagToRemove);
    onUpdateTags(creation.id, updated);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredHistory.map((item) => item.id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Bulk Delete Execution
  const handleExecuteBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (onBatchDelete) {
      onBatchDelete(selectedIds);
    } else {
      selectedIds.forEach((id) => onDeleteCreation(id));
    }
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast(`${count} ${count === 1 ? 'criação excluída' : 'criações excluídas'} com sucesso.`);
  };

  // Bulk Retag Execution
  const handleToggleBulkTag = (tagName: string) => {
    setBulkSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleAddBulkCustomTag = () => {
    const trimmed = bulkCustomTagInput.trim();
    if (!trimmed) return;
    if (!bulkSelectedTags.includes(trimmed)) {
      setBulkSelectedTags((prev) => [...prev, trimmed]);
    }
    setBulkCustomTagInput('');
  };

  const handleExecuteBulkRetag = () => {
    if (selectedIds.length === 0 || bulkSelectedTags.length === 0) return;
    const count = selectedIds.length;

    if (onBatchRetag) {
      onBatchRetag(selectedIds, bulkSelectedTags, bulkRetagMode);
    } else if (onUpdateTags) {
      selectedIds.forEach((id) => {
        const item = history.find((c) => c.id === id);
        const current = item?.userTags || [];
        let updated: string[];
        if (bulkRetagMode === 'replace') {
          updated = [...bulkSelectedTags];
        } else if (bulkRetagMode === 'remove') {
          const toRemove = new Set(bulkSelectedTags);
          updated = current.filter((t) => !toRemove.has(t));
        } else {
          updated = Array.from(new Set([...current, ...bulkSelectedTags]));
        }
        onUpdateTags(id, updated);
      });
    }

    setIsBulkRetagModalOpen(false);
    showToast(`Tags atualizadas para ${count} ${count === 1 ? 'criação' : 'criações'}.`);
  };

  // Export individual creation as JSON for local backup
  const handleExportSingleJSON = (e: React.MouseEvent, item: CreationData) => {
    e.stopPropagation();
    try {
      const exportPayload = {
        app: 'PLAYSTART IA',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        backupType: 'individual_creation',
        creation: item,
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const safeTitle = (item.title || 'criacao')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .slice(0, 30);
      const dateStr = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `backup-playstart-${safeTitle}-${item.id || 'export'}-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Backup JSON de "${item.title}" exportado com sucesso!`);
    } catch (err) {
      console.error('JSON export error:', err);
      showToast('Erro ao exportar JSON da criação.', 'info');
    }
  };

  // Export selected batch creations as a single JSON file
  const handleExportBatchJSON = () => {
    if (selectedIds.length === 0) return;
    try {
      const selectedCreations = history.filter((item) => selectedIds.includes(item.id));
      const exportPayload = {
        app: 'PLAYSTART IA',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        backupType: 'batch_creations',
        totalCount: selectedCreations.length,
        creations: selectedCreations,
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `backup-lote-playstart-${selectedCreations.length}-itens-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`${selectedCreations.length} criações exportadas em JSON!`);
    } catch (err) {
      console.error('Batch JSON export error:', err);
      showToast('Erro ao exportar lote em JSON.', 'info');
    }
  };

  const allFilteredSelected = filteredHistory.length > 0 && filteredHistory.every((item) => selectedIds.includes(item.id));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end animate-fadeIn">
      <div 
        id="history-drawer-panel"
        className="bg-[#1E1E2F] border-l border-[#06B6D4]/30 w-full max-w-xl h-full flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Toast Feedback Notification */}
        {feedbackToast && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-[#06B6D4] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center justify-between animate-fadeIn border border-white/20">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {feedbackToast.message}
            </span>
            <button
              onClick={() => setFeedbackToast(null)}
              className="p-1 hover:bg-black/10 rounded-lg text-slate-950 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0F111A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#06B6D4]/10 text-[#67E8F9] border border-[#06B6D4]/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Histórico & Gestão de Criações
                </h3>
                {isBatchMode && (
                  <span className="px-2 py-0.5 rounded-md bg-[#06B6D4]/20 border border-[#06B6D4] text-[#67E8F9] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Modo Lote
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                {history.length} mídias salvas • Categorização e edição em lote
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Batch Edit Mode Button */}
            <button
              id="btn-toggle-batch-mode"
              type="button"
              onClick={() => {
                const nextMode = !isBatchMode;
                setIsBatchMode(nextMode);
                if (!nextMode) {
                  setSelectedIds([]);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isBatchMode
                  ? 'bg-[#06B6D4] text-slate-950 border-[#06B6D4] shadow-md shadow-[#06B6D4]/30'
                  : 'bg-[#141622] text-[#67E8F9] border-[#06B6D4]/40 hover:border-[#06B6D4] hover:bg-[#06B6D4]/10'
              }`}
              title="Ativar seleção múltipla para aplicar tags ou exclusão em massa"
            >
              <ListChecks className="w-4 h-4" />
              <span>{isBatchMode ? 'Sair do Lote' : 'Editar em Lote'}</span>
            </button>

            <button
              id="btn-close-history-drawer"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1E1E2F] text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Batch Selection Banner & Controls (When Batch Mode is Active) */}
        {isBatchMode && (
          <div className="px-4 py-2.5 bg-[#0A192F] border-b border-[#06B6D4]/40 flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <button
                id="btn-batch-select-all"
                type="button"
                onClick={handleSelectAllFiltered}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#67E8F9] hover:text-white transition-colors"
              >
                {allFilteredSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#06B6D4]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>
                  {allFilteredSelected ? 'Desmarcar Visíveis' : `Selecionar Visíveis (${filteredHistory.length})`}
                </span>
              </button>

              <span className="text-slate-600">|</span>

              <span className="text-xs text-slate-300">
                <strong className="text-[#06B6D4] font-bold">{selectedIds.length}</strong> de {history.length} selecionados
              </span>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-batch-clear-selection"
                  type="button"
                  onClick={handleClearSelection}
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500"
                >
                  Limpar Seleção
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tag Filter Bar & Search Section */}
        <div className="p-3.5 bg-[#0F111A]/90 border-b border-slate-800 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-history"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, prompt ou tag..."
              className="w-full bg-[#1E1E2F] border border-slate-700/80 focus:border-[#06B6D4] text-xs text-[#F8FAFC] placeholder-slate-500 pl-8 pr-8 py-2 rounded-lg focus:outline-none transition-all"
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

          {/* Tag Filter Pills */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#06B6D4]" />
                Filtrar por Tags:
              </span>
              {(selectedTagFilter || searchQuery) && (
                <button
                  id="btn-clear-history-filters"
                  onClick={() => {
                    setSelectedTagFilter(null);
                    setSearchQuery('');
                  }}
                  className="text-[10px] text-[#06B6D4] hover:underline font-semibold"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {/* "Todas" Pill */}
              <button
                id="btn-filter-tag-all"
                onClick={() => setSelectedTagFilter(null)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                  selectedTagFilter === null
                    ? 'bg-[#06B6D4] text-slate-950 border-[#06B6D4] shadow-md shadow-[#06B6D4]/20'
                    : 'bg-[#1E1E2F] text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span>Todas</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedTagFilter === null ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {history.length}
                </span>
              </button>

              {/* Tag Pills */}
              {allAvailableTags.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isSelected = selectedTagFilter === tag;
                const style = getTagStyle(tag);

                return (
                  <button
                    key={tag}
                    id={`btn-filter-tag-${tag.toLowerCase()}`}
                    onClick={() => setSelectedTagFilter(isSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${style.bg} ${style.text} border-[#06B6D4] ring-1 ring-[#06B6D4]`
                        : `bg-[#1E1E2F] text-slate-300 border-slate-700 hover:border-slate-500`
                    }`}
                  >
                    {style.icon}
                    <span>{tag}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800/80 text-slate-400">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Summary Stats */}
        <div className="px-4 py-2 bg-[#141622] border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Mostrando <strong className="text-[#67E8F9]">{filteredHistory.length}</strong> de{' '}
            <strong>{history.length}</strong> criações
          </span>
          {selectedTagFilter && (
            <span className="flex items-center gap-1 text-xs text-[#67E8F9]">
              Tag ativa: <strong className="underline">{selectedTagFilter}</strong>
            </span>
          )}
        </div>

        {/* History List */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3.5 pb-24">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-3 text-slate-500">
              <Clock className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-semibold text-slate-400">
                Nenhuma criação encontrada com os filtros selecionados.
              </p>
              {(selectedTagFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTagFilter(null);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 bg-[#1E1E2F] border border-slate-700 text-xs text-[#67E8F9] rounded-lg hover:border-[#06B6D4]"
                >
                  Restaurar todas as criações
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const itemTags = item.userTags || [];
              const isEditorOpen = openTagEditorId === item.id;
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  id={`card-history-item-${item.id}`}
                  onClick={() => {
                    if (isBatchMode) {
                      handleToggleSelect(item.id);
                    }
                  }}
                  className={`bg-[#0F111A] border rounded-xl p-3.5 flex flex-col gap-2.5 transition-all shadow-md ${
                    isBatchMode ? 'cursor-pointer' : ''
                  } ${
                    isSelected
                      ? 'border-[#06B6D4] bg-[#06B6D4]/5 ring-1 ring-[#06B6D4]/50 shadow-lg shadow-[#06B6D4]/10'
                      : 'border-slate-800 hover:border-[#06B6D4]/50'
                  }`}
                >
                  {/* Card Top Row: Checkbox (if batch mode) + Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isBatchMode && (
                        <button
                          type="button"
                          id={`checkbox-history-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(item.id);
                          }}
                          className="flex-shrink-0 p-0.5 rounded focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#06B6D4] fill-[#06B6D4]/20" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                          )}
                        </button>
                      )}
                      <h4 className="font-bold text-xs text-[#F8FAFC] truncate">
                        {item.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                        item.status === 'Disparado'
                          ? 'bg-[#3B82F6]/20 text-[#67E8F9] border border-[#3B82F6]/40'
                          : item.status === 'Agendado'
                          ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40'
                          : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                      }`}
                    >
                      {item.status === 'Disparado' ? (
                        <Send className="w-2.5 h-2.5" />
                      ) : item.status === 'Agendado' ? (
                        <Calendar className="w-2.5 h-2.5" />
                      ) : (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      )}
                      {item.status}
                    </span>
                  </div>

                  {/* Prompt Excerpt */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-[#1E1E2F]/40 p-2 rounded-lg border border-slate-800/60">
                    "{item.prompt}"
                  </p>

                  {/* User Tags Row */}
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {itemTags.length > 0 ? (
                        itemTags.map((tag) => {
                          const style = getTagStyle(tag);
                          return (
                            <span
                              key={tag}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${style.bg} ${style.text} ${style.border}`}
                            >
                              {style.icon}
                              <span>{tag}</span>
                              {!isBatchMode && onUpdateTags && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(item, tag);
                                  }}
                                  className="ml-0.5 hover:text-white text-slate-400 text-[10px]"
                                  title={`Remover tag ${tag}`}
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Sem tags</span>
                      )}
                    </div>

                    {/* Tag Editor Toggle (Single item mode) */}
                    {!isBatchMode && onUpdateTags && (
                      <button
                        id={`btn-manage-tags-${item.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenTagEditorId(isEditorOpen ? null : item.id);
                          setCustomTagInput('');
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all ${
                          isEditorOpen
                            ? 'bg-[#06B6D4]/20 text-[#67E8F9] border-[#06B6D4]'
                            : 'bg-[#1E1E2F] text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        <TagIcon className="w-3 h-3 text-[#06B6D4]" />
                        <span>{isEditorOpen ? 'Fechar Tags' : '+ Gerenciar Tags'}</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Tag Editor / Manager for single item */}
                  {isEditorOpen && onUpdateTags && !isBatchMode && (
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2.5 bg-[#141622] rounded-lg border border-[#06B6D4]/30 flex flex-col gap-2 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                          <TagIcon className="w-3 h-3 text-[#06B6D4]" />
                          Adicionar / Alternar Tags:
                        </span>
                      </div>

                      {/* Quick preset buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PREDEFINED_TAGS.map((pt) => {
                          const isAssigned = itemTags.includes(pt.name);
                          return (
                            <button
                              key={pt.name}
                              type="button"
                              onClick={() => handleToggleTag(item, pt.name)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-md border flex items-center gap-1 transition-all ${
                                isAssigned
                                  ? `${pt.bgClass} ${pt.textClass} ${pt.borderClass} ring-1 ring-white/20`
                                  : 'bg-[#1E1E2F] text-slate-400 border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              {isAssigned ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Plus className="w-2.5 h-2.5" />
                              )}
                              <span>{pt.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom tag input */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomTag(item);
                            }
                          }}
                          placeholder="Criar nova tag personalizada..."
                          className="flex-1 bg-[#1E1E2F] border border-slate-700 focus:border-[#06B6D4] text-[11px] text-[#F8FAFC] px-2 py-1 rounded focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomTag(item)}
                          disabled={!customTagInput.trim()}
                          className="px-2.5 py-1 rounded bg-[#06B6D4] hover:bg-[#06B6D4]/90 disabled:opacity-50 text-slate-950 text-[10px] font-bold"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Networks & Timestamp */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#67E8F9]" />
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[#67E8F9] font-medium">
                      {item.selectedNetworks.length} redes ({item.activeFormat})
                    </span>
                  </div>

                  {/* Card Actions (Load in preview, Export JSON backup & Delete) */}
                  {!isBatchMode && (
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        id={`btn-load-history-${item.id}`}
                        onClick={() => {
                          onSelectCreation(item);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#06B6D4] hover:text-[#67E8F9] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Carregar no Preview</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {/* Individual JSON Export Button for Local Backup */}
                        <button
                          id={`btn-export-json-${item.id}`}
                          type="button"
                          onClick={(e) => handleExportSingleJSON(e, item)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#141622] hover:bg-[#06B6D4]/20 border border-slate-700/80 hover:border-[#06B6D4]/60 text-slate-300 hover:text-[#67E8F9] text-[10px] font-semibold transition-all shadow-sm"
                          title={`Exportar dados de "${item.title}" em arquivo JSON para backup local`}
                        >
                          <Download className="w-3 h-3 text-[#06B6D4]" />
                          <span>Exportar JSON</span>
                        </button>

                        <button
                          id={`btn-delete-history-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCreation(item.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                          title="Excluir do histórico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Floating Batch Action Bottom Bar (Sticky when items are selected) */}
        {isBatchMode && selectedIds.length > 0 && (
          <div className="absolute bottom-12 left-3 right-3 z-40 bg-[#0F111A]/95 border-2 border-[#06B6D4] rounded-xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#06B6D4] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{selectedIds.length} selecionados</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Bulk Export JSON Button */}
              <button
                id="btn-bulk-export-json"
                type="button"
                onClick={handleExportBatchJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E2F] hover:bg-[#06B6D4]/20 border border-slate-700 hover:border-[#06B6D4] text-slate-200 hover:text-[#67E8F9] text-xs font-bold transition-all shadow-md"
                title="Exportar todas as criações selecionadas em um arquivo JSON"
              >
                <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Exportar JSON ({selectedIds.length})</span>
              </button>

              {/* Bulk Retag Button */}
              <button
                id="btn-bulk-retag"
                type="button"
                onClick={() => {
                  setBulkSelectedTags([]);
                  setBulkRetagMode('add');
                  setIsBulkRetagModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E2F] hover:bg-[#06B6D4]/20 border border-[#06B6D4] text-[#67E8F9] text-xs font-bold transition-all shadow-md"
              >
                <TagIcon className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Retag em Lote</span>
              </button>

              {/* Bulk Delete Button */}
              <button
                id="btn-bulk-delete"
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 text-xs font-bold transition-all shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Excluir ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0F111A] text-center text-[10px] text-slate-500">
          PLAYSTART IA • Gestão Inteligente de Tags e Histórico Multiformato
        </div>
      </div>

      {/* Bulk Retag Modal */}
      {isBulkRetagModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1E1E2F] border border-[#06B6D4]/50 rounded-2xl p-5 max-w-md w-full flex flex-col gap-4 shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#06B6D4]/10 text-[#67E8F9] border border-[#06B6D4]/30">
                  <TagIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">
                    Aplicar Tags em Lote (Bulk Retag)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Altere tags para {selectedIds.length} {selectedIds.length === 1 ? 'criação selecionada' : 'criações selecionadas'}
                  </p>
                </div>
              </div>
              <button
                id="btn-close-bulk-retag-modal"
                onClick={() => setIsBulkRetagModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selection Tabs (Add, Replace, Remove) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300">
                Modo de Aplicação:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0F111A] rounded-xl border border-slate-800">
                <button
                  type="button"
                  id="btn-bulk-mode-add"
                  onClick={() => setBulkRetagMode('add')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    bulkRetagMode === 'add'
                      ? 'bg-[#06B6D4] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mescla as tags selecionadas com as tags já existentes"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar</span>
                </button>

                <button
                  type="button"
                  id="btn-bulk-mode-replace"
                  onClick={() => setBulkRetagMode('replace')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    bulkRetagMode === 'replace'
                      ? 'bg-[#06B6D4] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Substitui todas as tags atuais pelas selecionadas"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Substituir</span>
                </button>

                <button
                  type="button"
                  id="btn-bulk-mode-remove"
                  onClick={() => setBulkRetagMode('remove')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    bulkRetagMode === 'remove'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Remove as tags selecionadas das criações"
                >
                  <Minus className="w-3 h-3" />
                  <span>Remover</span>
                </button>
              </div>

              <span className="text-[10px] text-slate-400 italic">
                {bulkRetagMode === 'add' && '✓ Mescla com tags já existentes de cada criação.'}
                {bulkRetagMode === 'replace' && '⚠ Substituirá e sobrescreverá todas as tags atuais.'}
                {bulkRetagMode === 'remove' && '✕ Removerá as tags selecionadas dos itens que as possuírem.'}
              </span>
            </div>

            {/* Predefined Tags Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-slate-300">
                Selecione as Tags para Aplicar:
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PREDEFINED_TAGS.map((pt) => {
                  const isChecked = bulkSelectedTags.includes(pt.name);
                  return (
                    <button
                      key={pt.name}
                      type="button"
                      id={`btn-bulk-tag-pill-${pt.name.toLowerCase()}`}
                      onClick={() => handleToggleBulkTag(pt.name)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? `${pt.bgClass} ${pt.textClass} ${pt.borderClass} ring-1 ring-white/30 shadow-md`
                          : 'bg-[#0F111A] text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        pt.icon
                      )}
                      <span>{pt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300">
                Ou Adicionar Tag Customizada:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bulkCustomTagInput}
                  onChange={(e) => setBulkCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBulkCustomTag();
                    }
                  }}
                  placeholder="Ex: Black Friday, Podcast, Reels 2026..."
                  className="flex-1 bg-[#0F111A] border border-slate-700 focus:border-[#06B6D4] text-xs text-[#F8FAFC] px-3 py-2 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  id="btn-add-bulk-custom-tag"
                  onClick={handleAddBulkCustomTag}
                  disabled={!bulkCustomTagInput.trim()}
                  className="px-3 py-2 rounded-lg bg-[#06B6D4] hover:bg-[#06B6D4]/90 disabled:opacity-50 text-slate-950 text-xs font-bold"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Currently Selected Tags Preview */}
            {bulkSelectedTags.length > 0 && (
              <div className="p-2.5 bg-[#0F111A] rounded-xl border border-slate-800 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tags Selecionadas para o Lote ({bulkSelectedTags.length}):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {bulkSelectedTags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4] text-[#67E8F9] text-xs font-semibold flex items-center gap-1"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleBulkTag(t)}
                        className="hover:text-white text-slate-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkRetagModalOpen(false)}
                className="px-3.5 py-2 rounded-lg bg-[#141622] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-bulk-retag"
                type="button"
                onClick={handleExecuteBulkRetag}
                disabled={bulkSelectedTags.length === 0}
                className="px-4 py-2 rounded-lg bg-[#06B6D4] hover:bg-[#06B6D4]/90 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg shadow-[#06B6D4]/25 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aplicar a {selectedIds.length} Criações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1E1E2F] border border-red-500/50 rounded-2xl p-5 max-w-sm w-full flex flex-col gap-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F8FAFC]">
                  Confirmar Exclusão em Lote
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedIds.length} {selectedIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-[#0F111A] p-3 rounded-xl border border-slate-800">
              Tem certeza que deseja excluir permanentemente as{' '}
              <strong className="text-red-400">{selectedIds.length} criações</strong> selecionadas? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-3.5 py-2 rounded-lg bg-[#141622] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-bulk-delete"
                type="button"
                onClick={handleExecuteBulkDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir {selectedIds.length} Itens</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
