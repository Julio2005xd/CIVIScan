import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ThumbsUp, Share2, Flag, Camera } from 'lucide-react';
import { MapView } from '../components/MapView';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { MOCK_REPORTS, CATEGORY_LABELS, CATEGORY_ICONS, STATUS_LABELS } from '../data/mockReports';
import clsx from 'clsx';

const STATUS_ORDER: string[] = ['pending', 'in_review', 'in_progress', 'resolved'];

function timeAgo(dateString: string): string {
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = MOCK_REPORTS.find(r => r.id === id);
  const [voted, setVoted] = useState(false);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="font-display font-bold text-xl text-civic-blue-900 mb-2">Reporte no encontrado</h2>
        <p className="text-sm font-body text-slate-400 mb-6">El reporte que buscas no existe o fue eliminado.</p>
        <button onClick={() => navigate('/reports')} className="text-sm font-body font-semibold text-civic-blue-600 hover:underline">
          ← Ver todos los reportes
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER.indexOf(report.status);

  return (
    <div className="pb-24 md:pb-8">
      {/* Top bar */}
      <div className="sticky top-14 md:top-16 z-30 glass border-b border-white/60 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-body font-medium text-slate-600 hover:text-civic-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-slate-400 hover:text-civic-blue-600 hover:bg-civic-blue-50 transition-all">
              <Share2 size={17} />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <Flag size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5 animate-fade-in">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-civic-blue-50 flex items-center justify-center text-2xl shrink-0">
              {CATEGORY_ICONS[report.category]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-lg text-civic-blue-900 leading-tight mb-1">
                {report.title}
              </h1>
              <p className="text-xs font-body text-slate-400">{CATEGORY_LABELS[report.category]}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} />
          </div>

          <p className="text-sm font-body text-slate-600 leading-relaxed mb-4">{report.description}</p>

          <div className="flex items-center gap-4 text-xs font-body text-slate-400 border-t border-slate-50 pt-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {report.address}
            </span>
            <span className="flex items-center gap-1.5 ml-auto">
              <Clock size={12} />
              {timeAgo(report.createdAt)}
            </span>
          </div>
        </div>

        {/* Vote button */}
        <button
          onClick={() => setVoted(v => !v)}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-sm font-body font-semibold transition-all',
            voted
              ? 'border-civic-blue-500 bg-civic-blue-50 text-civic-blue-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-500 hover:border-civic-blue-200 hover:bg-civic-blue-50/50'
          )}
        >
          <ThumbsUp size={16} strokeWidth={voted ? 2.5 : 2} />
          {voted ? 'Apoyado' : 'Apoyar este reporte'}
          <span className={clsx(
            'ml-1 px-2 py-0.5 rounded-full text-xs font-bold',
            voted ? 'bg-civic-blue-600 text-white' : 'bg-slate-100 text-slate-500'
          )}>
            {report.votes + (voted ? 1 : 0)}
          </span>
        </button>

        {/* Status timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h2 className="font-display font-semibold text-sm text-civic-blue-900 mb-4">Seguimiento del reporte</h2>
          <div className="space-y-0">
            {STATUS_ORDER.map((s, i) => {
              const done = i <= currentStepIndex;
              const current = i === currentStepIndex;
              return (
                <div key={s} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shrink-0',
                      done
                        ? current
                          ? 'border-civic-blue-500 bg-civic-blue-500 shadow-lg shadow-civic-blue-100'
                          : 'border-civic-green-500 bg-civic-green-500'
                        : 'border-slate-200 bg-white'
                    )}>
                      {done && (
                        <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                          <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {!done && <div className="w-2 h-2 rounded-full bg-slate-200" />}
                    </div>
                    {i < STATUS_ORDER.length - 1 && (
                      <div className={clsx('w-0.5 h-8 mt-1', done && i < currentStepIndex ? 'bg-civic-green-400' : 'bg-slate-100')} />
                    )}
                  </div>
                  <div className={clsx('pt-1 pb-6', i === STATUS_ORDER.length - 1 && 'pb-0')}>
                    <p className={clsx(
                      'text-sm font-body font-semibold',
                      current ? 'text-civic-blue-700' : done ? 'text-civic-green-700' : 'text-slate-300'
                    )}>
                      {STATUS_LABELS[s]}
                    </p>
                    {current && (
                      <p className="text-xs font-body text-slate-400 mt-0.5">Estado actual</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm text-civic-blue-900">Ubicación del daño</h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${report.coordinates.lat},${report.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-body font-semibold text-civic-blue-600 hover:underline"
            >
              Abrir en Maps →
            </a>
          </div>
          <div style={{ height: '220px' }}>
            <MapView
              reports={[report]}
              center={[report.coordinates.lat, report.coordinates.lng]}
              zoom={16}
            />
          </div>
          <div className="px-5 py-3 border-t border-slate-50 flex items-center gap-2 text-xs font-body text-slate-400">
            <MapPin size={12} />
            {report.address}
          </div>
        </div>

        {/* Photos placeholder */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
          <h2 className="font-display font-semibold text-sm text-civic-blue-900 mb-3">Evidencia fotográfica</h2>
          {report.photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-center">
              <Camera size={28} className="text-slate-200 mb-2" />
              <p className="text-xs font-body text-slate-300">Sin fotos adjuntas</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {report.photos.map((url, i) => (
                <img key={i} src={url} alt={`Foto ${i + 1}`} className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* Reporter */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-civic-blue-100 flex items-center justify-center text-sm font-display font-bold text-civic-blue-600 shrink-0">
            {report.reporterName ? report.reporterName[0].toUpperCase() : '?'}
          </div>
          <div>
            <p className="text-xs font-body font-semibold text-slate-600">
              {report.reporterName ?? 'Anónimo'}
            </p>
            <p className="text-[11px] font-body text-slate-400">Reportado {timeAgo(report.createdAt)}</p>
          </div>
          <span className="ml-auto text-[11px] font-body text-slate-400 bg-white border border-slate-100 rounded-full px-2 py-0.5">
            #{report.id}
          </span>
        </div>
      </div>
    </div>
  );
};
