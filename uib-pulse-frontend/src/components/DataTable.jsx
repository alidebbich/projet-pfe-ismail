import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function DataTable({ 
  data, 
  columns, 
  onView, 
  onEdit, 
  onDelete, 
  viewLinkPrefix,
  editLinkPrefix
}) {
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-white/10 flex flex-wrap gap-4 justify-between items-center bg-gray-50 dark:bg-black/20">
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-[#E20032] transition-colors"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
          <span>Lignes par page:</span>
          <select 
            className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-white/50 uppercase bg-gray-50 dark:bg-black/40 border-b border-gray-200 dark:border-white/10">
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-gray-900 dark:text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  {viewLinkPrefix ? (
                    <Link to={`${viewLinkPrefix}/${row.id}`} className="text-blue-500 hover:text-blue-700">👁</Link>
                  ) : onView && (
                    <button onClick={() => onView(row)} className="text-blue-500 hover:text-blue-700">👁</button>
                  )}

                  {editLinkPrefix ? (
                    <Link to={`${editLinkPrefix}/${row.id}/edit`} className="text-amber-500 hover:text-amber-700">✏️</Link>
                  ) : onEdit && (
                    <button onClick={() => onEdit(row)} className="text-amber-500 hover:text-amber-700">✏️</button>
                  )}

                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="text-red-500 hover:text-red-700">🗑️</button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500 dark:text-white/50">
                  Aucune donnée trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
        <span className="text-sm text-gray-500 dark:text-white/50">
          Affichage {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} à {Math.min(currentPage * pageSize, sortedData.length)} sur {sortedData.length}
        </span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 rounded bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 disabled:opacity-50"
          >
            Précédent
          </button>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 rounded bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
