import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ReportCard } from '../components/ReportCard';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { MOCK_REPORTS, CATEGORY_LABELS } from '../data/mockReports';
import { ReportCategory, ReportStatus, ReportPriority } from '../types';
import clsx from 'clsx';

const ALL_STATUSES: ReportStatus[] = ['pending', 'in_review', 'in_progress', 'resolved', 'rejected'];
const ALL_PRIORITIES: ReportPriority[] = ['critical', 'high', 'medium', 'low'];
const ALL_CATEGORIES: ReportCategory[] = [
  'pothole', 'crack', 'flooding', 'broken_sign',
  'broken_light', 'damaged_guardrail', 'missing_manhole', 'sidewalk_damage', 'other'
];

export const ReportsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<ReportStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<ReportPriority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ReportCategory[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'priority'>('recent');

  const toggleArr = <T,>(arr: T[], val: T, set: (v: T[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedCategories([]);
    setSearch('');
  };

  const activeFilterCount =
    selectedStatuses.length + selectedPriorities.length + selectedCategories.length;

  const filtered = MOCK_REPORTS
    .filter(r => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
          !r.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(r.status)) return false;
      if (selectedPriorities.length && !selectedPriorities.includes(r.priority)) return false;
      if (selectedCategories.length && !selectedCategories.includes(r.category)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="pb-24 md:pb-8">
      {/* Sticky top bar */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar reportes..."
                className="flex-1 text-sm font-body bg-transparent focus:outline-none placeholder:text-slate-300"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFilterOpen(v => !v)}
              className={clsx(
                'relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-body font-semibold border transition-all',
                filterOpen || activeFilterCount > 0
                  ? 'bg-civic-blue-50 border-civic-blue-200 text-civic-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              <SlidersHorizontal size={15} />
              Filtros
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-civic-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Sort row */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] font-body text-slate-400">Ordenar:</span>
            {(['recent', 'votes', 'priority'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={clsx(
                  'text-[11px] font-body font-semibold px-2.5 py-1 rounded-full transition-colors',
                  sortBy === s
                    ? 'bg-civic-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {{ recent: 'Reciente', votes: 'Más votado', priority: 'Prioridad' }[s]}
              </button>
            ))}
            <span className="ml-auto text-[11px] font-body text-slate-400">{filtered.length} resultados</span>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="bg-white border-b border-slate-100 shadow-sm px-4 py-4 animate-slide-up">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-body font-semibold text-slate-500 uppercase tracking-wide mb-2">Estado</label>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map(s => (
                  <button key={s} onClick={() => toggleArr(selectedStatuses, s, setSelectedStatuses)}>
                    <StatusBadge
                      status={s}
                      size="sm"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-body font-semibold text-slate-500 uppercase tracking-wide mb-2">Prioridad</label>
              <div className="flex flex-wrap gap-2">
                {ALL_PRIORITIES.map(p => (
                  <button key={p} onClick={() => toggleArr(selectedPriorities, p, setSelectedPriorities)}>
                    <PriorityBadge priority={p} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-body font-semibold text-slate-500 uppercase tracking-wide mb-2">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleArr(selectedCategories, c, setSelectedCategories)}
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-xs font-body font-medium border transition-all',
                      selectedCategories.includes(c)
                        ? 'bg-civic-blue-600 text-white border-civic-blue-600'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-civic-blue-300'
                    )}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-body font-semibold text-red-500 hover:text-red-600"
              >
                <X size={13} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl">🔍</div>
            <p className="font-display font-semibold text-slate-600 mb-1">Sin resultados</p>
            <p className="text-sm font-body text-slate-400">Intenta con otros filtros o términos de búsqueda.</p>
            <button onClick={clearFilters} className="mt-4 text-sm font-body font-semibold text-civic-blue-600 hover:underline">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
