"use client";

import {
  createContext, useContext, useState, useEffect, type ReactNode,
} from "react";
import { TEAM } from "./data";
import type { TeamMember } from "./types";

// Demo: single shared password for all accounts
export const DEMO_PASSWORD = "discover2026";

interface AuthContextValue {
  user: TeamMember | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TeamMember | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("discover_auth");
    if (raw) {
      try {
        const stored = JSON.parse(raw) as { id: string };
        const member = TEAM.find(t => t.id === stored.id);
        if (member && member.status === "active") setUser(member);
      } catch {}
    }
    setReady(true);
  }, []);

  function login(email: string, password: string): { ok: boolean; error?: string } {
    if (!email.trim()) return { ok: false, error: "Enter your email" };
    if (!password) return { ok: false, error: "Enter your password" };
    if (password !== DEMO_PASSWORD) return { ok: false, error: "Incorrect password" };
    const member = TEAM.find(t => t.email.toLowerCase() === email.trim().toLowerCase());
    if (!member) return { ok: false, error: "No account found with that email" };
    if (member.status === "inactive") return { ok: false, error: "Account is inactive — contact your admin" };
    setUser(member);
    localStorage.setItem("discover_auth", JSON.stringify({ id: member.id }));
    return { ok: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("discover_auth");
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
