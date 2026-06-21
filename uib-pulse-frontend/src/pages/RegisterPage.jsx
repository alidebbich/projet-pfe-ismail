import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'ROLE_MANAGER',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('uib_theme') || 'dark');

  import('react').then(React => {
    React.useEffect(() => {
      localStorage.setItem('uib_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [theme]);
  });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authAPI.register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-noir-950 p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] opacity-20"
          style={{ background: 'radial-gradient(circle at center, rgba(226,0,50,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] opacity-10"
          style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-3xl p-8 backdrop-blur-2xl z-10 relative shadow-2xl transition-colors duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg shadow-uib-red/20"
            style={{ background: 'linear-gradient(135deg, #E20032 0%, #A00020 100%)' }}>
            UIB
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Créer un compte
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm text-center transition-colors duration-300">
            Rejoignez UIB Pulse pour piloter la performance de votre direction.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center overflow-hidden"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3 bg-status-green/10 border border-status-green/20 rounded-xl text-status-green text-sm text-center font-medium overflow-hidden"
            >
              Compte créé avec succès ! Redirection en cours...
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-white/60 text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300">Nom complet</label>
            <input
              type="text"
              required
              disabled={loading || success}
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-uib-red focus:bg-white dark:focus:bg-white/[0.05] transition-all"
              placeholder="Ex: Mohamed Ben Ali"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-white/60 text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300">Adresse Email</label>
            <input
              type="email"
              required
              disabled={loading || success}
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-uib-red focus:bg-white dark:focus:bg-white/[0.05] transition-all"
              placeholder="prenom.nom@uib.com.tn"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-white/60 text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300">Matricule (Identifiant)</label>
            <input
              type="text"
              required
              disabled={loading || success}
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-uib-red focus:bg-white dark:focus:bg-white/[0.05] transition-all"
              placeholder="Ex: M12345"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-white/60 text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300">Mot de passe</label>
            <input
              type="password"
              required
              disabled={loading || success}
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-uib-red focus:bg-white dark:focus:bg-white/[0.05] transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: (loading || success) ? 1 : 1.02 }}
            whileTap={{ scale: (loading || success) ? 1 : 0.98 }}
            className="w-full font-bold py-3.5 rounded-xl transition-all mt-6 shadow-lg relative overflow-hidden"
            style={{
              background: (loading || success) ? 'rgba(226,0,50,0.5)' : 'linear-gradient(135deg, #E20032 0%, #C8002D 100%)',
              color: 'white'
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </span>
            ) : 'Créer mon compte'}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 dark:text-white/50 text-sm mt-8 transition-colors duration-300">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/login"
            className="text-uib-red hover:text-white transition-colors font-bold"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
