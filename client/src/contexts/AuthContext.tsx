import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { type User } from '@shared/schema';

// Define a forma do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Cria o contexto com um valor inicial indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Provedor que irá envolver a sua aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa a carregar para verificar a sessão
  const [, setLocation] = useLocation();

  // Efeito para verificar o status da sessão quando a aplicação carrega
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        if (data.isAuthenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true); // Define o estado de carregamento

    // Simula uma pequena espera de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulação de login baseada nos dados de teste
    if (email === "admin@cbmpe.gov.br" && password === "admin123") {
      
      // Dados de usuário "mockados" (falsos) baseados no seu fyren.sql
      // O tipo 'User' vem de '@shared/schema'
 const mockUser: User = {
    id: 1,
    name: "Administrador do Sistema",
    email: "admin@cbmpe.gov.br",
    password: "admin123",
    createdAt: new Date(),
    roleId: 1,
    rank: "Administrador"
};
      setUser(mockUser as User);
      setIsLoading(false);
      return true; // Sucesso
    }  
    // Se o email/senha estiverem errados
    setIsLoading(false);
    return false; // Falha
  };

  // Função de logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setLocation('/login'); // Redireciona para a página de login após o logout
    } catch (error) {
      console.error("Falha no logout:", error);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para usar o contexto de autenticação facilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}