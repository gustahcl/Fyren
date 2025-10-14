import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { name: string; email: string } | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("fyren_auth");
    if (stored) {
      const data = JSON.parse(stored);
      setIsAuthenticated(true);
      setUser(data.user);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // TODO: remove mock functionality - integrate with real authentication
    if (email === "admin@cbmpe.gov.br" && password === "admin123") {
      const userData = { name: "Capitão João Silva", email };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("fyren_auth", JSON.stringify({ user: userData }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("fyren_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
