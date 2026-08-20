"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CLIENTS } from "@/lib/admin/data";
import { STATUS_META, type Client, type ClientStatus } from "@/lib/admin/types";
import { formatBudget } from "@/lib/format";

const PIPELINE_STAGES: ClientStatus[] = [
  "new","contacted","verified","published",
  "matched","owner_contacted","negotiating",
  "closed_won","closed_lost","dropped",
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function KanbanCard({ client }: { client: Client }) {
  const meta = STATUS_META[client.status];
  const initials = client.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Link
      href={`/admin/clients/${client.id}`}
      className="block rounded-lg p-3 mb-2 hover:shadow-md transition-shadow cursor-pointer"
      style={{
        backgroundColor: "var(--paper)",
        border: "1px solid var(--rule)",
        textDecoration: "none",
      }}
      draggable
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
        >
          {initials}
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }} className="truncate">
          {client.fullName}
        </p>
      </div>
      <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 4 }}>
        {client.localities.slice(0, 2).join(", ")}
      </p>
      <p style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 500 }}>
        {formatBudget(client.budgetMin)}–{formatBudget(client.budgetMax)}
      </p>
      <p style={{ fontSize: 10, color: "var(--ink-faint)", marginTop: 4 }}>
        {fmtDate(client.updatedAt)}
      </p>
    </Link>
  );
}

export default function PipelinePage() {
  const [view, setView] = useState<"kanban" | "stages">("kanban");

  const byStatus: Record<ClientStatus, Client[]> = {} as Record<ClientStatus, Client[]>;
  PIPELINE_STAGES.forEach(s => { byStatus[s] = []; });
  CLIENTS.forEach(c => { byStatus[c.status]?.push(c); });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-3"
        style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Pipeline</h1>
        <div className="flex-1" />
        <div
          className="flex items-center rounded-full p-0.5"
          style={{ border: "1px solid var(--rule)" }}
        >
          {(["kanban", "stages"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize"
              style={{
                backgroundColor: view === v ? "var(--ink)" : "transparent",
                color: view === v ? "var(--paper)" : "var(--ink-faint)",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      {view === "kanban" && (
        <div
          className="flex-1 overflow-x-auto"
          style={{ padding: "16px", display: "flex", gap: 12, alignItems: "flex-start" }}
        >
          {PIPELINE_STAGES.map(status => {
            const clients = byStatus[status];
            const meta = STATUS_META[status];
            return (
              <div
                key={status}
                className="flex flex-col shrink-0"
                style={{ width: 220 }}
              >
                {/* Column header */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2 shrink-0"
                  style={{ backgroundColor: meta.bg }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: meta.color, flex: 1 }}>
                    {meta.label}
                  </span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: meta.color + "33", color: meta.color }}
                  >
                    {clients.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ minHeight: 60 }}>
                  {clients.map(c => (
                    <KanbanCard key={c.id} client={c} />
                  ))}
                  {clients.length === 0 && (
                    <div
                      className="rounded-lg py-6 flex items-center justify-center"
                      style={{ border: "1.5px dashed var(--rule)" }}
                    >
                      <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>Empty</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stages list view */}
      {view === "stages" && (
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {PIPELINE_STAGES.map(status => {
              const clients = byStatus[status];
              const meta = STATUS_META[status];
              if (clients.length === 0) return null;
              return (
                <div
                  key={status}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2.5"
                    style={{ backgroundColor: meta.bg, borderBottom: "1px solid var(--rule)" }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: meta.color + "22", color: meta.color }}
                    >
                      {clients.length}
                    </span>
                  </div>
                  {clients.map((c, i) => (
                    <Link
                      key={c.id}
                      href={`/admin/clients/${c.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:opacity-80 transition-opacity"
                      style={{
                        borderTop: i > 0 ? "1px solid var(--rule)" : "none",
                        backgroundColor: "var(--paper)",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
                      >
                        {c.fullName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{c.fullName}</p>
                        <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                          {c.localities.slice(0,2).join(", ")} · {formatBudget(c.budgetMin)}–{formatBudget(c.budgetMax)}
                        </p>
                      </div>
                      <span className="shrink-0" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                        {fmtDate(c.updatedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
