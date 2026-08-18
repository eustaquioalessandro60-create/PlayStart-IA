import React from 'react';
import { 
  Check, 
  Share2, 
  Tv, 
  Smartphone, 
  Film, 
  Compass, 
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import { AspectRatio, NetworkConfig, SocialNetwork } from '../types';

interface SocialSelectorProps {
  selectedNetworks: SocialNetwork[];
  onToggleNetwork: (network: SocialNetwork) => void;
  onSelectAll: () => void;
  onSelectVerticalOnly: () => void;
  activeFormat: AspectRatio;
  onFormatChange: (format: AspectRatio) => void;
}

export const NETWORKS_DATA: NetworkConfig[] = [
  {
    id: 'Instagram',
    name: 'Instagram',
    formats: ['9:16', '4:5', '1:1'],
    defaultFormat: '9:16',
    formatLabels: {
      '9:16': '9:16 Reels',
      '4:5': '4:5 Stories / Carrossel',
      '1:1': '1:1 Feed Quadrado',
    },
    iconName: 'instagram',
    recommendedText: 'Reels 9:16 com gancho nos 3 primeiros segundos',
  },
  {
    id: 'TikTok',
    name: 'TikTok',
    formats: ['9:16'],
    defaultFormat: '9:16',
    formatLabels: {
      '9:16': '9:16 Full Screen Vertical',
    },
    iconName: 'tiktok',
    recommendedText: 'Áudio dinâmico e legendas automáticas em tela cheia',
  },
  {
    id: 'YouTube',
    name: 'YouTube',
    formats: ['16:9', '9:16'],
    defaultFormat: '16:9',
    formatLabels: {
      '16:9': '16:9 Vídeo HD',
      '9:16': '9:16 Shorts',
    },
    iconName: 'youtube',
    recommendedText: '16:9 Paisagem para vídeos longos ou 9:16 para Shorts',
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    formats: ['1200x628', '1:1'],
    defaultFormat: '1200x628',
    formatLabels: {
      '1200x628': '1200x628 Feed Link',
      '1:1': '1080x1080 Feed Post',
    },
    iconName: 'facebook',
    recommendedText: 'Formatos ideais para anúncios de conversão e posts no feed',
  },
  {
    id: 'Kwai',
    name: 'Kwai',
    formats: ['9:16'],
    defaultFormat: '9:16',
    formatLabels: {
      '9:16': '9:16 Vertical Dinâmico',
    },
    iconName: 'kwai',
    recommendedText: 'Vídeos curtos de alta retenção com efeitos e transições',
  },
  {
    id: 'Turistas',
    name: 'Turistas',
    formats: ['9:16'],
    defaultFormat: '9:16',
    formatLabels: {
      '9:16': '9:16 Stories & Roteiros',
    },
    iconName: 'turistas',
    recommendedText: 'Divulgação de destinos, passeios e experiências turísticas',
  },
];

export const SocialSelector: React.FC<SocialSelectorProps> = ({
  selectedNetworks,
  onToggleNetwork,
  onSelectAll,
  onSelectVerticalOnly,
  activeFormat,
  onFormatChange,
}) => {
  return (
    <section className="w-full bg-[#18131C] rounded-2xl border border-[#E05A47]/30 p-4 sm:p-6 terracotta-glow flex flex-col gap-4 shadow-xl shadow-black/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#E05A47] to-[#F97316] text-white shadow-md shadow-[#E05A47]/30">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#FFFFFF] tracking-tight">
              Seletor de Redes Sociais + Formatos
            </h2>
            <p className="text-xs text-[#E2E8F0]">
              Ao marcar a rede, o formato é ajustado e otimizado automaticamente para o algoritmo.
            </p>
          </div>
        </div>

        {/* Quick Selection Helpers */}
        <div className="flex items-center gap-2">
          <button
            id="btn-select-all-networks"
            onClick={onSelectAll}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/40 hover:bg-[#10B981]/25 hover:border-[#10B981] transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Todas as Redes
          </button>
          <button
            id="btn-select-vertical-networks"
            onClick={onSelectVerticalOnly}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#EC4899]/15 text-[#FB7185] hover:bg-[#EC4899]/25 border border-[#EC4899]/40 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
            Vídeos 9:16
          </button>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {NETWORKS_DATA.map((net) => {
          const isSelected = selectedNetworks.includes(net.id);

          return (
            <div
              key={net.id}
              id={`card-network-${net.id.toLowerCase()}`}
              onClick={() => {
                onToggleNetwork(net.id);
                // When user clicks a network, also auto-select its default format
                if (!isSelected) {
                  onFormatChange(net.defaultFormat);
                }
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-[#221825] border-[#E05A47] shadow-lg shadow-[#E05A47]/20 ring-1 ring-[#F97316]/50'
                  : 'bg-[#120E16]/80 border-slate-800/80 hover:border-[#E05A47]/40 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Top Row: Checkbox + Name + Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#10B981] border-[#10B981] text-[#0E0D12] shadow-sm shadow-[#10B981]/50'
                        : 'bg-[#1F1722] border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                  </div>
                  <span className="font-extrabold text-sm text-[#FFFFFF]">{net.name}</span>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#18131C] text-[#FB923C] border border-[#F97316]/40">
                  {net.defaultFormat}
                </span>
              </div>

              {/* Formats Pills */}
              <div className="flex flex-wrap gap-1.5">
                {net.formats.map((fmt) => {
                  const isCurrentActive = activeFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      id={`btn-net-fmt-${net.id}-${fmt}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected) onToggleNetwork(net.id);
                        onFormatChange(fmt);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border transition-all ${
                        isCurrentActive
                          ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] border-[#F97316] text-white shadow-md shadow-[#E05A47]/30'
                          : 'bg-[#18131C] border-slate-800 text-slate-300 hover:text-white hover:border-[#EC4899]/40'
                      }`}
                    >
                      {net.formatLabels[fmt] || fmt}
                    </button>
                  );
                })}
              </div>

              {/* Recommendation Note */}
              <p className="text-[11px] text-slate-300 leading-tight">
                {net.recommendedText}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
