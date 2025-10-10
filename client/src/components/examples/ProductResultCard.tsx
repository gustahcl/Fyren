import { ProductResultCard } from '../ProductResultCard';

export default function ProductResultCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <ProductResultCard
        nome="Equipamento de Proteção Individual Completo"
        imagem="https://images.unsplash.com/photo-1591731604408-4c1a3b4a5b0e?w=400"
        similaridade={95}
        categoria="Equipamento de Segurança"
        fornecedor="SafeGuard Brasil"
      />
    </div>
  );
}
