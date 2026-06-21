import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
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

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.login(username, password);
      const { token, role, fullName, username: actualUsername } = res.data;
      localStorage.setItem('uib_token', token);
      localStorage.setItem('uib_role', role);
      localStorage.setItem('uib_username', actualUsername || username);
      localStorage.setItem('uib_user', JSON.stringify({ username: actualUsername || username, role, fullName }));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants invalides ou erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.googleLogin(credentialResponse.credential);
      const { token, role, fullName, username } = res.data;
      localStorage.setItem('uib_token', token);
      localStorage.setItem('uib_role', role);
      localStorage.setItem('uib_username', username);
      localStorage.setItem('uib_user', JSON.stringify({ username, role, fullName }));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Erreur lors de la connexion Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-noir-950 p-6 relative transition-colors duration-300">
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
           style={{ background: 'radial-gradient(circle at 50% 50%, rgba(226,0,50,0.15), transparent 60%)' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl z-10 relative shadow-2xl transition-colors duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#E20032] rounded-xl flex items-center justify-center text-white font-black text-lg mb-4">
            UIB
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Bienvenue sur UIB Pulse
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm transition-colors duration-300">Connectez-vous pour accéder au tableau de bord</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-white/70 text-xs font-semibold mb-1.5 transition-colors duration-300">Identifiant ou Email</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#E20032] transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-gray-600 dark:text-white/70 text-xs font-semibold transition-colors duration-300">Mot de passe</label>
              <Link to="/forgot-password" className="text-xs text-[#E20032] hover:underline font-semibold">
                Mot de passe oublié ?
              </Link>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#E20032] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E20032] hover:bg-[#C8002D] text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10 transition-colors duration-300" />
          <span className="text-gray-400 dark:text-white/40 text-xs font-semibold transition-colors duration-300">OU</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10 transition-colors duration-300" />
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Erreur de l'API Google Sign-In.")}
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
          />
        </div>

        <p className="text-center text-gray-500 dark:text-white/50 text-xs mt-6 transition-colors duration-300">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-[#E20032] hover:underline font-semibold">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
