import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

// Define the shape of your context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Props type for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default value as undefined for proper type checking
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const validUsername = import.meta.env.VITE_APP_USERNAME;
    const validPassword = import.meta.env.VITE_APP_PASSWORD;

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with type check
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
