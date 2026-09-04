import React from 'react';
import { ShieldCheck, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { language, t, tSector } = useLanguage();

  const footerSectors = [
    'Solar / Green Jobs',
    'Construction & Electrical',
    'Healthcare',
    'IT / ITeS',
    'Automotive',
    'Apparel & Handicrafts (Self-Employment)'
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Govt Initiative */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                JV
              </div>
              <h3 className="text-white font-bold text-lg tracking-tight">
                {language === 'hi' ? 'जीवनवाणी | JeevanVani' : 'JeevanVani | जीवनवाणी'}
              </h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              {t.footer.brandDesc}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t.footer.ministry}</span>
            </div>
          </div>

          {/* Col 2: Key NSQF Sectors */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {t.footer.sectorsTitle}
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              {footerSectors.map((sec, idx) => (
                <li key={idx}>• {tSector(sec)}</li>
              ))}
            </ul>
          </div>

          {/* Col 3: Helpline & Beneficiary Support */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {t.footer.supportTitle}
            </h4>
            <p className="text-xs text-slate-400">
              {t.footer.tollFreeText}
            </p>
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{t.footer.tollFreeNum}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {t.footer.hours}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>{t.footer.rights}</p>
        <p className="flex items-center gap-1">
          {t.footer.accessibilityNote}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
