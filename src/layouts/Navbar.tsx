import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchCode, setSearchCode] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      navigate(`/?search=${encodeURIComponent(searchCode.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Road Code (e.g. RD-NH44-0101)..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </form>
      </div>

      {/* Right: User and Sign Out */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-900">{user?.name || 'Administrator'}</span>
          <span className="text-[11px] text-slate-500">{user?.role || 'Super Admin'}</span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-md transition cursor-pointer flex items-center gap-1 text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
