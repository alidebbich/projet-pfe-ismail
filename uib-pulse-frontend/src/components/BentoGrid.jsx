import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import GlobalHealthCard from './cards/GlobalHealthCard';
import SupportSLACard from './cards/SupportSLACard';
import DataQualityCard from './cards/DataQualityCard';
import DeploymentRateCard from './cards/DeploymentRateCard';
import CriticalAlertTile from './cards/CriticalAlertTile';
import { mockKpis } from '../data/mockKpis';

// Stagger children into view on load / filter change
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
};

export default function BentoGrid({ selectedDirection }) {
  const { criticalAlerts } = mockKpis;

  // Re-key grid on filter change → triggers AnimatePresence exit/enter (shuffle effect)
  const gridKey = selectedDirection;

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={gridKey}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'auto',
          }}
        >
          {/* ── [1] Global Health — Large (col 1–5, row 1–2) ─────────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-5 row-span-2 min-h-[520px]"
          >
            <GlobalHealthCard direction={selectedDirection} />
          </motion.div>

          {/* ── [2] Deployment Rate — Medium (col 6–9, row 1) ────────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-4 min-h-[250px]"
          >
            <DeploymentRateCard />
          </motion.div>

          {/* ── [3] Critical Alert 1 — Small (col 10–12, row 1) ─────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-3 min-h-[120px]"
          >
            <CriticalAlertTile alert={criticalAlerts[0]} index={0} />
          </motion.div>

          {/* ── [4] Support SLA — Medium (col 6–9, row 2) ────────────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-4 min-h-[250px]"
          >
            <SupportSLACard />
          </motion.div>

          {/* ── [5] Critical Alerts 2 & 3 — Stacked (col 10–12, row 2) ─ */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-3 flex flex-col gap-4 min-h-[250px]"
          >
            <div className="flex-1">
              <CriticalAlertTile alert={criticalAlerts[1]} index={1} />
            </div>
            <div className="flex-1">
              <CriticalAlertTile alert={criticalAlerts[2]} index={2} />
            </div>
          </motion.div>

          {/* ── [6] Data Quality — Medium (col 1–6, row 3) ───────────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-6 min-h-[380px]"
          >
            <DataQualityCard />
          </motion.div>

          {/* ── [7] Power BI Slot — Reserved for your report ─────────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12 md:col-span-6 min-h-[380px]"
          >
            <PowerBISlot />
          </motion.div>

          {/* ── [8] Stats Footer Bar ─────────────────────────────────── */}
          <motion.div
            variants={tileVariants}
            layout
            className="col-span-12"
          >
            <StatsFooter direction={selectedDirection} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}

// ── Power BI Slot ── reserved for user's own report ──────────────────────────
function PowerBISlot() {
  return (
    <div className="glass-card p-5 h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-uib-red/30 transition-colors duration-300">
      <div className="w-14 h-14 rounded-2xl bg-uib-red-dim border border-uib-red/20 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="#E2001A" strokeWidth={1.5} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-gray-900 dark:text-white font-semibold text-base mb-1 transition-colors duration-300">Rapport Power BI</p>
        <p className="text-gray-500 dark:text-text-muted text-sm max-w-[260px] leading-relaxed transition-colors duration-300">
          Intégrez ici votre rapport Power BI en remplaçant ce composant par votre propre iframe.
        </p>
      </div>
      <div className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-glass-border transition-colors duration-300">
        <code className="text-gray-500 dark:text-text-muted text-xs font-mono transition-colors duration-300">{'<PowerBISlot /> → votre iframe'}</code>
      </div>
    </div>
  );
}

function StatsFooter({ direction }) {
  const stats = [
    { label: 'Projets Actifs', value: '47', unit: '', icon: '📋', color: 'text-gray-900 dark:text-white' },
    { label: 'Taux Déploiement', value: '80.9', unit: '%', icon: '🚀', color: 'text-status-orange' },
    { label: 'SLA E-Ticketing', value: '91.3', unit: '%', icon: '🎫', color: 'text-status-green' },
    { label: 'Anomalies Critiques', value: '73.1', unit: '%', icon: '⚠️', color: 'text-uib-red' },
    { label: 'Tickets Ouverts', value: '46', unit: '', icon: '🔴', color: 'text-gray-900 dark:text-white' },
    { label: 'Budget Consommé', value: '67.4', unit: '%', icon: '💰', color: 'text-blue-500 dark:text-blue-400' },
  ];

  return (
    <div className="glass-card px-6 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-x divide-gray-200 dark:divide-glass-border transition-colors duration-300">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col ${i === 0 ? '' : 'pl-4'}`}
          >
            <span className="text-gray-500 dark:text-text-muted text-xs mb-1 transition-colors duration-300">
              {s.icon} {s.label}
            </span>
            <span className={`kpi-number font-black text-xl ${s.color} transition-colors duration-300`}>
              {s.value}{s.unit}
            </span>
            {direction !== 'Tous' && (
              <span className="text-gray-500 dark:text-text-muted text-xs mt-0.5 font-mono transition-colors duration-300">
                {direction}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
