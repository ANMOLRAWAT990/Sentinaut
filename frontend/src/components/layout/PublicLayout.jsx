import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../context/AuthContext';

export function PublicLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0d1117]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
