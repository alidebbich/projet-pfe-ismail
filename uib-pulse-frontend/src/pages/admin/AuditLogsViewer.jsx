import { useState, useEffect } from 'react';
import { auditAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

export default function AuditLogsViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await auditAPI.getLogs({ size: 100 });
        setLogs(res.data.content || res.data); // Support Page or List response
      } catch (err) {
        alert('Erreur lors du chargement des logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    { key: 'timestamp', label: 'Date/Heure', render: (val) => new Date(val).toLocaleString('fr-FR') },
    { key: 'username', label: 'Utilisateur', render: (val) => <span className="font-semibold">{val}</span> },
    { key: 'action', label: 'Action', render: (val) => <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-xs">{val}</span> },
    { key: 'entityName', label: 'Entité' },
    { key: 'entityId', label: 'ID Entité' },
    { key: 'details', label: 'Détails' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Journaux d'Audit</h2>
        <p className="text-gray-500 dark:text-white/50 text-sm">Traçabilité des actions utilisateurs (consultation uniquement).</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#E20032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable data={logs} columns={columns} />
      )}
    </div>
  );
}
