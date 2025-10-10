import { useState } from "react";
import { VisualSearchUpload } from "@/components/VisualSearchUpload";
import { ProductResultCard } from "@/components/ProductResultCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import equipmentImage from "@assets/stock_images/firefighter_emergenc_14031530.jpg";
import truckImage from "@assets/stock_images/fire_truck_emergency_65e72f10.jpg";

// Mock data - TODO: remove mock functionality
const mockResults = [
  { nome: "Equipamento de Proteção Individual Completo", imagem: equipmentImage, similaridade: 95, categoria: "Equipamento de Segurança", fornecedor: "SafeGuard Brasil" },
  { nome: "Capacete de Combate a Incêndio F1", imagem: equipmentImage, similaridade: 89, categoria: "Equipamento de Proteção", fornecedor: "FirePro" },
  { nome: "Viatura de Resgate ABT-2000", imagem: truckImage, similaridade: 87, categoria: "Viaturas", fornecedor: "AutoBombeiros PE" },
  { nome: "Kit de Primeiros Socorros Avançado", imagem: equipmentImage, similaridade: 82, categoria: "Equipamento Médico", fornecedor: "MedEmergency" },
];

export default function BuscaVisual() {
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleImageUpload = (file: File) => {
    console.log("Image uploaded:", file.name);
    setIsSearching(true);
    // Simulate AI search
    setTimeout(() => {
      setIsSearching(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Busca Visual de Produtos</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use inteligência artificial para encontrar equipamentos e produtos através de imagens
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <VisualSearchUpload onImageUpload={handleImageUpload} isLoading={isSearching} />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select>
                    <SelectTrigger id="categoria" data-testid="select-category">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="equipamento">Equipamento de Segurança</SelectItem>
                      <SelectItem value="viatura">Viaturas</SelectItem>
                      <SelectItem value="medico">Equipamento Médico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="similaridade">Similaridade Mínima</Label>
                  <Select>
                    <SelectTrigger id="similaridade" data-testid="select-similarity">
                      <SelectValue placeholder="70%" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%+</SelectItem>
                      <SelectItem value="80">80%+</SelectItem>
                      <SelectItem value="70">70%+</SelectItem>
                      <SelectItem value="60">60%+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Select>
                    <SelectTrigger id="fornecedor" data-testid="select-supplier">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="safeguard">SafeGuard Brasil</SelectItem>
                      <SelectItem value="firepro">FirePro</SelectItem>
                      <SelectItem value="autobombeiros">AutoBombeiros PE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {hasResults && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Resultados da Busca</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockResults.map((result, index) => (
                <ProductResultCard key={index} {...result} />
              ))}
            </div>
          </div>
        )}

        {!hasResults && !isSearching && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Faça upload de uma imagem para começar a busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
