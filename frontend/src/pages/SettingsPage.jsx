import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Globe,
  Volume2,
  Moon,
  Sun,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export function SettingsPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE' && deleteInput !== 'हटाएं') {
      setDeleteError(language === 'hi' ? 'कृपया पुष्टि करने के लिए "DELETE" या "हटाएं" लिखें।' : 'Please type "DELETE" to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await api.delete('/profile');
      if (res.data?.success) {
        logout();
        navigate('/');
      }
    } catch {
      setDeleteError(language === 'hi' ? 'खाता हटाने में त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-800/40 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <Settings className="w-6 h-6 text-amber-400" />
              <span>{language === 'hi' ? 'सेटिंग्स व प्राथमिकताएं' : 'Settings & Preferences'}</span>
            </h1>
            <p className="text-xs text-amber-200/80 mt-1">
              {language === 'hi'
                ? 'भाषा, वॉइस सहायक, थीम और PM-AJAY GIA डेटा गोपनीयता सेटिंग्स'
                : 'Configure language, voice assistant parameters, theme, and PM-AJAY data privacy'}
            </p>
          </div>
        </div>

        {/* Setting Groups */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {/* Language Selection */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>{language === 'hi' ? 'भाषा (Language)' : 'Preferred Language'}</span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'संवाद, वॉइस ऑनबोर्डिंग और कोर्स विवरण के लिए अपनी भाषा चुनें'
                  : 'Select interface and speech synthesis language'}
              </p>
            </div>

            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-900 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 transition shadow-sm"
            >
              <span>{language === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                ({language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'})
              </span>
            </button>
          </div>

          {/* Theme Mode */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{language === 'hi' ? 'थीम मोड (Theme Mode)' : 'Appearance Theme'}</span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'रात / दिन के लिए डार्क या लाइट व्यू का चयन करें'
                  : 'Toggle high-contrast dark mode or clean light mode'}
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <span>{isDark ? (language === 'hi' ? 'दिन का दृश्य (Light)' : 'Light Mode') : (language === 'hi' ? 'रात का दृश्य (Dark)' : 'Dark Mode')}</span>
            </button>
          </div>

          {/* Voice Assistant Auto-Readout */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                <Volume2 className="w-4 h-4 text-amber-500" />
                <span>{language === 'hi' ? 'वॉइस सहायक गति व पिच' : 'Speech Synthesis Rate'}</span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'हिंदी व अंग्रेजी में सहायक के बोलने की स्पष्टता'
                  : 'Native browser Web Speech API vocal response parameters'}
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              1.0x (Standard Hindi-IN)
            </div>
          </div>

          {/* Data Privacy & Consent */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{language === 'hi' ? 'PM-AJAY GIA डेटा सहमति' : 'PM-AJAY GIA Data Consent'}</span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'कौशल प्रशिक्षण व टूल-किट अनुदान सत्यापन के लिए सहमति सक्रिय है'
                  : 'Active data processing consent granted under Ministry GIA regulations'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सहमति दर्ज' : 'Consent Active'}</span>
            </div>
          </div>

          {/* Danger Zone: Account Deletion (Section 5) */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-sm text-rose-600 dark:text-rose-400">
              <Trash2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'खाता व डेटा विलोपन (Danger Zone)' : 'Account & Data Deletion'}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'यदि आप अपना JeevanVaani खाता हटाते हैं, तो आपकी प्रोफ़ाइल, वॉइस ऑनबोर्डिंग उत्तर, कौशल मैपिंग और सभी आवेदन स्थायी रूप से हटा दिए जाएंगे।'
                : 'Permanently remove your beneficiary account, profile records, and active application references.'}
            </p>

            {deleteConfirmOpen ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>
                    {language === 'hi'
                      ? 'पुष्टि करने के लिए नीचे "DELETE" लिखें:'
                      : 'Type "DELETE" below to confirm permanent removal:'}
                  </span>
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="DELETE"
                  className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-slate-900 dark:text-white"
                />
                {deleteError && <p className="text-[11px] text-rose-600 font-bold">{deleteError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setDeleteConfirmOpen(false); setDeleteInput(''); setDeleteError(null); }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    {isDeleting ? 'Deleting...' : (language === 'hi' ? 'स्थायी रूप से हटाएं' : 'Permanently Delete')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'खाता हटाएं' : 'Delete Account'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
