import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { DashboardIndex } from './pages/dashboards/DashboardIndex';
import { ReviewsIndex } from './pages/dashboards/ReviewsIndex';
import { SuggestionsIndex } from './pages/dashboards/SuggestionsIndex';
import { SettingsPage } from './pages/dashboards/SettingsPage';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardIndex />} />
                <Route path="reviews" element={<ReviewsIndex />} />
                <Route path="suggestions" element={<SuggestionsIndex />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
