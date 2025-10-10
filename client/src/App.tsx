import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import SOS from "@/pages/SOS";
import Graficos from "@/pages/Graficos";
import Relatorios from "@/pages/Relatorios";
import BuscaVisual from "@/pages/BuscaVisual";
import Perfil from "@/pages/Perfil";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SOS} />
      <Route path="/graficos" component={Graficos} />
      <Route path="/relatorios" component={Relatorios} />
      <Route path="/busca-visual" component={BuscaVisual} />
      <Route path="/perfil" component={Perfil} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
