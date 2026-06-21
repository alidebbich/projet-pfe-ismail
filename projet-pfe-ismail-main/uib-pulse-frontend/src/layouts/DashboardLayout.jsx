import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { authAPI } from '../services/api';

const PAGE_LABELS = {
  dashboard:    { label: 'Tableau de Bord', icon: '📊' },
  projects:     { label: 'Projets',         icon: '📁' },
  ticketing:    { label: 'E-Ticketing',     icon: '🎫' },
  'data-quality': { label: 'Qualité des Données', icon: '✅' },
  reports:      { label: 'Rapports',        icon: '📄' },
  powerbi:      { label: 'Power BI',        icon: '📈' },
  profile:      { label: 'Mon Profil',      icon: '👤' },
  users:        { label: 'Gestion Utilisateurs', icon: '👥' },
  thresholds:   { label: 'Seuils & Alertes', icon: '⚙️' },
  'audit-logs': { label: 'Audit Logs',      icon: '📋' },
  profiles:     { label: 'Profils & Droits', icon: '🔐' },
  settings:     { label: 'Paramètres',      icon: '⚙️' },
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split('/').filter(Boolean);
  let activeSection = pathParts[0] || 'dashboard';
  if (activeSection === 'admin') activeSection = pathParts[1] || 'users';

  const page = PAGE_LABELS[activeSection] || { label: activeSection, icon: '•' };

  const [theme, setTheme] = useState(() => localStorage.getItem('uib_theme') || 'light');
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uib_user') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('uib_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const roleLabel = user.role === 'ROLE_ADMIN' ? 'Administrateur' : user.role === 'ROLE_MANAGER' ? 'Manager' : '';
  const roleColor = user.role === 'ROLE_ADMIN' ? '#1C3A5E' : '#E2001A';
  const roleBg    = user.role === 'ROLE_ADMIN' ? 'rgba(28,58,94,0.1)' : 'rgba(226,0,26,0.1)';

  return (
    <div className="flex h-screen overflow-hidden bg-ivory dark:bg-noir-950 transition-colors duration-300">

      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          if (section === 'home')       navigate('/');
          else if (section === 'dashboard')  navigate('/dashboard');
          else if (section === 'projects')   navigate('/projects');
          else if (section === 'ticketing')  navigate('/ticketing');
          else if (section === 'data-quality') navigate('/data-quality');
          else if (section === 'reports')    navigate('/reports');
          else if (section === 'powerbi')    navigate('/powerbi');
          else if (section === 'profile')    navigate('/profile');
          else if (section === 'settings')   navigate('/admin/settings');
          else if (section === 'users')      navigate('/admin/users');
          else if (section === 'thresholds') navigate('/admin/thresholds');
          else if (section === 'audit-logs') navigate('/admin/audit-logs');
          else if (section === 'audit')      navigate('/admin/audit-logs');
          else if (section === 'profiles')   navigate('/admin/user-profiles');
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* ── Unified Header ──────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex-shrink-0 border-b border-[#DDD8CF] dark:border-glass-border bg-white/95 dark:bg-noir-950/90 backdrop-blur-sm px-6 h-16 z-10 flex items-center justify-between transition-colors duration-300"
        >
          {/* Left — breadcrumb + page title */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-white/30 font-medium mb-0.5">
              <button
                onClick={() => navigate('/')}
                className="hover:text-uib-red transition-colors duration-150"
              >
                UIB Pulse
              </button>
              <span>/</span>
              <span className="text-uib-red">{page.label}</span>
            </div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {page.label}
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

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />

            {/* User info */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {user.fullName || user.username || 'Utilisateur'}
                </p>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                  style={{ background: roleBg, color: roleColor }}
                >
                  {roleLabel}
                </span>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.username || 'user')}&backgroundColor=e20032`}
                alt={user?.fullName || 'User'}
                className="w-9 h-9 rounded-full border-2 border-gray-100 dark:border-white/10 object-cover bg-gray-100 dark:bg-noir-800"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-white/50 hover:text-uib-red hover:bg-red-50 dark:hover:bg-uib-red/10 border border-transparent hover:border-red-100 dark:hover:border-uib-red/20 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ theme }} />
        </div>

        <footer className="flex-shrink-0 border-t border-gray-200 dark:border-glass-border px-6 py-2 flex items-center justify-between transition-colors duration-300">
          <span className="text-gray-400 dark:text-text-muted text-xs font-mono">
            UIB Pulse v1.0.0 — DD&amp;P
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400 dark:text-text-muted text-xs">Système opérationnel</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
