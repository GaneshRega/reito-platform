"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Download } from "lucide-react";
import { CLIENTS, TEAM, getAgent } from "@/lib/admin/data";
import { STATUS_META, SOURCE_LABEL, type ClientStatus, type ClientSource } from "@/lib/admin/types";
import { formatBudget } from "@/lib/format";

const LOCALITIES = [
  "Jubilee Hills","Banjara Hills","Gachibowli","Kokapet","Madhapur",
  "Kondapur","Narsingi","Tellapur","Nallagandla","Kukatpally","Sainikpuri",
];

const BUDGET_BANDS = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under ₹1Cr",  min: 0,         max: 9999999  },
  { label: "₹1Cr – ₹2Cr", min: 10000000,  max: 19999999 },
  { label: "₹2Cr – ₹5Cr", min: 20000000,  max: 49999999 },
  { label: "₹5Cr+",       min: 50000000,  max: Infinity  },
];

type SortKey = "fullName" | "locality" | "budgetMax" | "status" | "createdAt" | "updatedAt";

const COL_HEADERS: Array<{ key: SortKey; label: string; width?: string }> = [
  { key: "fullName",   label: "Name",         width: "180px" },
  { key: "locality",   label: "Locality",     width: "130px" },
  { key: "budgetMax",  label: "Budget",        width: "120px" },
  { key: "status",     label: "Status",        width: "130px" },
  { key: "createdAt",  label: "Added",         width: "100px" },
  { key: "updatedAt",  label: "Updated",       width: "100px" },
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function ClientsPage() {
  return (
    <Suspense>
      <ClientsPageInner />
    </Suspense>
  );
}

function ClientsPageInner() {
  const sp = useSearchParams();

  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState<ClientStatus | "">(
    (sp.get("status") as ClientStatus | null) ?? ""
  );
  const [localityF, setLocalityF] = useState("");
  const [budgetBand, setBudgetBand] = useState(0);
  const [sourceF, setSourceF]     = useState<ClientSource | "">(
    (sp.get("source") as ClientSource | null) ?? ""
  );
  const [agentF, setAgentF]       = useState("");
  const [verifiedF, setVerifiedF] = useState(
    sp.get("verified") === "false" ? "unverified" : ""
  );
  const [sortKey, setSortKey]     = useState<SortKey>("createdAt");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const { min: bMin, max: bMax } = BUDGET_BANDS[budgetBand];
    const q = search.toLowerCase();

    return CLIENTS.filter(c => {
      if (q && !c.fullName.toLowerCase().includes(q) &&
               !c.phone.includes(q) &&
               !(c.email ?? "").toLowerCase().includes(q) &&
               !c.localities.some(l => l.toLowerCase().includes(q))) return false;
      if (statusF && c.status !== statusF) return false;
      if (localityF && !c.localities.includes(localityF)) return false;
      if (budgetBand > 0 && (c.budgetMax < bMin || c.budgetMin > bMax)) return false;
      if (sourceF && c.source !== sourceF) return false;
      if (agentF && c.assignedToId !== agentF && c.addedById !== agentF) return false;
      if (verifiedF === "unverified" && c.isVerified) return false;
      if (verifiedF === "verified" && !c.isVerified) return false;
      return true;
    }).sort((a, b) => {
      let av: string | number = 0, bv: string | number = 0;
      if (sortKey === "fullName")   { av = a.fullName;   bv = b.fullName; }
      if (sortKey === "locality")   { av = a.localities[0] ?? ""; bv = b.localities[0] ?? ""; }
      if (sortKey === "budgetMax")  { av = a.budgetMax;  bv = b.budgetMax; }
      if (sortKey === "status")     { av = a.status;     bv = b.status; }
      if (sortKey === "createdAt")  { av = a.createdAt;  bv = b.createdAt; }
      if (sortKey === "updatedAt")  { av = a.updatedAt;  bv = b.updatedAt; }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, statusF, localityF, budgetBand, sourceF, agentF, verifiedF, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function clearFilters() {
    setSearch(""); setStatusF(""); setLocalityF(""); setBudgetBand(0);
    setSourceF(""); setAgentF(""); setVerifiedF("");
  }

  const hasFilters = !!search || !!statusF || !!localityF || budgetBand > 0 || !!sourceF || !!agentF || !!verifiedF;
  const agents = TEAM.filter(a => a.role === "agent" || a.role === "manager");

  return (
    <div className="flex flex-col h-full">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center gap-2 px-4 md:px-6 py-3"
        style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Clients</h1>
        <span
          className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
        >
          {filtered.length}
        </span>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-faint)" }} />
          <input
            type="text"
            placeholder="Name, phone, locality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-full text-sm outline-none"
            style={{
              border: "1px solid var(--rule)",
              backgroundColor: "var(--paper-cool)",
              color: "var(--ink)",
              fontSize: 13,
              width: 200,
            }}
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            border: "1px solid var(--rule)",
            backgroundColor: showFilters ? "var(--ink)" : "var(--paper)",
            color: showFilters ? "var(--paper)" : "var(--ink-soft)",
          }}
        >
          <SlidersHorizontal size={12} />
          Filters{hasFilters ? " ·" : ""}
          {hasFilters && (
            <span
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: "var(--gold)", color: "var(--paper)" }}
            >
              {[!!statusF, !!localityF, budgetBand > 0, !!sourceF, !!agentF, !!verifiedF].filter(Boolean).length}
            </span>
          )}
        </button>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70"
          style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)" }}
          title="Export CSV"
        >
          <Download size={12} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* ── Mobile search ────────────────────────────────────────── */}
      <div className="sm:hidden px-4 py-2" style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-faint)" }} />
          <input
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-full text-sm outline-none"
            style={{
              border: "1px solid var(--rule)",
              backgroundColor: "var(--paper-cool)",
              color: "var(--ink)",
              fontSize: 13,
            }}
          />
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────── */}
      {showFilters && (
        <div
          className="shrink-0 flex flex-wrap items-center gap-2 px-4 md:px-6 py-2.5"
          style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)" }}
        >
          <FilterSelect
            value={statusF}
            onChange={v => setStatusF(v as ClientStatus | "")}
            options={[
              { value: "", label: "All statuses" },
              ...Object.entries(STATUS_META).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <FilterSelect
            value={localityF}
            onChange={setLocalityF}
            options={[{ value: "", label: "All localities" }, ...LOCALITIES.map(l => ({ value: l, label: l }))]}
          />
          <FilterSelect
            value={String(budgetBand)}
            onChange={v => setBudgetBand(Number(v))}
            options={BUDGET_BANDS.map((b, i) => ({ value: String(i), label: b.label }))}
          />
          <FilterSelect
            value={sourceF}
            onChange={v => setSourceF(v as ClientSource | "")}
            options={[
              { value: "", label: "Any source" },
              { value: "web", label: "Web" },
              { value: "agent", label: "Agent" },
              { value: "referral", label: "Referral" },
            ]}
          />
          <FilterSelect
            value={agentF}
            onChange={setAgentF}
            options={[
              { value: "", label: "Any agent" },
              ...agents.map(a => ({ value: a.id, label: a.fullName })),
            ]}
          />
          <FilterSelect
            value={verifiedF}
            onChange={setVerifiedF}
            options={[
              { value: "", label: "Verified & not" },
              { value: "verified",   label: "Verified only" },
              { value: "unverified", label: "Not verified" },
            ]}
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{ fontSize: 12, color: "var(--ink-faint)", textDecoration: "underline" }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {/* Desktop table */}
        <table className="w-full text-sm border-collapse hidden md:table">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)" }}>
              {COL_HEADERS.map(col => (
                <th
                  key={col.key}
                  className="text-left cursor-pointer select-none"
                  style={{
                    padding: "8px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--ink-faint)",
                    minWidth: col.width,
                    userSelect: "none",
                  }}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                    ) : null}
                  </span>
                </th>
              ))}
              <th style={{ padding: "8px 16px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>Source</th>
              <th style={{ padding: "8px 16px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>Assigned to</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const meta = STATUS_META[c.status];
              const agent = getAgent(c.assignedToId);
              return (
                <tr
                  key={c.id}
                  className="cursor-pointer hover:bg-[var(--paper-warm)] transition-colors"
                  style={{ borderBottom: "1px solid var(--rule)" }}
                  onClick={() => { window.location.href = `/admin/clients/${c.id}`; }}
                >
                  <td style={{ padding: "10px 16px" }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                      >
                        {c.fullName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{c.fullName}</p>
                        <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.localities.slice(0,2).join(", ")}</p>
                    {c.localities.length > 2 && <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>+{c.localities.length - 2}</p>}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{formatBudget(c.budgetMin)}–{formatBudget(c.budgetMax)}</p>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{fmtDate(c.createdAt)}</p>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{fmtDate(c.updatedAt)}</p>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{
                        backgroundColor: c.source === "web" ? "#E5EEF8" : c.source === "agent" ? "#F5EDD4" : "#E0F2EB",
                        color: c.source === "web" ? "#2A6EBB" : c.source === "agent" ? "#A8863E" : "#1D7D5A",
                      }}
                    >
                      {SOURCE_LABEL[c.source]}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    {agent ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                        >
                          {agent.initials}
                        </div>
                        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{agent.fullName.split(" ")[0]}</span>
                      </div>
                    ) : <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile card list */}
        <div className="md:hidden divide-y" style={{ borderColor: "var(--rule)" }}>
          {filtered.map(c => {
            const meta = STATUS_META[c.status];
            const agent = getAgent(c.assignedToId);
            return (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="flex items-center gap-3 px-4 py-3"
                style={{ textDecoration: "none", backgroundColor: "var(--paper)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                >
                  {c.fullName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }} className="truncate">{c.fullName}</p>
                    <span
                      className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-faint)" }} className="truncate">
                    {c.localities[0]} · {formatBudget(c.budgetMin)}–{formatBudget(c.budgetMax)}
                    {agent ? ` · ${agent.fullName.split(" ")[0]}` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p style={{ fontSize: 16, color: "var(--ink-soft)" }}>No clients match these filters.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{ fontSize: 13, color: "var(--ink-faint)", textDecoration: "underline" }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const active = value !== "" && value !== "0";
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-full text-xs font-medium outline-none"
        style={{
          border: "1.5px solid var(--rule)",
          backgroundColor: active ? "var(--ink)" : "var(--paper)",
          color: active ? "var(--paper)" : "var(--ink-soft)",
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px]"
        style={{ color: active ? "var(--paper)" : "var(--ink-faint)" }}
      >▾</span>
    </div>
  );
}
