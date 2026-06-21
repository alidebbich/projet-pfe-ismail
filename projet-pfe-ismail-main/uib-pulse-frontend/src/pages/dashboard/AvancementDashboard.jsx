import PowerBIEmbed from '../../components/PowerBIEmbed';

export default function AvancementDashboard() {
  return (
    <div className="p-6 h-full min-h-[calc(100vh-140px)]">
      <PowerBIEmbed title="Projets — Avancement & Adoption" settingKey="pbiUrlAdoption" defaultUrl="" />
    </div>
  );
}
