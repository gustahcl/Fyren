import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, History } from "lucide-react";

type OccurrenceCardProps = {
  id: string;
  tipo: string;
  regiao: string;
  status: "Em Andamento" | "Concluído";
  equipe: string;
  data: string;
  onVerHistorico: () => void;
  onAtualizarStatus: () => void;
};

const statusColors = {
  "Em Andamento": "bg-blue-500/20 text-blue-500 border-blue-500/50",
  "Concluído": "bg-green-500/20 text-green-500 border-green-500/50"
};

export function OccurrenceCard({
  id,
  tipo,
  regiao,
  status,
  equipe,
  data,
  onVerHistorico,
  onAtualizarStatus
}: OccurrenceCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300" data-testid={`card-occurrence-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">#{id}</CardTitle>
        <Badge className={statusColors[status]} data-testid={`badge-status-${id}`}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tipo</p>
          <p className="text-base font-semibold">{tipo}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{regiao}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{equipe}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{data}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 flex-1"
          onClick={onVerHistorico}
          data-testid={`button-history-${id}`}
        >
          <History className="h-4 w-4" />
          Ver Histórico
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={onAtualizarStatus}
          data-testid={`button-update-${id}`}
        >
          Atualizar Status
        </Button>
      </CardFooter>
    </Card>
  );
}
