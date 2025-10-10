import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Key, FileText, Download, Mail, Phone, Calendar, Hash } from "lucide-react";
import profileImage from "@assets/stock_images/emergency_response_f_c0e34c76.jpg";

// Mock data - TODO: remove mock functionality
const userData = {
  nome: "Capitão João Silva",
  email: "admin@cbmpe.gov.br",
  patente: "Capitão",
  unidade: "Batalhão 99 - Metropolitana",
  matricula: "CB-2025-001",
  telefone: "(81) 99999-9999",
  nascimento: "15/03/1985",
  fotoPerfilURL: profileImage
};

export default function Perfil() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">Informações do bombeiro logado no sistema</p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-32 w-32 border-4 border-primary">
                  <AvatarImage src={userData.fotoPerfilURL} alt={userData.nome} />
                  <AvatarFallback className="text-2xl">JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold" data-testid="text-user-name">{userData.nome}</h2>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/50">
                      {userData.patente}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{userData.unidade}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" className="gap-2" data-testid="button-change-password">
                      <Key className="h-4 w-4" />
                      Alterar Senha
                    </Button>
                    <Button variant="outline" className="gap-2" data-testid="button-my-forms">
                      <FileText className="h-4 w-4" />
                      Meus Formulários
                    </Button>
                    <Button variant="outline" className="gap-2" data-testid="button-export-user-data">
                      <Download className="h-4 w-4" />
                      Exportar Dados
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium" data-testid="text-email">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium" data-testid="text-phone">{userData.telefone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium" data-testid="text-birth">{userData.nascimento}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Matrícula</p>
                    <p className="font-medium" data-testid="text-matricula">{userData.matricula}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="h-5 w-5 bg-primary/20 text-primary border-primary/50" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Patente</p>
                    <p className="font-medium" data-testid="text-patente">{userData.patente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Unidade</p>
                    <p className="font-medium" data-testid="text-unidade">{userData.unidade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
