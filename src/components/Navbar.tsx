import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, List, BarChart2, Plus, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { label: 'Mapa', path: '/',          icon: MapPin },
  { label: 'Reportes', path: '/reports', icon: List },
  { label: 'Estadísticas', path: '/dashboard', icon: BarChart2 },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-card border-b border-white/60'
            : 'bg-white/95 border-b border-slate-100'
        )}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-civic-blue-600 to-civic-blue-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <MapPin size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-civic-green-500 border-2 border-white" />
              </div>
              <span className="font-display font-bold text-lg text-civic-blue-800 tracking-tight">
                CIVI<span className="text-civic-green-600">Scan</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-150',
                      active
                        ? 'bg-civic-blue-50 text-civic-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-civic-blue-700'
                    )}
                  >
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + mobile menu trigger */}
            <div className="flex items-center gap-2">
              <Link
                to="/new-report"
                className="flex items-center gap-1.5 bg-civic-blue-600 hover:bg-civic-blue-700 text-white px-3 py-2 rounded-lg text-sm font-body font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span className="hidden sm:inline">Nuevo Reporte</span>
                <span className="sm:hidden">Reportar</span>
              </Link>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-civic-blue-900/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={clsx(
            'absolute top-14 left-0 right-0 bg-white shadow-lg border-b border-slate-100 transition-transform duration-300',
            menuOpen ? 'translate-y-0' : '-translate-y-4'
          )}
        >
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-body font-medium transition-colors',
                    active
                      ? 'bg-civic-blue-50 text-civic-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-14 md:h-16" />
    </>
  );
};

// ─── Bottom tab bar (mobile) ──────────────────────────────────
export const BottomNav: React.FC = () => {
  const location = useLocation();

  const TABS = [
    { label: 'Mapa',      path: '/',          icon: MapPin },
    { label: 'Reportar',  path: '/new-report', icon: Plus, cta: true },
    { label: 'Reportes',  path: '/reports',    icon: List },
    { label: 'Stats',     path: '/dashboard',  icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/60 pb-safe">
      <div className="flex items-center justify-around h-16">
        {TABS.map(({ label, path, icon: Icon, cta }) => {
          const active = location.pathname === path;
          if (cta) {
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-civic-blue-600 to-civic-blue-700 flex items-center justify-center shadow-lg shadow-civic-blue-200">
                  <Icon size={22} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-body font-medium mt-0.5 text-civic-blue-600">{label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center justify-center w-16 h-full gap-0.5"
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-civic-blue-600' : 'text-slate-400'}
              />
              <span className={clsx(
                'text-[10px] font-body font-medium transition-colors',
                active ? 'text-civic-blue-600' : 'text-slate-400'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
