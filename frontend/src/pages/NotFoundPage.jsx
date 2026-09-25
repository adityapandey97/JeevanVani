import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function NotFoundPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <p className="text-4xl font-black text-amber-600 dark:text-amber-500 tracking-tight">404</p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'hi' ? 'पृष्ठ नहीं मिला' : 'Page Not Found'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {language === 'hi'
              ? 'आप जिस पृष्ठ को खोज रहे हैं वह मौजूद नहीं है या हटा दिया गया है।'
              : 'The vocational page or skilling resource you are looking for does not exist or has been moved.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Go Home'}</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'My Dashboard'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
