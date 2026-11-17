import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/authService';
import {
  Route,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('admin@saferoads.ai');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    try {
      await login({ email: email.trim(), password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin123');
    try {
      await login({ email: demoEmail, rememberMe: true });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-md p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Route className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">SafeRoads</h2>
          <p className="text-xs text-slate-500">
            Road Pothole Surveillance System
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <p className="text-[11px] text-slate-500 text-center font-medium">Quick Demo Sign In:</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(DEMO_USERS).map(([key, demoUser]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleQuickLogin(key)}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-center text-[11px] font-medium text-slate-700 transition cursor-pointer"
              >
                {demoUser.role.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
