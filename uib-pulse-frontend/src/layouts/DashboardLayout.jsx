import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import { authAPI } from '../services/api';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Derive active section from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  let activeSection = pathParts[0] || 'dashboard';
  if (activeSection === 'admin') activeSection = pathParts[1] || 'users';

  const [selectedDirection, setSelectedDirection] = useState('Tous');
  const [theme, setTheme] = useState(() => localStorage.getItem('uib_theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('uib_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-noir-950 transition-colors duration-300">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-[240px] w-[600px] h-[400px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, rgba(226,0,26,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
        />
      </div>

      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          if (section === 'dashboard') navigate('/dashboard');
          else if (section === 'projects') navigate('/projects');
          else if (section === 'ticketing') navigate('/ticketing');
          else if (section === 'data-quality') navigate('/data-quality');
          else if (section === 'reports') navigate('/reports');
          else if (section === 'profile') navigate('/profile');
          else if (section === 'settings') navigate('/admin/settings');
          else if (section === 'users') navigate('/admin/users');
          else if (section === 'thresholds') navigate('/admin/thresholds');
          else if (section === 'audit-logs') navigate('/admin/audit-logs');
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 border-b border-gray-200 dark:border-glass-border bg-white/80 dark:bg-noir-950/80 backdrop-blur-sm px-6 py-4 z-10 flex justify-between items-center transition-colors duration-300"
        >
          {location.pathname === '/dashboard' ? (
            <FilterBar
              selectedDirection={selectedDirection}
              onDirectionChange={setSelectedDirection}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          ) : (
            <div className="flex-1 flex justify-between">
              <div className="flex items-center gap-2 text-gray-500 dark:text-text-muted text-xs">
                <span>UIB Pulse</span>
                <span>/</span>
                <span className="text-uib-red capitalize">{activeSection}</span>
              </div>
              <button onClick={toggleTheme} className="text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-white transition-colors">
                {theme === 'dark' ? 'Clair' : 'Sombre'}
              </button>
            </div>
          )}
        </motion.header>

        <div className="flex-1 overflow-y-auto">
          {/* We will pass selectedDirection context down later if needed, or use a context provider. For now, we just pass to Outlet if possible using Outlet context */}
          <Outlet context={{ selectedDirection }} />
        </div>

        <footer className="flex-shrink-0 border-t border-glass-border px-6 py-2 flex items-center justify-between">
          <span className="text-text-muted text-xs font-mono">
            UIB Pulse v1.0.0 — DD&P
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
            <span className="text-text-muted text-xs">Système opérationnel</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
