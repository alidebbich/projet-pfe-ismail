import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ticketAPI } from '../../services/api';

export default function TicketForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'INCIDENT', title: '', description: '', priority: 'MEDIUM', assignedTeam: '', status: 'OPEN', resolutionNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      ticketAPI.getById(id).then(res => {
        setFormData(res.data);
        setInitialLoad(false);
      }).catch(() => {
        alert("Erreur chargement");
        navigate('/ticketing');
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
        await ticketAPI.update(id, formData);
      } else {
        await ticketAPI.create(formData);
      }
      navigate('/ticketing');
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
          {isEdit ? 'Modifier le ticket' : 'Nouveau Ticket'}
        </h2>
        <Link to="/ticketing" className="text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white">Retour</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-4 transition-colors duration-300">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Type *</label>
            <select required name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="INCIDENT">Incident</option>
              <option value="RECLAMATION">Réclamation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Priorité *</label>
            <select required name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="CRITICAL">Critique</option>
              <option value="HIGH">Élevée</option>
              <option value="MEDIUM">Normale</option>
              <option value="LOW">Faible</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Titre *</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Description *</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Équipe Assignée</label>
            <input name="assignedTeam" value={formData.assignedTeam} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Statut</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolu</option>
              <option value="CLOSED">Fermé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Notes de Résolution</label>
            <textarea name="resolutionNotes" value={formData.resolutionNotes} onChange={handleChange} rows="3" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/ticketing" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold transition-colors">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
