"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Plus, Building2, MapPin, Bed, Maximize2 } from "lucide-react";
import { HOMES } from "@/lib/admin/data";
import { HOME_STATUS_META, LISTING_STATUS_META, PROP_LABEL } from "@/lib/admin/types";
import { formatINR } from "@/lib/format";
import { useAuth } from "@/lib/admin/auth";

export default function AgentPropertiesPage() {
  const { user } = useAuth();
  const agentId = user?.id ?? "a3";

  const myHomes = useMemo(
    () => HOMES.filter(h => h.addedById === agentId || h.handledById === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [agentId]
  );

  const stats = {
    total: myHomes.length,
    approved: myHomes.filter(h => h.status === "approved").length,
    pending: myHomes.filter(h => h.status === "pending" || h.status === "more_info_requested").length,
    rejected: myHomes.filter(h => h.status === "rejected").length,
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>My Properties</h1>
          <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 2 }}>
            Properties you&apos;ve submitted or are handling
          </p>
        </div>
        <Link
          href="/agent/properties/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
        >
          <Plus size={14} />
          Add Property
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "var(--ink)", bg: "var(--paper-warm)" },
          { label: "Approved", value: stats.approved, color: "#126940", bg: "#D4F0E3" },
          { label: "Pending", value: stats.pending, color: "#5C554C", bg: "#F0EDE8" },
          { label: "Rejected", value: stats.rejected, color: "#B03030", bg: "#F5DADA" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
            <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {myHomes.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--ink-faint)" }}>
          <Building2 size={32} className="mx-auto mb-3" style={{ opacity: 0.3 }} />
          <p style={{ fontSize: 14, marginBottom: 16 }}>No properties yet</p>
          <Link
            href="/agent/properties/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            <Plus size={14} /> Add your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myHomes.map(home => {
            const hsMeta = HOME_STATUS_META[home.status];
            const lsMeta = LISTING_STATUS_META[home.listingStatus];
            return (
              <div
                key={home.id}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
              >
                {/* Status badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: hsMeta.bg, color: hsMeta.color }}
                  >
                    {hsMeta.label}
                  </span>
                  {home.status === "approved" && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: lsMeta.bg, color: lsMeta.color }}
                    >
                      {lsMeta.label}
                    </span>
                  )}
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
                  >
                    {PROP_LABEL[home.propertyType]}
                  </span>
                </div>

                {/* Address */}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }} className="truncate">{home.address}</p>
                  <div className="flex items-center gap-1">
                    <MapPin size={11} style={{ color: "var(--ink-faint)" }} />
                    <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.locality}</span>
                  </div>
                </div>

                {/* Details row */}
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
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginLeft: "auto" }}>
                    {formatINR(home.priceAsking)}
                  </span>
                </div>

                {/* Owner */}
                <div
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ backgroundColor: "var(--paper-cool)" }}
                >
                  <div>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>Owner</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{home.ownerName}</p>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.ownerPhone}</p>
                </div>

                {home.adminNote && (
                  <p style={{ fontSize: 12, color: "#B03030", backgroundColor: "#FEF2F2" }} className="rounded-lg px-3 py-2">
                    {home.adminNote}
                  </p>
                )}

                <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                  Added {new Date(home.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
