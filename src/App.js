// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './contexts/AppContext';

// Pages
import StartProjectPage from './pages/StartProjectPage';
import DashboardLayout from './pages/DashboardLayout';
import Board from './pages/Board';
import FocusMode from './pages/FocusMode';
import DailyPlanner from './pages/DailyPlanner';
import ProgressSummary from './pages/ProgressSummary';

function App() {
  const { state } = useContext(AppContext);
  const { projects, activeProjectId } = state;

  // Cek apakah user sudah punya proyek dan ada yang aktif
  const hasActiveProject = projects.length > 0 && activeProjectId;

  return (
    <Router>
      <div className="min-h-screen bg-background text-primary">
        <Routes>
          {/* Jika sudah ada proyek aktif → langsung ke dashboard, kalau belum → StartProjectPage */}
          <Route
            path="/"
            element={
              hasActiveProject ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <StartProjectPage />
              )
            }
          />

          {/* Dashboard dan semua fitur utama */}
          <Route path="/dashboard" element={hasActiveProject ? <DashboardLayout /> : <Navigate to="/" replace />}>
            <Route index element={<Board />} />
            <Route path="focus" element={<FocusMode />} />
            <Route path="daily" element={<DailyPlanner />} />
            <Route path="progress" element={<ProgressSummary />} />
          </Route>

          {/* Fallback kalau route tidak ditemukan */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;