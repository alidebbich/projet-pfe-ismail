import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { dataQualityAPI } from '../../services/api';

export default function DataQualityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    sourceSystem: 'WSM', period: '', totalRecordsControlled: 0, validRecords: 0, dataType: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      dataQualityAPI.getById(id).then(res => {
        setFormData(res.data);
        setInitialLoad(false);
      }).catch(() => {
        alert("Erreur chargement");
        navigate('/data-quality');
      });
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await dataQualityAPI.update(id, formData);
      } else {
        await dataQualityAPI.create(formData);
      }
      navigate('/data-quality');
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
          {isEdit ? 'Modifier le contrôle' : 'Nouveau contrôle de qualité'}
        </h2>
        <Link to="/data-quality" className="text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white">Retour</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-4 transition-colors duration-300">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Période (MM-YYYY) *</label>
            <input required name="period" value={formData.period} onChange={handleChange} placeholder="06-2026" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Système Source</label>
            <select name="sourceSystem" value={formData.sourceSystem} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
              <option value="WSM">WSM</option>
              <option value="Power BI">Power BI</option>
              <option value="Power Query">Power Query</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Total Enregistrements Contrôlés *</label>
            <input type="number" required min="1" name="totalRecordsControlled" value={formData.totalRecordsControlled} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Enregistrements Valides *</label>
            <input type="number" required min="0" name="validRecords" value={formData.validRecords} onChange={handleChange} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Type de donnée</label>
          <input name="dataType" value={formData.dataType} onChange={handleChange} placeholder="ex: Clients, Comptes, Transactions" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">Notes / Commentaires</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#E20032]" />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link to="/data-quality" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 transition-colors">Annuler</Link>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold transition-colors">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
