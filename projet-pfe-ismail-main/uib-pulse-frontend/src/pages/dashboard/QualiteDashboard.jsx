import PowerBIEmbed from '../../components/PowerBIEmbed';

export default function QualiteDashboard() {
  return (
    <div className="p-6 h-full min-h-[calc(100vh-140px)]">
      <PowerBIEmbed title="Projets — Qualité" settingKey="pbiUrlQualite" defaultUrl="" />
    </div>
  );
}
