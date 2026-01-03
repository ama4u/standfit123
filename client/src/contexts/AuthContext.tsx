import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Admin {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Check user authentication
      const userRes = await fetch("/api/auth/me", {
        credentials: 'include'
      });
      if (userRes.ok) {
        const data = await userRes.json();
        setUser(data);
      }
    } catch (error) {
      // Silently fail - user is not authenticated
    }

    try {
      // Check admin authentication
      const adminRes = await fetch("/api/auth/admin/me", {
        credentials: 'include'
      });
      if (adminRes.ok) {
        const data = await adminRes.json();
        setAdmin(data);
      }
    } catch (error) {
      // Silently fail - admin is not authenticated
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Login failed");
    }

    const data = await res.json();
    setUser(data);
    navigate("/dashboard");
  }

  async function adminLogin(email: string, password: string) {
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Admin login failed");
    }

    const data = await res.json();
    setAdmin(data);
    navigate("/admin");
  }

  async function register(userData: any) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Registration failed");
    }

    const data = await res.json();
    setUser(data);
    navigate("/dashboard");
  }

  async function logout() {
    await fetch("/api/auth/logout", { 
      method: "POST",
      credentials: 'include'
    });
    setUser(null);
    setAdmin(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        adminLogin,
        register,
        logout,
        isAuthenticated: !!user || !!admin,
        isAdmin: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
