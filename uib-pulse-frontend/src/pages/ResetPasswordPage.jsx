import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Le lien de réinitialisation est invalide ou manquant.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);
    
    try {
      const res = await authAPI.resetPassword(token, newPassword);
      setMessage(res.data.message || 'Mot de passe réinitialisé avec succès.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la réinitialisation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-noir-950 p-6 relative transition-colors duration-300">
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
            Nouveau mot de passe
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm transition-colors duration-300 text-center">
            Veuillez entrer votre nouveau mot de passe.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm text-center">
            {message}
            <br />
            <span className="text-xs opacity-70">Redirection vers la page de connexion...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-white/70 text-xs font-semibold mb-1.5 transition-colors duration-300">Nouveau mot de passe</label>
            <input 
              type="password" 
              required
              disabled={!token || message !== null}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#E20032] transition-colors"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-white/70 text-xs font-semibold mb-1.5 transition-colors duration-300">Confirmer le mot de passe</label>
            <input 
              type="password" 
              required
              disabled={!token || message !== null}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#E20032] transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !token || message !== null}
            className="w-full bg-[#E20032] hover:bg-[#C8002D] text-white font-bold py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Modification...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
            <span>&larr;</span> Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
