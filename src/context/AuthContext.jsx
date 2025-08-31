import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true" // initialize from localStorage
  );

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    const validUsername = import.meta.env.VITE_APP_USERNAME;
    const validPassword = import.meta.env.VITE_APP_PASSWORD;

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true"); // Save to storage
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Clear on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
