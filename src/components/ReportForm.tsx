import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, ChevronRight, ChevronLeft, Check, Loader2, X, Navigation } from 'lucide-react';
import clsx from 'clsx';
import { ReportFormData, ReportCategory, ReportPriority, Coordinates } from '../types';
import { MapView } from './MapView';
import { useGeolocation } from '../hooks/useGeolocation';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../data/mockReports';

const INITIAL_FORM: ReportFormData = {
  title: '',
  description: '',
  category: 'pothole',
  priority: 'medium',
  coordinates: null,
  address: '',
  photos: [],
  reporterName: '',
  reporterContact: '',
  anonymous: false,
};

const CATEGORIES: ReportCategory[] = [
  'pothole', 'crack', 'flooding', 'broken_sign',
  'broken_light', 'damaged_guardrail', 'missing_manhole', 'sidewalk_damage', 'other'
];

const PRIORITIES: { value: ReportPriority; label: string; desc: string; color: string }[] = [
  { value: 'low',      label: 'Baja',    desc: 'No urgente',       color: 'border-slate-200 bg-slate-50  text-slate-700' },
  { value: 'medium',   label: 'Media',   desc: 'Atención pronto',  color: 'border-yellow-200 bg-yellow-50 text-yellow-700' },
  { value: 'high',     label: 'Alta',    desc: 'Requiere atención rápida', color: 'border-orange-200 bg-orange-50 text-orange-700' },
  { value: 'critical', label: 'Crítica', desc: 'Peligro inmediato', color: 'border-red-200 bg-red-50 text-red-700' },
];

const STEPS = ['Categoría', 'Descripción', 'Ubicación', 'Fotos', 'Confirmar'];

