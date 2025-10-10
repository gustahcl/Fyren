import { OccurrenceCard } from '../OccurrenceCard';

export default function OccurrenceCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <OccurrenceCard
        id="001"
        tipo="Incêndio"
        regiao="Recife - Centro"
        status="Em Andamento"
        equipe="Equipe Alpha"
        data="10/10/2025 14:30"
        onVerHistorico={() => console.log('Ver histórico')}
        onAtualizarStatus={() => console.log('Atualizar status')}
      />
    </div>
  );
}
