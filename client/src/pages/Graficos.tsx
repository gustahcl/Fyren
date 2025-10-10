import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data - TODO: remove mock functionality
const monthlyData = [
  { mes: "Jan", total: 45 },
  { mes: "Fev", total: 52 },
  { mes: "Mar", total: 38 },
  { mes: "Abr", total: 65 },
  { mes: "Mai", total: 48 },
  { mes: "Jun", total: 71 },
];

const typeData = [
  { name: "Incêndio", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Resgate", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Acidente", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Vazamento", value: 15, color: "hsl(var(--chart-4))" },
];

const recentIncidents = [
  { id: "001", tipo: "Incêndio", data: "10/10/2025 14:30" },
  { id: "002", tipo: "Resgate", data: "08/10/2025 09:15" },
  { id: "003", tipo: "Vazamento", data: "05/10/2025 18:45" },
];

export default function Graficos() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard de Análise</h1>
          <p className="text-muted-foreground">Visualize estatísticas e tendências das ocorrências</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Ocorrências"
            value="319"
            icon={AlertTriangle}
            description="Nos últimos 6 meses"
          />
          <StatCard
            title="Em Andamento"
            value="12"
            icon={Clock}
            description="38% do total"
          />
          <StatCard
            title="Concluídas"
            value="287"
            icon={CheckCircle2}
            description="90% de resolução"
          />
          <StatCard
            title="Tipo Comum"
            value="Incêndio"
            icon={TrendingUp}
            description="41% das ocorrências"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ocorrências por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem"
                    }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Incidentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover-elevate transition-all"
                  data-testid={`incident-${incident.id}`}
                >
                  <div>
                    <p className="font-medium">Ocorrência #{incident.id}</p>
                    <p className="text-sm text-muted-foreground">{incident.tipo}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{incident.data}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
