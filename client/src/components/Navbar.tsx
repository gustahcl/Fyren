import { Link, useLocation } from "wouter";
import { Flame, AlertTriangle, FileText, BarChart3, UserCircle, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/", label: "S.O.S", icon: AlertTriangle },
    { path: "/relatorios", label: "Relatórios", icon: FileText },
    { path: "/graficos", label: "Gráficos", icon: BarChart3 },
    { path: "/perfil", label: "Perfil", icon: UserCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Fyren</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
