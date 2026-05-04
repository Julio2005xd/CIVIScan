import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, BottomNav } from './components/Navbar';
import { HomePage } from './pages/Home';
import { ReportsPage } from './pages/Reports';
import { ReportDetailPage } from './pages/ReportDetail';
import { NewReportPage } from './pages/NewReport';
import { DashboardPage } from './pages/Dashboard';

// Inner layout so useLocation works inside BrowserRouter
const Layout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={isHome ? 'flex flex-col h-dvh overflow-hidden' : 'min-h-dvh bg-slate-50 flex flex-col'}>
      <Navbar />
      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/reports"      element={<ReportsPage />} />
          <Route path="/reports/:id"  element={<ReportDetailPage />} />
          <Route path="/new-report"   element={<NewReportPage />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* BottomNav only on non-map pages (home has its own bottom sheet) */}
      {!isHome && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
