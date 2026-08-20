"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, Search, Filter, MapPin, Bed, Maximize2,
  Users, IndianRupee, Eye, CheckCircle2, Clock,
} from "lucide-react";
import { HOMES, CLIENTS, getAgent } from "@/lib/admin/data";
import {
  LISTING_STATUS_META, HOME_STATUS_META, PROP_LABEL,
  type ListingStatus, type PropertyType,
} from "@/lib/admin/types";
import { formatINR } from "@/lib/format";

const LOCALITIES = Array.from(new Set(HOMES.map(h => h.locality))).sort();

const PROP_TYPES: PropertyType[] = ["apartment", "villa", "plot", "penthouse", "farmhouse", "studio", "row_house", "duplex"];

function FilterSelect({
  value, onChange, children,
}: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
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

function StatusBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

function PropertyCard({ home }: { home: typeof HOMES[0] }) {
  const lsMeta = LISTING_STATUS_META[home.listingStatus];
  const hsMeta = HOME_STATUS_META[home.status];
  const agent = home.handledById ? getAgent(home.handledById) : undefined;
  const dealClient = home.dealClientId ? CLIENTS.find(c => c.id === home.dealClientId) : undefined;

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
      style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge label={lsMeta.label} color={lsMeta.color} bg={lsMeta.bg} />
            {home.status !== "approved" && (
              <StatusBadge label={hsMeta.label} color={hsMeta.color} bg={hsMeta.bg} />
            )}
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
            >
              {PROP_LABEL[home.propertyType]}
            </span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }} className="truncate">
            {home.address}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} style={{ color: "var(--ink-faint)" }} />
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.locality}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{formatINR(home.priceAsking)}</p>
          <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
            ₹{Math.round(home.priceAsking / home.areaSqft / 100) / 10}k/sqft
          </p>
        </div>
      </div>

      {/* Property details */}
      <div className="flex items-center gap-4 flex-wrap">
        {home.bedrooms > 0 && (
          <div className="flex items-center gap-1">
            <Bed size={12} style={{ color: "var(--ink-faint)" }} />
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.bedrooms}BHK</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Maximize2 size={12} style={{ color: "var(--ink-faint)" }} />
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.areaSqft.toLocaleString()} sqft</span>
        </div>
        {home.floor && home.totalFloors && (
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Floor {home.floor}/{home.totalFloors}</span>
        )}
        {home.facing && (
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.facing} facing</span>
        )}
        {home.ageYears !== undefined && (
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.ageYears === 0 ? "New" : `${home.ageYears}yr old`}</span>
        )}
      </div>

      {/* Owner */}
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2"
        style={{ backgroundColor: "var(--paper-cool)" }}
      >
        <div>
          <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 1 }}>Owner</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{home.ownerName}</p>
          <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{home.ownerPhone}</p>
        </div>
        <div className="text-right">
          {agent && (
            <div>
              <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 1 }}>Handled by</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)" }}>{agent.fullName}</p>
            </div>
          )}
          {home.matchedClientCount !== undefined && home.matchedClientCount > 0 && (
            <div className="flex items-center gap-1 mt-1 justify-end">
              <Users size={11} style={{ color: "var(--ink-faint)" }} />
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.matchedClientCount} buyers matched</span>
            </div>
          )}
        </div>
      </div>

      {/* Deal client */}
      {dealClient && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ backgroundColor: LISTING_STATUS_META[home.listingStatus].bg }}
        >
          <CheckCircle2 size={13} style={{ color: LISTING_STATUS_META[home.listingStatus].color }} />
          <div className="flex-1 min-w-0">
            <span style={{ fontSize: 12, color: LISTING_STATUS_META[home.listingStatus].color, fontWeight: 500 }}>
              {home.listingStatus === "sold" ? "Sold to" : "In deal with"}
            </span>
            <span style={{ fontSize: 12, color: LISTING_STATUS_META[home.listingStatus].color }}> · </span>
            <Link
              href={`/admin/clients/${dealClient.id}`}
              style={{ fontSize: 12, fontWeight: 600, color: LISTING_STATUS_META[home.listingStatus].color }}
            >
              {dealClient.fullName}
            </Link>
          </div>
        </div>
      )}

      {/* Admin note */}
      {home.adminNote && (
        <p
          className="text-xs px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#F5DADA", color: "#B03030" }}
        >
          {home.adminNote}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--rule)" }}>
        <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>
          via {home.submittedVia} · {new Date(home.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
        <Link
          href={`/admin/claims`}
          className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: "var(--ink-soft)" }}
        >
          <Eye size={11} />
          View claim
        </Link>
      </div>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  label, value, meta, active, onClick,
}: { label: string; value: number; meta: { color: string; bg: string }; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
      style={{
        backgroundColor: active ? meta.bg : "var(--paper)",
        border: active ? `2px solid ${meta.color}` : "1px solid var(--rule)",
        boxShadow: "var(--lift)",
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 700, color: meta.color }}>{value}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: active ? meta.color : "var(--ink-soft)" }}>{label}</span>
    </button>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────

function PropertiesPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [listingFilter, setListingFilter] = useState<string>(searchParams.get("listing") ?? "");
  const [localityFilter, setLocalityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [homeStatusFilter, setHomeStatusFilter] = useState<string>("");

  const counts = useMemo(() => ({
    total:     HOMES.length,
    available: HOMES.filter(h => h.listingStatus === "available").length,
    in_deal:   HOMES.filter(h => h.listingStatus === "in_deal").length,
    reserved:  HOMES.filter(h => h.listingStatus === "reserved").length,
    sold:      HOMES.filter(h => h.listingStatus === "sold").length,
    off_market:HOMES.filter(h => h.listingStatus === "off_market").length,
  }), []);

  const filtered = useMemo(() => {
    let list = [...HOMES];
    if (listingFilter)     list = list.filter(h => h.listingStatus === listingFilter);
    if (localityFilter)    list = list.filter(h => h.locality === localityFilter);
    if (typeFilter)        list = list.filter(h => h.propertyType === typeFilter);
    if (homeStatusFilter)  list = list.filter(h => h.status === homeStatusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(h =>
        h.ownerName.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.locality.toLowerCase().includes(q) ||
        h.ownerPhone.includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [listingFilter, localityFilter, typeFilter, homeStatusFilter, query]);

  const hasFilters = !!(listingFilter || localityFilter || typeFilter || homeStatusFilter || query);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>Properties</h1>
        <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 2 }}>
          All homes submitted by owners — approved, pending, and in deal
        </p>
      </div>

      {/* ── Stat pills ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <StatPill
          label="All"
          value={counts.total}
          meta={{ color: "var(--ink)", bg: "var(--paper-warm)" } as { color: string; bg: string }}
          active={listingFilter === ""}
          onClick={() => setListingFilter("")}
        />
        {(["available", "in_deal", "reserved", "sold", "off_market"] as ListingStatus[]).map(ls => (
          <StatPill
            key={ls}
            label={LISTING_STATUS_META[ls].label}
            value={counts[ls]}
            meta={LISTING_STATUS_META[ls]}
            active={listingFilter === ls}
            onClick={() => setListingFilter(listingFilter === ls ? "" : ls)}
          />
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-40 max-w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search owner, address…"
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)", color: "var(--ink)" }}
          />
        </div>

        <FilterSelect value={localityFilter} onChange={setLocalityFilter}>
          <option value="">All localities</option>
          {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
        </FilterSelect>

        <FilterSelect value={typeFilter} onChange={setTypeFilter}>
          <option value="">All types</option>
          {PROP_TYPES.map(t => <option key={t} value={t}>{PROP_LABEL[t]}</option>)}
        </FilterSelect>

        <FilterSelect value={homeStatusFilter} onChange={setHomeStatusFilter}>
          <option value="">Claim status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="more_info_requested">Info Requested</option>
          <option value="rejected">Rejected</option>
        </FilterSelect>

        {hasFilters && (
          <button
            onClick={() => { setListingFilter(""); setLocalityFilter(""); setTypeFilter(""); setHomeStatusFilter(""); setQuery(""); }}
            className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ color: "var(--ink-faint)" }}
          >
            <Filter size={11} /> Clear
          </button>
        )}

        <span className="ml-auto text-sm" style={{ color: "var(--ink-faint)" }}>
          {filtered.length} of {HOMES.length}
        </span>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--ink-faint)" }}>
          <Building2 size={32} className="mx-auto mb-3" style={{ opacity: 0.3 }} />
          <p style={{ fontSize: 14 }}>No properties match the current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(home => (
            <PropertyCard key={home.id} home={home} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesPageInner />
    </Suspense>
  );
}
