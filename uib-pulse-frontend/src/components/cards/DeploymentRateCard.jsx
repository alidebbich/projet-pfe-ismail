import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis,
} from 'recharts';
import { useCountUp } from '../../hooks/useCountUp';
import { mockKpis, getStatusColor } from '../../data/mockKpis';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-status-orange font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function DeploymentRateCard() {
  const { kpiP2 } = mockKpis;
  const colors = getStatusColor(kpiP2.status);

  const valueCountUp = useCountUp(kpiP2.value, 2000, 1);
  const numCountUp = useCountUp(kpiP2.numerator, 1400, 0, 300);
  const denCountUp = useCountUp(kpiP2.denominator, 1400, 0, 300);

  const ringData = [
    { name: 'Déployés', value: kpiP2.numerator },
    { name: 'Non déployés', value: kpiP2.denominator - kpiP2.numerator },
  ];

  const ringColors = ['#F59E0B', 'rgba(255,255,255,0.06)'];

  return (
    <div className="glass-card p-5 h-full flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-text-muted text-xs tracking-widest uppercase mb-1 transition-colors duration-300">{kpiP2.code}</p>
          <h3 className="text-gray-900 dark:text-white font-bold text-base transition-colors duration-300">{kpiP2.label}</h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
          ◐ Orange
        </div>
      </div>

      {/* ── Ring + Value ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Donut Ring */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ringData}
                cx="50%" cy="50%"
                innerRadius={38} outerRadius={52}
                startAngle={90} endAngle={-270}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={2000}
              >
                {ringData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={ringColors[idx]}
                    style={idx === 0 ? { filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' } : {}}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="kpi-number text-status-orange font-black text-2xl leading-none">
              {valueCountUp.toFixed(0)}
            </span>
            <span className="text-gray-500 dark:text-text-muted text-xs transition-colors duration-300">%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">Déployés</span>
            <span className="kpi-number text-status-green font-bold text-xl transition-colors duration-300">{numCountUp}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">Planifiés</span>
            <span className="kpi-number text-gray-900 dark:text-white font-bold text-xl transition-colors duration-300">{denCountUp}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-glass-border flex justify-between items-center transition-colors duration-300">
            <span className="text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">Cible</span>
            <span className="kpi-number text-gray-600 dark:text-text-secondary text-sm transition-colors duration-300">{kpiP2.target}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-status-orange" />
            <span className="text-status-orange text-xs font-medium">
              À {(kpiP2.target - kpiP2.value).toFixed(1)}% de l'objectif
            </span>
          </div>
        </div>
      </div>

      {/* ── Threshold Indicator ──────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500 dark:text-text-muted mb-1 transition-colors duration-300">
          <span>0%</span>
          <span className="text-uib-red">75% Rouge</span>
          <span className="text-status-orange">90% Vert</span>
          <span>100%</span>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-white/[0.05] rounded-full overflow-hidden transition-colors duration-300">
          {/* Red zone */}
          <div className="absolute left-0 top-0 h-full w-[75%] bg-gradient-to-r from-uib-red/20 to-status-orange/20 rounded-full" />
          {/* Progress marker */}
          <motion.div
            className="absolute top-0 h-full bg-status-orange rounded-full"
            style={{ left: 0, boxShadow: '0 0 8px rgba(245,158,11,0.5)' }}
            initial={{ width: 0 }}
            animate={{ width: `${kpiP2.value}%` }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Current marker dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-status-orange"
            style={{ boxShadow: '0 0 8px rgba(245,158,11,0.7)' }}
            initial={{ left: '0%' }}
            animate={{ left: `calc(${kpiP2.value}% - 6px)` }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* ── Area Chart ───────────────────────────────────────────── */}
      <div className="flex-1 min-h-[60px]">
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={kpiP2.history}>
            <defs>
              <linearGradient id="deployGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#606060', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[60, 100]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#deployGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
