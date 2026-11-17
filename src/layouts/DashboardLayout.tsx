import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
      <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              <div className="max-w-7xl mx-auto space-y-6">
                <Outlet />
              </div>
            </main>
        </div>
      </div>
      );
};
