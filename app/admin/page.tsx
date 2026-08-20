"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, ShieldCheck, Megaphone,
  GitMerge, CheckCircle, AlertTriangle,
  Building2, Handshake, BookmarkCheck, BadgeCheck,
} from "lucide-react";
import { CLIENTS, TEAM, CHART_DATA, FOLLOW_UPS, HOMES, LOCALITIES_DEMAND } from "@/lib/admin/data";
import { STATUS_META, LISTING_STATUS_META } from "@/lib/admin/types";
import { formatINR, formatBudget } from "@/lib/format";

type Period = "7d" | "30d" | "90d";

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl p-4 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "var(--paper)",
        border: "1px solid var(--rule)",
        boxShadow: "var(--lift)",
        textDecoration: "none",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {label}
          </p>
          <p className="mt-1" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: "var(--ink)" }}>
            {value}
          </p>
          {sub && <p className="mt-1" style={{ fontSize: 12, color: "var(--ink-faint)" }}>{sub}</p>}
        </div>
        <div
          className="p-2 rounded-lg shrink-0"
          style={{ backgroundColor: "var(--paper-warm)" }}
        >
          <Icon size={16} style={{ color: "var(--ink-soft)" }} />
        </div>
      </div>
    </Link>
  );
}

// ── Mini line chart ───────────────────────────────────────────────────────────

function LineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const W = 300;
  const H = 64;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (v / max) * (H - 8) - 4,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H, display: "block" }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGrad)" />
      <path d={linePath} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Needs attention item ───────────────────────────────────────────────────────

