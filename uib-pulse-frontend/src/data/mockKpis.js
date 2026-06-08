// UIB Pulse — Mock KPI Data (Bilingual FR/EN)
// Replace with live API data from Spring Boot backend

export const mockKpis = {
  // ─── Global Health ────────────────────────────────────────────────────────
  globalHealth: {
    score: 84,
    label: 'Santé Globale Projets',
    labelEn: 'Global Project Health',
    trend: '+3.2%',
    trendPositive: true,
    lastUpdated: '2026-06-07T14:30:00Z',
  },

  // ─── Project Overview ─────────────────────────────────────────────────────
  projects: {
    total: 47,
    deployed: 38,
    inProgress: 6,
    delayed: 3,
    byDirection: [
      { direction: 'DSI', total: 18, deployed: 15, rate: 83 },
      { direction: 'DCR', total: 12, deployed: 11, rate: 92 },
      { direction: 'DRM', total: 9, deployed: 7, rate: 78 },
      { direction: 'DOSI', total: 8, deployed: 5, rate: 63 },
    ],
    byPhase: [
      { phase: 'Cadrage', count: 4 },
      { phase: 'Développement', count: 12 },
      { phase: 'Recette', count: 8 },
      { phase: 'Déploiement', count: 5 },
      { phase: 'Production', count: 18 },
    ],
  },

  // ─── KPI-P2: Taux de Déploiement ─────────────────────────────────────────
  kpiP2: {
    code: 'KPI-P2',
    label: 'Taux de Déploiement',
    labelEn: 'Deployment Rate',
    value: 80.9,
    target: 90,
    unit: '%',
    status: 'orange', // green >= 90, orange 75-89, red < 75
    numerator: 38,
    denominator: 47,
    history: [
      { month: 'Jan', value: 72 },
      { month: 'Fév', value: 75 },
      { month: 'Mar', value: 78 },
      { month: 'Avr', value: 76 },
      { month: 'Mai', value: 80 },
      { month: 'Jun', value: 80.9 },
    ],
  },

  // ─── KPI-D2: SLA E-Ticketing ──────────────────────────────────────────────
  kpiD2: {
    code: 'KPI-D2',
    label: 'SLA E-Ticketing',
    labelEn: 'E-Ticketing SLA',
    value: 91.3,
    target: 90,
    unit: '%',
    status: 'green',
    criticalTicketsTotal: 46,
    criticalTicketsClosedJ1: 42,
    byLevel: [
      { level: 'N1', total: 24, closedJ1: 23, rate: 95.8 },
      { level: 'N2', total: 22, closedJ1: 19, rate: 86.4 },
    ],
    history: [
      { month: 'Jan', value: 85 },
      { month: 'Fév', value: 88 },
      { month: 'Mar', value: 90 },
      { month: 'Avr', value: 89 },
      { month: 'Mai', value: 92 },
      { month: 'Jun', value: 91.3 },
    ],
  },

  // ─── KPI-P10: Anomalies Critiques ────────────────────────────────────────
  kpiP10: {
    code: 'KPI-P10',
    label: 'Anomalies Critiques',
    labelEn: 'Critical Anomalies',
    value: 73.1,
    target: 75,
    unit: '%',
    status: 'red', // Below 75%
    detectedBeforeProd: 19,
    totalAnomalies: 26,
    history: [
      { month: 'Jan', value: 82 },
      { month: 'Fév', value: 79 },
      { month: 'Mar', value: 77 },
      { month: 'Avr', value: 75 },
      { month: 'Mai', value: 74 },
      { month: 'Jun', value: 73.1 },
    ],
  },

  // ─── Critical Alerts ─────────────────────────────────────────────────────
  criticalAlerts: [
    {
      id: 1,
      type: 'anomaly',
      title: 'Anomalies Critiques ↓',
      titleEn: 'Critical Anomalies ↓',
      detail: 'KPI-P10 sous le seuil (73.1%)',
      detailEn: 'KPI-P10 below threshold (73.1%)',
      severity: 'critical',
      timestamp: '2026-06-07T08:15:00Z',
    },
    {
      id: 2,
      type: 'delay',
      title: '3 Projets en Retard',
      titleEn: '3 Projects Delayed',
      detail: 'DOSI: 2 projets — DRM: 1 projet',
      detailEn: 'DOSI: 2 projects — DRM: 1 project',
      severity: 'high',
      timestamp: '2026-06-07T09:00:00Z',
    },
    {
      id: 3,
      type: 'ticket',
      title: 'SLA N2 Dégradé',
      titleEn: 'N2 SLA Degraded',
      detail: 'N2 SLA: 86.4% — En dessous de 90%',
      detailEn: 'N2 SLA: 86.4% — Below 90% target',
      severity: 'medium',
      timestamp: '2026-06-07T10:30:00Z',
    },
  ],

  // ─── Directions (for filter) ──────────────────────────────────────────────
  directions: ['Tous', 'DSI', 'DCR', 'DRM', 'DOSI'],
};

export function getStatusColor(status) {
  switch (status) {
    case 'green': return { text: 'text-status-green', bg: 'bg-green-500/10', border: 'border-status-green/30', glow: 'shadow-green-glow' };
    case 'orange': return { text: 'text-status-orange', bg: 'bg-amber-500/10', border: 'border-status-orange/30', glow: '' };
    case 'red': return { text: 'text-uib-red', bg: 'bg-uib-red-dim', border: 'border-uib-red/30', glow: 'shadow-red-glow animate-pulse-red' };
    default: return { text: 'text-text-secondary', bg: 'bg-white/5', border: 'border-white/10', glow: '' };
  }
}

export function computeStatus(value, greenThreshold = 90, orangeThreshold = 75) {
  if (value >= greenThreshold) return 'green';
  if (value >= orangeThreshold) return 'orange';
  return 'red';
}
