import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductResultCardProps = {
  nome: string;
  imagem: string;
  similaridade: number;
  categoria: string;
  fornecedor?: string;
};

export function ProductResultCard({
  nome,
  imagem,
  similaridade,
  categoria,
  fornecedor
}: ProductResultCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-300 overflow-hidden" data-testid="card-product">
      <img src={imagem} alt={nome} className="w-full h-48 object-cover" />
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base line-clamp-2">{nome}</h3>
          <Badge variant="secondary" className="shrink-0">
            {similaridade}%
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{categoria}</p>
        {fornecedor && (
          <p className="text-xs text-muted-foreground">Por: {fornecedor}</p>
        )}
      </CardContent>
    </Card>
  );
}
