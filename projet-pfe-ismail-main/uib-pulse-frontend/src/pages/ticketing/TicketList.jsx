import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ticketAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

export default function TicketList() {
  const { selectedDirection } = useOutletContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = selectedDirection !== 'Tous' ? { direction: selectedDirection } : {};
      const res = await ticketAPI.getAll(params);
      setTickets(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedDirection]);

  const handleDelete = async (row) => {
    if (window.confirm(`Supprimer le ticket ${row.ticketRef} ?`)) {
      try {
        await ticketAPI.delete(row.id);
        fetchTickets();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const columns = [
    { key: 'ticketRef', label: 'Réf' },
    { key: 'type', label: 'Type' },
    { key: 'title', label: 'Titre' },
    { key: 'priority', label: 'Priorité', render: (val) => {
        let color = 'bg-gray-100 text-gray-800';
        if (val === 'CRITICAL') color = 'bg-red-100 text-red-800';
        if (val === 'HIGH') color = 'bg-orange-100 text-orange-800';
        if (val === 'MEDIUM') color = 'bg-blue-100 text-blue-800';
        if (val === 'LOW') color = 'bg-green-100 text-green-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{val}</span>;
      }
    },
    { key: 'status', label: 'Statut' },
    { key: 'assignedTeam', label: 'Equipe' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Support & E-Ticketing</h2>
          <p className="text-gray-500 dark:text-white/50 text-sm">Gestion des incidents et réclamations.</p>
        </div>
        <Link to="/ticketing/new" className="bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouveau Ticket
        </Link>
      </div>

      {error && <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#E20032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable 
          data={tickets} 
          columns={columns} 
          viewLinkPrefix="/ticketing"
          editLinkPrefix="/ticketing"
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
