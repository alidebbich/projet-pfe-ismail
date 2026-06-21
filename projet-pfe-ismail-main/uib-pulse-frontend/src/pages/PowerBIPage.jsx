import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TABS = [
  { key: 'pbiUrlGlobal',   label: 'Vue Globale',  icon: '📊' },
  { key: 'pbiUrlData',     label: 'DATA',          icon: '🗄️' },
  { key: 'pbiUrlProjects', label: 'Projets',       icon: '🚀' },
  { key: 'pbiUrlSupport',  label: 'Support',       icon: '🎫' },
];

function SetupGuide({ onGoSettings }) {
  const steps = [
    {
      n: 1,
      title: 'Ouvrir Power BI Service',
      desc: 'Allez sur app.powerbi.com et connectez-vous avec votre compte Microsoft.',
    },
    {
      n: 2,
      title: 'Publier le fichier .pbix',
      desc: 'Dans Power BI Desktop → Accueil → Publier. Choisissez "Mon espace de travail".',
    },
    {
      n: 3,
      title: 'Obtenir le lien "Publier sur le web"',
      desc: 'Dans Power BI Service : ouvrez le rapport → Fichier → Incorporer le rapport → Publier sur le web (public). Copiez l\'URL iframe.',
    },
    {
      n: 4,
      title: 'Coller l\'URL dans les Paramètres',
      desc: 'Admin → Paramètres → Intégration Power BI → collez l\'URL dans le champ correspondant.',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-3xl mx-auto mb-4">
            📡
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Rapport Power BI non configuré
          </h3>
          <p className="text-gray-500 dark:text-white/50 text-sm">
            Suivez ces étapes pour connecter votre rapport Power BI au tableau de bord.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((s) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: s.n * 0.1 }}
              className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
            >
              <div className="w-8 h-8 rounded-xl bg-[#E20032]/10 border border-[#E20032]/20 flex items-center justify-center text-[#E20032] font-black text-sm flex-shrink-0">
                {s.n}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">{s.title}</p>
                <p className="text-gray-500 dark:text-white/50 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onGoSettings}
          className="w-full bg-[#E20032] hover:bg-[#C8002D] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Aller aux Paramètres Power BI
        </button>
      </div>
    </div>
  );
}

export default function PowerBIPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pbiUrlGlobal');
  const [urls, setUrls] = useState({});

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('uib_settings') || '{}');
    // Fall back to env variable for global view if not manually configured
    if (!settings.pbiUrlGlobal && import.meta.env.VITE_POWERBI_EMBED_URL) {
      settings.pbiUrlGlobal = import.meta.env.VITE_POWERBI_EMBED_URL;
    }
    setUrls(settings);
  }, []);

  const activeUrl = urls[activeTab];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Power BI
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/50">Rapports interactifs — UIB Pulse</p>
          </div>
          <button
            onClick={() => navigate('/admin/settings')}
            title="Configurer les URLs Power BI"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-white/60 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:text-[#E20032] hover:border-[#E20032]/30 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurer
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const hasUrl = !!urls[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#E20032] text-white shadow-sm'
                    : 'text-gray-600 dark:text-white/60 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {hasUrl && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.key ? 'bg-white/60' : 'bg-green-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeUrl ? (
          <iframe
            key={activeTab}
            src={activeUrl}
            title={TABS.find(t => t.key === activeTab)?.label}
            className="w-full h-full border-0"
            allowFullScreen
          />
        ) : (
          <SetupGuide onGoSettings={() => navigate('/admin/settings')} />
        )}
      </div>
    </div>
  );
}
