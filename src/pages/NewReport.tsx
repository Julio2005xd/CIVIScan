import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ReportForm } from '../components/ReportForm';

export const NewReportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 md:pb-8">
      {/* Page header */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display font-bold text-base text-civic-blue-900 leading-none">Nuevo Reporte</h1>
            <p className="text-[11px] font-body text-slate-400 mt-0.5">Registra un daño o falla vial</p>
          </div>
        </div>
      </div>

      <ReportForm />
    </div>
  );
};
