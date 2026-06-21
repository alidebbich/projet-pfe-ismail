import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

export default function ProjectList() {
  const { selectedDirection } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = selectedDirection !== 'Tous' ? { direction: selectedDirection } : {};
      const res = await projectAPI.getAll(params);
      setProjects(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des projets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedDirection]);

  const handleDelete = async (row) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le projet ${row.name} ?`)) {
      try {
        await projectAPI.delete(row.id);
        fetchProjects();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom du Projet' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Statut', render: (val) => {
        let color = 'bg-gray-100 text-gray-800';
        if (val === 'EN_COURS') color = 'bg-blue-100 text-blue-800';
        if (val === 'DEPLOYE' || val === 'LIVRE') color = 'bg-green-100 text-green-800';
        if (val === 'ANNULE') color = 'bg-red-100 text-red-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{val}</span>;
      }
    },
    { key: 'phase', label: 'Phase' },
    { key: 'direction', label: 'Direction' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Portefeuille Projets</h2>
          <p className="text-gray-500 dark:text-white/50 text-sm">Gestion des projets DD&P et autres directions.</p>
        </div>
        <Link to="/projects/new" className="bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouveau Projet
        </Link>
      </div>

      {error && <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#E20032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable 
          data={projects} 
          columns={columns} 
          viewLinkPrefix="/projects"
          editLinkPrefix="/projects"
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
