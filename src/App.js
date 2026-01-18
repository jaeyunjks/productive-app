// src/App.js (pastikan seperti ini)
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const { activeProjectId } = state;

  return (
    <Router>
      <div className="min-h-screen bg-background text-primary">
        <Routes>
          <Route
            path="/"
            element={
              activeProjectId ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <StartProjectPage />
              )
            }
          />

          <Route
            path="/dashboard/*"
            element={activeProjectId ? <DashboardLayout /> : <Navigate to="/" replace />}
          >
            <Route index element={<Board />} />
            <Route path="focus" element={<FocusMode />} />
            <Route path="daily" element={<DailyPlanner />} />
            <Route path="progress" element={<ProgressSummary />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;