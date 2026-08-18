import React from 'react';
import { Radio, Globe, GitBranch, Cpu, CheckCircle2, ShieldCheck, X, Activity, Server, Zap } from 'lucide-react';

interface IntegrationsStatusProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationsStatus: React.FC<IntegrationsStatusProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#18131C] border border-[#E05A47]/40 rounded-2xl w-full max-w-2xl shadow-2xl terracotta-glow overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#120E16]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#E05A47] to-[#F97316] text-white shadow-sm shadow-[#E05A47]/30">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Status das 4 Integrações Centrais
              </h3>
              <p className="text-xs text-slate-400">
                Infraestrutura de automação, publicação, versionamento e CDN do PLAYSTART IA.
              </p>
            </div>
          </div>

          <button
            id="btn-close-integrations-status"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18131C] text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Cards */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* 1. Six Nine */}
          <div className="p-4 bg-[#120E16] border border-[#E05A47]/30 rounded-xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#E05A47]/15 text-[#FB923C] flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Six Nine Automation</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                  CONECTADO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Motor de automação de rede e conexão distribuída. Gerencia sessões, segurança de rota e conexões estáveis para disparo instantâneo.
              </p>
              <div className="mt-2 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span>Latência: <strong className="text-[#FB923C]">14ms</strong></span>
                <span>Protocolo: <strong className="text-white">Mesh v4</strong></span>
                <span>Taxa de Entrega: <strong className="text-[#34D399]">99.98%</strong></span>
              </div>
            </div>
          </div>

          {/* 2. Hootsuite */}
          <div className="p-4 bg-[#120E16] border border-[#F97316]/30 rounded-xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#F97316]/15 text-[#FB923C] flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Hootsuite Sync & Scheduler</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                  OPERACIONAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Gerenciamento centralizado de contas sociais. Automatiza agendamentos de postagens, sincroniza métricas e realiza publicações simultâneas em massa.
              </p>
              <div className="mt-2 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span>Canais Ativos: <strong className="text-white">6 Redes</strong></span>
                <span>Fila: <strong className="text-[#34D399]">Zero Atraso</strong></span>
                <span>Webhooks: <strong className="text-[#FB923C]">Ativos</strong></span>
              </div>
            </div>
          </div>

          {/* 3. GitHub */}
          <div className="p-4 bg-[#120E16] border border-[#EC4899]/30 rounded-xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#EC4899]/15 text-[#FB7185] flex-shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">GitHub Versioning</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                  SINCRONIZADO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Estrutura de código pronta para repositório e versionamento contínuo. Rastreia versões de assets, templates e scripts gerados.
              </p>
              <div className="mt-2 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span>Branch: <strong className="text-white">main</strong></span>
                <span>CI/CD: <strong className="text-[#34D399]">Pronto</strong></span>
                <span>Audit Trail: <strong className="text-[#FB7185]">Ativo</strong></span>
              </div>
            </div>
          </div>

          {/* 4. FlowRoute */}
          <div className="p-4 bg-[#120E16] border border-[#10B981]/30 rounded-xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#10B981]/15 text-[#34D399] flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">FlowRoute CDN & Smart Traffic</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                  ALTA VELOCIDADE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Roteamento inteligente de tráfego de mídia e distribuição em Edge CDN de alta performance com cache global para vídeos e imagens geradas.
              </p>
              <div className="mt-2 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span>Edge PoPs: <strong className="text-white">14 Servidores</strong></span>
                <span>Compressão: <strong className="text-[#FB923C]">Brotli/WebP</strong></span>
                <span>Tempo de Resposta: <strong className="text-[#34D399]">9ms</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#120E16] flex items-center justify-between text-xs text-slate-400">
          <div>Grupo Rimane | CNPJ: 17.431.363/0001-84</div>
          <button
            id="btn-close-integrations-footer"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#06B6D4] text-[#0F111A] font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
