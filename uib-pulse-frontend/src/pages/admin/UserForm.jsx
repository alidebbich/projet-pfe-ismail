import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { userAPI } from '../../services/api';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    username: '', email: '', fullName: '', role: 'ROLE_MANAGER', status: 'ACTIVE', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      // In a real app we would get user details
      userAPI.getAll().then(res => {
        const u = res.data.find(x => x.id === Number(id));
        if (u) {
          setFormData({ ...u, password: '' });
          setInitialLoad(false);
        } else {
          navigate('/admin/users');
        }
      });
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await userAPI.update(id, payload);
      } else {
        await userAPI.create(formData);
      }
      navigate('/admin/users');
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {isEdit ? "Modifier l'utilisateur" : 'Nouvel Utilisateur'}
        </h2>
        <Link to="/admin/users" className="text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white">Retour</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-4 transition-colors duration-300">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Identifiant *</label>
            <input required name="username" value={formData.username} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" disabled={isEdit} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Mot de passe {isEdit ? '(laisser vide pour ne pas changer)' : '*'}</label>
            <input type="password" required={!isEdit} name="password" value={formData.password} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Email *</label>
            <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Nom Complet</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Rôle</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="ROLE_MANAGER">Manager</option>
              <option value="ROLE_ADMIN">Administrateur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Statut</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/admin/users" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold transition-colors">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
