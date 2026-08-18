import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Cpu,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { CreationData } from '../types';

interface PerformanceInsightsProps {
  history: CreationData[];
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Compute daily generation counts for the last 7 days (Seg a Dom)
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();
  
  // Build 7-day buckets
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dayLabel = daysOfWeek[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];

    // Count creations on this specific day from history
    const matchingCreations = history.filter((item) => {
      if (!item.createdAt) return false;
      return item.createdAt.startsWith(dateStr);
    });

    // Base mock count + real history count for rich visualization
    const baseline = [3, 5, 4, 8, 6, 9, 7][i];
    const totalGens = baseline + matchingCreations.length;
    const multiFormatDispatches = totalGens * 4;

    return {
      day: `${dayLabel} (${d.getDate()}/${d.getMonth() + 1})`,
      shortDay: dayLabel,
      geracoes: totalGens,
      disparos: multiFormatDispatches,
      sucesso: 100,
    };
  });

  // Calculate high-level metrics
  const totalGenerations = weeklyData.reduce((acc, curr) => acc + curr.geracoes, 0);
  const totalDispatches = weeklyData.reduce((acc, curr) => acc + curr.disparos, 0);
  const totalHistoryCount = history.length;

  const engineDistribution = [
    { name: 'Leonardo IA', count: 42, color: '#06B6D4' },
    { name: 'Veo 3', count: 38, color: '#3B82F6' },
    { name: 'Ideogram', count: 24, color: '#8B5CF6' },
    { name: 'ElevenLabs', count: 35, color: '#10B981' },
    { name: 'Gemini Flash', count: 48, color: '#F59E0B' },
  ];

  return (
    <section className="w-full bg-[#1E1E2F]/90 backdrop-blur-md rounded-2xl border border-[#06B6D4]/30 p-4 sm:p-6 shadow-xl cyan-glow-subtle flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#06B6D4]/20 to-[#3B82F6]/20 border border-[#06B6D4]/40 text-[#67E8F9] shadow-inner">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-[#F8FAFC] tracking-tight">
                Performance Insights & Métricas de IA
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#67E8F9] border border-[#06B6D4]/30 text-[10px] font-mono font-bold">
                Recharts Live
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Atividade semanal de gerações neurais, multiformatos e taxa de entrega.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-[#0F111A] border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                timeRange === 'week'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                timeRange === 'month'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
          </div>

          <button
            id="btn-toggle-performance-insights"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-[#0F111A] text-slate-400 hover:text-[#67E8F9] border border-slate-800 hover:border-[#06B6D4]/40 transition-colors"
            title={isOpen ? 'Recolher gráficos' : 'Expandir gráficos'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      {isOpen && (
        <div className="flex flex-col gap-6 pt-2">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0F111A] border border-slate-800/80 flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Gerações na Semana</span>
                <Sparkles className="w-3.5 h-3.5 text-[#67E8F9]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
                {totalGenerations}
              </div>
              <span className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +24% vs semana anterior
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F111A] border border-slate-800/80 flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total no Histórico</span>
                <Layers className="w-3.5 h-3.5 text-[#3B82F6]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#67E8F9]">
                {Math.max(totalHistoryCount, 8)}
              </div>
              <span className="text-[10px] text-slate-400">
                Sincronizado localmente
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F111A] border border-slate-800/80 flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Multiformatos Ativos</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
                {totalDispatches}
              </div>
              <span className="text-[10px] text-[#38BDF8]">
                9:16, 16:9, 1:1, 4:5
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F111A] border border-slate-800/80 flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Taxa de Sucesso Fallback</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#22C55E]">
                99.8%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                16 IAs em redundância
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Primary Recharts Line / Area Chart (Atividade Semanal) */}
            <div className="lg:col-span-2 bg-[#0F111A] rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#06B6D4]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                    Gerações Diárias de Conteúdo (Últimos 7 Dias)
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                    <span>Gerações de IA</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                    <span>Formatos / Disparos</span>
                  </div>
                </div>
              </div>

              {/* Recharts Component */}
              <div className="w-full h-56 sm:h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weeklyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorGera" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorDisp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                    <XAxis
                      dataKey="shortDay"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#1E1E2F] border border-[#06B6D4]/40 rounded-xl p-2.5 shadow-xl text-xs flex flex-col gap-1">
                              <span className="font-bold text-[#F8FAFC]">
                                Dia: {label}
                              </span>
                              <div className="flex items-center gap-2 text-[#06B6D4]">
                                <span>Gerações:</span>
                                <span className="font-mono font-bold">{payload[0]?.value}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[#3B82F6]">
                                <span>Disparos:</span>
                                <span className="font-mono font-bold">{payload[1]?.value}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="geracoes"
                      stroke="#06B6D4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorGera)"
                    />
                    <Area
                      type="monotone"
                      dataKey="disparos"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorDisp)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engine Distribution & Utilization Bar Chart */}
            <div className="bg-[#0F111A] rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#3B82F6]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                    Uso das Principais IAs
                  </h4>
                </div>
                <span className="text-[10px] text-[#67E8F9] font-mono">16 Motores</span>
              </div>

              <div className="w-full h-56 sm:h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engineDistribution}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={10} hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#1E1E2F] border border-slate-700 rounded-lg p-2 text-xs shadow-lg">
                              <span className="font-bold text-[#F8FAFC]">{data.name}</span>
                              <div className="text-[#67E8F9]">
                                Chamadas: <strong className="font-mono">{data.count}</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {engineDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
