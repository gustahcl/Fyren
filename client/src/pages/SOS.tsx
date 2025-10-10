import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OccurrenceCard } from "@/components/OccurrenceCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - TODO: remove mock functionality
const mockOccurrences = [
  { id: "001", tipo: "Incêndio", regiao: "Metropolitana", status: "Em Andamento" as const, equipe: "Equipe Alpha", data: "10/10/2025 14:30" },
  { id: "002", tipo: "Resgate", regiao: "Zona da Mata", status: "Concluído" as const, equipe: "Equipe Bravo", data: "08/10/2025 09:15" },
  { id: "003", tipo: "Vazamento", regiao: "Agreste", status: "Em Andamento" as const, equipe: "Equipe Charlie", data: "05/10/2025 16:00" },
];

export default function SOS() {
  const [selectedOccurrence, setSelectedOccurrence] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusProgress, setStatusProgress] = useState(50);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ocorrência Registrada",
      description: "A ocorrência foi registrada com sucesso no sistema.",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Central de Ocorrências</h1>
          <p className="text-muted-foreground">Gerencie todas as ocorrências em tempo real</p>
        </div>

        <Tabs defaultValue="filtro" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="filtro" data-testid="tab-filter">Filtrar</TabsTrigger>
            <TabsTrigger value="registrar" data-testid="tab-register">Registrar</TabsTrigger>
            <TabsTrigger value="status" data-testid="tab-status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="filtro" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="filter-date">Data</Label>
                <Input type="date" id="filter-date" data-testid="input-filter-date" />
              </div>
              <div>
                <Label htmlFor="filter-type">Tipo</Label>
                <Select>
                  <SelectTrigger id="filter-type" data-testid="select-filter-type">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incendio">Incêndio</SelectItem>
                    <SelectItem value="resgate">Resgate</SelectItem>
                    <SelectItem value="acidente">Acidente</SelectItem>
                    <SelectItem value="vazamento">Vazamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-region">Região</Label>
                <Select>
                  <SelectTrigger id="filter-region" data-testid="select-filter-region">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metropolitana">Metropolitana</SelectItem>
                    <SelectItem value="zona-mata">Zona da Mata</SelectItem>
                    <SelectItem value="agreste">Agreste</SelectItem>
                    <SelectItem value="sertao">Sertão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-status">Status</Label>
                <Select>
                  <SelectTrigger id="filter-status" data-testid="select-filter-status">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por palavra-chave..." className="pl-10" data-testid="input-search" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {mockOccurrences.map((occ) => (
                <OccurrenceCard
                  key={occ.id}
                  {...occ}
                  onVerHistorico={() => setSelectedOccurrence(occ.id)}
                  onAtualizarStatus={() => setShowStatusModal(true)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="registrar">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="equipe">Equipe</Label>
                  <Input id="equipe" placeholder="Ex: Equipe Alpha" data-testid="input-team" />
                </div>
                <div>
                  <Label htmlFor="regiao">Região</Label>
                  <Select>
                    <SelectTrigger id="regiao" data-testid="select-region">
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recife">Recife</SelectItem>
                      <SelectItem value="olinda">Olinda</SelectItem>
                      <SelectItem value="jaboatao">Jaboatão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="viatura">Viatura</Label>
                  <Input id="viatura" placeholder="Ex: ABT-001" data-testid="input-vehicle" />
                </div>
                <div>
                  <Label htmlFor="data">Data e Hora</Label>
                  <Input type="datetime-local" id="data" data-testid="input-datetime" />
                </div>
                <div>
                  <Label htmlFor="natureza">Natureza</Label>
                  <Select>
                    <SelectTrigger id="natureza" data-testid="select-nature">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incendio">Incêndio</SelectItem>
                      <SelectItem value="resgate">Resgate</SelectItem>
                      <SelectItem value="acidente">Acidente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="atividade">Atividade Operacional</Label>
                  <Select>
                    <SelectTrigger id="atividade" data-testid="select-activity">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="combate">Combate a Incêndio</SelectItem>
                      <SelectItem value="salvamento">Salvamento</SelectItem>
                      <SelectItem value="prevencao">Prevenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="descricao">Descrição da Ocorrência</Label>
                <Textarea 
                  id="descricao" 
                  rows={4} 
                  placeholder="Descreva detalhadamente a ocorrência..."
                  data-testid="textarea-description"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="foto">Upload de Foto</Label>
                  <div className="mt-2">
                    <Button type="button" variant="outline" className="w-full gap-2" data-testid="button-upload-photo">
                      <Upload className="h-4 w-4" />
                      Selecionar Foto
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="video">Upload de Vídeo</Label>
                  <div className="mt-2">
                    <Button type="button" variant="outline" className="w-full gap-2" data-testid="button-upload-video">
                      <Upload className="h-4 w-4" />
                      Selecionar Vídeo
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" size="lg" data-testid="button-submit">
                <Plus className="h-5 w-5" />
                Registrar Ocorrência
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="status">
            <div className="grid md:grid-cols-3 gap-6">
              {mockOccurrences.map((occ) => (
                <OccurrenceCard
                  key={occ.id}
                  {...occ}
                  onVerHistorico={() => setSelectedOccurrence(occ.id)}
                  onAtualizarStatus={() => setShowStatusModal(true)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedOccurrence} onOpenChange={() => setSelectedOccurrence(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Histórico da Ocorrência #{selectedOccurrence}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="h-full w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Ocorrência registrada</p>
                  <p className="text-sm text-muted-foreground">10/10/2025 14:30</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="h-full w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Equipe despachada</p>
                  <p className="text-sm text-muted-foreground">10/10/2025 14:35</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                </div>
                <div>
                  <p className="font-medium">Em andamento</p>
                  <p className="text-sm text-muted-foreground">10/10/2025 14:45</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{statusProgress}%</span>
                </div>
                <Progress value={statusProgress} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>Aviso</div>
                <div>Em Rota</div>
                <div>No Local</div>
                <div>Concluído</div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setStatusProgress(100);
                  toast({ title: "Status atualizado com sucesso!" });
                  setTimeout(() => setShowStatusModal(false), 1000);
                }}
                data-testid="button-confirm-status"
              >
                Confirmar Atualização
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
