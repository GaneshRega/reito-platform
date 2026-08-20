"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useAuth, DEMO_PASSWORD } from "@/lib/admin/auth";

const DEMO_ACCOUNTS = [
  { role: "Super Admin", email: "rajesh@discover.in",   badge: { color: "#6B4CA6", bg: "#EDE6F8" } },
  { role: "Manager",     email: "divya@discover.in",    badge: { color: "#2A6EBB", bg: "#E5EEF8" } },
  { role: "Agent",       email: "arjun@discover.in",    badge: { color: "#1D7D5A", bg: "#E0F2EB" } },
  { role: "Agent",       email: "sneha@discover.in",    badge: { color: "#1D7D5A", bg: "#E0F2EB" } },
  { role: "Viewer",      email: "siddharth@discover.in",badge: { color: "#5C554C", bg: "#F0EDE8" } },
];

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreds, setShowCreds] = useState(false);

  // Already logged in → redirect
  useEffect(() => {
    if (!ready) return;
    if (user) {
      router.replace(user.role === "agent" ? "/agent" : "/admin");
    }
  }, [user, ready, router]);

  function fill(e: string) {
    setEmail(e);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setLoading(true);
    setError("");
    // Tiny artificial delay for UX realism
    await new Promise(r => setTimeout(r, 400));
    const result = login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Login failed");
      return;
    }
    // router.replace handled by useEffect above when user updates
  }

  if (!ready) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: "var(--paper)" }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--rule)", borderTopColor: "var(--ink)" }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-full flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--paper-cool)" }}
    >
      {/* Wordmark */}
      <div className="mb-8 text-center">
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          DISCOVER
        </p>
        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4, letterSpacing: "0.1em" }}>
          Internal dashboard
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          backgroundColor: "var(--paper)",
          border: "1px solid var(--rule)",
          boxShadow: "0 4px 24px rgba(33,29,25,0.08)",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
          Sign in
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 24 }}>
          Enter your team credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 6 }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="you@discover.in"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{
                border: `1px solid ${error ? "#B03030" : "var(--rule)"}`,
                backgroundColor: "var(--paper-cool)",
                color: "var(--ink)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 6 }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm outline-none"
                style={{
                  border: `1px solid ${error ? "#B03030" : "var(--rule)"}`,
                  backgroundColor: "var(--paper-cool)",
                  color: "var(--ink)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--ink-faint)" }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-3 py-2.5 rounded-xl text-sm"
              style={{ backgroundColor: "#FEF2F2", color: "#B03030", border: "1px solid #F5DADA" }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: "var(--ink)",
              color: "var(--paper)",
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      {/* Demo credentials panel */}
      <div className="w-full max-w-sm mt-4">
        <button
          onClick={() => setShowCreds(s => !s)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{
            backgroundColor: "var(--paper)",
            border: "1px solid var(--rule)",
            color: "var(--ink-soft)",
          }}
        >
          <span style={{ fontWeight: 500 }}>Demo credentials</span>
          <ChevronDown
            size={15}
            style={{ transform: showCreds ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          />
        </button>

        {showCreds && (
          <div
            className="mt-1 rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
          >
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper-warm)" }}
            >
              <span style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Password for all accounts
              </span>
              <code
                className="px-2 py-0.5 rounded text-xs font-mono"
                style={{ backgroundColor: "var(--paper-cool)", color: "var(--ink)", border: "1px solid var(--rule)" }}
              >
                {DEMO_PASSWORD}
              </code>
            </div>

            <div className="divide-y" style={{ borderColor: "var(--rule)" }}>
              {DEMO_ACCOUNTS.map(acct => (
                <button
                  key={acct.email}
                  onClick={() => fill(acct.email)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:opacity-80"
                  style={{ backgroundColor: "transparent" }}
                >
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-semibold shrink-0"
                    style={{ backgroundColor: acct.badge.bg, color: acct.badge.color }}
                  >
                    {acct.role}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{acct.email}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>Use →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
