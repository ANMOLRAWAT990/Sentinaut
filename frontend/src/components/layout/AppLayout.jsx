import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="h-screen bg-slate-50 dark:bg-[#0d1117] flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="mx-auto max-w-7xl p-6 lg:p-8 flex-1 w-full">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
