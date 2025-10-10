import { StatCard } from '../StatCard';
import { AlertTriangle } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <StatCard
        title="Total de Ocorrências"
        value="319"
        icon={AlertTriangle}
        description="Nos últimos 6 meses"
      />
    </div>
  );
}
