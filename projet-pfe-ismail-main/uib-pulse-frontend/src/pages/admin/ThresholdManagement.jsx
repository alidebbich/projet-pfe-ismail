import { useState, useEffect } from 'react';
import { thresholdAPI } from '../../services/api';
import DataTable from '../../components/DataTable';

export default function ThresholdManagement() {
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchThresholds = async () => {
    setLoading(true);
    try {
      const res = await thresholdAPI.getAll();
      setThresholds(res.data);
    } catch (err) {
      alert('Erreur lors du chargement des seuils.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

  const handleEdit = (row) => {
    setEditingRow(row.kpiCode);
    setEditData(row);
  };

  const handleSave = async () => {
    try {
      await thresholdAPI.update(editData.kpiCode, editData);
      setEditingRow(null);
      fetchThresholds();
    } catch (err) {
      alert('Erreur lors de la sauvegarde.');
    }
  };

  const columns = [
    { key: 'kpiCode', label: 'Code KPI' },
    { key: 'description', label: 'Description' },
    { key: 'targetValue', label: 'Cible', render: (val, row) => 
      editingRow === row.kpiCode ? (
        <input type="number" value={editData.targetValue} onChange={e => setEditData({...editData, targetValue: Number(e.target.value)})} className="w-20 p-1 border rounded text-black" />
      ) : val
    },
    { key: 'warningThreshold', label: 'Seuil Alerte', render: (val, row) => 
      editingRow === row.kpiCode ? (
        <input type="number" value={editData.warningThreshold} onChange={e => setEditData({...editData, warningThreshold: Number(e.target.value)})} className="w-20 p-1 border rounded text-black" />
      ) : val
    },
    { key: 'criticalThreshold', label: 'Seuil Critique', render: (val, row) => 
      editingRow === row.kpiCode ? (
        <input type="number" value={editData.criticalThreshold} onChange={e => setEditData({...editData, criticalThreshold: Number(e.target.value)})} className="w-20 p-1 border rounded text-black" />
      ) : val
    },
    { key: 'operator', label: 'Opérateur' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Seuils de Performance</h2>
        <p className="text-gray-500 dark:text-white/50 text-sm">Définissez les seuils d'alerte et critiques pour les KPIs.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#E20032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-white/50 uppercase bg-gray-50 dark:bg-black/40">
              <tr>
                {columns.map(col => <th key={col.key} className="px-6 py-3">{col.label}</th>)}
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map(row => (
                <tr key={row.kpiCode} className="border-b border-gray-100 dark:border-white/5">
                  {columns.map(col => <td key={col.key} className="px-6 py-4">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>)}
                  <td className="px-6 py-4 text-right">
                    {editingRow === row.kpiCode ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={handleSave} className="text-green-500 hover:text-green-700">💾</button>
                        <button onClick={() => setEditingRow(null)} className="text-gray-500 hover:text-gray-700">❌</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(row)} className="text-amber-500 hover:text-amber-700">✏️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
