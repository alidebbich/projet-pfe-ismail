import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI } from '../../services/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    projectAPI.getById(id).then(res => setProject(res.data)).catch(() => alert('Erreur'));
  }, [id]);

  if (!project) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Détail du projet</h2>
        <div className="flex gap-2">
          <Link to={`/projects/${id}/edit`} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Modifier</Link>
          <Link to="/projects" className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors">Retour</Link>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <span className="block text-xs text-gray-500 dark:text-white/50 uppercase">Nom du Projet</span>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">{project.name}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 dark:text-white/50 uppercase">Direction</span>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">{project.direction}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <span className="block text-xs text-gray-500 dark:text-white/50 uppercase">Type</span>
            <span className="text-gray-900 dark:text-white">{project.type}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 dark:text-white/50 uppercase">Phase</span>
            <span className="text-gray-900 dark:text-white">{project.phase}</span>
          </div>
        </div>

        <div className="border-b border-gray-100 dark:border-white/10 pb-4">
          <span className="block text-xs text-gray-500 dark:text-white/50 uppercase mb-1">Statut</span>
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{project.status}</span>
        </div>

        <div>
          <span className="block text-xs text-gray-500 dark:text-white/50 uppercase mb-1">Description</span>
          <p className="text-gray-700 dark:text-white/80 whitespace-pre-wrap">{project.description || "Aucune description fournie."}</p>
        </div>
      </div>
    </div>
  );
}