export const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ReportFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { coordinates, loading: geoLoading, error: geoError, getCurrentPosition } = useGeolocation();

  const update = <K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleGeolocate = () => {
    getCurrentPosition();
  };

  React.useEffect(() => {
    if (coordinates) {
      update('coordinates', coordinates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  const handleMapClick = (lat: number, lng: number) => {
    const coords: Coordinates = { lat, lng };
    update('coordinates', coords);
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    update('photos', [...form.photos, ...files].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    update('photos', form.photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // TODO: connect to backend API
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  // ─── Success screen ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-civic-green-100 flex items-center justify-center mb-6 shadow-lg">
          <Check size={36} className="text-civic-green-600" strokeWidth={2.5} />
        </div>
        <h2 className="font-display font-bold text-2xl text-civic-blue-900 mb-2">¡Reporte enviado!</h2>
        <p className="font-body text-slate-500 max-w-xs mb-8 leading-relaxed">
          Tu reporte ha sido registrado exitosamente. Las autoridades serán notificadas y el seguimiento estará disponible pronto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate('/reports')}
            className="flex-1 bg-civic-blue-600 text-white font-body font-semibold py-3 rounded-xl hover:bg-civic-blue-700 transition-colors"
          >
            Ver reportes
          </button>
          <button
            onClick={() => { setForm(INITIAL_FORM); setStep(0); setSubmitted(false); }}
            className="flex-1 border border-civic-blue-200 text-civic-blue-700 font-body font-semibold py-3 rounded-xl hover:bg-civic-blue-50 transition-colors"
          >
            Nuevo reporte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-body font-medium text-slate-400">
            Paso {step + 1} de {STEPS.length}
          </span>
          <span className="text-xs font-body font-semibold text-civic-blue-600">{STEPS[step]}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-civic-blue-500 to-civic-green-500 rounded-full transition-all duration-400"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {STEPS.map((s, i) => (
            <span key={s} className={clsx('text-[10px] font-body', i === step ? 'text-civic-blue-600 font-semibold' : 'text-slate-300')}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Step 0: Category ─────────────────────────────────── */}
      {step === 0 && (
        <div className="animate-slide-up">
          <h2 className="font-display font-bold text-xl text-civic-blue-900 mb-1">¿Qué tipo de daño vas a reportar?</h2>
          <p className="text-sm font-body text-slate-400 mb-5">Selecciona la categoría que mejor describe el problema.</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => update('category', cat)}
                className={clsx(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center',
                  form.category === cat
                    ? 'border-civic-blue-500 bg-civic-blue-50 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-civic-blue-200 hover:bg-civic-blue-50/50'
                )}
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <span className={clsx(
                  'text-[11px] font-body font-medium leading-tight',
                  form.category === cat ? 'text-civic-blue-700' : 'text-slate-600'
                )}>
                  {CATEGORY_LABELS[cat]}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <label className="block text-xs font-body font-semibold text-slate-600 mb-2 uppercase tracking-wide">Prioridad</label>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  onClick={() => update('priority', p.value)}
                  className={clsx(
                    'flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left',
                    form.priority === p.value ? `${p.color} border-current` : 'border-slate-100 bg-white hover:border-slate-200'
                  )}
                >
                  <div className={clsx('w-2 h-2 rounded-full shrink-0', {
                    'bg-slate-400': p.value === 'low',
                    'bg-yellow-400': p.value === 'medium',
                    'bg-orange-400': p.value === 'high',
                    'bg-red-500':    p.value === 'critical',
                  })} />
                  <div>
                    <div className="text-xs font-body font-semibold">{p.label}</div>
                    <div className="text-[10px] font-body text-slate-400">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 1: Description ──────────────────────────────── */}
      {step === 1 && (
        <div className="animate-slide-up space-y-4">
          <div>
            <h2 className="font-display font-bold text-xl text-civic-blue-900 mb-1">Describe el problema</h2>
            <p className="text-sm font-body text-slate-400 mb-5">Cuéntanos más sobre el daño para que pueda atenderse correctamente.</p>
          </div>
          <div>
            <label className="block text-xs font-body font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="Ej: Hueco grande en la carrera 7"
              className="w-full px-4 py-3 text-sm font-body bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-civic-blue-400 focus:border-transparent transition placeholder:text-slate-300"
              maxLength={80}
            />
            <div className="text-right text-[10px] text-slate-300 mt-1">{form.title.length}/80</div>
          </div>
          <div>
            <label className="block text-xs font-body font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Descripción <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe el daño con detalle: tamaño, riesgo, cuánto tiempo lleva..."
              rows={4}
              className="w-full px-4 py-3 text-sm font-body bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-civic-blue-400 focus:border-transparent transition placeholder:text-slate-300 resize-none"
              maxLength={500}
            />
            <div className="text-right text-[10px] text-slate-300 mt-1">{form.description.length}/500</div>
          </div>
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3">
            <label className="block text-xs font-body font-semibold text-slate-600 uppercase tracking-wide">
              Datos del reportante (opcional)
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => update('anonymous', !form.anonymous)}
                className={clsx(
                  'w-10 h-6 rounded-full transition-colors relative',
                  form.anonymous ? 'bg-civic-blue-500' : 'bg-slate-200'
                )}
              >
                <div className={clsx(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  form.anonymous ? 'translate-x-4' : 'translate-x-0.5'
                )} />
              </div>
              <span className="text-sm font-body text-slate-600">Reportar anónimamente</span>
            </label>
            {!form.anonymous && (
              <>
                <input
                  type="text"
                  value={form.reporterName}
                  onChange={e => update('reporterName', e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-3 py-2.5 text-sm font-body bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-civic-blue-300 transition placeholder:text-slate-300"
                />
                <input
                  type="text"
                  value={form.reporterContact}
                  onChange={e => update('reporterContact', e.target.value)}
                  placeholder="Email o teléfono de contacto"
                  className="w-full px-3 py-2.5 text-sm font-body bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-civic-blue-300 transition placeholder:text-slate-300"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Step 2: Location ─────────────────────────────────── */}
      {step === 2 && (
        <div className="animate-slide-up">
          <h2 className="font-display font-bold text-xl text-civic-blue-900 mb-1">Ubica el daño en el mapa</h2>
          <p className="text-sm font-body text-slate-400 mb-4">Toca el mapa o usa tu ubicación actual para marcar el lugar exacto.</p>

          <button
            onClick={handleGeolocate}
            disabled={geoLoading}
            className="w-full flex items-center justify-center gap-2 mb-4 py-2.5 border border-civic-blue-200 bg-civic-blue-50 text-civic-blue-700 rounded-xl text-sm font-body font-semibold hover:bg-civic-blue-100 transition disabled:opacity-60"
          >
            {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            {geoLoading ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
          </button>

          {geoError && (
            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs font-body text-red-600">
              {geoError}
            </div>
          )}

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-map mb-4" style={{ height: '260px' }}>
            <MapView
              onMapClick={handleMapClick}
              selectedPin={form.coordinates ? [form.coordinates.lat, form.coordinates.lng] : null}
              interactive
              zoom={13}
            />
          </div>

          {form.coordinates && (
            <div className="flex items-center gap-2 px-3 py-2 bg-civic-green-50 border border-civic-green-200 rounded-xl text-xs font-body text-civic-green-700">
              <MapPin size={13} />
              <span>
                Ubicación seleccionada: {form.coordinates.lat.toFixed(5)}, {form.coordinates.lng.toFixed(5)}
              </span>
            </div>
          )}

          <div className="mt-3">
            <label className="block text-xs font-body font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Dirección (opcional)
            </label>
            <input
              type="text"
              value={form.address}
              onChange={e => update('address', e.target.value)}
              placeholder="Ej: Carrera 7 #45-20, cerca al parque"
              className="w-full px-4 py-3 text-sm font-body bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-civic-blue-400 focus:border-transparent transition placeholder:text-slate-300"
            />
          </div>
        </div>
      )}

      {/* ─── Step 3: Photos ───────────────────────────────────── */}
      {step === 3 && (
        <div className="animate-slide-up">
          <h2 className="font-display font-bold text-xl text-civic-blue-900 mb-1">Agrega fotos del daño</h2>
          <p className="text-sm font-body text-slate-400 mb-5">Las fotos ayudan a las autoridades a priorizar y atender el reporte. Máximo 5 fotos.</p>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={form.photos.length >= 5}
            className="w-full border-2 border-dashed border-civic-blue-200 bg-civic-blue-50/50 hover:bg-civic-blue-50 rounded-2xl p-8 flex flex-col items-center gap-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-full bg-civic-blue-100 flex items-center justify-center">
              <Camera size={22} className="text-civic-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-body font-semibold text-civic-blue-700">Toca para agregar fotos</p>
              <p className="text-xs font-body text-slate-400 mt-1">JPG, PNG · Máx 10MB por foto</p>
            </div>
          </button>
          {form.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {form.photos.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs font-body text-slate-400 text-center mt-3">
            {form.photos.length}/5 fotos agregadas
          </p>
        </div>
      )}

      {/* ─── Step 4: Confirm ──────────────────────────────────── */}
      {step === 4 && (
        <div className="animate-slide-up">
          <h2 className="font-display font-bold text-xl text-civic-blue-900 mb-1">Confirma tu reporte</h2>
          <p className="text-sm font-body text-slate-400 mb-5">Revisa la información antes de enviar.</p>
          <div className="space-y-3">
            {[
              { label: 'Categoría', value: `${CATEGORY_ICONS[form.category]} ${CATEGORY_LABELS[form.category]}` },
              { label: 'Título', value: form.title || '—' },
              { label: 'Descripción', value: form.description ? form.description.slice(0, 80) + (form.description.length > 80 ? '...' : '') : '—' },
              { label: 'Ubicación', value: form.coordinates ? `${form.coordinates.lat.toFixed(4)}, ${form.coordinates.lng.toFixed(4)}` : 'No seleccionada' },
              { label: 'Fotos', value: `${form.photos.length} foto(s) adjunta(s)` },
              { label: 'Reportante', value: form.anonymous ? 'Anónimo' : (form.reporterName || 'Anónimo') },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <span className="text-xs font-body font-semibold text-slate-400 uppercase tracking-wide w-24 shrink-0">{label}</span>
                <span className="text-sm font-body text-slate-700">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-civic-blue-50 border border-civic-blue-100 rounded-xl">
            <p className="text-xs font-body text-civic-blue-700 leading-relaxed">
              Al enviar este reporte, confirmas que la información es verídica y que el daño existe en la ubicación indicada. Los reportes falsos pueden ser sancionados.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-body font-semibold hover:bg-slate-50 transition"
          >
            <ChevronLeft size={16} />
            Atrás
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && (!form.title.trim() || !form.description.trim())}
            className="flex-1 flex items-center justify-center gap-1.5 bg-civic-blue-600 hover:bg-civic-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3 rounded-xl text-sm font-body font-semibold transition shadow-sm hover:shadow-md disabled:shadow-none"
          >
            Continuar
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 bg-civic-green-600 hover:bg-civic-green-700 text-white py-3 rounded-xl text-sm font-body font-semibold transition shadow-sm hover:shadow-md"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {submitting ? 'Enviando...' : 'Enviar reporte'}
          </button>
        )}
      </div>
    </div>
  );
};
