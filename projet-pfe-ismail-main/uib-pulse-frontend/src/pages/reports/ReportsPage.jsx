import { useState } from 'react';
import { reportAPI } from '../../services/api';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    type: 'EXCEL',
    scope: 'ALL',
    direction: 'DDP'
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await reportAPI.generate(params);
      
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = params.type === 'EXCEL' ? 'xlsx' : 'pdf';
      link.setAttribute('download', `UIB_Pulse_Report_${new Date().toISOString().split('T')[0]}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erreur lors de la génération du rapport.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Génération de Rapports</h2>
        <p className="text-gray-500 dark:text-white/50 text-sm">Exportez les données des projets, tickets et KPI en PDF ou Excel.</p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-6">
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-2">Format du rapport</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="EXCEL" checked={params.type === 'EXCEL'} onChange={e => setParams({...params, type: e.target.value})} className="accent-[#E20032]" />
              <span className="text-gray-900 dark:text-white">Excel (.xlsx)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="PDF" checked={params.type === 'PDF'} onChange={e => setParams({...params, type: e.target.value})} className="accent-[#E20032]" />
              <span className="text-gray-900 dark:text-white">PDF (.pdf)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-2">Périmètre</label>
          <select value={params.scope} onChange={e => setParams({...params, scope: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
            <option value="ALL">Tableau de bord complet</option>
            <option value="PROJECTS">Projets uniquement</option>
            <option value="TICKETS">Tickets uniquement</option>
            <option value="KPI">KPIs uniquement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-2">Direction / Filtrage</label>
          <select value={params.direction} onChange={e => setParams({...params, direction: e.target.value})} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none">
            <option value="ALL">Toutes les directions</option>
            <option value="DDP">DD&P</option>
            <option value="DSI">DSI</option>
            <option value="RISK">RISK</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#E20032] hover:bg-[#C8002D] text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Génération...</>
          ) : (
            <>⬇️ Télécharger le rapport</>
          )}
        </button>
      </form>
    </div>
  );
}
