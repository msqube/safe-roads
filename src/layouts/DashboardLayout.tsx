import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile header only (hidden on desktop lg:) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-800">SafeRoads NKDA</span>
        </div>

        <main className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden px-4 lg:px-6 py-4 bg-slate-50">
          <div className="w-full max-w-7xl mx-auto min-w-0 space-y-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

