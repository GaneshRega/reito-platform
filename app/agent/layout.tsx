"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, X, Menu, ArrowLeft, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/admin/auth";

const NAV = [
  { href: "/agent",             label: "Dashboard",     icon: LayoutDashboard },
  { href: "/agent/clients",     label: "My Clients",    icon: Users           },
  { href: "/agent/properties",  label: "My Properties", icon: Building2       },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/login"); return; }
  }, [user, ready, router]);

  if (!ready || !user) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: "var(--paper)" }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--rule)", borderTopColor: "var(--ink)" }} />
      </div>
    );
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex h-full" style={{ backgroundColor: "var(--paper-cool)" }}>
      {/* ── Sidebar (desktop) ───────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 w-56"
        style={{ backgroundColor: "var(--paper)", borderRight: "1px solid var(--rule)" }}
      >
        <SidebarContent pathname={pathname} user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(33,29,25,0.4)" }}
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col md:hidden transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--paper)", borderRight: "1px solid var(--rule)" }}
      >
        <div className="flex items-center justify-between px-4 h-12" style={{ borderBottom: "1px solid var(--rule)" }}>
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
            DISCOVER
          </span>
          <button onClick={() => setOpen(false)} style={{ color: "var(--ink-faint)" }}>
            <X size={16} />
          </button>
        </div>
        <SidebarContent pathname={pathname} user={user} onLogout={handleLogout} onNav={() => setOpen(false)} />
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="shrink-0 flex items-center gap-3 px-4 md:px-6 h-12"
          style={{ backgroundColor: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
        >
          <button className="md:hidden shrink-0" onClick={() => setOpen(true)} style={{ color: "var(--ink-soft)" }}>
            <Menu size={18} />
          </button>
          <span
            className="hidden md:block text-sm font-medium"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 11 }}
          >
            DISCOVER · Agent
          </span>
          <div className="flex-1" />
          <Link
            href="/agent/properties/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mr-2 hover:opacity-80 transition-opacity"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
          >
            + Property
          </Link>
          <Link
            href="/agent/clients/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            + Client
          </Link>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname, user, onLogout, onNav,
}: {
  pathname: string;
  user: { id: string; initials: string; fullName: string; role: string; region: string };
  onLogout: () => void;
  onNav?: () => void;
}) {
  const ROLE_LABEL: Record<string, string> = {
    super_admin: "Super Admin", manager: "Manager", agent: "Agent", viewer: "Viewer",
  };

  const initBg: Record<string, { bg: string; color: string }> = {
    agent:       { bg: "#E0F2EB", color: "#1D7D5A" },
    manager:     { bg: "#E5EEF8", color: "#2A6EBB" },
    super_admin: { bg: "#EDE6F8", color: "#6B4CA6" },
    viewer:      { bg: "#F0EDE8", color: "#5C554C" },
  };
  const initStyle = initBg[user.role] ?? { bg: "var(--paper-warm)", color: "var(--ink)" };

  return (
    <>
      <div className="shrink-0 flex items-center px-4 h-12" style={{ borderBottom: "1px solid var(--rule)" }}>
        <Link href="/agent" onClick={onNav}>
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
            DISCOVER
          </span>
          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>
            Agent
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/agent" ? pathname === "/agent" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "var(--ink)" : "transparent",
                color: active ? "var(--paper)" : "var(--ink-soft)",
              }}
            >
              <Icon size={15} style={{ opacity: active ? 1 : 0.7 }} />
              {label}
            </Link>
          );
        })}

        {/* Quick actions */}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--rule)" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", paddingLeft: 12, marginBottom: 6 }}>
            Quick add
          </p>
          <Link
            href="/agent/clients/new"
            onClick={onNav}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            <Users size={14} />
            + New Client
          </Link>
          <Link
            href="/agent/properties/new"
            onClick={onNav}
            className="flex items-center gap-2.5 px-3 py-2 mt-1.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)", border: "1px solid var(--rule)" }}
          >
            <Building2 size={14} />
            + New Property
          </Link>
        </div>
      </nav>

      {/* Back to admin (visible to non-agents) */}
      {user.role !== "agent" && (
        <div className="shrink-0 px-2 pb-1">
          <Link
            href="/admin"
            onClick={onNav}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
          >
            <ArrowLeft size={12} />
            Admin Panel
          </Link>
        </div>
      )}

      {/* Current user */}
      <div className="shrink-0 px-3 py-3" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ backgroundColor: initStyle.bg, color: initStyle.color }}
          >
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate" style={{ color: "var(--ink)" }}>{user.fullName}</p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{ROLE_LABEL[user.role]}</p>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: "var(--ink-faint)" }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </>
  );
}
