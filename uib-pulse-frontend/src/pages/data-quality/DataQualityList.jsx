import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataQualityAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

export default function DataQualityList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await dataQualityAPI.getAll();
      setRecords(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (row) => {
    if (window.confirm(`Supprimer le contrôle qualité de la période ${row.period} ?`)) {
      try {
        await dataQualityAPI.delete(row.id);
        fetchRecords();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'period', label: 'Période' },
    { key: 'sourceSystem', label: 'Système Source' },
    { key: 'totalRecordsControlled', label: 'Contrôlés' },
    { key: 'validRecords', label: 'Valides' },
    { key: 'taux', label: 'Taux Qualité', render: (_, row) => {
        const rate = ((row.validRecords / row.totalRecordsControlled) * 100).toFixed(2);
        let color = 'bg-red-100 text-red-800';
        if (rate >= 95) color = 'bg-green-100 text-green-800';
        else if (rate >= 80) color = 'bg-amber-100 text-amber-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{rate}%</span>;
      }
    },
    { key: 'createdAt', label: 'Date Saisie', render: (val) => new Date(val).toLocaleDateString('fr-FR') },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Qualité des données</h2>
          <p className="text-gray-500 dark:text-white/50 text-sm">Suivi des contrôles de qualité des données critiques (KPI-D1).</p>
        </div>
        <Link to="/data-quality/new" className="bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouvelle Saisie
        </Link>
      </div>

      {error && <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#E20032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable 
          data={records} 
          columns={columns} 
          editLinkPrefix="/data-quality"
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
