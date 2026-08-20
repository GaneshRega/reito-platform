"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Users, Building2, Calendar, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { CLIENTS, HOMES, FOLLOW_UPS } from "@/lib/admin/data";
import { STATUS_META } from "@/lib/admin/types";
import { formatINR } from "@/lib/format";
import { useAuth } from "@/lib/admin/auth";

export default function AgentDashboard() {
  const { user } = useAuth();
  const agentId = user?.id ?? "a3";
  const agentName = user?.fullName?.split(" ")[0] ?? "there";

  const myClients = useMemo(
    () => CLIENTS.filter(c => c.addedById === agentId || c.assignedToId === agentId),
    [agentId]
  );
  const myHomes = useMemo(
    () => HOMES.filter(h => h.addedById === agentId || h.handledById === agentId),
    [agentId]
  );
  const myFollowUps = useMemo(
    () => FOLLOW_UPS.filter(f => f.assignedToId === agentId && !f.completedAt)
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
    [agentId]
  );

  const pipelineCounts = useMemo(() => {
    const map: Record<string, number> = {};
    myClients.forEach(c => { map[c.status] = (map[c.status] ?? 0) + 1; });
    return map;
  }, [myClients]);

  const now = new Date();
  const overdueCount = myFollowUps.filter(f => new Date(f.dueAt) < now).length;
  const todayFollowUps = myFollowUps.filter(f => {
    const d = new Date(f.dueAt);
    return d.toDateString() === now.toDateString();
  });

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  function fmtDue(iso: string) {
    const d = new Date(iso);
    const diff = d.getTime() - now.getTime();
    const diffH = Math.floor(diff / 3600000);
    const diffD = Math.floor(diff / 86400000);
    if (diff < 0) return `Overdue ${Math.abs(diffD)}d`;
    if (diffH < 1) return "Due now";
    if (diffH < 6) return `In ${diffH}h`;
    if (d.toDateString() === now.toDateString()) return `Today · ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffD === 1) return `Tomorrow`;
    return `In ${diffD} days`;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
          {greeting}, {agentName}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 2 }}>
          {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          {overdueCount > 0 && (
            <span style={{ color: "#B03030" }}> · {overdueCount} overdue follow-up{overdueCount > 1 ? "s" : ""}</span>
          )}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/agent/clients/new"
          className="flex flex-col gap-2 rounded-xl p-4 transition-shadow hover:shadow-md"
          style={{ backgroundColor: "var(--ink)", textDecoration: "none" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <Users size={16} style={{ color: "var(--paper)" }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--paper)" }}>Add Client</p>
            <p style={{ fontSize: 12, color: "rgba(247,244,239,0.6)" }}>New buyer enquiry</p>
          </div>
        </Link>

        <Link
          href="/agent/properties/new"
          className="flex flex-col gap-2 rounded-xl p-4 transition-shadow hover:shadow-md"
          style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)", textDecoration: "none" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--paper-warm)" }}>
            <Building2 size={16} style={{ color: "var(--ink-soft)" }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Add Property</p>
            <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Owner wants to list</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* ── Left (3/5) ─────────────────────────────────────────── */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* My stats */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>My stats</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "My Clients", value: myClients.length, icon: Users, href: "/agent/clients" },
                { label: "Properties", value: myHomes.length, icon: Building2, href: "/agent/properties" },
                { label: "Follow-ups", value: myFollowUps.length, icon: Calendar, href: "/agent/clients" },
              ].map(({ label, value, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--paper-cool)", textDecoration: "none" }}
                >
                  <Icon size={16} style={{ color: "var(--ink-soft)" }} />
                  <span style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{value}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* My pipeline */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>My pipeline</h2>
              <Link href="/agent/clients" style={{ fontSize: 12, color: "var(--ink-faint)" }}>View all</Link>
            </div>
            <div className="flex flex-col gap-0.5">
              {(Object.entries(STATUS_META) as [string, { label: string; color: string; bg: string }][])
                .filter(([status]) => (pipelineCounts[status] ?? 0) > 0)
                .map(([status, meta]) => (
                  <Link
                    key={status}
                    href={`/agent/clients?status=${status}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:opacity-80 transition-opacity"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{meta.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{pipelineCounts[status]}</span>
                  </Link>
                ))}
            </div>
          </div>

          {/* Recent clients */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Recent clients</h2>
              <Link href="/agent/clients" style={{ fontSize: 12, color: "var(--ink-faint)" }}>See all</Link>
            </div>
            <div className="flex flex-col gap-0.5">
              {[...myClients]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(c => {
                  const meta = STATUS_META[c.status];
                  return (
                    <Link
                      key={c.id}
                      href={`/admin/clients/${c.id}`}
                      className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                      >
                        {c.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{c.fullName}</p>
                        <p className="truncate" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                          {c.localities[0]} · {formatINR(c.budgetMin)}–{formatINR(c.budgetMax)}
                        </p>
                      </div>
                      <span
                        className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ── Right (2/5) ─────────────────────────────────────────── */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Today's schedule */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} style={{ color: "var(--ink-faint)" }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Today&apos;s schedule</h2>
            </div>
            {todayFollowUps.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>Nothing scheduled for today.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {todayFollowUps.map(f => {
                  const client = CLIENTS.find(c => c.id === f.clientId);
                  const isOverdue = new Date(f.dueAt) < now;
                  return (
                    <div
                      key={f.id}
                      className="flex gap-2.5 p-2.5 rounded-lg"
                      style={{ backgroundColor: isOverdue ? "#FEF2F2" : "var(--paper-cool)" }}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isOverdue
                          ? <Clock size={13} style={{ color: "#B03030" }} />
                          : <CheckCircle2 size={13} style={{ color: "var(--ink-faint)" }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 12, fontWeight: 500, color: isOverdue ? "#B03030" : "var(--ink)" }} className="truncate">
                          {f.title}
                        </p>
                        {client && (
                          <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{client.fullName}</p>
                        )}
                        <p style={{ fontSize: 11, color: isOverdue ? "#B03030" : "var(--ink-faint)" }}>
                          {fmtDue(f.dueAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming follow-ups */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Upcoming</h2>
            {myFollowUps.filter(f => new Date(f.dueAt) > now).slice(0, 4).length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>No upcoming follow-ups.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {myFollowUps
                  .filter(f => new Date(f.dueAt) > now)
                  .slice(0, 4)
                  .map(f => {
                    const client = CLIENTS.find(c => c.id === f.clientId);
                    return (
                      <div key={f.id} className="flex items-start gap-2">
                        <div
                          className="shrink-0 w-1 h-1 rounded-full mt-1.5"
                          style={{ backgroundColor: "var(--ink-faint)" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }} className="truncate">{f.title}</p>
                          <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                            {client?.fullName} · {fmtDue(f.dueAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* My properties */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>My properties</h2>
              <Link href="/agent/properties" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                <ArrowRight size={12} />
              </Link>
            </div>
            {myHomes.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>No properties added yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {myHomes.slice(0, 4).map(h => (
                  <div key={h.id} className="flex items-center gap-2">
                    <Building2 size={12} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontSize: 12, color: "var(--ink)" }}>{h.locality} · {h.bedrooms > 0 ? `${h.bedrooms}BHK` : "Plot"}</p>
                      <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{formatINR(h.priceAsking)}</p>
                    </div>
                    <span
                      className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: h.status === "approved" ? "#D4F0E3" : "#F0EDE8", color: h.status === "approved" ? "#126940" : "#5C554C" }}
                    >
                      {h.status === "approved" ? "Live" : "Review"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
