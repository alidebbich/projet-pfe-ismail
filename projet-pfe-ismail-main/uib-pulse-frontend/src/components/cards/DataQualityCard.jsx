import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';
import { useCountUp } from '../../hooks/useCountUp';
import { mockKpis, getStatusColor } from '../../data/mockKpis';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-gray-600 dark:text-text-secondary transition-colors duration-300">{label}</p>
        <p className="text-status-red font-bold transition-colors duration-300">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function DataQualityCard() {
  const { kpiP10 } = mockKpis;
  const colors = getStatusColor(kpiP10.status);

  const valueCountUp = useCountUp(kpiP10.value, 2000, 1);
  const detectedCountUp = useCountUp(kpiP10.detectedBeforeProd, 1400, 0, 300);
  const totalCountUp = useCountUp(kpiP10.totalAnomalies, 1400, 0, 500);

  return (
    <div className="glass-card-red p-5 h-full flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-text-muted text-xs tracking-widest uppercase mb-1 transition-colors duration-300">{kpiP10.code}</p>
          <h3 className="text-gray-900 dark:text-white font-bold text-base transition-colors duration-300">{kpiP10.label}</h3>
          <p className="text-gray-500 dark:text-text-muted text-xs mt-0.5 transition-colors duration-300">{kpiP10.labelEn}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-uib-red-dim border border-uib-red/20 transition-colors duration-300">
            <div className="status-dot-red w-1.5 h-1.5" />
            <span className="text-uib-red text-xs font-bold transition-colors duration-300">CRITIQUE</span>
          </div>
          <span className="text-gray-500 dark:text-text-muted text-xs transition-colors duration-300">Sous le seuil min.</span>
        </div>
      </div>

      {/* ── Big Number with gauge ─────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <motion.div
            className="flex items-end gap-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="kpi-number text-uib-red font-black text-5xl leading-none">
              {valueCountUp.toFixed(1)}
            </span>
            <span className="text-gray-500 dark:text-text-muted text-2xl mb-1 transition-colors duration-300">%</span>
          </motion.div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500 dark:text-text-muted text-xs transition-colors duration-300">Cible min.:</span>
            <span className="text-status-orange font-mono text-xs">{kpiP10.target}%</span>
            <span className="text-uib-red text-xs font-semibold">
              ({(kpiP10.value - kpiP10.target).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Gauge Arc */}
        <div className="ml-auto">
          <GaugeArc value={kpiP10.value} />
        </div>
      </div>

      {/* ── Counts ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-500/10 rounded-xl p-3 border border-status-green/20">
          <p className="text-gray-500 dark:text-text-muted text-xs mb-1 transition-colors duration-300">Détectées avant prod</p>
          <p className="kpi-number text-status-green font-black text-2xl">{detectedCountUp}</p>
        </div>
        <div className="bg-gray-100 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-200 dark:border-glass-border transition-colors duration-300">
          <p className="text-gray-500 dark:text-text-muted text-xs mb-1 transition-colors duration-300">Total anomalies</p>
          <p className="kpi-number text-gray-900 dark:text-white font-black text-2xl transition-colors duration-300">{totalCountUp}</p>
        </div>
      </div>

      {/* ── Trend Line ───────────────────────────────────────────── */}
      <div className="flex-1 min-h-[80px]">
        <p className="text-gray-500 dark:text-text-muted text-xs mb-2 uppercase tracking-wider transition-colors duration-300">Tendance — En baisse ↓</p>
        <ResponsiveContainer width="100%" height={70}>
          <LineChart data={kpiP10.history}>
            <XAxis dataKey="month" tick={{ fill: '#606060', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[60, 90]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine y={75} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#E2001A"
              strokeWidth={2}
              dot={{ fill: '#E2001A', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#E2001A', stroke: 'rgba(226,0,26,0.3)', strokeWidth: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Alert Footer ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-3 border-t border-uib-red/20">
        <svg viewBox="0 0 24 24" fill="#E2001A" className="w-4 h-4 flex-shrink-0">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
        <span className="text-uib-red text-xs font-semibold">
          Action requise — Renforcer les tests pré-production
        </span>
      </div>
    </div>
  );
}

function GaugeArc({ value }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const angle = -135 + (clampedValue / 100) * 270; // -135 to +135 deg
  const color = value >= 90 ? '#22C55E' : value >= 75 ? '#F59E0B' : '#E2001A';

  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Track */}
        <path
          d="M 10 60 A 30 30 0 1 1 70 60"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Zone markers */}
        <path d="M 10 60 A 30 30 0 0 1 24.4 19.4" fill="none" stroke="rgba(226,0,26,0.3)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 24.4 19.4 A 30 30 0 0 1 55.6 19.4" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 55.6 19.4 A 30 30 0 0 1 70 60" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="7" strokeLinecap="round" />
        {/* Needle */}
        <motion.line
          x1="40" y1="40"
          x2="40" y2="13"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transformOrigin: '40px 40px', rotate: `${angle}deg` }}
          initial={{ rotate: '-135deg' }}
          animate={{ rotate: `${angle}deg` }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        />
        <circle cx="40" cy="40" r="3" fill={color} />
      </svg>
    </div>
  );
}
