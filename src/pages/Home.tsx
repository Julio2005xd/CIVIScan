import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Layers, ChevronUp, ChevronDown,
  AlertTriangle, CheckCircle, Clock, X, Navigation,
  Filter, MapPin,
} from 'lucide-react';
import { MapView } from '../components/MapView';
import { ReportCard } from '../components/ReportCard';
import { MOCK_REPORTS, MOCK_STATS, STATUS_LABELS } from '../data/mockReports';
import { ReportStatus } from '../types';
import clsx from 'clsx';

// ── Filter chip config ────────────────────────────────────────
const FILTER_OPTIONS: { label: string; value: ReportStatus | 'all'; dot: string }[] = [
  { label: 'Todos',       value: 'all',         dot: 'bg-slate-400' },
  { label: 'Pendientes',  value: 'pending',     dot: 'bg-amber-400' },
  { label: 'En revisión', value: 'in_review',   dot: 'bg-civic-blue-500' },
  { label: 'En proceso',  value: 'in_progress', dot: 'bg-indigo-500' },
  { label: 'Resueltos',   value: 'resolved',    dot: 'bg-civic-green-500' },
];

// ── Bottom sheet snap heights ─────────────────────────────────
type SheetSnap = 'peek' | 'half' | 'full';
const SNAP_H: Record<SheetSnap, string> = {
  peek: 'h-[108px]',
  half: 'h-[52vh]',
  full: 'h-[88vh]',
};
// FAB bottom offset (mirrors sheet height + gap)
const FAB_BOTTOM: Record<SheetSnap, string> = {
  peek: 'bottom-[124px]',
  half: 'bottom-[calc(52vh+12px)]',
  full: 'bottom-[calc(88vh+12px)]',
};

