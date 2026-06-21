import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, suffix = '') {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const isDecimal = String(target).includes('.');
    const numericTarget = parseFloat(target);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * ease;
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, sublabel, color = '#E20032', delay = 0 }) {
  const { count, ref } = useCountUp(value, 2200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] backdrop-blur-md transition-colors duration-300"
    >
      <div
        className="text-4xl font-black tracking-tight mb-1"
        style={{ color, fontFamily: "'Outfit', sans-serif" }}
      >
        {count}{suffix}
      </div>
      <div className="text-gray-900 dark:text-white font-semibold text-sm mb-0.5 transition-colors duration-300">{label}</div>
      {sublabel && <div className="text-xs text-gray-500 dark:text-white/40 transition-colors duration-300">{sublabel}</div>}
    </motion.div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, badge, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-2xl cursor-default bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.07] backdrop-blur-md transition-colors duration-300"
    >
      {/* hover red glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(226,0,50,0.08), transparent 70%)' }}
      />
      {badge && (
        <span
          className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(226,0,50,0.15)', color: '#E20032', border: '1px solid rgba(226,0,50,0.2)' }}
        >
          {badge}
        </span>
      )}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ background: 'rgba(226,0,50,0.1)', border: '1px solid rgba(226,0,50,0.15)' }}
      >
        {icon}
      </div>
      <h3 className="text-gray-900 dark:text-white font-bold text-base mb-2 transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-white/50 transition-colors duration-300">
        {description}
      </p>
    </motion.div>
  );
}

// ── Hero noise texture ────────────────────────────────────────────────────────
const noiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
};

// ════════════════════════════════════════════════════════════════════════════
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const onEnterDashboard = () => navigate('/dashboard');
  const [hoverCTA, setHoverCTA] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('uib_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('uib_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const stats = [
    { value: 1964, suffix: '', label: 'Année de création', sublabel: 'Banque universelle tunisienne', color: '#E20032', delay: 0 },
    { value: 147, suffix: '', label: 'Points de vente', sublabel: 'Couvrant tout le territoire', color: '#60A5FA', delay: 0.1 },
    { value: 1433, suffix: '+', label: 'Collaborateurs', sublabel: '84% de taux d\'encadrement', color: '#34D399', delay: 0.2 },
    { value: 542, suffix: ' MTND', label: 'PNB 2024', sublabel: '+4,3% vs 2023', color: '#F59E0B', delay: 0.3 },
    { value: 6859.9, suffix: ' MTND', label: 'Dépôts clientèle', sublabel: '+9,1% vs 2023', color: '#A78BFA', delay: 0.4 },
    { value: 8301.8, suffix: ' MTND', label: 'Total bilan consolidé', sublabel: 'Exercice 2024', color: '#E20032', delay: 0.5 },
  ];

  const features = [
    {
      icon: '📊',
      title: 'Tableau de bord KPI',
      description: 'Visualisez en temps réel KPI-P2 (Déploiement), KPI-D2 (SLA), KPI-P10 (Qualité) avec des indicateurs "feux tricolores" selon le CDC UIB.',
      badge: 'Live',
      delay: 0,
    },
    {
      icon: '🎫',
      title: 'SLA E-Ticketing',
      description: 'Suivi des tickets critiques clos en J+1 par niveau (N1/N2). Calcul automatique du taux SLA avec décomposition par direction.',
      badge: 'KPI-D2',
      delay: 0.08,
    },
    {
      icon: '🚀',
      title: 'Taux de Déploiement',
      description: 'Pilotez le portefeuille projets DSI — projets déployés, en retard, annulés — par direction et par phase avec alertes automatiques.',
      badge: 'KPI-P2',
      delay: 0.16,
    },
    {
      icon: '🔍',
      title: 'Qualité & Anomalies',
      description: 'Mesurez le taux de détection des anomalies critiques avant mise en production. Tendance sur 6 mois et historique Power Query.',
      badge: 'KPI-P10',
      delay: 0.24,
    },
    {
      icon: '📈',
      title: 'Rapports Power BI',
      description: 'Intégration native de vos rapports Power BI Desktop. ETL M Language prêt à l\'emploi pour Oracle, MySQL et sources Excel.',
      badge: 'Vous',
      delay: 0.32,
    },
    {
      icon: '🔐',
      title: 'Sécurité & Audit',
      description: 'JWT + Spring Security avec rôles MANAGER / ADMIN. Piste d\'audit complète : qui a fait quoi, quand et depuis quelle IP.',
      delay: 0.40,
    },
  ];

  const directions = ['DSI', 'DCR', 'DRM', 'DOSI'];

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Noise overlay ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30" style={noiseStyle} />

      {/* ── Ambient glows ──────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(226,0,50,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-white/[0.06] backdrop-blur-xl transition-colors duration-300"
      >
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
          title="Retour en haut"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white border border-gray-200 dark:border-white/10 group-hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="UIB Logo" className="w-full h-full object-cover scale-[1.3]" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="hidden w-full h-full bg-uib-red items-center justify-center">
              <span className="text-white font-black text-sm tracking-tight">UIB</span>
            </div>
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-sm transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
              UIB <span style={{ color: '#E20032' }}>Pulse</span>
            </span>
            <p className="text-xs text-gray-500 dark:text-white/30 transition-colors duration-300" style={{ lineHeight: 1 }}>Performance Bancaire</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-white/50 transition-colors duration-300">
          <a href="#about" className="hover:text-gray-900 dark:hover:text-white transition-colors">À propos</a>
          <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Modules</a>
          <a href="#stats" className="hover:text-gray-900 dark:hover:text-white transition-colors">Chiffres clés</a>
          <a href="#directions" className="hover:text-gray-900 dark:hover:text-white transition-colors">Directions</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="hidden md:flex p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {/* CTA */}
          <motion.button
            onClick={onEnterDashboard}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#E20032', boxShadow: '0 0 24px rgba(226,0,50,0.3)' }}
          >
            Accéder au Tableau de Bord
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-24 pb-20 px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{
            background: 'rgba(226,0,50,0.1)',
            border: '1px solid rgba(226,0,50,0.2)',
            color: '#E20032',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Union Internationale de Banques — Outil Interne DSI
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-[1.05]"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          UIB <span style={{ color: '#E20032' }}>Pulse</span>
          <br />
          <span
            className="text-4xl md:text-5xl font-bold text-gray-500 dark:text-white/50 transition-colors duration-300"
          >
            Tableau de Bord Performance
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-gray-600 dark:text-white/50 transition-colors duration-300"
        >
          Pilotez en temps réel les indicateurs de performance des directions DSI, DCR, DRM et DOSI
          de l'UIB — avec alertes automatiques, audit complet et intégration Power BI.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={onEnterDashboard}
            onHoverStart={() => setHoverCTA(true)}
            onHoverEnd={() => setHoverCTA(false)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 48px rgba(226,0,50,0.45)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base"
            style={{ background: '#E20032', boxShadow: '0 0 32px rgba(226,0,50,0.3)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Ouvrir le Dashboard
            <AnimatePresence>
              {hoverCTA && (
                <motion.svg
                  key="arrow"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"
                >
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.a
            href="https://www.uib.com.tn"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-colors duration-300 text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 dark:text-white/70 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:shadow-none"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            UIB.com.tn
          </motion.a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-2 text-gray-400 dark:text-white/25 transition-colors duration-300"
        >
          <span className="text-xs font-mono">Découvrir</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── ABOUT UIB ──────────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-start gap-8 rounded-3xl p-8 md:p-12 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.07] transition-colors duration-300"
          >
            {/* UIB identity block */}
            <div className="flex-1">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6"
                style={{ background: 'rgba(226,0,50,0.1)', border: '1px solid rgba(226,0,50,0.2)', color: '#E20032' }}
              >
                À propos de l'UIB
              </div>
              <h2
                className="text-3xl font-black mb-4"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                La banque universelle <br />
                <span style={{ color: '#E20032' }}>tunisienne depuis 1964</span>
              </h2>
              <p className="text-sm leading-relaxed mb-6 text-gray-600 dark:text-white/50 transition-colors duration-300">
                Créée en 1964, l'Union Internationale de Banques (UIB) est un acteur incontournable
                du paysage bancaire tunisien. Privatisée en 2002, filiale du groupe{' '}
                <strong className="text-gray-900 dark:text-white transition-colors duration-300">Société Générale</strong> (52,34%), l'UIB est une
                banque universelle cotée à la Bourse de Tunis depuis 1996.
              </p>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-white/50 transition-colors duration-300">
                Avec <strong className="text-gray-900 dark:text-white transition-colors duration-300">147 points de vente</strong> répartis sur tout
                le territoire, l'UIB offre une gamme complète de services aux particuliers,
                professionnels, PME et grandes entreprises, appuyée par des solutions digitales
                innovantes : <strong className="text-gray-900 dark:text-white transition-colors duration-300">UIBnet</strong>,{' '}
                <strong className="text-gray-900 dark:text-white transition-colors duration-300">UIB Mobile</strong>,{' '}
                <strong className="text-gray-900 dark:text-white transition-colors duration-300">MyBusiness</strong> et{' '}
                <strong className="text-gray-900 dark:text-white transition-colors duration-300">Tap'n'Pay</strong>.
              </p>
            </div>

            {/* Quick facts */}
            <div className="hidden lg:flex flex-col gap-3 min-w-[220px]">
              {[
                { label: 'Fondée en', value: '1964' },
                { label: 'Groupe', value: 'Société Générale' },
                { label: 'Cotée à', value: 'Bourse de Tunis' },
                { label: 'Filiales', value: 'SICAR · Finance · IRC' },
                { label: 'Contact', value: '81 10 25 25' },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex justify-between items-center px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] transition-colors duration-300"
                >
                  <span className="text-gray-500 dark:text-white/40 transition-colors duration-300">{f.label}</span>
                  <span className="text-gray-900 dark:text-white font-semibold transition-colors duration-300">{f.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section id="stats" className="relative z-10 px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60A5FA' }}
            >
              Chiffres clés — Exercice 2024
            </div>
            <h2
              className="text-3xl font-black"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              UIB en chiffres
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs mt-6 text-gray-400 dark:text-white/25 transition-colors duration-300"
          >
            Sources: Rapports financiers UIB 2024 — BVMT — uib.com.tn
          </motion.p>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(226,0,50,0.1)', border: '1px solid rgba(226,0,50,0.2)', color: '#E20032' }}
            >
              Modules UIB Pulse
            </div>
            <h2
              className="text-3xl font-black mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/40 transition-colors duration-300">
              Un outil complet pour piloter la performance des projets et services IT de l'UIB
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── DIRECTIONS ─────────────────────────────────────────────────── */}
      <section id="directions" className="relative z-10 px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 text-center relative overflow-hidden border border-gray-200 dark:border-uib-red/12 bg-white dark:bg-transparent transition-colors duration-300"
          >
            <div className="absolute inset-0 dark:bg-[linear-gradient(135deg,rgba(226,0,50,0.06)_0%,rgba(10,10,10,0)_60%)] pointer-events-none" />
            <h2
              className="text-2xl font-black mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Couverture par direction
            </h2>
            <p className="text-sm mb-8 text-gray-500 dark:text-white/40 relative z-10 transition-colors duration-300">
              UIB Pulse couvre les 4 directions IT stratégiques de l'UIB
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { code: 'DSI', label: 'Direction Systèmes d\'Information', icon: '💻' },
                { code: 'DCR', label: 'Direction Conformité & Risques', icon: '🛡️' },
                { code: 'DRM', label: 'Direction des Ressources et Moyens', icon: '⚙️' },
                { code: 'DOSI', label: 'Direction Organisation & SI', icon: '🏗️' },
              ].map((d, i) => (
                <motion.div
                  key={d.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className="p-5 rounded-2xl text-center bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.07] transition-colors duration-300 relative z-10"
                >
                  <div className="text-3xl mb-2">{d.icon}</div>
                  <div
                    className="font-black text-lg mb-1"
                    style={{ color: '#E20032', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {d.code}
                  </div>
                  <div className="text-xs leading-tight text-gray-500 dark:text-white/40 transition-colors duration-300">
                    {d.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={onEnterDashboard}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(226,0,50,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-xl text-white font-bold text-base relative z-10"
              style={{ background: '#E20032', boxShadow: '0 0 24px rgba(226,0,50,0.25)' }}
            >
              Accéder au Tableau de Bord →
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer
        className="relative z-10 px-8 py-10 mt-8 border-t border-gray-200 dark:border-white/[0.06] transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
              style={{ background: '#E20032' }}
            >
              UIB
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white transition-colors duration-300">UIB Pulse — Outil Interne DSI</p>
              <p className="text-xs text-gray-500 dark:text-white/30 transition-colors duration-300">
                © {new Date().getFullYear()} Union Internationale de Banques — Société Générale Group
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-white/30 transition-colors duration-300">
            <span>UIB Contact: 81 10 25 25</span>
            <span>·</span>
            <span>UIB Standard: 81 10 20 20</span>
            <span>·</span>
            <a
              href="https://www.uib.com.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              uib.com.tn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
