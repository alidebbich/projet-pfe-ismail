import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectAPI } from '../../services/api';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '', type: 'SI', status: 'PLANIFIE', phase: 'ETUDE', direction: 'DDP', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      projectAPI.getById(id).then(res => {
        setFormData(res.data);
        setInitialLoad(false);
      }).catch(() => {
        alert("Erreur chargement");
        navigate('/projects');
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
        await projectAPI.update(id, formData);
      } else {
        await projectAPI.create(formData);
      }
      navigate('/projects');
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {isEdit ? 'Modifier le projet' : 'Nouveau Projet'}
        </h2>
        <Link to="/projects" className="text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white">Retour</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-4 transition-colors duration-300">
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Nom du Projet *</label>
          <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Direction</label>
            <select name="direction" value={formData.direction} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="DDP">DDP</option>
              <option value="DSI">DSI</option>
              <option value="RISK">RISK</option>
              <option value="FIN">FIN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="SI">SI</option>
              <option value="DIGITAL">Digital</option>
              <option value="DATA">Data</option>
              <option value="IA">IA</option>
              <option value="ADOPT">ADOPT</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Statut</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="PLANIFIE">Planifié</option>
              <option value="EN_COURS">En cours</option>
              <option value="DEPLOYE">Déployé</option>
              <option value="ANNULE">Annulé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Phase</label>
            <select name="phase" value={formData.phase} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="ETUDE">Etude</option>
              <option value="BUILD">Build</option>
              <option value="TEST">Test / HMLG</option>
              <option value="PROD">Production</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/projects" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold transition-colors">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