function AttentionItem({ label, count, color, href }: { label: string; count: number; color: string; href: string }) {
  if (count === 0) return null;
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:opacity-80 transition-opacity"
      style={{ backgroundColor: "var(--paper-warm)" }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={13} style={{ color }} />
        <span style={{ fontSize: 13, color: "var(--ink)" }}>{label}</span>
      </div>
      <span
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: color + "22", color }}
      >
        {count}
      </span>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = CLIENTS.filter(c => new Date(c.createdAt) >= weekAgo).length;
    const pendingVerif = CLIENTS.filter(c => !c.isVerified && c.status !== "closed_won" && c.status !== "closed_lost" && c.status !== "dropped").length;
    const published = CLIENTS.filter(c => c.status === "published").length;
    const matched = CLIENTS.filter(c => c.status === "matched" || c.status === "owner_contacted" || c.status === "negotiating").length;
    const closed = CLIENTS.filter(c => c.status === "closed_won").length;
    return { total: CLIENTS.length, newThisWeek, pendingVerif, published, matched, closed };
  }, []);

  const propStats = useMemo(() => {
    const approved = HOMES.filter(h => h.status === "approved");
    return {
      total: HOMES.length,
      available: approved.filter(h => h.listingStatus === "available").length,
      inDeal:    approved.filter(h => h.listingStatus === "in_deal").length,
      reserved:  approved.filter(h => h.listingStatus === "reserved").length,
      sold:      approved.filter(h => h.listingStatus === "sold").length,
      pending:   HOMES.filter(h => h.status === "pending" || h.status === "more_info_requested").length,
    };
  }, []);

  const attention = useMemo(() => {
    const now = new Date();
    const unverif3d = CLIENTS.filter(c => {
      if (c.isVerified || c.status === "closed_won" || c.status === "closed_lost" || c.status === "dropped") return false;
      const daysOld = (now.getTime() - new Date(c.createdAt).getTime()) / 86400000;
      return daysOld >= 3;
    });
    const noUpdate14d = CLIENTS.filter(c => {
      if (c.status === "closed_won" || c.status === "closed_lost" || c.status === "dropped") return false;
      const daysSince = (now.getTime() - new Date(c.updatedAt).getTime()) / 86400000;
      return daysSince >= 14;
    });
    const pendingClaims = HOMES.filter(h => h.status === "pending").length;
    const overdueFU = FOLLOW_UPS.filter(f => !f.completedAt && new Date(f.dueAt) < now).length;
    return { unverif3d: unverif3d.length, noUpdate14d: noUpdate14d.length, pendingClaims, overdueFU };
  }, []);

  const topAgents = useMemo(() => {
    return TEAM
      .filter(a => a.role !== "super_admin" && a.role !== "viewer")
      .sort((a, b) => b.clientsAdded - a.clientsAdded)
      .slice(0, 5);
  }, []);

  const webCount = CLIENTS.filter(c => c.source === "web").length;
  const agentCount = CLIENTS.filter(c => c.source === "agent").length;
  const referralCount = CLIENTS.filter(c => c.source === "referral").length;

  const chartData = CHART_DATA[period];

  const periodLabel: Record<Period, string> = { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" };
  const periodTotal: Record<Period, number> = {
    "7d": CHART_DATA["7d"].reduce((a, b) => a + b, 0),
    "30d": CHART_DATA["30d"].reduce((a, b) => a + b, 0),
    "90d": CHART_DATA["90d"].reduce((a, b) => a + b, 0),
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>Overview</h1>
        <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 2 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* ── Client stat cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
        <StatCard label="Total Clients" value={stats.total}       sub="all time"        icon={Users}       href="/admin/clients" />
        <StatCard label="New This Week" value={stats.newThisWeek} sub="past 7 days"     icon={TrendingUp}  href="/admin/clients?status=new" />
        <StatCard label="Pending Verif." value={stats.pendingVerif} sub="need action"   icon={ShieldCheck} href="/admin/clients?verified=false" />
        <StatCard label="Published"     value={stats.published}   sub="live profiles"   icon={Megaphone}   href="/admin/clients?status=published" />
        <StatCard label="Matched"       value={stats.matched}     sub="incl. in talks"  icon={GitMerge}    href="/admin/clients?status=matched" />
        <StatCard label="Closed Won"    value={stats.closed}      sub="deals closed"    icon={CheckCircle} href="/admin/clients?status=closed_won" />
      </div>

      {/* ── Property stat strip ─────────────────────────────────── */}
      <div
        className="rounded-xl p-3 mb-6 flex flex-wrap gap-3 items-center"
        style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
      >
        <div className="flex items-center gap-2 mr-2">
          <Building2 size={14} style={{ color: "var(--ink-faint)" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Properties
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
          >
            {propStats.total} total
          </span>
        </div>
        <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: "var(--rule)" }} />
        {[
          { label: "Available", value: propStats.available, meta: LISTING_STATUS_META.available, href: "/admin/properties?listing=available" },
          { label: "In Deal",   value: propStats.inDeal,    meta: LISTING_STATUS_META.in_deal,   href: "/admin/properties?listing=in_deal" },
          { label: "Reserved",  value: propStats.reserved,  meta: LISTING_STATUS_META.reserved,  href: "/admin/properties?listing=reserved" },
          { label: "Sold",      value: propStats.sold,      meta: LISTING_STATUS_META.sold,      href: "/admin/properties?listing=sold" },
          { label: "Pending review", value: propStats.pending, meta: { color: "#5C554C", bg: "#F0EDE8" }, href: "/admin/claims" },
        ].map(({ label, value, meta, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: meta.bg, color: meta.color, textDecoration: "none" }}
          >
            <span style={{ fontWeight: 700 }}>{value}</span>
            <span style={{ opacity: 0.8 }}>{label}</span>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left column (2/3) ───────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Submissions chart */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Submissions over time</h2>
                <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 1 }}>
                  {periodTotal[period]} submissions · {periodLabel[period]}
                </p>
              </div>
              <div
                className="flex items-center rounded-full p-0.5"
                style={{ border: "1px solid var(--rule)" }}
              >
                {(["7d","30d","90d"] as Period[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: period === p ? "var(--ink)" : "transparent",
                      color: period === p ? "var(--paper)" : "var(--ink-faint)",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <LineChart data={chartData} />
          </div>

          {/* Source split + locality demand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Source split */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
            >
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Client sources</h2>
              {[
                { label: "Web (self-serve)", count: webCount,      color: "#2A6EBB" },
                { label: "Agent-entered",    count: agentCount,    color: "#A8863E" },
                { label: "Referral",         count: referralCount, color: "#1D7D5A" },
              ].map(({ label, count, color }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--paper-warm)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(count / CLIENTS.length) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Locality demand */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
            >
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Demand by locality</h2>
              <div className="flex flex-col gap-2">
                {LOCALITIES_DEMAND.slice(0, 6).map(({ name, clients, homes }) => (
                  <div key={name} className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: "var(--ink-soft)", width: 90 }} className="truncate">{name}</span>
                    <div className="flex-1 mx-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--paper-warm)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(clients / LOCALITIES_DEMAND[0].clients) * 100}%`,
                          backgroundColor: "var(--ink)",
                          opacity: 0.5,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span style={{ fontSize: 11, color: "#2A6EBB", fontWeight: 600 }}>{clients}B</span>
                      <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>·</span>
                      <span style={{ fontSize: 11, color: "#1D7D5A", fontWeight: 600 }}>{homes}H</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent leaderboard */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Agent leaderboard · this month</h2>
              <Link href="/admin/agents" style={{ fontSize: 12, color: "var(--ink-faint)" }}>View all</Link>
            </div>
            <div className="flex flex-col gap-0.5">
              {topAgents.map((agent, i) => (
                <Link
                  key={agent.id}
                  href={`/admin/agents`}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ textDecoration: "none" }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-faint)", width: 16 }}>{i + 1}</span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                  >
                    {agent.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{agent.fullName}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{agent.region}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{agent.clientsAdded}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>clients</p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1D7D5A" }}>{agent.conversionRate}%</p>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>conv.</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column (1/3) ──────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Needs attention */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Needs attention</h2>
            <div className="flex flex-col gap-2">
              <AttentionItem
                label="Unverified 3+ days"
                count={attention.unverif3d}
                color="#B03030"
                href="/admin/clients?verified=false"
              />
              <AttentionItem
                label="No update in 14+ days"
                count={attention.noUpdate14d}
                color="#B05B15"
                href="/admin/clients"
              />
              <AttentionItem
                label="Claims awaiting review"
                count={attention.pendingClaims}
                color="#8A6D00"
                href="/admin/claims"
              />
              <AttentionItem
                label="Overdue follow-ups"
                count={attention.overdueFU}
                color="#B03030"
                href="/admin/clients"
              />
            </div>
            {Object.values(attention).every(v => v === 0) && (
              <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>All caught up.</p>
            )}
          </div>

          {/* Pipeline snapshot */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Pipeline snapshot</h2>
            {(Object.entries(STATUS_META) as [string, { label: string; color: string; bg: string }][]).map(
              ([status, meta]) => {
                const count = CLIENTS.filter(c => c.status === status).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={status}
                    href={`/admin/clients?status=${status}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:opacity-80 transition-opacity"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{meta.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{count}</span>
                  </Link>
                );
              }
            )}
          </div>

          {/* Recent clients */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Recent clients</h2>
              <Link href="/admin/clients" style={{ fontSize: 12, color: "var(--ink-faint)" }}>See all</Link>
            </div>
            <div className="flex flex-col gap-0.5">
              {[...CLIENTS]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 6)
                .map(c => {
                  const meta = STATUS_META[c.status];
                  return (
                    <Link
                      key={c.id}
                      href={`/admin/clients/${c.id}`}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:opacity-80 transition-opacity"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                      >
                        {c.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{c.fullName}</p>
                        <p className="truncate" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{c.localities[0]}</p>
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
      </div>
    </div>
  );
}
