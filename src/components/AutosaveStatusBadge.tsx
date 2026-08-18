import React from 'react';
import { ShieldCheck, Clock, Check, Loader2, Save, RefreshCw } from 'lucide-react';
import { AutosaveReason } from '../hooks/useAutosaveCreation';

interface AutosaveStatusBadgeProps {
  lastSavedAt: Date | null;
  saveCount: number;
  lastReason: AutosaveReason | null;
  isSaving: boolean;
  onSaveNow?: () => void;
  className?: string;
}

export const AutosaveStatusBadge: React.FC<AutosaveStatusBadgeProps> = ({
  lastSavedAt,
  saveCount,
  lastReason,
  isSaving,
  onSaveNow,
  className = '',
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getReasonLabel = (reason: AutosaveReason | null) => {
    switch (reason) {
      case 'tag_edit':
        return 'Tags atualizadas';
      case 'periodic_5s':
        return 'Intervalo 5s';
      case 'generation':
        return 'Nova geração';
      case 'manual':
        return 'Salvo manual';
      case 'lifecycle':
        return 'Segurança de aba';
      default:
        return 'Ativo';
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18131C] border border-[#10B981]/30 text-xs text-slate-300 shadow-sm ${className}`}
      title="Autosave LocalStorage: Salva o estado da criação e edições de tags automaticamente a cada 5 segundos e em tempo real para proteção contra erros críticos."
    >
      <div className="flex items-center gap-1.5">
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="absolute w-3 h-3 rounded-full bg-[#10B981]/40 animate-ping" />
          </div>
        )}

        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span className="hidden sm:inline font-bold text-white">Autosave:</span>
          {isSaving ? (
            <span className="text-[#34D399] font-bold animate-pulse">Gravando...</span>
          ) : lastSavedAt ? (
            <span className="text-slate-300">
              Salvo às <strong className="text-white font-mono">{formatTime(lastSavedAt)}</strong>
            </span>
          ) : (
            <span className="text-slate-400">Ativo (5s)</span>
          )}
        </div>
      </div>

      {lastReason && (
        <span className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#120E16] text-[#34D399] border border-[#10B981]/30">
          {getReasonLabel(lastReason)}
        </span>
      )}

      {onSaveNow && (
        <button
          type="button"
          id="btn-trigger-manual-autosave"
          onClick={onSaveNow}
          disabled={isSaving}
          className="p-1 rounded hover:bg-[#1F1722] text-slate-400 hover:text-[#34D399] transition-colors"
          title="Forçar salvamento imediato no LocalStorage"
        >
          <Save className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
