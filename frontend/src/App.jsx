import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ChatBot } from './components/ui';

import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import PricingPage from './pages/public/PricingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import { DashboardIndex } from './pages/dashboards/DashboardIndex';
import { ReviewsIndex } from './pages/dashboards/ReviewsIndex';
import { SuggestionsIndex } from './pages/dashboards/SuggestionsIndex';
import { GuestsIndex } from './pages/dashboards/GuestsIndex';
import { SettingsPage } from './pages/dashboards/SettingsPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>
        
        {/* Unrestricted Public Routes */}
        <Route path="/pricing" element={<PricingPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardIndex />} />
                <Route path="reviews" element={<ReviewsIndex />} />
                <Route path="suggestions" element={<SuggestionsIndex />} />
                <Route path="guests" element={<GuestsIndex />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
