import React from 'react';
import clsx from 'clsx';
import { ReportStatus, ReportPriority } from '../types';

// ─── Status Badge ──────────────────────────────────────────────
interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<ReportStatus, { label: string; className: string; dot: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400 animate-pulse-dot',
  },
  in_review: {
    label: 'En revisión',
    className: 'bg-blue-50 text-civic-blue-700 border-civic-blue-200',
    dot: 'bg-civic-blue-500 animate-pulse-dot',
  },
  in_progress: {
    label: 'En proceso',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500 animate-pulse-dot',
  },
  resolved: {
    label: 'Resuelto',
    className: 'bg-green-50 text-civic-green-700 border-civic-green-200',
    dot: 'bg-civic-green-500',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-body font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={clsx('rounded-full shrink-0', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {config.label}
    </span>
  );
};

// ─── Priority Badge ────────────────────────────────────────────
interface PriorityBadgeProps {
  priority: ReportPriority;
  size?: 'sm' | 'md';
}

const PRIORITY_CONFIG: Record<ReportPriority, { label: string; className: string }> = {
  low:      { label: 'Baja',     className: 'bg-slate-100 text-slate-600 border-slate-200' },
  medium:   { label: 'Media',    className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  high:     { label: 'Alta',     className: 'bg-orange-50 text-orange-700 border-orange-200' },
  critical: { label: 'Crítica',  className: 'bg-red-50 text-red-700 border-red-200 font-semibold' },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-body font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {priority === 'critical' && <span className="mr-1">⚠️</span>}
      {config.label}
    </span>
  );
};
