import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Mic,
  Compass,
  Award,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Globe,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Briefcase
} from 'lucide-react';


export function Navbar({ isDemoActive, onToggleDemo }) {
  const { user, logout, isAdmin } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/', icon: Compass },
    { name: t('nav.dashboard', 'My Dashboard'), path: '/dashboard', icon: LayoutDashboard, authOnly: true },
    { name: t('nav.assessment', 'Voice Assessment'), path: '/assessment', icon: Mic, highlight: true },
    { name: t('nav.skillGap', 'Skill Gaps'), path: '/skill-gap', icon: Award, authOnly: true },
    { name: t('nav.courses', 'Courses'), path: '/courses', icon: BookOpen },
    { name: t('nav.jobs', 'Jobs'), path: '/jobs', icon: Briefcase },
    { name: t('nav.roadmap', 'Career Roadmap'), path: '/roadmap', icon: TrendingUp, authOnly: true },
    { name: t('nav.careerPath', 'Career Ladder'), path: '/career-path', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Top Govt Bar with Indian Geometric Top Border */}
      <div className="motif-top-border" />
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-terracotta-400 animate-ping" />
          <span className="font-bold tracking-wide text-white">{t('topBar.tag', 'PM-AJAY (Grant-in-Aid Component)')}</span>
          <span className="hidden md:inline text-slate-400">| {t('topBar.sub', 'Ministry of Social Justice & Empowerment, Govt. of India')}</span>
        </div>
        <div className="flex items-center gap-2.5">
          {/* SIH Demo Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDemo}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition border ${
              isDemoActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/30 animate-pulse-slow'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title="Toggle SIH 2026 Presentation Demo Mode"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isDemoActive ? 'Demo Active' : 'Demo Mode'}</span>
          </button>

          {/* Theme Day/Night Toggle Button */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition text-xs border border-slate-700 shadow-sm"
            title={isDark ? 'Switch to Light View (दिन)' : 'Switch to Dark View (रात)'}
          >
            {isDark ? (
              <>
                <Sun className="w-3 h-3 text-amber-300" />
                <span className="text-[10px] text-amber-200">{language === 'hi' ? 'दिन' : 'Day'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-indigo-300" />
                <span className="text-[10px] text-indigo-200">{language === 'hi' ? 'रात' : 'Night'}</span>
              </>
            )}
          </button>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold transition text-xs shadow-sm border border-terracotta-500"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('topBar.switchLang', 'हिंदी')}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 flex items-center justify-center text-white font-bold shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition">
                  {t('nav.brand', 'JeevanVaani')}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-terracotta-100 dark:bg-terracotta-950 text-terracotta-800 dark:text-terracotta-300 font-extrabold uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 hidden sm:block">
                {t('nav.subBrand', 'PM-AJAY GIA Skilling Assistant')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authOnly && !user) return null;
              const Icon = link.icon;
              const active = location.pathname === link.path;

              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-terracotta-500 to-amber-500 hover:from-terracotta-600 hover:to-amber-600 text-white font-bold text-xs shadow-sm shadow-terracotta-500/20 transition mx-1"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-terracotta-50 dark:bg-slate-800 text-terracotta-700 dark:text-terracotta-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Admin Portal Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  location.pathname === '/admin'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                    : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{t('nav.adminPortal', 'Admin Portal')}</span>
              </Link>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-terracotta-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
                      {user.name?.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] text-terracotta-600 dark:text-terracotta-400 font-semibold uppercase">
                      {user.role || 'Beneficiary'}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  title={t('nav.logout', 'Sign Out')}
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {t('nav.login', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-terracotta-500 hover:bg-slate-800 dark:hover:bg-terracotta-600 text-white shadow-sm transition"
                >
                  {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            if (link.authOnly && !user) return null;
            const Icon = link.icon;
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-terracotta-50 dark:bg-slate-800 text-terracotta-700 dark:text-terracotta-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('nav.adminPortal', 'Admin Portal')}</span>
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout', 'Sign Out')}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white"
                >
                  {t('nav.login', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl text-sm font-bold bg-terracotta-500 text-white shadow"
                >
                  {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
