import React from 'react';
import {
  AlertTriangle, CheckCircle, Clock, TrendingUp,
  BarChart2, Zap, MapPin
} from 'lucide-react';
import { MOCK_STATS, MOCK_REPORTS, CATEGORY_LABELS, CATEGORY_ICONS } from '../data/mockReports';
import { ReportCategory } from '../types';
import clsx from 'clsx';

// Simple bar chart using plain divs
const BarChart: React.FC<{ data: { label: string; value: number; max: number; color: string }[] }> = ({ data }) => (
  <div className="space-y-3">
    {data.map(({ label, value, max, color }) => (
      <div key={label}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-body text-slate-500">{label}</span>
          <span className="text-xs font-body font-semibold text-civic-blue-700">{value}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-700', color)}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

// Donut chart SVG
const DonutChart: React.FC<{
  segments: { value: number; color: string; label: string }[];
  total: number;
  centerLabel: string;
}> = ({ segments, total, centerLabel }) => {
  const r = 40;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = segments.map(seg => {
    const dash = (seg.value / total) * circ;
    const gap = circ - dash;
    const slice = { ...seg, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="w-24 h-24 shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="14" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx="50" cy="50" r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
          />
        ))}
        <text
          x="50" y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="rotate-90"
          transform="rotate(90,50,50)"
          fill="#1E3A8A"
          fontSize="14"
          fontFamily="Syne, sans-serif"
          fontWeight="bold"
        >
          {centerLabel}
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-xs font-body text-slate-500">{s.label}</span>
            <span className="ml-auto text-xs font-body font-semibold text-slate-700">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  // Count by category
  const categoryCounts = MOCK_REPORTS.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCat = topCategories[0]?.[1] ?? 1;

  const statusColors: Record<string, string> = {
    pending:     '#F59E0B',
    in_review:   '#3B82F6',
    in_progress: '#6366F1',
    resolved:    '#22C55E',
    rejected:    '#EF4444',
  };

  const statusCounts = MOCK_REPORTS.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const donutSegments = Object.entries(statusCounts).map(([status, val]) => ({
    value: val,
    color: statusColors[status] ?? '#94A3B8',
    label: { pending: 'Pendiente', in_review: 'En revisión', in_progress: 'En proceso', resolved: 'Resuelto', rejected: 'Rechazado' }[status] ?? status,
  }));

  const STATS_CARDS = [
    { icon: BarChart2,    label: 'Total reportes',    value: MOCK_STATS.totalReports,    color: 'bg-civic-blue-50 text-civic-blue-600',   bg: 'bg-civic-blue-600' },
    { icon: AlertTriangle, label: 'Pendientes',        value: MOCK_STATS.pendingReports,  color: 'bg-amber-50 text-amber-600',             bg: 'bg-amber-500' },
    { icon: Clock,         label: 'En proceso',        value: MOCK_STATS.inProgressReports, color: 'bg-indigo-50 text-indigo-600',         bg: 'bg-indigo-500' },
    { icon: CheckCircle,   label: 'Resueltos',         value: MOCK_STATS.resolvedReports, color: 'bg-civic-green-50 text-civic-green-600', bg: 'bg-civic-green-600' },
    { icon: Zap,           label: 'Críticos',          value: MOCK_STATS.criticalReports, color: 'bg-red-50 text-red-600',                 bg: 'bg-red-500' },
    { icon: TrendingUp,    label: 'Esta semana',       value: MOCK_STATS.reportsThisWeek, color: 'bg-purple-50 text-purple-600',           bg: 'bg-purple-500' },
  ];

  return (
    <div className="pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-civic-blue-800 to-civic-blue-900 text-white px-4 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={16} className="text-civic-green-400" />
            <span className="text-xs font-body font-semibold text-civic-green-400 uppercase tracking-wide">Panel de control</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Estadísticas</h1>
          <p className="text-sm font-body text-blue-200">Resumen del estado de reportes en la plataforma.</p>

          {/* Resolution rate */}
          <div className="mt-5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-body font-semibold text-blue-200">Tasa de resolución</span>
              <span className="font-display font-bold text-xl text-white">{MOCK_STATS.resolutionRate}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-civic-green-400 to-civic-green-300 rounded-full"
                style={{ width: `${MOCK_STATS.resolutionRate}%` }}
              />
            </div>
            <p className="text-[11px] font-body text-blue-300 mt-1.5">
              {MOCK_STATS.resolvedReports} de {MOCK_STATS.totalReports} reportes resueltos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-5 space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STATS_CARDS.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
              <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center mb-3', color)}>
                <Icon size={17} strokeWidth={2} />
              </div>
              <div className="font-display font-bold text-2xl text-civic-blue-900 leading-none">{value}</div>
              <div className="text-xs font-body text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Donut + status */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h2 className="font-display font-semibold text-sm text-civic-blue-900 mb-4">Distribución por estado</h2>
          <DonutChart
            segments={donutSegments}
            total={MOCK_REPORTS.length}
            centerLabel={`${MOCK_REPORTS.length}`}
          />
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h2 className="font-display font-semibold text-sm text-civic-blue-900 mb-4">Categorías más reportadas</h2>
          <BarChart
            data={topCategories.map(([cat, count], i) => ({
              label: `${CATEGORY_ICONS[cat as ReportCategory] ?? '📍'} ${CATEGORY_LABELS[cat] ?? cat}`,
              value: count,
              max: maxCat,
              color: ['bg-civic-blue-600', 'bg-civic-blue-500', 'bg-civic-blue-400', 'bg-civic-blue-300', 'bg-civic-blue-200'][i] ?? 'bg-civic-blue-100',
            }))}
          />
        </div>

        {/* Critical reports */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm text-civic-blue-900">Reportes críticos activos</h2>
            <span className="text-[11px] font-body text-red-500 bg-red-50 border border-red-100 rounded-full px-2 py-0.5 font-semibold">
              {MOCK_REPORTS.filter(r => r.priority === 'critical').length} críticos
            </span>
          </div>
          <div className="space-y-2.5">
            {MOCK_REPORTS.filter(r => r.priority === 'critical').map(report => (
              <div key={report.id} className="flex items-start gap-3 p-3 bg-red-50/60 border border-red-100 rounded-xl">
                <span className="text-lg shrink-0">{CATEGORY_ICONS[report.category]}</span>
                <div className="min-w-0">
                  <p className="text-xs font-body font-semibold text-slate-700 leading-tight line-clamp-1">{report.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={10} className="text-slate-400" />
                    <p className="text-[11px] font-body text-slate-400 line-clamp-1">{report.address}</p>
                  </div>
                </div>
                <span className="text-[11px] font-body font-semibold text-red-600 bg-red-100 rounded-full px-2 py-0.5 shrink-0">
                  ⚠️ Crítico
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs font-body text-slate-300 pb-2">
          Datos simulados — se conectarán al backend cuando esté disponible.
        </p>
      </div>
    </div>
  );
};
