import React, { useEffect, useRef, useState } from 'react';
import { Download, X, Eye, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AspectRatio, CreationData } from '../types';
import { drawMediaFrame, downloadCanvasAsImage, getDimensionsForFormat } from '../utils/canvasRenderer';

interface MultiFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  creation: CreationData | null;
  onSelectFormat: (format: AspectRatio) => void;
}

const ALL_FORMATS: { format: AspectRatio; title: string; subtitle: string; frameStyle: string }[] = [
  { format: '9:16', title: '9:16 Vertical Full Screen', subtitle: 'TikTok, Instagram Reels, Kwai, Turistas', frameStyle: 'w-36 h-64' },
  { format: '16:9', title: '16:9 Horizontal Paisagem', subtitle: 'YouTube HD, Vídeos institucionais', frameStyle: 'w-64 h-36' },
  { format: '1:1', title: '1:1 Quadrado Feed', subtitle: 'Feed Instagram e Facebook Post', frameStyle: 'w-48 h-48' },
  { format: '4:5', title: '4:5 Retrato Vertical', subtitle: 'Stories Instagram e Carrossel', frameStyle: 'w-44 h-56' },
  { format: '1200x628', title: '1200x628 Link Banner', subtitle: 'Facebook Ads, Anúncios de Conversão', frameStyle: 'w-64 h-32' },
];

export const MultiFormatModal: React.FC<MultiFormatModalProps> = ({
  isOpen,
  onClose,
  creation,
  onSelectFormat,
}) => {
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    let animationId: number;

    const renderAll = () => {
      if (!active) return;
      const elapsedSec = (Date.now() / 1000) % 15;

      ALL_FORMATS.forEach(({ format }) => {
        const canvas = canvasRefs.current[format];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const dims = getDimensionsForFormat(format);
            if (canvas.width !== dims.width || canvas.height !== dims.height) {
              canvas.width = dims.width;
              canvas.height = dims.height;
            }
            drawMediaFrame(ctx, canvas.width, canvas.height, elapsedSec, creation, {
              showSafeZone: false,
              format,
            });
          }
        }
      });

      animationId = requestAnimationFrame(renderAll);
    };

    animationId = requestAnimationFrame(renderAll);

    return () => {
      active = false;
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, creation]);

  if (!isOpen) return null;

  const handleDownloadSingle = (format: AspectRatio) => {
    const canvas = canvasRefs.current[format];
    if (canvas) {
      downloadCanvasAsImage(canvas, `playstart-${format}-${Date.now()}.png`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#18131C] border border-[#E05A47]/40 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl terracotta-glow overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#120E16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#E05A47] to-[#F97316] text-white shadow-sm shadow-[#E05A47]/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Visualização Multiformato em Tempo Real
              </h3>
              <p className="text-xs text-slate-400">
                Veja como o PLAYSTART IA adapta a composição automaticamente para cada rede social.
              </p>
            </div>
          </div>

          <button
            id="btn-close-multi-formats-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18131C] text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_FORMATS.map(({ format, title, subtitle }) => (
              <div
                key={format}
                className="bg-[#120E16] border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-[#E05A47]/50 transition-all"
              >
                {/* Format Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{title}</h4>
                    <p className="text-[11px] text-slate-400">{subtitle}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#18131C] text-[#FB923C] border border-[#F97316]/30">
                    {format}
                  </span>
                </div>

                {/* Live Canvas Mockup */}
                <div className="w-full h-56 flex items-center justify-center bg-black/40 rounded-lg p-2 overflow-hidden">
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[format] = el;
                    }}
                    className="max-h-full max-w-full object-contain rounded-md shadow-lg border border-[#E05A47]/30"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    id={`btn-apply-format-${format.replace(':', '-')}`}
                    onClick={() => {
                      onSelectFormat(format);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#18131C] hover:bg-[#221825] text-xs font-bold text-[#FB923C] border border-[#F97316]/30 hover:border-[#F97316] transition-all"
                  >
                    Usar no Preview Principal
                  </button>

                  <button
                    id={`btn-download-format-${format.replace(':', '-')}`}
                    onClick={() => handleDownloadSingle(format)}
                    className="p-1.5 rounded-lg bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white hover:opacity-90 transition-all shadow-sm shadow-[#E05A47]/30"
                    title={`Baixar ${format}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#120E16] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Todos os formatos são renderizados em resolução ultra-HD (1080p / 4K).
          </div>
          <button
            id="btn-close-multi-formats-footer"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E05A47] via-[#F97316] to-[#EC4899] text-white font-extrabold text-xs hover:opacity-90 shadow-md shadow-[#E05A47]/30 transition-all"
          >
            Concluir Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
