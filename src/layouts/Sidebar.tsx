import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CalendarClock,
  LogOut,
  Route,
  FileText,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeClass?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    {
      to: '/',
      label: 'GIS Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      // badge: 'Live',
    },
    {
      to: '/survey',
      label: 'Drone Survey Report',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: '65',
    },
    {
      to: '/scheduler',
      label: 'Lane Scheduler',
      icon: <CalendarClock className="w-4 h-4" />,
    },
    {
      to: '/dpr/MAR-1111',
      label: 'DPR & Tender Release',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      to: '/progress',
      label: 'Progress Report',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: 'Targets',
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-60 shrink-0 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">
              SafeRoads
            </h1>
            <p className="text-[11px] text-slate-500">Pothole Surveillance</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Menu
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <span className={item.to === window.location.pathname ? 'text-blue-600' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.2 text-[10px] font-medium rounded ${item.badgeClass || 'bg-slate-200 text-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user?.role || 'Administrator'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200 rounded transition cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
