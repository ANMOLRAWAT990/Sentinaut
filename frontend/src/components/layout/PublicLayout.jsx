import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#0d1117] overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
