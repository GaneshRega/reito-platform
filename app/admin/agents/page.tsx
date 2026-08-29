"use client";

import { useState } from "react";
import { TEAM, CLIENTS } from "@/lib/admin/data";
import type { TeamMember, UserRole } from "@/lib/admin/types";
import { useAuth } from "@/lib/admin/auth";
import { Users, TrendingUp, CheckCircle, Clock, Plus, X, Check } from "lucide-react";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin", manager: "Manager",
  agent: "Agent", viewer: "Viewer",
};

const ROLE_COLOR: Record<string, { color: string; bg: string }> = {
  super_admin: { color: "#6B4CA6", bg: "#EDE6F8" },
  manager:     { color: "#2A6EBB", bg: "#E5EEF8" },
  agent:       { color: "#1D7D5A", bg: "#E0F2EB" },
  viewer:      { color: "#5C554C", bg: "#F0EDE8" },
};

const REGIONS = ["All HYD", "West HYD", "East HYD", "North HYD", "Central HYD", "South HYD"];

interface NewAgent {
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  region: string;
}

function AgentCard({ member }: { member: TeamMember }) {
  const roleMeta = ROLE_COLOR[member.role];
  const clientsForAgent = CLIENTS.filter(
    c => c.addedById === member.id || c.assignedToId === member.id
  );
  const closedWon = clientsForAgent.filter(c => c.status === "closed_won").length;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--paper)",
        border: "1px solid var(--rule)",
        boxShadow: "var(--lift)",
        opacity: member.status === "inactive" ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
        >
          {member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{member.fullName}</p>
            {member.status === "inactive" && (
              <span style={{ fontSize: 10, color: "var(--ink-faint)", border: "1px solid var(--rule)", padding: "1px 6px", borderRadius: 999 }}>
                Inactive
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{member.region}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded text-[11px] font-semibold shrink-0"
          style={{ backgroundColor: roleMeta.bg, color: roleMeta.color }}
        >
          {ROLE_LABEL[member.role]}
        </span>
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{member.phone}</p>
        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{member.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-2" style={{ borderTop: "1px solid var(--rule)", paddingTop: 12 }}>
        <div className="flex items-center gap-2">
          <Users size={13} style={{ color: "var(--ink-faint)" }} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{member.clientsAdded}</p>
            <p style={{ fontSize: 10, color: "var(--ink-faint)" }}>Added</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={13} style={{ color: "var(--ink-faint)" }} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{member.conversionRate}%</p>
            <p style={{ fontSize: 10, color: "var(--ink-faint)" }}>Conv. rate</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={13} style={{ color: "var(--ink-faint)" }} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{closedWon}</p>
            <p style={{ fontSize: 10, color: "var(--ink-faint)" }}>Closed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: "var(--ink-faint)" }} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{member.avgVerifyDays || "—"}</p>
            <p style={{ fontSize: 10, color: "var(--ink-faint)" }}>Avg. verify (d)</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--rule)", paddingTop: 10 }}>
        <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Updates this month</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{member.updatesThisMonth}</span>
      </div>
    </div>
  );
}

// ── Add Agent Modal ───────────────────────────────────────────────────────────

