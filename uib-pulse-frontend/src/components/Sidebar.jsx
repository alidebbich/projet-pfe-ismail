import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  {
    id: 'dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    label: 'Tableau de Bord',
  },
  {
    id: 'projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    label: 'Projets',
  },
  {
    id: 'kpis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    label: 'KPIs',
  },
  {
    id: 'tickets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    label: 'E-Ticketing',
  },
  {
    id: 'powerbi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    label: 'Power BI',
  },
  {
    id: 'audit',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    label: 'Audit Logs',
  },
];

const bottomItems = [
  {
    id: 'settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Paramètres',
  },
];

export default function Sidebar({ activeSection, onSectionChange, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const [user, setUser] = useState(() => {
    try {
      const userStr = localStorage.getItem('uib_user');
      return userStr ? JSON.parse(userStr) : { fullName: 'Admin UIB', role: 'ROLE_ADMIN' };
    } catch (e) {
      return { fullName: 'Admin UIB', role: 'ROLE_ADMIN' };
    }
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      const userStr = localStorage.getItem('uib_user');
      if (userStr) setUser(JSON.parse(userStr));
    };
    window.addEventListener('uib_user_updated', handleUserUpdate);
    return () => window.removeEventListener('uib_user_updated', handleUserUpdate);
  }, []);

  const initials = user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'UI';

  return (
    <motion.aside
      id="sidebar"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-white dark:bg-noir-900 border-r border-gray-200 dark:border-glass-border flex-shrink-0 overflow-hidden z-20 shadow-sm transition-colors duration-300"
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div 
        onClick={() => window.location.href = '/'}
        className="flex items-center gap-3 px-4 h-16 border-b border-gray-200 dark:border-glass-border flex-shrink-0 transition-colors duration-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
        title="Retourner à la page d'accueil"
      >
        {/* UIB Logo Mark */}
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-md bg-white">
          <img src="/logo.png" alt="UIB Logo" className="w-full h-full object-cover scale-[1.3]" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          <div className="hidden w-full h-full rounded-lg bg-uib-red items-center justify-center shadow-sm">
            <span className="text-white font-black text-[10px] tracking-tight">UIB</span>
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="whitespace-nowrap">
                <p className="text-gray-900 dark:text-white font-bold text-sm leading-none transition-colors duration-300">UIB Pulse</p>
                <p className="text-gray-500 dark:text-text-muted text-xs mt-0.5 transition-colors duration-300">Performance Banking</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* ── Nav Items ─────────────────────────────────────────── */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5 px-2">
          {navItems.map((item, idx) => {
            const isActive = (activeSection || 'dashboard') === item.id;
            return (
              <motion.button
                key={item.id}
                id={`nav-${item.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSectionChange?.(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-red-50 dark:bg-uib-red-dim text-uib-red border border-uib-red/20'
                    : 'text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-uib-red rounded-r-full"
                  />
                )}

                <span className={`flex-shrink-0 ${isActive ? 'text-uib-red' : 'text-gray-400 dark:text-text-muted group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200'}`}>
                  {item.icon}
                </span>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-noir-700 border border-gray-200 dark:border-glass-border rounded-lg text-xs text-gray-900 dark:text-white shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div className="mx-4 border-t border-gray-200 dark:border-glass-border transition-colors duration-300" />

      {/* ── Bottom Items ──────────────────────────────────────── */}
      <div className="py-4 px-2 space-y-0.5">
        {bottomItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onSectionChange?.(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? 'bg-red-50 dark:bg-uib-red-dim text-uib-red border border-uib-red/20' : 'text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}`}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-uib-red' : 'text-gray-400 dark:text-text-muted group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200'}`}>{item.icon}</span>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* ── Premium Profile & Logout ──────────────────────────── */}
        <div 
          onClick={(e) => {
            if (e.target.closest('button')) return;
            onSectionChange?.('profile');
          }}
          className={`cursor-pointer relative mt-2 p-2 rounded-2xl bg-gray-50 dark:bg-noir-800 border shadow-sm transition-all duration-300 group hover:border-uib-red/30 dark:hover:border-uib-red/30 ${isCollapsed ? 'flex justify-center' : 'flex items-center justify-between'} ${(activeSection === 'profile') ? 'border-uib-red/50 dark:border-uib-red/50 ring-2 ring-uib-red/20' : 'border-gray-200 dark:border-white/5'}`}
        >
          <div className={`flex items-center overflow-hidden ${isCollapsed ? 'gap-0 justify-center w-full' : 'gap-3'}`}>
            <div className="relative flex-shrink-0">
              <img 
                src={localStorage.getItem('uib_avatar_url') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.username || user?.fullName || 'Admin')}&backgroundColor=e20032`}
                alt={user?.fullName || 'Utilisateur'}
                className="w-10 h-10 rounded-full shadow-sm object-cover border-2 border-white dark:border-noir-900 transition-transform duration-300 group-hover:scale-105 bg-gray-100 dark:bg-noir-900"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-noir-900 rounded-full" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {user?.fullName || 'Utilisateur'}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-wider font-semibold">
                    {user?.role ? user.role.replace('ROLE_', '') : ''}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onLogout}
                className="flex items-center justify-center flex-shrink-0 w-9 h-9 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-transparent text-gray-500 hover:text-uib-red hover:bg-red-50 dark:hover:bg-uib-red/10 transition-all duration-200 shadow-sm dark:shadow-none"
                title="Déconnexion"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 ml-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
