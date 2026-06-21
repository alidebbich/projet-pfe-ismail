import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const dashboards = [
  {
    id: 'data',
    title: 'Dashboard DATA',
    desc: 'Indicateurs de qualité des données, anomalies et tendances sur 6 mois.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    tag: 'KPI-P10',
    route: '/dashboard/data',
    color: '#E2001A',
  },
  {
    id: 'projects-quality',
    title: 'Projets — Qualité',
    desc: 'Taux de détection des anomalies critiques avant mise en production.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tag: 'Qualité',
    route: '/dashboard/qualite',
    color: '#1C3A5E',
  },
  {
    id: 'projects-progress',
    title: 'Projets — Avancement',
    desc: 'Portefeuille projets DSI — déployés, en retard, annulés — par direction.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    tag: 'KPI-P2',
    route: '/dashboard/projects',
    color: '#E2001A',
  },
  {
    id: 'projects-adoption',
    title: 'Projets — Adoption',
    desc: 'Taux de déploiement et adoption par direction et par phase.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    tag: 'Adoption',
    route: '/dashboard/avancement',
    color: '#1C3A5E',
  },
  {
    id: 'support',
    title: 'Dashboard Support',
    desc: 'SLA E-Ticketing — tickets critiques clos en J+1 par niveau N1/N2.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    tag: 'KPI-D2',
    route: '/dashboard/support',
    color: '#E2001A',
  },
  {
    id: 'powerbi',
    title: 'Rapports Power BI',
    desc: 'Intégration native de vos rapports Power BI Desktop par direction.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    tag: 'Power BI',
    route: '/powerbi',
    color: '#1C3A5E',
  },
];

export default function GlobalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#A89E8C' }}>
          UIB Pulse
        </p>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Tableaux de <span style={{ color: '#E2001A' }}>Bord</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          Sélectionnez un tableau de bord pour commencer
        </p>
      </motion.div>

      {/* Dashboard cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((d, i) => (
          <motion.button
            key={d.id}
            onClick={() => navigate(d.route)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            className="text-left p-6 rounded-2xl border bg-white dark:bg-white/[0.03] transition-all duration-200 group"
            style={{ borderColor: '#DDD8CF' }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200"
              style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}22` }}
            >
              {d.icon}
            </div>

            {/* Tag */}
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block"
              style={{ background: `${d.color}12`, color: d.color }}
            >
              {d.tag}
            </span>

            {/* Title */}
            <h3
              className="font-bold text-gray-900 dark:text-white text-base mb-1.5 group-hover:text-[#E2001A] transition-colors duration-200"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {d.title}
            </h3>

            {/* Description */}
            <p className="text-xs leading-relaxed text-gray-500 dark:text-white/40">
              {d.desc}
            </p>

            {/* Arrow */}
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: d.color }}>
              Ouvrir
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