function AddAgentModal({
  onClose,
  onAdd,
}: { onClose: () => void; onAdd: (m: TeamMember) => void }) {
  const [form, setForm] = useState<NewAgent>({
    fullName: "", phone: "", email: "", role: "agent", region: "West HYD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function set<K extends keyof NewAgent>(k: K, v: NewAgent[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!form.email.includes("@")) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const words = form.fullName.trim().split(" ");
    const initials = (words[0]?.[0] ?? "") + (words[words.length - 1]?.[0] ?? "");
    const newMember: TeamMember = {
      id: `a${Date.now()}`,
      fullName: form.fullName.trim(),
      initials: initials.toUpperCase(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      region: form.region,
      status: "active",
      clientsAdded: 0,
      clientsAssigned: 0,
      conversionRate: 0,
      avgVerifyDays: 0,
      updatesThisMonth: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    onAdd(newMember);
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(33,29,25,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "0 8px 40px rgba(33,29,25,0.18)" }}
      >
        {done ? (
          <div className="text-center py-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#D4F0E3" }}
            >
              <Check size={24} style={{ color: "#126940" }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              Agent added!
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 4 }}>
              <strong style={{ color: "var(--ink)" }}>{form.fullName}</strong> has been added to the team.
            </p>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20 }}>
              They can log in with their email and the shared password.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>Add team member</h2>
              <button onClick={onClose} style={{ color: "var(--ink-faint)" }}>
                <X size={18} />
              </button>
            </div>

            {/* Full name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>
                Full name <span style={{ color: "#B03030" }}>*</span>
              </label>
              <input
                value={form.fullName}
                onChange={e => set("fullName", e.target.value)}
                placeholder="e.g. Priya Singh"
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ border: `1px solid ${errors.fullName ? "#B03030" : "var(--rule)"}`, backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
              {errors.fullName && <p style={{ fontSize: 12, color: "#B03030", marginTop: 3 }}>{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>
                Phone <span style={{ color: "#B03030" }}>*</span>
              </label>
              <input
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
                placeholder="+91 98765 00000"
                type="tel"
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ border: `1px solid ${errors.phone ? "#B03030" : "var(--rule)"}`, backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
              {errors.phone && <p style={{ fontSize: 12, color: "#B03030", marginTop: 3 }}>{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>
                Email <span style={{ color: "#B03030" }}>*</span>
              </label>
              <input
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="priya@discover.in"
                type="email"
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ border: `1px solid ${errors.email ? "#B03030" : "var(--rule)"}`, backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
              {errors.email && <p style={{ fontSize: 12, color: "#B03030", marginTop: 3 }}>{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Role */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={e => set("role", e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm"
                  style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={e => set("region", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm"
                  style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Password hint */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: "var(--paper-warm)", border: "1px solid var(--rule)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--ink-faint)" }} />
              <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                Default login password: <code className="font-mono" style={{ color: "var(--ink)" }}>discover2026</code>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
              >
                Add member
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  if (user && user.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "var(--ink-faint)" }}>
        <Users size={36} style={{ opacity: 0.25 }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Access Restricted</p>
        <p style={{ fontSize: 13 }}>Only Super Admins can view the Team page.</p>
      </div>
    );
  }

  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showAddModal, setShowAddModal] = useState(false);
  const [extraMembers, setExtraMembers] = useState<TeamMember[]>([]);

  const allTeam = [...TEAM, ...extraMembers];

  const filtered = allTeam.filter(m => {
    if (roleFilter && m.role !== roleFilter) return false;
    if (statusFilter && m.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-3"
        style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Team</h1>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
        >
          {filtered.length}
        </span>
        <div className="flex-1" />

        {/* Role filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-full text-xs font-medium outline-none"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)", color: "var(--ink-soft)" }}
          >
            <option value="">All roles</option>
            {Object.entries(ROLE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px]" style={{ color: "var(--ink-faint)" }}>▾</span>
        </div>

        {/* Status filter */}
        <div className="flex items-center rounded-full p-0.5" style={{ border: "1px solid var(--rule)" }}>
          {["active", "inactive", ""].map(v => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize"
              style={{
                backgroundColor: statusFilter === v ? "var(--ink)" : "transparent",
                color: statusFilter === v ? "var(--paper)" : "var(--ink-faint)",
              }}
            >
              {v || "All"}
            </button>
          ))}
        </div>

        {/* Add member — super_admin only */}
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            <Plus size={12} />
            Add member
          </button>
        )}
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total active",       value: allTeam.filter(m => m.status === "active").length },
            { label: "Total clients added", value: allTeam.reduce((s, m) => s + m.clientsAdded, 0) },
            { label: "Avg conversion",     value: `${Math.round(allTeam.filter(m => m.role !== "viewer").reduce((s, m) => s + m.conversionRate, 0) / Math.max(1, allTeam.filter(m => m.role !== "viewer").length))}%` },
            { label: "Updates this month", value: allTeam.reduce((s, m) => s + m.updatesThisMonth, 0) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}
            >
              <p style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{value}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--ink-faint)" }}>
            <Users size={32} className="mx-auto mb-3" style={{ opacity: 0.3 }} />
            <p>No team members match the filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(member => (
              <AgentCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onAdd={m => {
            setExtraMembers(prev => [...prev, m]);
          }}
        />
      )}
    </div>
  );
}
