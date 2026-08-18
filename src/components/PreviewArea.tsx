import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Eye, 
  Share2, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Film, 
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  Calendar,
  Zap,
  Activity,
  RotateCcw
} from 'lucide-react';
import { AspectRatio, CreationData } from '../types';
import { drawMediaFrame, downloadCanvasAsImage, recordCanvasToVideo, getDimensionsForFormat } from '../utils/canvasRenderer';
import { EngineFallbackModal } from './EngineFallbackModal';

interface PreviewAreaProps {
  creation: CreationData | null;
  activeFormat: AspectRatio;
  onFormatChange: (format: AspectRatio) => void;
  onOpenMultiFormatModal: () => void;
  onShare: () => void;
  onOpenDispatchModal: () => void;
  onOpenMatrix?: () => void;
  onRetry?: () => void;
  isGenerating: boolean;
}

const AVAILABLE_FORMATS: { id: AspectRatio; label: string; ratio: string; icon: string }[] = [
  { id: '9:16', label: '9:16 Vertical', ratio: '9/16', icon: 'TikTok / Reels' },
  { id: '16:9', label: '16:9 Horizontal', ratio: '16/9', icon: 'YouTube' },
  { id: '1:1', label: '1:1 Quadrado', ratio: '1/1', icon: 'Feed Instagram' },
  { id: '4:5', label: '4:5 Retrato', ratio: '4/5', icon: 'Stories / Post' },
  { id: '1200x628', label: '1200x628 Link', ratio: '1.91/1', icon: 'Facebook' },
];

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  creation,
  activeFormat,
  onFormatChange,
  onOpenMultiFormatModal,
  onShare,
  onOpenDispatchModal,
  onOpenMatrix,
  onRetry,
  isGenerating,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadType, setDownloadType] = useState<'image' | 'video'>('image');
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [showFallbackModal, setShowFallbackModal] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Render loop for real-time video simulation on Canvas
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dims = getDimensionsForFormat(activeFormat);
          if (canvas.width !== dims.width || canvas.height !== dims.height) {
            canvas.width = dims.width;
            canvas.height = dims.height;
          }

          const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
          const currentLoopSec = isPlaying ? elapsedSec % 15 : currentTime;
          setCurrentTime(currentLoopSec);

          drawMediaFrame(ctx, canvas.width, canvas.height, currentLoopSec, creation, {
            showSafeZone,
            format: activeFormat,
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, activeFormat, creation, showSafeZone, currentTime]);

  const handleDownload = async (type: 'image' | 'video') => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    setShowDownloadMenu(false);

    try {
      if (type === 'image') {
        downloadCanvasAsImage(canvasRef.current, `playstart-${activeFormat}-${Date.now()}.png`);
      } else {
        const videoBlob = await recordCanvasToVideo(canvasRef.current, 4000);
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `playstart-${activeFormat}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = () => {
    const status = isGenerating ? 'Gerando' : creation?.status || 'Aguardando';

    switch (status) {
      case 'Aguardando':
        return {
          label: 'Aguardando Prompt',
          color: 'bg-[#18131C] text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'Gerando':
        return {
          label: 'Gerando com IA (Multi-Engine)...',
          color: 'bg-[#E05A47]/20 text-[#FB923C] border-[#E05A47] animate-pulse',
          dot: 'bg-[#E05A47]',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" />,
        };
      case 'Pronto':
        return {
          label: 'Pronto para Disparo',
          color: 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/50',
          dot: 'bg-[#10B981]',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />,
        };
      case 'Disparado':
        return {
          label: 'Disparado nas Redes',
          color: 'bg-[#EC4899]/20 text-[#FB7185] border-[#EC4899]/50',
          dot: 'bg-[#EC4899]',
          icon: <Send className="w-3.5 h-3.5 text-[#EC4899]" />,
        };
      case 'Agendado':
        return {
          label: creation?.scheduledFor
            ? `Agendado (${new Date(creation.scheduledFor).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })})`
            : 'Agendado para Disparo',
          color: 'bg-[#F97316]/20 text-[#FB923C] border-[#F97316]/50',
          dot: 'bg-[#F97316]',
          icon: <Calendar className="w-3.5 h-3.5 text-[#FB923C]" />,
        };
      default:
        return {
          label: 'Aguardando',
          color: 'bg-[#18131C] text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <section className="w-full bg-[#18131C] rounded-2xl border border-[#E05A47]/30 p-3 sm:p-5 terracotta-glow flex flex-col gap-4 shadow-xl shadow-black/40">
      {/* Top Bar: Status + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${statusBadge.color}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </div>

          {/* AI Fallback Stack Badge & Diagnostic Trigger */}
          <button
            id="btn-open-fallback-diagnostic"
            onClick={() => setShowFallbackModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              creation?.telemetry?.autoRerouteTriggered
                ? 'bg-[#F97316]/20 border-[#F97316] text-[#FB923C] shadow-sm shadow-[#F97316]/20'
                : 'bg-[#120E16] border-[#E05A47]/40 text-slate-300 hover:border-[#E05A47] hover:text-white'
            }`}
            title="Clique para ver o relatório de diagnóstico e roteamento automático de IA"
          >
            <Zap className={`w-3.5 h-3.5 ${creation?.telemetry?.autoRerouteTriggered ? 'text-[#F97316] animate-pulse' : 'text-[#E05A47]'}`} />
            <span>
              {creation?.telemetry?.autoRerouteTriggered ? (
                <>
                  <strong className="text-[#FB923C]">Fallback Ativo:</strong> {creation?.primaryEngine} + {creation?.videoEngine}
                </>
              ) : (
                <>
                  Engine: <strong className="text-white">{creation?.primaryEngine || 'Leonardo IA'}</strong> + <strong className="text-[#FB923C]">{creation?.videoEngine || 'Veo 3'}</strong>
                </>
              )}
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 font-mono text-[#FB7185] border border-[#EC4899]/30">
              Diagnóstico ⚡
            </span>
          </button>
        </div>

        {/* Action Buttons: Baixar | Ver em cada formato | Compartilhar */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Safe Zone Toggle */}
          <button
            id="btn-toggle-safe-zone"
            onClick={() => setShowSafeZone(!showSafeZone)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              showSafeZone
                ? 'bg-[#F97316]/20 text-[#FB923C] border-[#F97316]'
                : 'bg-[#120E16] text-slate-300 border-slate-800 hover:text-white hover:border-[#F97316]/40'
            }`}
            title="Mostrar Zonas Seguras de Sobreposição"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="hidden md:inline">Zonas Seguras</span>
          </button>

          {/* Ver em Cada Formato */}
          <button
            id="btn-view-multi-formats"
            onClick={onOpenMultiFormatModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#120E16] hover:bg-[#221825] text-xs font-bold text-white border border-[#EC4899]/40 hover:border-[#EC4899] transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#FB7185]" />
            <span>Ver em cada formato</span>
          </button>

          {/* Retry / Regenerar */}
          {onRetry && (
            <button
              id="btn-retry-preview-generation"
              onClick={onRetry}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#120E16] hover:bg-[#221825] text-xs font-bold text-[#FB923C] border border-[#F97316]/40 hover:border-[#F97316] hover:shadow-md hover:shadow-[#F97316]/10 transition-all disabled:opacity-50 active:scale-[0.98]"
              title="Tentar novamente / Regenerar mídia com o prompt atual"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : 'text-[#FB923C]'}`} />
              <span>{isGenerating ? 'Regerando...' : 'Regenerar (Retry)'}</span>
            </button>
          )}

          {/* Baixar Menu */}
          <div className="relative">
            <button
              id="btn-download-media"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#E05A47] to-[#F97316] hover:opacity-90 text-xs font-extrabold text-white shadow-md shadow-[#E05A47]/30 transition-all disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Gerando...' : 'Baixar'}</span>
            </button>

            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#18131C] border border-[#E05A47]/40 rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1">
                <button
                  id="btn-download-png"
                  onClick={() => handleDownload('image')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left text-white hover:bg-[#221825] transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-[#FB923C]" />
                  <div>
                    <div className="font-bold text-white">Imagem HD (PNG)</div>
                    <div className="text-[10px] text-slate-300">Formato {activeFormat}</div>
                  </div>
                </button>
                <button
                  id="btn-download-video"
                  onClick={() => handleDownload('video')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left text-white hover:bg-[#221825] transition-colors"
                >
                  <Film className="w-4 h-4 text-[#FB7185]" />
                  <div>
                    <div className="font-bold text-white">Vídeo Animado (WebM)</div>
                    <div className="text-[10px] text-slate-300">Clipe 60fps Veo 3</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Compartilhar */}
          <button
            id="btn-share-media"
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#120E16] hover:bg-[#221825] text-xs font-bold text-white border border-slate-800 hover:border-[#10B981]/50 transition-all"
            title="Compartilhar"
          >
            <Share2 className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Main Big Canvas Preview Container */}
      <div 
        ref={containerRef}
        className="w-full bg-[#120E16] rounded-xl border border-slate-800/80 overflow-hidden relative flex flex-col items-center justify-center p-2 sm:p-4 min-h-[360px] sm:min-h-[440px] max-h-[560px]"
      >
        {/* Dynamic Aspect Ratio Canvas Wrapper */}
        <div 
          className="relative max-h-[460px] max-w-full flex items-center justify-center transition-all duration-300"
          style={{
            aspectRatio: activeFormat === '16:9' ? '16/9' : activeFormat === '9:16' ? '9/16' : activeFormat === '1:1' ? '1/1' : activeFormat === '4:5' ? '4/5' : '1.91/1',
            height: '100%',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-lg border border-[#E05A47]/30 shadow-2xl terracotta-glow"
          />

          {/* Watermark Tag */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-bold text-[#FB923C] border border-[#F97316]/30 pointer-events-none">
            PLAYSTART IA • {activeFormat}
          </div>

          {/* Live Overlay Indicators */}
          {isGenerating && (
            <div className="absolute inset-0 bg-[#120E16]/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center rounded-lg">
              <div className="w-12 h-12 rounded-full border-4 border-[#E05A47]/20 border-t-[#E05A47] animate-spin" />
              <div className="text-sm font-extrabold text-white">Sintetizando Imagem + Vídeo</div>
              <div className="text-xs text-[#FB923C] max-w-xs">
                Executando fallback inteligente em 16 motores neurais...
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="w-full mt-3 flex items-center justify-between gap-3 px-2 py-1 bg-[#18131C] rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              id="btn-preview-play-pause"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md hover:bg-[#120E16] text-[#FB923C] transition-colors"
              title={isPlaying ? 'Pausar Animação' : 'Reproduzir Animação'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              id="btn-preview-mute"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-md hover:bg-[#120E16] text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Áudio Mudo' : 'Áudio Ativo'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-[11px] font-mono text-slate-300">
              00:{Math.floor(currentTime).toString().padStart(2, '0')} / 00:15
            </span>
          </div>

          {/* Quick Format Switcher Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {AVAILABLE_FORMATS.map((fmt) => {
              const isSelected = activeFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  id={`btn-format-${fmt.id.replace(':', '-')}`}
                  onClick={() => onFormatChange(fmt.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#E05A47] to-[#F97316] text-white shadow-sm shadow-[#E05A47]/30'
                      : 'bg-[#120E16] text-slate-300 hover:text-white hover:border-[#EC4899]/40 border border-slate-800'
                  }`}
                >
                  {fmt.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diagnostic & Fallback Routing Modal */}
      <EngineFallbackModal
        isOpen={showFallbackModal}
        onClose={() => setShowFallbackModal(false)}
        creation={creation}
        onOpenMatrix={onOpenMatrix}
      />
    </section>
  );
};
