import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { useCountUp } from '../../hooks/useCountUp';
import { mockKpis, getStatusColor } from '../../data/mockKpis';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-gray-600 dark:text-text-secondary transition-colors duration-300">{label}</p>
        <p className="text-gray-900 dark:text-white font-bold transition-colors duration-300">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SupportSLACard() {
  const { kpiD2 } = mockKpis;
  const colors = getStatusColor(kpiD2.status);

  const valueCountUp = useCountUp(kpiD2.value, 1800, 1);
  const totalCountUp = useCountUp(kpiD2.criticalTicketsTotal, 1400, 0, 300);
  const closedCountUp = useCountUp(kpiD2.criticalTicketsClosedJ1, 1400, 0, 500);

  return (
    <div className={`glass-card p-5 h-full flex flex-col gap-4 ${kpiD2.status === 'red' ? 'glass-card-red' : ''}`}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-text-muted text-xs tracking-widest uppercase mb-1 transition-colors duration-300">{kpiD2.code}</p>
          <h3 className="text-gray-900 dark:text-white font-bold text-base transition-colors duration-300">{kpiD2.label}</h3>
          <p className="text-gray-500 dark:text-text-muted text-xs mt-0.5 transition-colors duration-300">{kpiD2.labelEn}</p>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
          {kpiD2.status === 'green' ? '● Vert' : kpiD2.status === 'orange' ? '◐ Orange' : '● Rouge'}
        </div>
      </div>

      {/* ── Big Number ──────────────────────────────────────────── */}
      <div className="flex items-end gap-2">
        <motion.span
          className={`kpi-number font-black text-5xl leading-none ${colors.text} transition-colors duration-300`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {valueCountUp.toFixed(1)}
        </motion.span>
        <span className="text-gray-500 dark:text-text-muted text-lg mb-1 transition-colors duration-300">%</span>
        <div className="ml-auto text-right">
          <p className="text-gray-500 dark:text-text-muted text-xs transition-colors duration-300">Cible</p>
          <p className="text-gray-600 dark:text-text-secondary font-mono text-sm transition-colors duration-300">{kpiD2.target}%</p>
        </div>
      </div>

      {/* ── Ticket Counts ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-100 dark:bg-white/[0.03] rounded-xl px-3 py-2 border border-gray-200 dark:border-glass-border transition-colors duration-300">
          <p className="text-gray-500 dark:text-text-muted text-xs mb-0.5 transition-colors duration-300">Tickets Critiques</p>
          <p className="kpi-number text-gray-900 dark:text-white font-bold text-xl transition-colors duration-300">{totalCountUp}</p>
        </div>
        <div className="bg-status-green/10 rounded-xl px-3 py-2 border border-status-green/20 transition-colors duration-300">
          <p className="text-gray-500 dark:text-text-muted text-xs mb-0.5 transition-colors duration-300">Clos en J+1</p>
          <p className="kpi-number text-status-green font-bold text-xl">{closedCountUp}</p>
        </div>
      </div>

      {/* ── N1 / N2 Breakdown ────────────────────────────────────── */}
      <div className="space-y-2">
        {kpiD2.byLevel.map((lvl) => {
          const lvlColor = lvl.rate >= 90 ? '#22C55E' : lvl.rate >= 75 ? '#F59E0B' : '#E2001A';
          return (
            <div key={lvl.level} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-text-secondary text-xs font-medium transition-colors duration-300">Niveau {lvl.level}</span>
                <span className="kpi-number text-xs font-bold" style={{ color: lvlColor }}>
                  {lvl.rate.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-white/[0.05] rounded-full overflow-hidden transition-colors duration-300">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: lvlColor, boxShadow: `0 0 6px ${lvlColor}50` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lvl.rate}%` }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Trend Chart ──────────────────────────────────────────── */}
      <div className="flex-1 min-h-[80px]">
        <p className="text-gray-500 dark:text-text-muted text-xs mb-2 uppercase tracking-wider transition-colors duration-300">Tendance 6 mois</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={kpiD2.history} barSize={14}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#606060', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[60, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <ReferenceLine
              y={90} stroke="rgba(34,197,94,0.3)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {kpiD2.history.map((entry, idx) => {
                const c = entry.value >= 90 ? '#22C55E' : entry.value >= 75 ? '#F59E0B' : '#E2001A';
                return <Cell key={idx} fill={c} fillOpacity={0.8} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
