import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockKpis } from '../data/mockKpis';

export default function FilterBar({ selectedDirection, onDirectionChange, onExport, theme, toggleTheme }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise((r) => setTimeout(r, 2500));
    setIsExporting(false);
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap w-full">
      {/* ── Left: Title + Breadcrumb ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-text-muted text-xs mb-1 transition-colors duration-300">
          <span>UIB Pulse</span>
          <span>/</span>
          <span className="text-uib-red">Tableau de Bord</span>
        </div>
        <h1 className="text-gray-900 dark:text-white font-bold text-2xl tracking-tight transition-colors duration-300">
          Pilotage Performance
          <span className="gradient-text-red ml-2">Projets</span>
        </h1>
      </div>

      {/* ── Right: Filters + Actions ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-noir-800 border border-gray-200 dark:border-glass-border text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-sm dark:shadow-none"
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        {/* Direction Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-noir-800 border border-gray-200 dark:border-glass-border transition-colors duration-300">
          {mockKpis.directions.map((dir) => (
            <motion.button
              key={dir}
              id={`filter-${dir.toLowerCase()}`}
              onClick={() => onDirectionChange?.(dir)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${selectedDirection === dir
                  ? 'text-white'
                  : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {selectedDirection === dir && (
                <motion.div
                  layoutId="filterPill"
                  className="absolute inset-0 bg-uib-red rounded-lg shadow-sm"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{dir}</span>
            </motion.button>
          ))}
        </div>

        {/* Date Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-noir-800 border border-gray-200 dark:border-glass-border shadow-sm dark:shadow-none transition-colors duration-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-500 dark:text-text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-gray-600 dark:text-text-secondary text-xs font-mono">Juin 2026</span>
        </div>

        {/* Export Button */}
        <ExportButton isExporting={isExporting} onClick={handleExport} />
      </div>
    </div>
  );
}

function ExportButton({ isExporting, onClick }) {
  return (
    <motion.button
      id="export-button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      disabled={isExporting}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
        border transition-all duration-300 overflow-hidden shadow-sm
        ${isExporting
          ? 'bg-uib-red-dim border-uib-red/30 text-uib-red cursor-not-allowed'
          : 'bg-uib-red border-uib-red text-white hover:bg-red-600 hover:shadow-red-glow-sm'
        }
      `}
    >
      {isExporting ? (
        <>
          {/* Data stream particles */}
          <div className="flex flex-col gap-0.5 w-4 h-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="data-particle h-0.5 bg-uib-red rounded-full"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="font-mono text-xs">Streaming...</span>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 shimmer opacity-30" />
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Exporter</span>
        </>
      )}
    </motion.button>
  );
}
