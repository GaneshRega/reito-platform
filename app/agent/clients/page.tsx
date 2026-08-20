"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Users } from "lucide-react";
import { CLIENTS } from "@/lib/admin/data";
import { STATUS_META, type ClientStatus } from "@/lib/admin/types";
import { formatINR } from "@/lib/format";
import { useAuth } from "@/lib/admin/auth";

function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-sm rounded-lg px-3 py-1.5 pr-8 appearance-none"
      style={{
        border: "1px solid var(--rule)",
        backgroundColor: "var(--paper)",
        color: value ? "var(--ink)" : "var(--ink-faint)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A9187' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {children}
    </select>
  );
}

function AgentClientsInner() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const agentId = user?.id ?? "a3";
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") ?? "");

  const myClients = useMemo(
    () => CLIENTS.filter(c => c.addedById === agentId || c.assignedToId === agentId),
    [agentId]
  );

  const filtered = useMemo(() => {
    let list = [...myClients];
    if (statusFilter) list = list.filter(c => c.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(c =>
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.localities.some(l => l.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [myClients, statusFilter, query]);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>My Clients</h1>
          <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 2 }}>
            {myClients.length} clients assigned to you
          </p>
        </div>
        <Link
          href="/agent/clients/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
        >
          <Plus size={14} />
          Add Client
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-40 max-w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clients…"
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)", color: "var(--ink)" }}
          />
        </div>
        <FilterSelect value={statusFilter} onChange={setStatusFilter}>
          <option value="">All statuses</option>
          {(Object.entries(STATUS_META) as [ClientStatus, { label: string }][]).map(([s, m]) => (
            <option key={s} value={s}>{m.label}</option>
          ))}
        </FilterSelect>
        <span className="ml-auto text-sm self-center" style={{ color: "var(--ink-faint)" }}>
          {filtered.length} shown
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--ink-faint)" }}>
          <Users size={32} className="mx-auto mb-3" style={{ opacity: 0.3 }} />
          <p>No clients match the filter</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(c => {
            const meta = STATUS_META[c.status];
            return (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:shadow-md transition-shadow"
                style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", textDecoration: "none" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                >
                  {c.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{c.fullName}</p>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    {!c.isVerified && (
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{ backgroundColor: "#F5DADA", color: "#B03030" }}
                      >
                        Unverified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                    {c.localities.join(", ")} · {formatINR(c.budgetMin)}–{formatINR(c.budgetMax)}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{c.phone}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                    {new Date(c.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AgentClientsPage() {
  return (
    <Suspense>
      <AgentClientsInner />
    </Suspense>
  );
}
