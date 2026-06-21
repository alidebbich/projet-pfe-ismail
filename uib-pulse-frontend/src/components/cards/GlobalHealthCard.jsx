import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { mockKpis } from '../../data/mockKpis';

const STATUS_CONFIG = {
  green: { color: '#22C55E', label: 'Vert', labelFr: '✓ Objectif atteint' },
  orange: { color: '#F59E0B', label: 'Orange', labelFr: '⚠ Proche du seuil' },
  red: { color: '#E2001A', label: 'Rouge', labelFr: '✗ Sous le seuil' },
};

function RadialProgress({ value, max = 100, color, size = 140 }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const animated = useCountUp(value, 2000, 1);
  const offset = circumference - (animated / max) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
        {/* Background track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-white/10"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Animated progress */}
        <motion.circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        {/* Glow dot at tip */}
        <motion.circle
          cx="60" cy="8" r="4"
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="kpi-number text-gray-900 dark:text-white font-bold text-3xl leading-none transition-colors duration-300">
          {animated.toFixed(0)}
        </span>
        <span className="text-gray-500 dark:text-text-muted text-xs mt-0.5 transition-colors duration-300">/ 100</span>
      </div>
    </div>
  );
}

export default function GlobalHealthCard({ direction }) {
  const { globalHealth, projects } = mockKpis;
  const score = globalHealth.score;
  const color = score >= 90 ? '#22C55E' : score >= 75 ? '#F59E0B' : '#E2001A';

  const statusKey = score >= 90 ? 'green' : score >= 75 ? 'orange' : 'red';
  const status = STATUS_CONFIG[statusKey];

  const totalCountUp = useCountUp(projects.total, 1600, 0, 200);
  const deployedCountUp = useCountUp(projects.deployed, 1600, 0, 400);
  const inProgressCountUp = useCountUp(projects.inProgress, 1600, 0, 600);
  const delayedCountUp = useCountUp(projects.delayed, 1600, 0, 800);

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-5">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-text-muted text-xs font-medium tracking-widest uppercase mb-1 transition-colors duration-300">
            Santé Globale
          </p>
          <h2 className="text-gray-900 dark:text-white font-bold text-lg leading-tight transition-colors duration-300">
            Performance des Projets
          </h2>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          statusKey === 'green' ? 'bg-green-500/10 text-status-green border border-status-green/20' :
          statusKey === 'orange' ? 'bg-amber-500/10 text-status-orange border border-status-orange/20' :
          'bg-uib-red-dim text-uib-red border border-uib-red/20'
        }`}>
          <div className={`status-dot-${statusKey} w-1.5 h-1.5`} />
          {status.label}
        </div>
      </div>

      {/* ── Radial + Stats ──────────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        <RadialProgress value={score} color={color} size={140} />

        <div className="flex-1 space-y-3">
          <StatRow
            label="Total Projets"
            value={totalCountUp}
            icon="📋"
            color="text-gray-900 dark:text-white"
          />
          <StatRow
            label="Déployés"
            value={deployedCountUp}
            icon="✅"
            color="text-status-green"
          />
          <StatRow
            label="En cours"
            value={inProgressCountUp}
            icon="🔄"
            color="text-status-orange"
          />
          <StatRow
            label="En retard"
            value={delayedCountUp}
            icon="⚠️"
            color="text-uib-red"
          />
        </div>
      </div>

      {/* ── Direction Breakdown ─────────────────────────────────────── */}
      <div className="mt-auto space-y-2">
        <p className="text-gray-500 dark:text-text-muted text-xs font-medium uppercase tracking-wider transition-colors duration-300">
          Par Direction
        </p>
        <div className="space-y-2">
          {projects.byDirection.map((d, i) => (
            <DirectionBar key={d.direction} data={d} delay={i * 150} />
          ))}
        </div>
      </div>

      {/* ── Trend ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-glass-border transition-colors duration-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
        <span className="text-status-green text-xs font-semibold">{globalHealth.trend}</span>
        <span className="text-gray-500 dark:text-text-muted text-xs transition-colors duration-300">vs. mois précédent</span>
        <span className="ml-auto text-gray-500 dark:text-text-muted text-xs font-mono transition-colors duration-300">
          MAJ: 07/06/2026 14:30
        </span>
      </div>
    </div>
  );
}

function StatRow({ label, value, icon, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600 dark:text-text-secondary text-sm flex items-center gap-1.5 transition-colors duration-300">
        <span>{icon}</span>
        {label}
      </span>
      <span className={`kpi-number font-bold text-lg ${color}`}>{value}</span>
    </div>
  );
}

function DirectionBar({ data, delay }) {
  const rateCountUp = useCountUp(data.rate, 1800, 0, delay);
  const color = data.rate >= 90 ? '#22C55E' : data.rate >= 75 ? '#F59E0B' : '#E2001A';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-text-secondary text-xs transition-colors duration-300">{data.direction}</span>
        <span className="kpi-number text-xs font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          {rateCountUp}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-white/[0.06] rounded-full overflow-hidden transition-colors duration-300">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${data.rate}%` }}
          transition={{ duration: 1.5, delay: delay / 1000, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
