"use client";

import { useState, useMemo } from "react";
import { HOMES, getAgent } from "@/lib/admin/data";
import { HOME_STATUS_META, PROP_LABEL, type HomeStatus } from "@/lib/admin/types";
import { formatINR } from "@/lib/format";
import { CheckCircle, XCircle, Info, Clock, Home } from "lucide-react";

const STATUS_TABS: Array<{ key: HomeStatus | "all"; label: string }> = [
  { key: "all",                 label: "All"           },
  { key: "pending",             label: "Pending"       },
  { key: "more_info_requested", label: "Info Requested"},
  { key: "approved",            label: "Approved"      },
  { key: "rejected",            label: "Rejected"      },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function ActionButton({
  label, color, bg, icon: Icon, onClick,
}: {
  label: string; color: string; bg: string;
  icon: React.ElementType; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
      style={{ backgroundColor: bg, color }}
    >
      <Icon size={11} />
      {label}
    </button>
  );
}

export default function ClaimsPage() {
  const [statusTab, setStatusTab] = useState<HomeStatus | "all">("all");
  const [localityF, setLocalityF] = useState("");

  const localities = [...new Set(HOMES.map(h => h.locality))].sort();

  const filtered = useMemo(() => {
    return HOMES.filter(h => {
      if (statusTab !== "all" && h.status !== statusTab) return false;
      if (localityF && h.locality !== localityF) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [statusTab, localityF]);

  const counts: Record<string, number> = { all: HOMES.length };
  HOMES.forEach(h => { counts[h.status] = (counts[h.status] ?? 0) + 1; });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-3"
        style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Owner Claims</h1>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
        >
          {filtered.length}
        </span>
        <div className="flex-1" />

        {/* Locality filter */}
        <div className="relative">
          <select
            value={localityF}
            onChange={e => setLocalityF(e.target.value)}
            className="appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-full text-xs font-medium outline-none"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)", color: "var(--ink-soft)" }}
          >
            <option value="">All localities</option>
            {localities.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px]" style={{ color: "var(--ink-faint)" }}>▾</span>
        </div>
      </div>

      {/* Status tabs */}
      <div
        className="shrink-0 flex items-center gap-1 px-4 md:px-6 py-2 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)", scrollbarWidth: "none" }}
      >
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusTab(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors"
            style={{
              backgroundColor: statusTab === key ? "var(--ink)" : "transparent",
              color: statusTab === key ? "var(--paper)" : "var(--ink-faint)",
              border: statusTab === key ? "none" : "1px solid var(--rule)",
            }}
          >
            {label}
            {(counts[key] ?? 0) > 0 && (
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: statusTab === key ? "rgba(255,255,255,0.2)" : "var(--paper-warm)",
                  color: statusTab === key ? "var(--paper)" : "var(--ink)",
                }}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Claims list */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Home size={24} style={{ color: "var(--ink-faint)" }} />
            <p style={{ fontSize: 14, color: "var(--ink-faint)" }}>No claims in this category.</p>
          </div>
        )}

        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {filtered.map(home => {
            const meta = HOME_STATUS_META[home.status];
            const handler = home.handledById ? getAgent(home.handledById) : null;
            const age = daysSince(home.createdAt);
            const isPending = home.status === "pending" || home.status === "more_info_requested";

            return (
              <div
                key={home.id}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--paper)",
                  border: isPending && age > 2 ? "1.5px solid #8A6D00" : "1px solid var(--rule)",
                  boxShadow: "var(--lift)",
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--paper-warm)" }}
                  >
                    <Home size={18} style={{ color: "var(--ink-soft)" }} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                        {home.bedrooms > 0 ? `${home.bedrooms}BHK ` : ""}{PROP_LABEL[home.propertyType]} · {home.locality}
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{ backgroundColor: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      {isPending && age > 2 && (
                        <span style={{ fontSize: 11, color: "#8A6D00" }}>
                          <Clock size={11} style={{ display: "inline", marginRight: 2 }} />
                          {age}d old
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>
                      {home.address}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                        {home.areaSqft.toLocaleString("en-IN")} sqft · {formatINR(home.priceAsking)}
                        {home.facing ? ` · ${home.facing} facing` : ""}
                        {home.ageYears !== undefined ? ` · ${home.ageYears}yr old` : ""}
                      </span>
                    </div>

                    {/* Owner */}
                    <div className="mt-2 flex items-center gap-4 flex-wrap">
                      <div>
                        <span style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Owner</span>
                        <p style={{ fontSize: 13, color: "var(--ink)" }}>{home.ownerName} · {home.ownerPhone}</p>
                      </div>
                      {home.ownerEmail && (
                        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.ownerEmail}</p>
                      )}
                      <div>
                        <span style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Via</span>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)" }} className="capitalize">{home.submittedVia}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Received</span>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{fmtDate(home.createdAt)}</p>
                      </div>
                      {handler && (
                        <div>
                          <span style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Handled by</span>
                          <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{handler.fullName}</p>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {home.amenities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {home.amenities.map(a => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded-full text-[10px]"
                            style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-faint)" }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {home.description && (
                      <p className="mt-2" style={{ fontSize: 12, color: "var(--ink-faint)", fontStyle: "italic" }}>
                        "{home.description}"
                      </p>
                    )}

                    {/* Admin note */}
                    {home.adminNote && (
                      <div
                        className="mt-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: "var(--paper-warm)", borderLeft: `3px solid ${meta.color}` }}
                      >
                        <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.adminNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons (only for pending / info-requested) */}
                  {(home.status === "pending" || home.status === "more_info_requested") && (
                    <div className="shrink-0 flex flex-col gap-2">
                      <ActionButton label="Approve" color="#126940" bg="#D4F0E3" icon={CheckCircle} />
                      <ActionButton label="More info" color="#B05B15" bg="#FAE9D8" icon={Info} />
                      <ActionButton label="Reject" color="#B03030" bg="#F5DADA" icon={XCircle} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
