import { motion } from 'framer-motion';

export default function PowerBIFrame() {
  return (
    <div className="glass-card p-5 h-full flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-xs tracking-widest uppercase mb-1">Rapport Intégré</p>
          <h3 className="text-white font-bold text-base">Power BI Analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-xs font-medium">Live</span>
          </div>
          <button
            id="powerbi-fullscreen"
            className="p-1.5 rounded-lg bg-white/[0.04] border border-glass-border text-text-muted hover:text-white transition-colors"
            data-tooltip="Plein écran"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Iframe Area ──────────────────────────────────────────── */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-glass-border min-h-[280px]">
        {/*
          PRODUCTION: Replace this stub with your actual Power BI embed:

          <iframe
            id="powerbi-report-frame"
            title="UIB Pulse Power BI Report"
            src={`https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID&groupId=YOUR_WORKSPACE_ID&autoAuth=true&ctid=YOUR_TENANT_ID`}
            className="w-full h-full border-0"
            allowFullScreen
          />

          Required env vars:
          VITE_POWERBI_REPORT_ID=...
          VITE_POWERBI_WORKSPACE_ID=...
          VITE_POWERBI_TENANT_ID=...
        */}

        {/* ── Stub: Realistic Power BI Mockup ────────────────────── */}
        <div className="absolute inset-0 bg-[#0B0B1A] flex flex-col">
          {/* Simulated PBI toolbar */}
          <div className="h-9 bg-[#0F0F24] border-b border-white/[0.06] flex items-center px-4 gap-3">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <rect x="2" y="2" width="9" height="9" rx="1" fill="#F2C811" />
                <rect x="13" y="2" width="9" height="9" rx="1" fill="#E8715A" />
                <rect x="2" y="13" width="9" height="9" rx="1" fill="#7BB8D4" />
                <rect x="13" y="13" width="9" height="9" rx="1" fill="#A3A3A3" />
              </svg>
              <span className="text-white text-xs font-medium">UIB Pulse — Rapport Principal</span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-text-muted text-xs">
              <span>Mis à jour: 07/06/2026</span>
              <div className="w-px h-3 bg-glass-border" />
              <span>Actualiser</span>
            </div>
          </div>

          {/* Simulated charts area */}
          <div className="flex-1 p-4 grid grid-cols-3 gap-3">
            {/* Bar chart sim */}
            <div className="col-span-2 bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
              <p className="text-text-muted text-xs mb-3">Projets par Statut — Q2 2026</p>
              <div className="flex items-end gap-2 h-24 px-2">
                {[
                  { h: 85, c: '#22C55E', l: 'Prod' },
                  { h: 45, c: '#3B82F6', l: 'Recette' },
                  { h: 65, c: '#F59E0B', l: 'Dev' },
                  { h: 25, c: '#E2001A', l: 'Retard' },
                  { h: 35, c: '#8B5CF6', l: 'Cadrage' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full rounded-t-sm"
                      style={{ backgroundColor: `${bar.c}99`, height: 0 }}
                      animate={{ height: `${bar.h}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    />
                    <span className="text-[9px] text-text-muted">{bar.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie sim */}
            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05] flex flex-col items-center justify-center gap-2">
              <p className="text-text-muted text-xs">Par Direction</p>
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#1A1A2E" strokeWidth="8" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="8" strokeDasharray="38 50" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="8" strokeDasharray="25 62" strokeDashoffset="-38" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="8" strokeDasharray="20 68" strokeDashoffset="-63" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2001A" strokeWidth="8" strokeDasharray="17 70" strokeDashoffset="-83" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                {[['DSI', '#22C55E'], ['DCR', '#3B82F6'], ['DRM', '#F59E0B'], ['DOSI', '#E2001A']].map(([dir, c]) => (
                  <div key={dir} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                    <span className="text-[9px] text-text-muted">{dir}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI table sim */}
            <div className="col-span-3 bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
              <p className="text-text-muted text-xs mb-2">Tableau KPIs — Seuils d'alerte</p>
              <div className="grid grid-cols-4 gap-2 text-[10px]">
                {[
                  { kpi: 'KPI-P2', val: '80.9%', s: 'orange' },
                  { kpi: 'KPI-D2', val: '91.3%', s: 'green' },
                  { kpi: 'KPI-P10', val: '73.1%', s: 'red' },
                  { kpi: 'KPI-P1', val: '94.2%', s: 'green' },
                ].map((row) => {
                  const c = row.s === 'green' ? '#22C55E' : row.s === 'orange' ? '#F59E0B' : '#E2001A';
                  return (
                    <div key={row.kpi} className="flex items-center justify-between px-2 py-1 rounded bg-white/[0.04] border border-white/[0.05]">
                      <span className="text-text-muted">{row.kpi}</span>
                      <span className="font-bold" style={{ color: c }}>{row.val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stub overlay notice */}
          <div className="absolute bottom-2 right-2">
            <span className="text-[10px] text-text-muted opacity-60 font-mono bg-black/40 px-2 py-0.5 rounded">
              Stub — Remplacer par iframe Power BI réel
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer controls ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-text-muted text-xs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span>Configurez VITE_POWERBI_REPORT_ID dans .env pour activer l'embed réel</span>
      </div>
    </div>
  );
}