export const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter]   = useState<ReportStatus | 'all'>('all');
  const [snap, setSnap]                   = useState<SheetSnap>('peek');
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [legendOpen, setLegendOpen]       = useState(false);
  const searchRef   = useRef<HTMLInputElement>(null);
  const touchStartY = useRef<number>(0);

  const filtered = MOCK_REPORTS
    .filter(r => activeFilter === 'all' || r.status === activeFilter)
    .filter(r => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.address.toLowerCase().includes(q);
    });

  const cycleSheet = () =>
    setSnap(s => s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek');

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy < -50) setSnap(s => s === 'peek' ? 'half' : 'full');
    if (dy >  50) setSnap(s => s === 'full' ? 'half' : 'peek');
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  return (
    // container ocupa toda la pantalla disponible debajo del navbar
    <div className="relative w-full overflow-hidden"
      style={{ height: 'calc(100dvh - 3.5rem)' /* 56px navbar */ }}
    >

      {/* ─────────────────────────────────────────────────────
          MAPA A PANTALLA COMPLETA
      ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <MapView
          reports={filtered}
          zoom={12}
          className="!rounded-none w-full h-full"
        />
      </div>

      {/* ─────────────────────────────────────────────────────
          TOP BAR — barra de búsqueda + botón capas
      ───────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-2">

        {/* Search pill */}
        <div className="flex-1 flex items-center gap-2.5 glass rounded-2xl shadow-map border border-white/70 px-4 py-3">
          <Search size={16} className="text-civic-blue-500 shrink-0" />
          {searchOpen ? (
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar dirección o reporte..."
              className="flex-1 text-sm font-body bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-300"
            />
          ) : (
            <button
              onClick={openSearch}
              className="flex-1 text-left text-sm font-body text-slate-400"
            >
              Buscar en CIVIScan…
            </button>
          )}
          {searchOpen && searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={15} />
            </button>
          )}
          {searchOpen && !searchQuery && (
            <button
              onClick={() => setSearchOpen(false)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Layers / legend button */}
        <button
          onClick={() => setLegendOpen(v => !v)}
          className={clsx(
            'w-11 h-11 glass rounded-2xl shadow-map border border-white/70 flex items-center justify-center transition-all',
            legendOpen && 'bg-civic-blue-50 border-civic-blue-200'
          )}
        >
          <Layers size={18} className={legendOpen ? 'text-civic-blue-600' : 'text-civic-blue-700'} />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────
          LEGEND POPUP
      ───────────────────────────────────────────────────── */}
      {legendOpen && (
        <div className="absolute top-[4.6rem] right-3 z-20 glass rounded-2xl shadow-xl border border-white/70 p-4 w-52 animate-slide-up">
          <p className="text-[10px] font-body font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Leyenda de estados
          </p>
          {(Object.entries(STATUS_LABELS) as [string, string][]).map(([key, label]) => {
            const colors: Record<string, string> = {
              pending: '#F59E0B', in_review: '#3B82F6', in_progress: '#6366F1',
              resolved: '#22C55E', rejected: '#EF4444',
            };
            return (
              <div key={key} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: colors[key] ?? '#94A3B8' }} />
                <span className="text-xs font-body text-slate-600">{label}</span>
              </div>
            );
          })}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-body text-slate-400 mb-1.5">Total en mapa</p>
            <p className="font-display font-bold text-lg text-civic-blue-800">{filtered.length} reportes</p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────
          RIGHT SIDEBAR — stat pills + ubicación (Waze-style)
      ───────────────────────────────────────────────────── */}
      <div
        className={clsx(
          'absolute right-3 z-20 flex flex-col gap-2 items-end transition-all duration-350',
          snap === 'peek'
            ? 'bottom-[140px]'
            : snap === 'half'
            ? 'bottom-[calc(52vh+48px)]'
            : 'bottom-[calc(88vh+48px)]'
        )}
        style={{ transition: 'bottom 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* stat pills */}
        {[
          { icon: AlertTriangle, value: MOCK_STATS.pendingReports,    bg: 'bg-amber-50/90',          text: 'text-amber-600',       label: 'pendientes' },
          { icon: Clock,         value: MOCK_STATS.inProgressReports, bg: 'bg-indigo-50/90',         text: 'text-indigo-600',      label: 'en proceso' },
          { icon: CheckCircle,   value: MOCK_STATS.resolvedReports,   bg: 'bg-civic-green-50/90',    text: 'text-civic-green-600', label: 'resueltos'  },
        ].map(({ icon: Icon, value, bg, text, label }) => (
          <div
            key={label}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/80 shadow backdrop-blur-sm',
              bg
            )}
          >
            <Icon size={13} className={text} strokeWidth={2.5} />
            <span className={clsx('text-xs font-body font-bold', text)}>{value}</span>
            <span className="text-[10px] font-body text-slate-400 hidden sm:inline">{label}</span>
          </div>
        ))}

        {/* My location */}
        <button className="w-11 h-11 glass rounded-2xl shadow-map border border-white/70 flex items-center justify-center hover:bg-white/90 transition-colors mt-1">
          <Navigation size={18} className="text-civic-blue-600" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────
          FAB — "Reportar daño" (sube con el sheet)
      ───────────────────────────────────────────────────── */}
      <Link
        to="/new-report"
        className={clsx(
          'absolute left-3 z-30',
          'flex items-center gap-2',
          'bg-civic-blue-600 hover:bg-civic-blue-700 active:scale-95',
          'text-white rounded-2xl px-4 py-3',
          'font-body font-bold text-sm',
          'shadow-xl shadow-civic-blue-400/30',
          'transition-colors',
          FAB_BOTTOM[snap]
        )}
        style={{ transition: 'bottom 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="w-5 h-5 rounded-lg bg-civic-green-400 flex items-center justify-center shrink-0">
          <Plus size={13} strokeWidth={3} className="text-white" />
        </div>
        Reportar daño
      </Link>

      {/* ─────────────────────────────────────────────────────
          BOTTOM SHEET — lista de reportes tipo drawer
      ───────────────────────────────────────────────────── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={clsx(
          'absolute bottom-0 left-0 right-0 z-20',
          'flex flex-col',
          'glass border-t border-white/60',
          'shadow-[0_-6px_40px_rgba(0,0,0,0.13)]',
          'rounded-t-3xl',
          SNAP_H[snap]
        )}
        style={{ transition: 'height 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* ── Handle + counter ── */}
        <div
          className="flex flex-col items-center pt-3 pb-1 shrink-0 cursor-pointer select-none"
          onClick={cycleSheet}
        >
          <div className="w-10 h-1 rounded-full bg-slate-300 mb-2.5" />
          <div className="flex items-center gap-1.5 px-3">
            <span className="text-sm font-display font-semibold text-civic-blue-800">
              {filtered.length} reportes
            </span>
            {activeFilter !== 'all' && (
              <span className="text-xs font-body text-slate-400">
                · {FILTER_OPTIONS.find(f => f.value === activeFilter)?.label}
              </span>
            )}
            {snap === 'peek'
              ? <ChevronUp size={15} className="text-slate-400 ml-1" />
              : <ChevronDown size={15} className="text-slate-400 ml-1" />
            }
          </div>
        </div>

        {/* ── Filter chips (siempre visibles) ── */}
        <div className="shrink-0 px-4 pt-1 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_OPTIONS.map(({ label, value, dot }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={clsx(
                  'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                  'text-xs font-body font-semibold transition-all border whitespace-nowrap',
                  activeFilter === value
                    ? 'bg-civic-blue-600 text-white border-civic-blue-600 shadow-sm'
                    : 'bg-white/80 text-slate-500 border-slate-200 hover:border-civic-blue-300'
                )}
              >
                {activeFilter !== value && (
                  <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dot)} />
                )}
                {label}
                {value !== 'all' && (
                  <span className={clsx(
                    'ml-0.5 text-[10px] font-bold',
                    activeFilter === value ? 'text-white/70' : 'text-slate-300'
                  )}>
                    {MOCK_REPORTS.filter(r => r.status === value).length}
                  </span>
                )}
              </button>
            ))}
            <button className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body font-semibold border bg-white/80 text-slate-500 border-slate-200 hover:border-civic-blue-300 transition-all">
              <Filter size={11} />
              Más
            </button>
          </div>
        </div>

        {/* ── Nav tabs (Waze-style, solo en peek) ── */}
        {snap === 'peek' && (
          <div className="shrink-0 flex items-center justify-around px-2 pb-2 pt-1">
            {([
              { to: '/',           label: 'Mapa',     emoji: '🗺️',  active: true  },
              { to: '/reports',    label: 'Reportes', emoji: '📋',  active: false },
              { to: '/dashboard',  label: 'Stats',    emoji: '📊',  active: false },
              { to: '/new-report', label: 'Reportar', emoji: '➕',  active: false },
            ] as const).map(({ to, emoji, label, active }) => (
              <Link key={to} to={to} className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl hover:bg-civic-blue-50 transition-colors">
                <span className="text-xl leading-none">{emoji}</span>
                <span className={clsx('text-[10px] font-body font-semibold mt-0.5', active ? 'text-civic-blue-600' : 'text-slate-400')}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* ── Report list (solo en half / full) ── */}
        {snap !== 'peek' && (
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 pb-24 md:pb-6 space-y-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MapPin size={30} className="text-slate-200 mb-3" />
                <p className="text-sm font-body font-semibold text-slate-400 mb-1">Sin reportes</p>
                <p className="text-xs font-body text-slate-300">Prueba otro filtro o sé el primero en reportar.</p>
              </div>
            ) : (
              filtered.map(report => (
                <ReportCard key={report.id} report={report} compact />
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};
