"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, GitBranch, UserCheck,
  Home, BarChart2, X, Menu, Plus, Search, Building2, ArrowRight, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/admin/auth";

const NAV = [
  { href: "/admin",             label: "Overview",      icon: LayoutDashboard },
  { href: "/admin/clients",     label: "Clients",       icon: Users           },
  { href: "/admin/pipeline",    label: "Pipeline",      icon: GitBranch       },
  { href: "/admin/properties",  label: "Properties",    icon: Building2       },
  { href: "/admin/agents",      label: "Team",          icon: UserCheck       },
  { href: "/admin/claims",      label: "Owner Claims",  icon: Home            },
  { href: "/admin/analytics",   label: "Analytics",     icon: BarChart2       },
];

// Pages each role can access
const ROLE_ALLOWED: Record<string, string[]> = {
  super_admin: NAV.map(n => n.href),
  manager:     ["/admin", "/admin/clients", "/admin/pipeline", "/admin/properties", "/admin/claims"],
  viewer:      ["/admin", "/admin/clients"],
};

const ADMIN_ROLES = new Set(["super_admin", "manager", "viewer"]);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/login"); return; }
    // Agents belong in the agent portal
    if (user.role === "agent") { router.replace("/agent"); return; }
  }, [user, ready, router]);

  if (!ready || !user || !ADMIN_ROLES.has(user.role)) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: "var(--paper)" }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--rule)", borderTopColor: "var(--ink)" }} />
      </div>
    );
  }

  return (
    <div className="flex h-full" style={{ backgroundColor: "var(--paper-cool)" }}>
      {/* ── Sidebar (desktop) ───────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col shrink-0 w-56"
        style={{ backgroundColor: "var(--paper)", borderRight: "1px solid var(--rule)" }}
      >
        <SidebarContent pathname={pathname} user={user} onLogout={logout} />
      </aside>

      {/* ── Mobile drawer overlay ───────────────────────────────── */}
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
        <SidebarContent pathname={pathname} user={user} onLogout={logout} onNav={() => setOpen(false)} />
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
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
            DISCOVER · Admin
          </span>
          <div className="flex-1" />
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink-faint)", fontSize: 12 }}
          >
            <Search size={12} />
            <span>Search clients…</span>
            <kbd className="ml-1 px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-faint)" }}>
              ⌘K
            </kbd>
          </button>
          {user.role !== "viewer" && (
            <Link
              href="/admin/clients/new"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              <Plus size={12} /> Add Client
            </Link>
          )}
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
  user: { initials: string; fullName: string; role: string };
  onLogout: () => void;
  onNav?: () => void;
}) {
  const router = useRouter();

  const ROLE_LABEL: Record<string, string> = {
    super_admin: "Super Admin", manager: "Manager", viewer: "Viewer", agent: "Agent",
  };

  function handleLogout() {
    onLogout();
    router.push("/login");
  }

  const allowedHrefs = new Set(ROLE_ALLOWED[user.role] ?? []);
  const visibleNav = NAV.filter(n => allowedHrefs.has(n.href));

  return (
    <>
      {/* Logo */}
      <div className="shrink-0 flex items-center px-4 h-12" style={{ borderBottom: "1px solid var(--rule)" }}>
        <Link href="/admin" onClick={onNav}>
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
            DISCOVER
          </span>
          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
        {visibleNav.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
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
      </nav>

      {/* Agent portal link */}
      <div className="shrink-0 px-2 pb-1">
        <Link
          href="/agent"
          onClick={onNav}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
        >
          <span>Agent Portal</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Current user */}
      <div className="shrink-0 px-3 py-3" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ backgroundColor: "var(--gold-soft, #F5EDD4)", color: "var(--gold)" }}
          >
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate" style={{ color: "var(--ink)" }}>{user.fullName}</p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{ROLE_LABEL[user.role]}</p>
          </div>
          <button
            onClick={handleLogout}
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
