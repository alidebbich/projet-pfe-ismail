import { motion } from 'framer-motion';

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-300">
    <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
  </svg>
);

const ManagerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const PROFILES = [
  {
    id: 'manager',
    role: 'ROLE_MANAGER',
    title: 'Manager',
    subtitle: 'Profil opérationnel',
    Icon: ManagerIcon,
    accent: '#E2001A',
    iconBg: 'rgba(226,0,26,0.08)',
    badgeBg: 'rgba(226,0,26,0.1)',
    rights: [
      'Consultation de tous les tableaux de bord',
      'Ajout, modification et suppression de données',
      'Export de rapports (PDF, Excel)',
      'Supervision globale de la performance',
    ],
    dataAccess: 'Accès global — toutes les directions et tous les projets',
    accessLevel: 'Global',
  },
  {
    id: 'admin',
    role: 'ROLE_ADMIN',
    title: 'Administrateur',
    subtitle: 'Profil système',
    Icon: AdminIcon,
    accent: '#1C3A5E',
    iconBg: 'rgba(28,58,94,0.08)',
    badgeBg: 'rgba(28,58,94,0.1)',
    rights: [
      'Tous les droits du Manager',
      "Administration de l'application (gestion des utilisateurs et des rôles)",
      'Configuration des seuils et des alertes',
      "Supervision des journaux d'audit et de la sécurité",
    ],
    dataAccess: "Accès complet à l'ensemble du système, y compris les paramètres et les logs",
    accessLevel: 'Complet',
  },
];

const COMPARISON_ROWS = [
  { feature: 'Consultation des tableaux de bord', manager: true,  admin: true  },
  { feature: 'Ajout / modification de données',   manager: true,  admin: true  },
  { feature: 'Export rapports (PDF, Excel)',       manager: true,  admin: true  },
  { feature: 'Supervision de la performance',      manager: true,  admin: true  },
  { feature: 'Gestion des utilisateurs & rôles',  manager: false, admin: true  },
  { feature: 'Configuration des seuils & alertes',manager: false, admin: true  },
  { feature: "Journaux d'audit & sécurité",        manager: false, admin: true  },
];

export default function UserProfilesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#A89E8C' }}>
          Administration
        </p>
        <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Profils &amp; <span style={{ color: '#E2001A' }}>Droits d'Accès</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Deux profils sont définis pour l'accès à UIB Pulse, chacun avec des droits et un périmètre de données distincts.
        </p>
      </motion.div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {PROFILES.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-2xl bg-white overflow-hidden"
            style={{ border: `1px solid ${p.accent}30` }}
          >
            {/* Card top accent bar */}
            <div className="h-1 w-full" style={{ background: p.accent }} />

            {/* Card header */}
            <div className="px-6 py-5 border-b" style={{ background: p.iconBg, borderColor: `${p.accent}18` }}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl" style={{ background: p.iconBg, color: p.accent }}>
                  <p.Icon />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {p.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: p.badgeBg, color: p.accent }}>
                      {p.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Rights */}
            <div className="px-6 py-4 border-b" style={{ borderColor: '#EDE9E1' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A89E8C' }}>
                Droits &amp; Fonctionnalités
              </p>
              <ul className="space-y-2">
                {p.rights.map((right, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: p.accent }}>
                      <CheckIcon />
                    </span>
                    <span className="text-sm text-gray-700">{right}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data access */}
            <div className="px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#A89E8C' }}>
                Accès aux données
              </p>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: p.badgeBg, color: p.accent }}>
                  {p.accessLevel}
                </span>
                <span className="text-sm text-gray-700">{p.dataAccess}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #DDD8CF' }}
      >
        {/* Table title */}
        <div className="px-6 py-4 bg-white border-b" style={{ borderColor: '#DDD8CF' }}>
          <h3 className="text-base font-black text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Tableau comparatif des droits
          </h3>
        </div>

        <table className="w-full text-sm bg-white">
          <thead>
            <tr style={{ background: '#1C3A5E' }}>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/70 w-1/2">
                Fonctionnalité
              </th>
              <th className="text-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#FFB3B3' }}>
                Manager
              </th>
              <th className="text-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/70">
                Administrateur
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: '#EDE9E1' }}>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={i} className="hover:bg-[#F7F4EF] transition-colors">
                <td className="px-6 py-3.5 text-gray-700 font-medium">{row.feature}</td>
                <td className="px-6 py-3.5 text-center">
                  {row.manager ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                      style={{ background: 'rgba(226,0,26,0.1)' }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" style={{ color: '#E2001A' }}>
                        <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.465-6.697a.75.75 0 011.068-.25z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                      <XIcon />
                    </span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ background: 'rgba(28,58,94,0.1)' }}>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" style={{ color: '#1C3A5E' }}>
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.465-6.697a.75.75 0 011.068-.25z" clipRule="evenodd" />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
