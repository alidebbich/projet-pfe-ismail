import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PowerBIEmbed({ settingKey, defaultUrl, title }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load URL from settings, fallback to default
    const savedSettings = JSON.parse(localStorage.getItem('uib_settings') || '{}');
    const configuredUrl = savedSettings[settingKey] || defaultUrl;
    setUrl(configuredUrl);
    
    if (!configuredUrl) {
      setLoading(false);
    }
  }, [settingKey, defaultUrl]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
        <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {title}
        </h3>
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#E20032] hover:underline"
          >
            Ouvrir dans Power BI
          </a>
        )}
      </div>
      
      <div className="flex-1 relative bg-gray-100 dark:bg-black/40 min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-white/10 border-t-[#E20032] rounded-full animate-spin mb-4" />
            <span className="text-sm text-gray-500 dark:text-white/50">Chargement du rapport Power BI...</span>
          </div>
        )}
        {url ? (
          <iframe 
            title={title}
            src={url}
            className="w-full h-full border-0 absolute inset-0"
            onLoad={() => setLoading(false)}
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-white/50 text-sm p-6 text-center">
            Aucune URL Power BI configurée pour ce tableau de bord.<br/>
            Un administrateur peut la configurer dans les paramètres.
          </div>
        )}
      </div>
    </div>
  );
}
