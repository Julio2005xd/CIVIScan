import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ThumbsUp, ChevronRight } from 'lucide-react';
import { Report } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../data/mockReports';
import clsx from 'clsx';

interface ReportCardProps {
  report: Report;
  className?: string;
  compact?: boolean;
}

function timeAgo(dateString: string): string {
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, className, compact }) => {
  return (
    <Link
      to={`/reports/${report.id}`}
      className={clsx(
        'group block bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      <div className={clsx('p-4', compact ? '' : 'p-5')}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-civic-blue-50 flex items-center justify-center text-lg shrink-0">
              {CATEGORY_ICONS[report.category] ?? '📍'}
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-sm text-civic-blue-900 leading-tight line-clamp-2 group-hover:text-civic-blue-700 transition-colors">
                {report.title}
              </h3>
              <p className="text-[11px] font-body text-slate-400 mt-0.5">
                {CATEGORY_LABELS[report.category]}
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-slate-300 group-hover:text-civic-blue-400 shrink-0 mt-1 transition-colors"
          />
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-xs font-body text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {report.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <StatusBadge status={report.status} size="sm" />
          <PriorityBadge priority={report.priority} size="sm" />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between text-[11px] font-body text-slate-400 pt-2.5 border-t border-slate-50">
          <div className="flex items-center gap-1">
            <MapPin size={11} />
            <span className="line-clamp-1 max-w-[140px]">{report.address}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <ThumbsUp size={11} />
              {report.votes}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {timeAgo(report.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
