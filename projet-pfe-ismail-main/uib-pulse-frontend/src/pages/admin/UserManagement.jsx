import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../../services/api';

const ROLE_LABEL = { ROLE_MANAGER: 'Manager', ROLE_ADMIN: 'Administrateur' };
const FILTERS = ['Tous', 'Manager', 'Administrateur'];

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [deleting, setDeleting]     = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer l'utilisateur « ${user.username} » ?`)) return;
    setDeleting(user.id);
    try {
      await userAPI.delete(user.id);
      await fetchUsers();
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      roleFilter === 'Tous' ||
      (roleFilter === 'Manager' && u.role === 'ROLE_MANAGER') ||
      (roleFilter === 'Administrateur' && u.role === 'ROLE_ADMIN');
    return matchSearch && matchRole;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#A89E8C' }}>
            Administration
          </p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Gestion des <span style={{ color: '#E2001A' }}>Utilisateurs</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
            {users.length} utilisateur{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: '#E2001A' }}
          onMouseEnter={e => e.currentTarget.style.background = '#c5001a'}
          onMouseLeave={e => e.currentTarget.style.background = '#E2001A'}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Nouvel Utilisateur
        </Link>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, identifiant ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{ background: '#fff', border: '1px solid #DDD8CF', color: '#111' }}
            onFocus={e => e.target.style.borderColor = '#E2001A'}
            onBlur={e => e.target.style.borderColor = '#DDD8CF'}
          />
        </div>

        {/* Role filter pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#EDE9E1', border: '1px solid #DDD8CF' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={roleFilter === f
                ? { background: '#E2001A', color: '#fff' }
                : { color: '#6b7280' }}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #DDD8CF', background: '#fff' }}
      >
        {/* Table header */}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#1C3A5E' }}>
              {['Nom complet', 'Identifiant', 'Email', 'Rôle', 'Statut', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/80">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#EDE9E1' }}>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="w-7 h-7 border-3 border-gray-200 border-t-[#E2001A] rounded-full animate-spin" style={{ borderWidth: 3 }} />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-[#F7F4EF] transition-colors"
                  >
                    {/* Full name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: u.role === 'ROLE_ADMIN' ? '#1C3A5E' : '#E2001A' }}>
                          {(u.fullName || u.username || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{u.fullName || '—'}</span>
                      </div>
                    </td>
                    {/* Username */}
                    <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{u.username}</td>
                    {/* Email */}
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email || '—'}</td>
                    {/* Role */}
                    <td className="px-5 py-3.5">
                      {u.role === 'ROLE_ADMIN' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(28,58,94,0.1)', color: '#1C3A5E' }}>
                          Administrateur
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(226,0,26,0.1)', color: '#E2001A' }}>
                          Manager
                        </span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.enabled ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          style={{ background: 'rgba(28,58,94,0.08)', color: '#1C3A5E' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,58,94,0.16)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(28,58,94,0.08)'}
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L6.75 6.774a2.75 2.75 0 00-.596.892l-.583 1.762a.25.25 0 00.317.316l1.762-.582a2.75 2.75 0 00.893-.597l4.26-4.262a1.75 1.75 0 000-2.474zm-1.414 1.06a.25.25 0 01.354 0 .25.25 0 010 .354L8.165 8.19a1.25 1.25 0 01-.406.271l-.717.237.236-.716a1.25 1.25 0 01.272-.407l4.524-4.523z" />
                            <path fillRule="evenodd" d="M2 14.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                          </svg>
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deleting === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          style={{ background: 'rgba(226,0,26,0.08)', color: '#E2001A' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,0,26,0.16)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(226,0,26,0.08)'}
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.711z" clipRule="evenodd" />
                          </svg>
                          {deleting === u.id ? '...' : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-center mt-4" style={{ color: '#A89E8C' }}>
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
          {roleFilter !== 'Tous' || search ? ` (filtrés sur ${users.length})` : ''}
        </p>
      )}
    </div>
  );
}
