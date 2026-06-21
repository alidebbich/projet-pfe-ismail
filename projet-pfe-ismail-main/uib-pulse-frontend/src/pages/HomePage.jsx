import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';

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
      className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#DDD8CF] dark:border-white/[0.07] transition-colors duration-300"
    >
      <div
        className="text-4xl font-black tracking-tight mb-1"
        style={{ color, fontFamily: "'Outfit', sans-serif" }}
      >
        {count}{suffix}
      </div>
      <div className="text-gray-900 dark:text-white font-semibold text-sm mb-0.5 transition-colors duration-300">{label}</div>
      {sublabel && <div className="text-xs transition-colors duration-300" style={{ color: '#A89E8C' }}>{sublabel}</div>}
    </motion.div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-xl cursor-default bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-white/[0.12] transition-all duration-200"
    >
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

export default function HomePage() {
  const navigate = useNavigate();
  const hasSession = typeof window !== 'undefined' && !!localStorage.getItem('uib_token');

  // ── Auth panel state ───────────────────────────────────────────────────────
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('manager');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [saveId, setSaveId] = useState(false);

  const onEnterDashboard = () => {
    if (hasSession) navigate('/dashboard');
    else setAuthOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await authAPI.login(authUsername, authPassword);
      const { token, role, fullName, username: u } = res.data;
      localStorage.setItem('uib_token', token);
      localStorage.setItem('uib_role', role);
      localStorage.setItem('uib_username', u || authUsername);
      localStorage.setItem('uib_user', JSON.stringify({ username: u || authUsername, role, fullName }));
      if (saveId) localStorage.setItem('uib_saved_id', authUsername);
      window.location.href = '/dashboard';
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Identifiants invalides ou erreur serveur.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await authAPI.googleLogin(credentialResponse.credential);
      const { token, role, fullName, username: u } = res.data;
      localStorage.setItem('uib_token', token);
      localStorage.setItem('uib_role', role);
      localStorage.setItem('uib_username', u);
      localStorage.setItem('uib_user', JSON.stringify({ username: u, role, fullName }));
      window.location.href = '/dashboard';
    } catch {
      setAuthError('Erreur lors de la connexion Google.');
    } finally {
      setAuthLoading(false);
    }
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('uib_theme') || 'light');

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
    { value: 147, suffix: '', label: 'Points de vente', sublabel: 'Couvrant tout le territoire', color: '#E2001A', delay: 0 },
    { value: 1433, suffix: '+', label: 'Collaborateurs', sublabel: '84% de taux d\'encadrement', color: '#1C3A5E', delay: 0.1 },
    { value: 542, suffix: ' MTND', label: 'PNB 2024', sublabel: '+4,3% vs 2023', color: '#E2001A', delay: 0.2 },
    { value: 6859.9, suffix: ' MTND', label: 'Dépôts clientèle', sublabel: '+9,1% vs 2023', color: '#1C3A5E', delay: 0.3 },
    { value: 8301.8, suffix: ' MTND', label: 'Total bilan consolidé', sublabel: 'Exercice 2024', color: '#E2001A', delay: 0.4 },
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
      className="min-h-screen bg-ivory dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      {/* ── HEADER — same style as dashboard ──────────────────────────── */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 h-16 border-b border-[#DDD8CF] dark:border-white/[0.06] bg-white/95 dark:bg-[#0A0A0A]/90 backdrop-blur-sm transition-colors duration-300">

        {/* Left — logo + title */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-white/30 font-medium mb-0.5">
            <span>UIB Pulse</span>
            <span>/</span>
            <span style={{ color: '#E2001A' }}>Accueil</span>
          </div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Accueil
          </h1>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-3">

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />

          {hasSession ? (
            <>
              {/* User info */}
              {(() => {
                const u = (() => { try { return JSON.parse(localStorage.getItem('uib_user') || '{}'); } catch { return {}; } })();
                const roleLabel = u.role === 'ROLE_ADMIN' ? 'Administrateur' : 'Manager';
                const roleColor = u.role === 'ROLE_ADMIN' ? '#1C3A5E' : '#E2001A';
                const roleBg    = u.role === 'ROLE_ADMIN' ? 'rgba(28,58,94,0.1)' : 'rgba(226,0,26,0.1)';
                return (
                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {u.fullName || u.username || 'Utilisateur'}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: roleBg, color: roleColor }}>
                        {roleLabel}
                      </span>
                    </div>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u?.username || 'user')}&backgroundColor=e20032`}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border-2 border-gray-100 dark:border-white/10 object-cover bg-gray-100"
                    />
                  </div>
                );
              })()}

              <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />

              {/* Go to dashboard */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-uib-red hover:bg-red-700 transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span className="hidden sm:inline">Tableau de Bord</span>
              </button>

              {/* Logout */}
              <button
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                title="Se déconnecter"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-white/50 hover:text-uib-red hover:bg-red-50 dark:hover:bg-uib-red/10 border border-transparent hover:border-red-100 dark:hover:border-uib-red/20 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          ) : (
            /* Not logged in — just a login button */
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-uib-red hover:bg-red-700 transition-colors duration-200 shadow-sm"
            >
              Se connecter
            </button>
          )}
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-24 pb-20 px-8 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 transition-colors duration-300"
          style={{ color: '#A89E8C' }}
        >
          Union Internationale de Banques · Outil Interne
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-5 leading-[1.05] text-gray-900 dark:text-white transition-colors duration-300"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Pilotage de la <span style={{ color: '#E2001A' }}>Performance</span>
          <br />
          <span className="text-gray-900 dark:text-white">des Projets Bancaires</span>
        </motion.h1>



        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={onEnterDashboard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-8 py-4 rounded-lg text-white font-semibold text-base bg-uib-red hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Accéder au Tableau de Bord
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

        {/* Discover button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C8C0B0] dark:border-white/20 text-gray-600 dark:text-white/60 text-sm font-medium hover:border-uib-red hover:text-uib-red dark:hover:border-uib-red dark:hover:text-uib-red transition-all duration-200"
          >
            Découvrir
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </a>
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
            className="flex items-start gap-8 rounded-3xl p-8 md:p-12 bg-white dark:bg-white/[0.02] border border-[#DDD8CF] dark:border-white/[0.07] transition-colors duration-300"
          >
            {/* UIB identity block */}
            <div className="flex-1">
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
                  className="flex justify-between items-center px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-white/[0.04] border border-[#DDD8CF] dark:border-white/[0.06] transition-colors duration-300"
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
            <h2
              className="text-3xl font-black"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              UIB en chiffres
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

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
                  className="p-5 rounded-2xl text-center bg-white dark:bg-white/[0.03] border border-[#DDD8CF] dark:border-white/[0.07] transition-colors duration-300 relative z-10"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 rounded-lg text-white font-semibold text-base relative z-10 bg-uib-red hover:bg-red-700 transition-colors duration-200 shadow-md"
            >
              Accéder au Tableau de Bord
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer
        id="footer-contact"
        className="relative z-10 px-8 py-10 mt-8 border-t border-[#DDD8CF] dark:border-white/[0.06] transition-colors duration-300"
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

      {/* ── AUTH SIDEBAR PANEL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {authOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ background: 'rgba(28,58,94,0.18)', backdropFilter: 'blur(4px)' }}
              className="fixed inset-0 z-40"
              onClick={() => setAuthOpen(false)}
            />

            {/* Slide panel — ivory/white, matches homepage */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ background: '#F7F4EF', borderLeft: '1px solid #DDD8CF' }}
              className="fixed right-0 top-0 h-full w-full max-w-[400px] z-50 flex flex-col overflow-y-auto shadow-2xl"
            >
              {/* Top red accent bar */}
              <div className="h-1 w-full bg-uib-red flex-shrink-0" />

              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: '#DDD8CF' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="UIB" className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                    <div className="hidden w-8 h-8 bg-uib-red rounded-md items-center justify-center">
                      <span className="text-white font-black text-xs">UIB</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    UIB <span style={{ color: '#E2001A' }}>Pulse</span>
                  </span>
                </div>
                <button
                  onClick={() => setAuthOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-[#EDE9E1] transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Profile selector */}
              <div className="px-6 pt-5 pb-4 flex-shrink-0">
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">
                  Votre espace
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'manager', label: 'Manager', desc: 'Projets & KPI', hint: 'Dashboards · Export · Supervision' },
                    { id: 'admin', label: 'Administrateur', desc: 'Système & Audit', hint: 'Utilisateurs · Audit · Paramètres' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfile(p.id)}
                      className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-center transition-all duration-200"
                      style={selectedProfile === p.id
                        ? { borderColor: '#E2001A', background: '#fff', color: '#1a1a1a', boxShadow: '0 1px 6px rgba(226,0,26,0.12)' }
                        : { borderColor: '#DDD8CF', background: '#EDE9E1', color: '#6b7280' }
                      }
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200"
                        style={selectedProfile === p.id
                          ? { borderColor: '#E2001A', background: 'rgba(226,0,26,0.07)' }
                          : { borderColor: '#C8C0B0', background: '#F7F4EF' }
                        }
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"
                          style={{ color: selectedProfile === p.id ? '#E2001A' : '#9ca3af' }}>
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-sm block">{p.label}</span>
                        <span className="text-xs opacity-60">{p.desc}</span>
                        <span className="block text-[10px] mt-1 leading-tight" style={{ color: selectedProfile === p.id ? '#A89E8C' : '#C8C0B0' }}>{p.hint}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login form — seamlessly on ivory background */}
              <div className="px-6 pb-6 flex-1 flex flex-col">
                <div className="mb-5">
                  <h2 className="font-bold text-gray-900 text-xl mb-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Connexion
                  </h2>
                  <p className="text-gray-500 text-xs">Accédez à votre espace UIB Pulse</p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 flex-1">
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1.5">Identifiant</label>
                    <input
                      type="text"
                      required
                      placeholder="Identifiant ou e-mail"
                      style={{ background: '#fff', borderColor: '#DDD8CF' }}
                      className="w-full border rounded-lg px-4 py-2.5 text-gray-900 text-sm outline-none focus:border-uib-red transition-colors placeholder:text-gray-300"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-semibold mb-1.5">Mot de passe</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      style={{ background: '#fff', borderColor: '#DDD8CF' }}
                      className="w-full border rounded-lg px-4 py-2.5 text-gray-900 text-sm outline-none focus:border-uib-red transition-colors"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="save-id"
                      type="checkbox"
                      checked={saveId}
                      onChange={(e) => setSaveId(e.target.checked)}
                      className="w-4 h-4 rounded accent-uib-red"
                      style={{ borderColor: '#DDD8CF' }}
                    />
                    <label htmlFor="save-id" className="text-gray-500 text-xs cursor-pointer select-none">
                      Mémoriser mon identifiant
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full text-white font-bold py-3 rounded-full transition-colors text-sm disabled:opacity-60"
                    style={{ background: '#1C3A5E' }}
                    onMouseEnter={e => e.currentTarget.style.background='#16304F'}
                    onMouseLeave={e => e.currentTarget.style.background='#1C3A5E'}
                  >
                    {authLoading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: '#DDD8CF' }} />
                  <span className="text-gray-400 text-xs font-semibold">OU</span>
                  <div className="flex-1 h-px" style={{ background: '#DDD8CF' }} />
                </div>

                <div className="flex justify-center mb-4">
                  {window.location.port === '5173' ? (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setAuthError('Google Sign-In non disponible.')}
                      theme="outline"
                      shape="rectangular"
                      text="continue_with"
                    />
                  ) : (
                    <p className="text-xs text-center" style={{ color: '#A89E8C' }}>
                      Connexion Google disponible en production uniquement
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-1.5 pt-3 border-t" style={{ borderColor: '#DDD8CF' }}>
                  <Link
                    to="/forgot-password"
                    onClick={() => setAuthOpen(false)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: '#E2001A' }}
                  >
                    Mot de passe oublié ?
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setAuthOpen(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Pas de compte ? <span className="font-semibold" style={{ color: '#1C3A5E' }}>S'inscrire</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
