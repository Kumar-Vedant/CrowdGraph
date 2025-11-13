import React, { createContext, useState, useContext, type ReactNode, use } from "react";
import type { User } from "@/schema/index";
import { Navigate, useNavigate } from "react-router";

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({id: '667a383d-a8c8-40f7-a542-6610900ab5d0', username: 'lakshay', createdAt: new Date('2025-11-11T17:26:08.193Z').toLocaleDateString()});
  const navigate = useNavigate();
  // Optional helper functions for better usability
  const login = (userData: User) => setUser(userData);
  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};




