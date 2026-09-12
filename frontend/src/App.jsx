import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import DemoBanner from './components/common/DemoBanner';
import OfflineBanner from './components/common/OfflineBanner';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Recommendations from './pages/Recommendations';
import CareerPath from './pages/CareerPath';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Jobs from './pages/Jobs';
import Courses from './pages/Courses';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';

export function App() {
  const [isDemoActive, setIsDemoActive] = useState(() => {
    return localStorage.getItem('jeevanvani_demo_mode') === 'true';
  });
  const [selectedPersona, setSelectedPersona] = useState('rahul');

  const handleToggleDemo = () => {
    const nextState = !isDemoActive;
    setIsDemoActive(nextState);
    localStorage.setItem('jeevanvani_demo_mode', String(nextState));
  };

  const handleSelectPersona = (personaKey) => {
    setSelectedPersona(personaKey);
    // When persona is selected, auto-seed persona demo details into session
    if (personaKey === 'rahul') {
      const rahulDemo = {
        name: 'Rahul Kumar',
        mobile: '9812345678',
        email: 'rahul.kumar@gmail.com',
        preferred_language: 'hi',
        role: 'beneficiary',
      };
      localStorage.setItem('jeevanvani_user', JSON.stringify(rahulDemo));
    }
  };

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
              {/* Offline Connectivity Status Banner */}
              <OfflineBanner />

              {/* SIH 2026 Presentation Demo Mode Banner */}
              <DemoBanner
                active={isDemoActive}
                onToggle={handleToggleDemo}
                onSelectPersona={handleSelectPersona}
                selectedPersona={selectedPersona}
              />

              <Navbar
                isDemoActive={isDemoActive}
                onToggleDemo={handleToggleDemo}
              />

              <main className="flex-1">
                <Routes>
                  {/* Public Discovery Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/career-path" element={<CareerPath />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/courses" element={<Courses />} />

                  {/* Beneficiary Pathways */}
                  <Route
                    path="/assessment"
                    element={
                      <ProtectedRoute>
                        <Assessment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/skill-gap"
                    element={
                      <ProtectedRoute>
                        <SkillGap />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/roadmap"
                    element={
                      <ProtectedRoute>
                        <Roadmap />
                      </ProtectedRoute>
                    }
                  />

                  {/* State Admin Portal */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
