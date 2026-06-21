import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    // Start with local storage data if available for immediate rendering
    try {
      const lsUser = JSON.parse(localStorage.getItem('uib_user') || '{}');
      return {
        username: localStorage.getItem('uib_username') || '',
        role: localStorage.getItem('uib_role') || '',
        fullName: lsUser.fullName || '',
      };
    } catch (e) {
      return null;
    }
  });
  
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(() => localStorage.getItem('uib_avatar_url') || '');
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const selectAvatar = (url) => {
    setSelectedAvatarUrl(url);
    localStorage.setItem('uib_avatar_url', url);
    window.dispatchEvent(new Event('uib_user_updated'));
  };

  useEffect(() => {
    userAPI.getProfile().then(res => {
      setUser(res.data);
      setFormData({ fullName: res.data.fullName || '', email: res.data.email || '', password: '' });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      // Fallback to local storage
      const lsUser = JSON.parse(localStorage.getItem('uib_user') || '{}');
      const username = localStorage.getItem('uib_username') || '';
      const role = localStorage.getItem('uib_role') || '';
      
      setUser({ fullName: lsUser.fullName, username, role });
      setFormData({ fullName: lsUser.fullName || '', email: '', password: '' });
      
      // We don't show the red banner if we have fallback data to keep it clean
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await userAPI.updateProfile(formData);
      setUser(res.data);
      
      const lsUser = JSON.parse(localStorage.getItem('uib_user') || '{}');
      localStorage.setItem('uib_user', JSON.stringify({ ...lsUser, fullName: res.data.fullName }));
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
      setFormData(prev => ({ ...prev, password: '' })); 
      window.dispatchEvent(new Event('uib_user_updated'));
      
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user?.fullName) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-10 h-10 border-4 border-uib-red border-t-transparent rounded-full animate-spin shadow-lg" />
        <p className="text-gray-500 font-medium animate-pulse">Chargement de votre profil...</p>
      </div>
    );
  }

  const roleText = user?.role ? user.role.replace('ROLE_', '') : 'UTILISATEUR';

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 w-full overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-10"
      >
        <h2 className="text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Mon Profil
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
      </motion.div>
      
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* L E F T   C A R D */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="md:col-span-4"
        >
          <div className="bg-white dark:bg-noir-800 rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 flex flex-col items-center text-center shadow-xl shadow-red-900/5 relative overflow-hidden group">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-uib-red to-red-900 opacity-20 dark:opacity-40 transition-opacity duration-500 group-hover:opacity-30 dark:group-hover:opacity-60" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
            
            <div className="relative mt-4 mb-5">
              <div className="absolute inset-0 bg-uib-red rounded-full blur-xl opacity-40 animate-pulse" />
              <img 
                src={selectedAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.username || user?.fullName || 'Admin')}&backgroundColor=e20032`}
                alt="Avatar"
                className="w-32 h-32 rounded-full shadow-2xl border-[6px] border-white dark:border-noir-900 relative z-10 bg-[#e20032] transition-transform duration-500 group-hover:scale-110 object-cover"
              />
              <div className="absolute bottom-1 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-noir-900 rounded-full z-20 shadow-md" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 relative z-10 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {user?.fullName || 'Utilisateur'}
            </h3>
            <p className="text-xs font-bold text-uib-red uppercase tracking-widest bg-red-50 dark:bg-uib-red-dim border border-uib-red/10 px-4 py-1.5 rounded-full relative z-10 shadow-sm">
              {roleText}
            </p>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 w-full relative z-10">
              <div className="flex flex-col gap-1 items-center bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest">Matricule / Identifiant</span>
                <span className="font-mono text-gray-900 dark:text-white font-bold text-lg">{user?.username}</span>
              </div>
            </div>

            {/* Avatar Gallery Button */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 w-full relative z-20 text-center">
              <button 
                type="button"
                onClick={() => setIsAvatarDropdownOpen(true)}
                className="px-6 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors inline-flex items-center gap-2 w-full justify-center"
              >
                Parcourir la galerie
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isAvatarDropdownOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsAvatarDropdownOpen(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-2xl bg-white dark:bg-noir-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Galerie d'Avatars</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choisissez votre nouvelle identité visuelle</p>
                        </div>
                        <button 
                          onClick={() => setIsAvatarDropdownOpen(false)}
                          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                          {[
                            ...Array.from({ length: 12 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent((user?.username || 'A') + '-' + i)}&backgroundColor=e20032`),
                            ...Array.from({ length: 6 }, (_, i) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || 'UIB')}&backgroundColor=${i%2===0 ? 'e20032' : '111827'}`),
                            ...Array.from({ length: 12 }, (_, i) => `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent((user?.username || 'A') + '-' + i)}&backgroundColor=e20032`),
                            ...Array.from({ length: 12 }, (_, i) => `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent((user?.username || 'A') + '-' + i)}&backgroundColor=111827`),
                            ...Array.from({ length: 6 }, (_, i) => `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent((user?.username || 'A') + '-' + i)}&backgroundColor=e20032`)
                          ].map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                selectAvatar(url);
                                setIsAvatarDropdownOpen(false);
                              }}
                              className={`relative aspect-square rounded-2xl border-4 transition-all overflow-hidden focus:outline-none hover:scale-105 hover:shadow-lg ${selectedAvatarUrl === url ? 'border-uib-red shadow-xl scale-105' : 'border-transparent hover:border-gray-200 dark:hover:border-white/20'}`}
                            >
                              <img 
                                src={url}
                                alt="Avatar Option"
                                className="w-full h-full object-cover bg-gray-100 dark:bg-noir-800"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* R I G H T   C A R D */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }} 
          className="md:col-span-8"
        >
          <form onSubmit={handleSubmit} className="bg-white dark:bg-noir-800 rounded-[2rem] p-8 md:p-10 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-900/5 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-50 dark:bg-uib-red-dim flex items-center justify-center text-uib-red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </span>
              Informations Personnelles
            </h3>
            
            <AnimatePresence>
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }} 
                  animate={{ opacity: 1, y: 0, height: 'auto' }} 
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className={`p-4 rounded-2xl mb-8 text-sm font-medium border flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'}`}
                >
                  {message.type === 'success' ? '✅' : '❌'} {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1 transition-colors group-focus-within:text-uib-red">Nom complet</label>
                <input 
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                  className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:border-uib-red focus:bg-white dark:focus:bg-white/5 transition-all outline-none shadow-sm focus:shadow-md"
                />
              </div>
              
              <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1 transition-colors group-focus-within:text-uib-red">Adresse Email</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:border-uib-red focus:bg-white dark:focus:bg-white/5 transition-all outline-none shadow-sm focus:shadow-md"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1 transition-colors group-focus-within:text-uib-red">
                  Nouveau Mot de passe
                  <span className="normal-case text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">(Optionnel)</span>
                </label>
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:border-uib-red focus:bg-white dark:focus:bg-white/5 transition-all outline-none shadow-sm focus:shadow-md placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-end">
              <motion.button 
                type="submit" 
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.97 }}
                className="px-8 py-4 bg-uib-red hover:bg-[#C8002D] text-white font-bold rounded-2xl transition-all shadow-lg shadow-uib-red/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 relative overflow-hidden"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enregistrement en cours...
                  </>
                ) : (
                  <>
                    Enregistrer les modifications
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
