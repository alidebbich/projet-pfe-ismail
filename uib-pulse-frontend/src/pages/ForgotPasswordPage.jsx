import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setMessage(res.data.message || 'Un lien de réinitialisation a été envoyé.');
    } catch (err) {
      setError('Erreur lors de la demande. Veuillez réessayer.');
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
            Mot de passe oublié
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm transition-colors duration-300 text-center">
            Saisissez votre email et nous vous enverrons un lien de réinitialisation.
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
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-white/70 text-xs font-semibold mb-1.5 transition-colors duration-300">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-[#E20032] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E20032] hover:bg-[#C8002D] text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
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
