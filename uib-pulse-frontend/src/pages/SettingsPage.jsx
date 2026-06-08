import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('uib_theme') || 'light');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('uib_notifications') !== 'false');
  const [language, setLanguage] = useState(() => localStorage.getItem('uib_language') || 'fr');

  const [pbiSettings, setPbiSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('uib_settings') || '{}');
  });

  const handlePbiChange = (key, value) => {
    const updated = { ...pbiSettings, [key]: value };
    setPbiSettings(updated);
    localStorage.setItem('uib_settings', JSON.stringify(updated));
  };

  useEffect(() => {
    localStorage.setItem('uib_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Dispatch event to sync theme in App.jsx if needed
    window.dispatchEvent(new Event('uib_theme_changed'));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('uib_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('uib_language', language);
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 w-full overflow-y-auto">
      <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>Paramètres</h2>
      
      <div className="bg-white dark:bg-noir-800 rounded-3xl p-8 border border-gray-200 dark:border-white/10 shadow-sm">
        
        {/* Apparence */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-uib-red">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            Apparence
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-noir-900 rounded-2xl border border-gray-200 dark:border-white/5">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Thème de l'application</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Basculer entre le mode clair et le mode sombre.</p>
            </div>
            <div className="flex bg-gray-200 dark:bg-noir-700 p-1 rounded-xl">
              <button 
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                Clair
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-noir-900 text-white shadow-sm border border-white/10' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                Sombre
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-uib-red">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Notifications
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-noir-900 rounded-2xl border border-gray-200 dark:border-white/5">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Alertes critiques</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recevoir des notifications lors d'incidents majeurs.</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 flex-shrink-0 ${notifications ? 'bg-uib-red' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <motion.div 
                layout
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: notifications ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Langue */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-uib-red">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Langue et Région
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-noir-900 rounded-2xl border border-gray-200 dark:border-white/5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Langue de l'interface</label>
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white dark:bg-noir-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:border-uib-red focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="fr">Français</option>
                <option value="en">Anglais (English)</option>
                <option value="ar">Arabe (العربية)</option>
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Power BI Configuration */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-uib-red">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Intégration Power BI
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-noir-900 rounded-2xl border border-gray-200 dark:border-white/5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">URL Vue Globale</label>
              <input type="text" value={pbiSettings.pbiUrlGlobal || ''} onChange={e => handlePbiChange('pbiUrlGlobal', e.target.value)} placeholder="https://app.powerbi.com/reportEmbed?..." className="w-full bg-white dark:bg-noir-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:border-uib-red focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">URL Dashboard DATA</label>
              <input type="text" value={pbiSettings.pbiUrlData || ''} onChange={e => handlePbiChange('pbiUrlData', e.target.value)} placeholder="https://app.powerbi.com/reportEmbed?..." className="w-full bg-white dark:bg-noir-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:border-uib-red focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">URL Dashboard Projets</label>
              <input type="text" value={pbiSettings.pbiUrlProjects || ''} onChange={e => handlePbiChange('pbiUrlProjects', e.target.value)} placeholder="https://app.powerbi.com/reportEmbed?..." className="w-full bg-white dark:bg-noir-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:border-uib-red focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">URL Dashboard Support</label>
              <input type="text" value={pbiSettings.pbiUrlSupport || ''} onChange={e => handlePbiChange('pbiUrlSupport', e.target.value)} placeholder="https://app.powerbi.com/reportEmbed?..." className="w-full bg-white dark:bg-noir-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:border-uib-red focus:outline-none transition-colors" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
