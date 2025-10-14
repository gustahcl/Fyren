import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockReports = [
  { id: "001", data: "10/10/2025", tipo: "Incêndio", regiao: "Metropolitana", responsavel: "Cap. Silva" },
  { id: "002", data: "08/10/2025", tipo: "Resgate", regiao: "Zona da Mata", responsavel: "Ten. Santos" },
  { id: "003", data: "05/10/2025", tipo: "Vazamento", regiao: "Agreste", responsavel: "Sgt. Oliveira" },
];

export default function Relatorios() {
  const { toast } = useToast();
  const [filteredReports] = useState(mockReports);

  const handleDownload = (id: string) => {
    toast({
      title: "Relatório Gerado",
      description: `PDF da ocorrência #${id} baixado com sucesso.`,
    });
    console.log("Downloading report:", id);
  };

  const handleDownloadAll = () => {
    toast({
      title: "Relatório Completo Gerado",
      description: "PDF com todas as ocorrências filtradas foi gerado.",
    });
    console.log("Downloading all reports");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Relatórios</h1>
          <p className="text-muted-foreground">Gere e exporte relatórios das ocorrências</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filtros de Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="period-start">Período - Início</Label>
                    <Input type="date" id="period-start" data-testid="input-period-start" />
                  </div>
                  <div>
                    <Label htmlFor="period-end">Período - Fim</Label>
                    <Input type="date" id="period-end" data-testid="input-period-end" />
                  </div>
                  <div>
                    <Label htmlFor="report-type">Tipo</Label>
                    <Select>
                      <SelectTrigger id="report-type" data-testid="select-report-type">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="incendio">Incêndio</SelectItem>
                        <SelectItem value="resgate">Resgate</SelectItem>
                        <SelectItem value="acidente">Acidente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="report-region">Região</Label>
                    <Select>
                      <SelectTrigger id="report-region" data-testid="select-report-region">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="metropolitana">Metropolitana</SelectItem>
                        <SelectItem value="zona-mata">Zona da Mata</SelectItem>
                        <SelectItem value="agreste">Agreste</SelectItem>
                        <SelectItem value="sertao">Sertão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle>Resultados</CardTitle>
                <Button onClick={handleDownloadAll} className="gap-2" data-testid="button-download-all">
                  <Download className="h-4 w-4" />
                  Baixar Todos
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Tipo</th>
                        <th className="text-left py-3 px-4 font-medium">Região</th>
                        <th className="text-left py-3 px-4 font-medium">Responsável</th>
                        <th className="text-left py-3 px-4 font-medium">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="border-b hover-elevate" data-testid={`report-${report.id}`}>
                          <td className="py-3 px-4">{report.data}</td>
                          <td className="py-3 px-4">{report.tipo}</td>
                          <td className="py-3 px-4">{report.regiao}</td>
                          <td className="py-3 px-4">{report.responsavel}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(report.id)}
                              data-testid={`button-download-${report.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredReports.length}</p>
                    <p className="text-sm text-muted-foreground">Ocorrências</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Período:</span>
                    <span className="text-sm font-medium">Últimos 7 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tipo mais comum:</span>
                    <span className="text-sm font-medium">Incêndio</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Região mais ativa:</span>
                    <span className="text-sm font-medium">Metropolitana</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2" data-testid="button-export-data">
                  <Download className="h-4 w-4" />
                  Exportar Dados
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
