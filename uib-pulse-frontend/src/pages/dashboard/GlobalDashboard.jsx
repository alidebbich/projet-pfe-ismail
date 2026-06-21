import { useOutletContext } from 'react-router-dom';
import PowerBIEmbed from '../../components/PowerBIEmbed';

export default function GlobalDashboard() {
  const { selectedDirection } = useOutletContext();
  
  // Example appending filter to URL (pseudo-logic for Power BI URL filtering)
  const filterParam = selectedDirection !== 'Tous' ? `&$filter=Direction/Nom eq '${selectedDirection}'` : '';

  return (
    <div className="p-6 h-full min-h-[calc(100vh-140px)]">
      <PowerBIEmbed 
        title="Vue Globale (DD&P)"
        settingKey="pbiUrlGlobal"
        defaultUrl=""
      />
    </div>
  );
}
