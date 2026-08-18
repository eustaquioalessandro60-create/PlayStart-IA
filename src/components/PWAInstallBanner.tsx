import React from 'react';
import { Download, Sparkles, X, Smartphone, ShieldCheck } from 'lucide-react';

interface PWAInstallBannerProps {
  isInstallable: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isInstallable,
  onInstall,
  onDismiss,
}) => {
  if (!isInstallable) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 mb-4">
      <div className="bg-gradient-to-r from-[#1E1E2F] to-[#0F111A] border border-[#06B6D4]/40 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg cyan-glow-subtle relative overflow-hidden">
        {/* Left Icon & Text */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] p-[2px] flex-shrink-0">
            <div className="w-full h-full bg-[#0F111A] rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#67E8F9]" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
              Instale o PLAYSTART IA no seu celular (PWA)
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#06B6D4]/20 text-[#67E8F9]">
                Sem loja de apps
              </span>
            </h4>
            <p className="text-xs text-[#94A3B8]">
              Funciona offline, carrega instantaneamente e roda em tela cheia como app nativo.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-pwa-banner-dismiss"
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            title="Ignorar"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            id="btn-pwa-banner-install"
            onClick={onInstall}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white font-bold text-xs hover:opacity-95 cyan-glow-subtle flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Instalar Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
