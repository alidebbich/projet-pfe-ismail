import { useOutletContext } from 'react-router-dom';
import PowerBIEmbed from '../../components/PowerBIEmbed';

export default function SupportDashboard() {
  const { selectedDirection } = useOutletContext();

  return (
    <div className="p-6 h-full min-h-[calc(100vh-140px)]">
      <PowerBIEmbed 
        title="Tableau de bord Support"
        settingKey="pbiUrlSupport"
        defaultUrl=""
      />
    </div>
  );
}
