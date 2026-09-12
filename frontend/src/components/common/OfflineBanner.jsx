import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium shadow-sm transition-all duration-300 flex items-center justify-center gap-2">
        <Wifi className="w-3.5 h-3.5" />
        <span>
          {language === 'hi'
            ? 'पुनः ऑनलाइन! लाइव डेटा और आवाज सेवाएं सक्रिय हैं।'
            : 'Back online! Live data and voice services active.'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-amber-300 text-xs py-1.5 px-4 text-center font-medium shadow-sm transition-all duration-300 flex items-center justify-center gap-2 border-b border-amber-500/30">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>
        {language === 'hi'
          ? 'आप वर्तमान में ऑफ़लाइन हैं। सहेजी गई प्रोफ़ाइल, अवसर व रोडमैप उपलब्ध हैं।'
          : 'You are currently offline. Cached profile, opportunities & roadmap remain available.'}
      </span>
    </div>
  );
}

export default OfflineBanner;
