import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (err) {
      alert('Erreur lors du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (row) => {
    if (window.confirm(`Supprimer l'utilisateur ${row.username} ?`)) {
      try {
        await userAPI.delete(row.id);
        fetchUsers();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Identifiant' },
    { key: 'email', label: 'Email' },
    { key: 'fullName', label: 'Nom complet' },
    { key: 'role', label: 'Rôle', render: (val) => {
        const isAdmin = val === 'ROLE_ADMIN';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{val}</span>;
      }
    },
    { key: 'status', label: 'Statut', render: (val) => {
        const isActive = val === 'ACTIVE';
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{val}</span>;
      }
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Gestion des Utilisateurs</h2>
          <p className="text-gray-500 dark:text-white/50 text-sm">Administration des accès et des rôles.</p>
        </div>
        <Link to="/admin/users/new" className="bg-[#E20032] hover:bg-[#C8002D] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nouvel Utilisateur
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#E20032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable 
          data={users} 
          columns={columns} 
          editLinkPrefix="/admin/users"
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
