import { motion } from 'framer-motion';
import { mockKpis } from '../../data/mockKpis';

const SEVERITY_CONFIG = {
  critical: {
    bg: 'glass-card-red',
    icon: '🔴',
    border: 'border-uib-red/30',
    text: 'text-uib-red',
    badge: 'bg-uib-red-dim border-uib-red/30 text-uib-red',
    label: 'CRITIQUE',
  },
  high: {
    bg: 'glass-card',
    icon: '🟠',
    border: 'border-status-orange/25',
    text: 'text-status-orange',
    badge: 'bg-amber-500/10 border-status-orange/30 text-status-orange',
    label: 'ÉLEVÉ',
  },
  medium: {
    bg: 'glass-card',
    icon: '🟡',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    label: 'MOYEN',
  },
};

export default function CriticalAlertTile({ alert, index }) {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;

  return (
    <motion.div
      id={`alert-tile-${alert.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`${config.bg} p-4 h-full flex flex-col gap-2`}
    >
      {/* ── Top Row ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.badge}`}>
            {config.label}
          </span>
        </div>
        <span className="text-gray-500 dark:text-text-muted text-xs font-mono flex-shrink-0 transition-colors duration-300">
          {new Date(alert.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* ── Alert Title ──────────────────────────────────────── */}
      <h4 className={`font-bold text-sm ${config.text} leading-tight`}>
        {alert.title}
      </h4>

      {/* ── Detail ───────────────────────────────────────────── */}
      <p className="text-gray-600 dark:text-text-muted text-xs leading-relaxed flex-1 transition-colors duration-300">
        {alert.detail}
      </p>

      {/* ── Action ───────────────────────────────────────────── */}
      <motion.button
        whileHover={{ x: 2 }}
        className={`flex items-center gap-1 text-xs font-medium ${config.text} mt-auto self-start`}
      >
        Voir détails
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// ── Alert Summary Bar ────────────────────────────────────────────────────────
export function AlertSummaryBar() {
  const { criticalAlerts } = mockKpis;
  const criticalCount = criticalAlerts.filter(a => a.severity === 'critical').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-uib-red-dim border border-uib-red/20"
    >
      {/* Pulsing indicator */}
      <div className="relative flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-uib-red" />
        <div className="absolute inset-0 rounded-full bg-uib-red animate-ping opacity-60" />
      </div>

      <span className="text-uib-red font-semibold text-sm">
        {criticalCount} Alerte{criticalCount > 1 ? 's' : ''} Critique{criticalCount > 1 ? 's' : ''}
      </span>

      <span className="text-gray-500 dark:text-text-muted text-xs transition-colors duration-300">
        — {criticalAlerts.length} alertes actives au total
      </span>

      <motion.button
        whileHover={{ x: 2 }}
        className="ml-auto text-uib-red text-xs font-medium flex items-center gap-1"
      >
        Voir tout
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
