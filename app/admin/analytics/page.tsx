"use client";

import { useState } from "react";
import { CLIENTS, HOMES, MATCHES, TEAM, LOCALITIES_DEMAND } from "@/lib/admin/data";
import { STATUS_META, type ClientStatus } from "@/lib/admin/types";
import { formatBudget } from "@/lib/format";

const PIPELINE_STAGES: ClientStatus[] = [
  "new","contacted","verified","published",
  "matched","owner_contacted","negotiating",
  "closed_won","closed_lost","dropped",
];

// ── SVG Bar chart ─────────────────────────────────────────────────────────────

function BarChart({ data }: { data: Array<{ label: string; value: number; color?: string }> }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const H = 80;
  return (
    <div className="flex items-end gap-2">
      {data.map(({ label, value, color }) => (
        <div key={label} className="flex flex-col items-center gap-1 flex-1">
          <span style={{ fontSize: 10, color: "var(--ink)", fontWeight: 700 }}>{value}</span>
          <div
            style={{
              height: Math.max(4, (value / max) * H),
              width: "100%",
              backgroundColor: color ?? "var(--ink)",
              opacity: 0.7,
              borderRadius: "3px 3px 0 0",
            }}
          />
          <span
            style={{ fontSize: 9, color: "var(--ink-faint)", textAlign: "center", wordBreak: "break-word" }}
            className="w-full"
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Mini funnel ───────────────────────────────────────────────────────────────

function FunnelRow({ label, count, total, color, bg }: { label: string; count: number; total: number; color: string; bg: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-28 shrink-0 text-right" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{label}</span>
      <div className="flex-1 h-5 rounded overflow-hidden" style={{ backgroundColor: "var(--paper-warm)" }}>
        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color }} />
      </div>
      <span className="w-6 shrink-0 text-right" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{count}</span>
      <span className="w-8 shrink-0 text-right" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{pct}%</span>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
    >
      <h2 className="mb-4" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const totalClients = CLIENTS.length;

  // Pipeline funnel
  const funnelData = PIPELINE_STAGES.map(s => ({
    status: s,
    label: STATUS_META[s].label,
    count: CLIENTS.filter(c => c.status === s).length,
    color: STATUS_META[s].color,
    bg: STATUS_META[s].bg,
  }));

  // Budget distribution
  const BANDS = [
    { label: "< ₹75L",     min: 0,        max: 7499999  },
    { label: "₹75L–₹1Cr",  min: 7500000,  max: 9999999  },
    { label: "₹1–2Cr",     min: 10000000, max: 19999999 },
    { label: "₹2–5Cr",     min: 20000000, max: 49999999 },
    { label: "₹5Cr+",      min: 50000000, max: Infinity  },
  ];
  const budgetData = BANDS.map(b => ({
    label: b.label,
    value: CLIENTS.filter(c => c.budgetMax >= b.min && c.budgetMin <= b.max).length,
  }));

  // Property type mix
  const propTypes: Record<string, number> = {};
  CLIENTS.forEach(c => c.propertyTypes.forEach(p => { propTypes[p] = (propTypes[p] ?? 0) + 1; }));
  const propData = Object.entries(propTypes)
    .sort((a, b) => b[1] - a[1])
    .map(([key, val]) => ({
      label: key.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
      value: val,
    }));

  // Timeline distribution
  const timelineGroups = [
    { label: "0–6mo",  min: 0,  max: 6  },
    { label: "7–12mo", min: 7,  max: 12 },
    { label: "13–24mo",min: 13, max: 24 },
    { label: "24mo+",  min: 25, max: 99 },
  ];
  const timelineData = timelineGroups.map(g => ({
    label: g.label,
    value: CLIENTS.filter(c => c.timelineMonths >= g.min && c.timelineMonths <= g.max).length,
  }));

  // Source attribution
  const webClients = CLIENTS.filter(c => c.source === "web");
  const agentClients = CLIENTS.filter(c => c.source === "agent");
  const referralClients = CLIENTS.filter(c => c.source === "referral");
  const sourceConversion = [
    { label: "Web", total: webClients.length, closed: webClients.filter(c => c.status === "closed_won").length, color: "#2A6EBB" },
    { label: "Agent", total: agentClients.length, closed: agentClients.filter(c => c.status === "closed_won").length, color: "#A8863E" },
    { label: "Referral", total: referralClients.length, closed: referralClients.filter(c => c.status === "closed_won").length, color: "#1D7D5A" },
  ];

  // Agent performance
  const agentPerf = TEAM
    .filter(a => a.role === "agent" || a.role === "manager")
    .filter(a => a.clientsAdded > 0)
    .map(a => ({
      name: a.fullName.split(" ")[0],
      added: a.clientsAdded,
      conv: a.conversionRate,
      verify: a.avgVerifyDays,
    }))
    .sort((a, b) => b.conv - a.conv);

  // Response time metric (computed from match_shares data — placeholder for demo)
  const avgResponseHrs = 38; // avg < 48 as advertised

  return (
    <div className="flex flex-col h-full">
      <div
        className="shrink-0 flex items-center px-4 md:px-6 py-3"
        style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Analytics</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Key metrics row */}
          <div
            className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { label: "Total clients",    value: totalClients },
              { label: "Homes approved",   value: HOMES.filter(h => h.status === "approved").length },
              { label: "Active matches",   value: MATCHES.length },
              { label: "Avg owner response", value: `${avgResponseHrs}h` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
              >
                <p style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Funnel */}
          <Section title="Funnel — conversion at each stage">
            {funnelData.filter(d => d.count > 0).map(d => (
              <FunnelRow
                key={d.status}
                label={d.label}
                count={d.count}
                total={totalClients}
                color={d.color}
                bg={d.bg}
              />
            ))}
          </Section>

          {/* Demand vs supply */}
          <Section title="Demand vs. supply by locality">
            <div className="flex flex-col gap-2">
              {LOCALITIES_DEMAND.map(({ name, clients, homes }) => (
                <div key={name} className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: "var(--ink-soft)", width: 100 }} className="shrink-0 truncate">{name}</span>
                  <div className="flex-1 relative h-5">
                    <div
                      style={{
                        position: "absolute", left: 0, top: 4, height: 8,
                        width: `${(clients / 12) * 100}%`,
                        backgroundColor: "#2A6EBB",
                        opacity: 0.7,
                        borderRadius: 4,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute", left: 0, bottom: 2, height: 5,
                        width: `${(homes / 5) * 100}%`,
                        backgroundColor: "#1D7D5A",
                        opacity: 0.7,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: "#2A6EBB", width: 16, textAlign: "right", fontWeight: 700 }}>{clients}</span>
                  <span style={{ fontSize: 11, color: "#1D7D5A", width: 16, textAlign: "right", fontWeight: 700 }}>{homes}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 mt-2 pt-2" style={{ borderTop: "1px solid var(--rule)" }}>
                <div className="flex items-center gap-1.5"><div style={{ width: 10, height: 10, backgroundColor: "#2A6EBB", opacity: 0.7, borderRadius: 2 }} /><span style={{ fontSize: 11, color: "var(--ink-faint)" }}>Buyers</span></div>
                <div className="flex items-center gap-1.5"><div style={{ width: 10, height: 7, backgroundColor: "#1D7D5A", opacity: 0.7, borderRadius: 2 }} /><span style={{ fontSize: 11, color: "var(--ink-faint)" }}>Homes</span></div>
              </div>
            </div>
          </Section>

          {/* Budget distribution */}
          <Section title="Budget distribution">
            <BarChart data={budgetData} />
          </Section>

          {/* Property type mix */}
          <Section title="Property type mix">
            <BarChart data={propData} />
          </Section>

          {/* Timeline distribution */}
          <Section title="Buyer timeline distribution">
            <BarChart data={timelineData} />
          </Section>

          {/* Source attribution */}
          <Section title="Source → conversion">
            <div className="flex flex-col gap-3">
              {sourceConversion.map(({ label, total, closed, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 }}>{label}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{total} clients</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>
                        {closed} closed ({total > 0 ? Math.round((closed / total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--paper-warm)" }}>
                    <div
                      style={{
                        width: `${total > 0 ? (closed / total) * 100 : 0}%`,
                        height: "100%",
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Agent performance */}
          <Section title="Agent performance">
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--rule)" }}>
                    {["Agent","Added","Conv. rate","Avg. verify (d)"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "4px 8px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agentPerf.map(a => (
                    <tr key={a.name} style={{ borderBottom: "1px solid var(--rule)" }}>
                      <td style={{ padding: "8px 8px", fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{a.name}</td>
                      <td style={{ padding: "8px 8px", fontSize: 13, color: "var(--ink-soft)" }}>{a.added}</td>
                      <td style={{ padding: "8px 8px" }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: a.conv >= 25 ? "#126940" : a.conv >= 15 ? "#A8863E" : "#B03030",
                        }}>{a.conv}%</span>
                      </td>
                      <td style={{ padding: "8px 8px", fontSize: 13, color: "var(--ink-soft)" }}>{a.verify || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Owner response time claim */}
          <div
            className="md:col-span-2 rounded-xl p-4"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>
              Owner response time — vs. our &lt;48h promise
            </h2>
            <div className="flex items-center gap-8">
              <div>
                <p style={{ fontSize: 36, fontWeight: 900, color: avgResponseHrs < 48 ? "#126940" : "#B03030" }}>
                  {avgResponseHrs}h
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Current average</p>
              </div>
              <div>
                <p style={{ fontSize: 36, fontWeight: 900, color: "var(--ink)", opacity: 0.3 }}>48h</p>
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Target SLA</p>
              </div>
              <div>
                <p style={{ fontSize: 36, fontWeight: 900, color: "#126940" }}>{MATCHES.length}</p>
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Active matches</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
