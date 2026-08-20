"use client";

import { AuthProvider } from "@/lib/admin/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
