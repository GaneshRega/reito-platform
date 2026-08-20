"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Phone, MessageSquare, Mail, Clock,
  CheckCircle, User, MapPin, Home, Calendar,
  FileText, Zap, GitBranch, X, Plus, Users,
  ChevronDown,
} from "lucide-react";
import {
  TEAM, getAgent, getClientUpdates, getClientFollowUps, getClientMatches,
} from "@/lib/admin/data";
import {
  STATUS_META, PROP_LABEL, SOURCE_LABEL, UPDATE_LABEL,
  type Client, type ClientStatus, type UpdateType, type FollowUp, type ClientUpdate,
} from "@/lib/admin/types";
import { formatBudget, formatTimeline, formatINR } from "@/lib/format";

type Tab = "profile" | "timeline" | "matches" | "followups";

// ── Activity config ───────────────────────────────────────────────────────────

const LOG_TYPES: Array<{ key: UpdateType; label: string; icon: React.ElementType }> = [
  { key: "call",       label: "Call",       icon: Phone         },
  { key: "whatsapp",   label: "WhatsApp",   icon: MessageSquare },
  { key: "meeting",    label: "Meeting",    icon: Users         },
  { key: "site_visit", label: "Site Visit", icon: MapPin        },
  { key: "email",      label: "Email",      icon: Mail          },
  { key: "note",       label: "Note",       icon: FileText      },
];

const SCHEDULE_TYPES: Array<{ key: UpdateType; label: string; icon: React.ElementType }> = [
  { key: "call",       label: "Call",       icon: Phone  },
  { key: "meeting",    label: "Meeting",    icon: Users  },
  { key: "site_visit", label: "Site Visit", icon: MapPin },
];

const UPDATE_ICONS: Record<UpdateType, React.ElementType> = {
  call: Phone, meeting: Users, site_visit: MapPin,
  email: Mail, whatsapp: MessageSquare, note: FileText,
  status_change: GitBranch, reassignment: User, system: Zap,
};

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " · " +
    d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
  );
}

function fmtDue(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.round(diffMs / 3600000);
  const diffD = Math.round(diffMs / 86400000);
  if (diffH < 0) return `Overdue by ${Math.abs(diffD) < 1 ? `${Math.abs(diffH)}h` : `${Math.abs(diffD)}d`}`;
  if (diffH < 1) return "In less than an hour";
  if (diffH < 24) return `In ${diffH}h`;
  if (diffD === 1) return "Tomorrow · " + d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  if (diffD < 7) return `In ${diffD} days · ` + d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " · " + d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function isOverdue(dueAt: string, completedAt?: string) {
  return !completedAt && new Date(dueAt) < new Date();
}

function defaultFuDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.34, backgroundColor: "var(--paper-warm)", color: "var(--ink)" }}
    >
      {initials}
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}>
      {title && (
        <h3 className="mb-3" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-faint)" }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2" style={{ borderBottom: "1px solid var(--rule)" }}>
      <span style={{ fontSize: 11, color: "var(--ink-faint)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 14, color: "var(--ink)" }}>{value || "—"}</span>
    </div>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(33,29,25,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={ref}
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl flex flex-col"
        style={{
          backgroundColor: "var(--paper)",
          border: "1px solid var(--rule)",
          boxShadow: "0 8px 48px rgba(33,29,25,0.18)",
          maxHeight: "92dvh",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Type selector chip ────────────────────────────────────────────────────────

function TypeChip({
  label, icon: Icon, active, onClick,
}: {
  label: string; icon: React.ElementType; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      style={{
        backgroundColor: active ? "var(--ink)" : "var(--paper-warm)",
        color: active ? "var(--paper)" : "var(--ink-soft)",
        border: active ? "none" : "1px solid var(--rule)",
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

// ── Log Update Modal ──────────────────────────────────────────────────────────

function LogUpdateModal({
  clientName,
  currentStatus,
  onClose,
  onSubmit,
  onSchedule,
}: {
  clientName: string;
  currentStatus: ClientStatus;
  onClose: () => void;
  onSubmit: (type: UpdateType, body: string, newStatus?: ClientStatus) => void;
  onSchedule: (prefillTitle: string) => void;
}) {
  const [type, setType] = useState<UpdateType>("call");
  const [body, setBody] = useState("");
  const [changeStatus, setChangeStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ClientStatus>(currentStatus);
  const [scheduleCallback, setScheduleCallback] = useState(false);

  const canSubmit = body.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit(type, body.trim(), changeStatus ? newStatus : undefined);
    if (scheduleCallback) {
      const typeLabel = LOG_TYPES.find(t => t.key === type)?.label ?? "Follow-up";
      onSchedule(`${typeLabel} re: ${clientName}`);
    } else {
      onClose();
    }
  }

  return (
    <Modal title="Log activity" onClose={onClose}>
      {/* Type */}
      <div className="mb-4">
        <p className="mb-2" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {LOG_TYPES.map(t => (
            <TypeChip key={t.key} label={t.label} icon={t.icon} active={type === t.key} onClick={() => setType(t.key)} />
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <p className="mb-1.5" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Notes
        </p>
        <textarea
          autoFocus
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={
            type === "call" ? "What was discussed? Budget, timeline, objections…" :
            type === "whatsapp" ? "Summary of the WhatsApp conversation…" :
            type === "meeting" ? "What was covered? Next steps agreed?" :
            type === "site_visit" ? "Property visited, client reactions, interest level…" :
            type === "email" ? "What did the email say? Any response received?" :
            "Add a note…"
          }
          rows={4}
          className="w-full rounded-xl px-3 py-2.5 outline-none resize-none"
          style={{
            border: "1px solid var(--rule)",
            backgroundColor: "var(--paper-cool)",
            color: "var(--ink)",
            fontSize: 14,
            lineHeight: 1.55,
          }}
        />
      </div>

      {/* Change status */}
      <div className="mb-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => setChangeStatus(v => !v)}
            className="w-4 h-4 rounded flex items-center justify-center shrink-0"
            style={{
              backgroundColor: changeStatus ? "var(--ink)" : "transparent",
              border: `2px solid ${changeStatus ? "var(--ink)" : "var(--rule)"}`,
            }}
          >
            {changeStatus && <CheckCircle size={10} color="white" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Update client status</span>
        </label>

        {changeStatus && (
          <div className="mt-2 relative">
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as ClientStatus)}
              className="appearance-none w-full pl-3 pr-8 py-2 rounded-lg outline-none text-sm"
              style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
            >
              {Object.entries(STATUS_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-faint)" }} />
          </div>
        )}
      </div>

      {/* Schedule callback */}
      <div className="mb-5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => setScheduleCallback(v => !v)}
            className="w-4 h-4 rounded flex items-center justify-center shrink-0"
            style={{
              backgroundColor: scheduleCallback ? "var(--ink)" : "transparent",
              border: `2px solid ${scheduleCallback ? "var(--ink)" : "var(--rule)"}`,
            }}
          >
            {scheduleCallback && <CheckCircle size={10} color="white" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Schedule a follow-up after logging</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)" }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-opacity"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--paper)",
            opacity: canSubmit ? 1 : 0.4,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {scheduleCallback ? "Log & Schedule" : "Log activity"}
        </button>
      </div>
    </Modal>
  );
}

// ── Schedule Modal ────────────────────────────────────────────────────────────

function ScheduleModal({
  clientName,
  initialTitle,
  onClose,
  onSubmit,
}: {
  clientName: string;
  initialTitle: string;
  onClose: () => void;
  onSubmit: (fu: Omit<FollowUp, "id" | "createdAt">) => void;
}) {
  const [type, setType] = useState<UpdateType>("call");
  const [title, setTitle] = useState(initialTitle || `Call with ${clientName}`);
  const [date, setDate] = useState(defaultFuDate());
  const [time, setTime] = useState("10:00");
  const [assignedTo, setAssignedTo] = useState("a2");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!initialTitle) {
      const typeLabel = SCHEDULE_TYPES.find(t => t.key === type)?.label ?? "Follow-up";
      setTitle(`${typeLabel} with ${clientName}`);
    }
  }, [type, clientName, initialTitle]);

  const canSubmit = title.trim() && date && time;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      clientId: "",
      title: title.trim(),
      dueAt: `${date}T${time}:00`,
      assignedToId: assignedTo,
      createdBy: "a2",
    });
    onClose();
  }

  const agents = TEAM.filter(a => a.status === "active" && a.role !== "viewer");

  return (
    <Modal title="Schedule activity" onClose={onClose}>
      {/* Type */}
      <div className="mb-4">
        <p className="mb-2" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Activity type
        </p>
        <div className="flex gap-2">
          {SCHEDULE_TYPES.map(t => (
            <TypeChip key={t.key} label={t.label} icon={t.icon} active={type === t.key} onClick={() => setType(t.key)} />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <p className="mb-1.5" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Title
        </p>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's this follow-up for?"
          className="w-full px-3 py-2.5 rounded-xl outline-none"
          style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)", fontSize: 14 }}
        />
      </div>

      {/* Date & time */}
      <div className="mb-4">
        <p className="mb-1.5" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Date &amp; time
        </p>
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setDate(e.target.value)}
            className="flex-[3] px-3 py-2.5 rounded-xl outline-none"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)", fontSize: 14 }}
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="flex-[2] px-3 py-2.5 rounded-xl outline-none"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)", fontSize: 14 }}
          />
        </div>
      </div>

      {/* Assign to */}
      <div className="mb-4">
        <p className="mb-1.5" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Assign to
        </p>
        <div className="relative">
          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            className="appearance-none w-full pl-3 pr-8 py-2.5 rounded-xl outline-none text-sm"
            style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.fullName} · {a.role.replace("_"," ")}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ink-faint)" }} />
        </div>
      </div>

      {/* Notes (optional) */}
      <div className="mb-5">
        <p className="mb-1.5" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" }}>
          Notes <span style={{ color: "var(--ink-faint)", fontWeight: 400, textTransform: "none" }}>(optional)</span>
        </p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Anything the assignee should know beforehand…"
          rows={2}
          className="w-full rounded-xl px-3 py-2.5 outline-none resize-none"
          style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)", fontSize: 13 }}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)" }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--paper)",
            opacity: canSubmit ? 1 : 0.4,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          <Calendar size={14} />
          Schedule
        </button>
      </div>
    </Modal>
  );
}

// ── Next-action banner ────────────────────────────────────────────────────────

function NextActionBanner({ followup, onSchedule }: { followup: FollowUp | null; onSchedule: () => void }) {
  if (!followup) {
    return (
      <button
        onClick={onSchedule}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:opacity-80 transition-opacity"
        style={{ border: "1.5px dashed var(--rule)", color: "var(--ink-faint)" }}
      >
        <Calendar size={14} />
        No follow-up scheduled — tap to add one
      </button>
    );
  }

  const Icon = UPDATE_ICONS[followup.assignedToId ? "call" : "note"];
  const overdue = isOverdue(followup.dueAt, followup.completedAt);
  const agent = getAgent(followup.assignedToId);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
      style={{
        backgroundColor: overdue ? "#FFF0F0" : "var(--paper-warm)",
        border: `1.5px solid ${overdue ? "#B03030" : "var(--rule)"}`,
      }}
    >
      <Calendar size={14} className="shrink-0" style={{ color: overdue ? "#B03030" : "var(--gold)" }} />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 13, fontWeight: 500, color: overdue ? "#B03030" : "var(--ink)" }} className="truncate">
          {followup.title}
        </p>
        <p style={{ fontSize: 11, color: overdue ? "#B03030" : "var(--ink-faint)" }}>
          {fmtDue(followup.dueAt)}
          {agent ? ` · ${agent.fullName.split(" ")[0]}` : ""}
        </p>
      </div>
      <button
        onClick={onSchedule}
        className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
        style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "var(--paper)" }}
      >
        + Add
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ClientDetail({ client: c }: { client: Client }) {
  const [tab, setTab] = useState<Tab>("profile");
  const [updates, setUpdates] = useState<ClientUpdate[]>(() => getClientUpdates(c.id));
  const [followups, setFollowups] = useState<FollowUp[]>(() => getClientFollowUps(c.id));
  const [currentStatus, setCurrentStatus] = useState<ClientStatus>(c.status);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleInitialTitle, setScheduleInitialTitle] = useState("");

  const meta     = STATUS_META[currentStatus];
  const agent    = getAgent(c.addedById);
  const assigned = getAgent(c.assignedToId);
  const matches  = getClientMatches(c.id);

  const overdueCount = followups.filter(f => isOverdue(f.dueAt, f.completedAt)).length;
  const nextFollowUp = followups
    .filter(f => !f.completedAt)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0] ?? null;

  const TABS: Array<{ key: Tab; label: string; badge?: number }> = [
    { key: "profile",   label: "Profile" },
    { key: "timeline",  label: "Timeline", badge: updates.length },
    { key: "matches",   label: "Matches",  badge: matches.length },
    { key: "followups", label: "Follow-ups", badge: overdueCount > 0 ? overdueCount : followups.filter(f => !f.completedAt).length },
  ];

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleLogSubmit(type: UpdateType, body: string, newStatus?: ClientStatus) {
    const now = new Date().toISOString();
    const newUpdates: ClientUpdate[] = [];

    newUpdates.push({
      id: `u-${Date.now()}`,
      clientId: c.id, type, body, authorId: "a2", createdAt: now,
    });

    if (newStatus && newStatus !== currentStatus) {
      newUpdates.push({
        id: `u-${Date.now()}-s`,
        clientId: c.id,
        type: "status_change",
        body: "",
        prevStatus: currentStatus,
        nextStatus: newStatus,
        authorId: "a2",
        createdAt: now,
      });
      setCurrentStatus(newStatus);
    }

    setUpdates(prev => [...newUpdates, ...prev]);
  }

  function handleScheduleSubmit(fu: Omit<FollowUp, "id" | "createdAt">) {
    const newFU: FollowUp = {
      ...fu,
      id: `f-${Date.now()}`,
      clientId: c.id,
      createdAt: new Date().toISOString(),
    };
    setFollowups(prev => [...prev, newFU]);

    const now = new Date().toISOString();
    const scheduleUpdate: ClientUpdate = {
      id: `u-sched-${Date.now()}`,
      clientId: c.id,
      type: "system",
      body: `Follow-up scheduled: "${newFU.title}" — ${fmtDue(newFU.dueAt)}`,
      authorId: "a2",
      createdAt: now,
    };
    setUpdates(prev => [scheduleUpdate, ...prev]);
  }

  function openSchedule(prefillTitle = "") {
    setScheduleInitialTitle(prefillTitle);
    setShowScheduleModal(true);
  }

  function markDone(id: string) {
    const now = new Date().toISOString();
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, completedAt: now } : f));
    const fu = followups.find(f => f.id === id);
    if (fu) {
      setUpdates(prev => [{
        id: `u-done-${Date.now()}`,
        clientId: c.id,
        type: "system",
        body: `Follow-up completed: "${fu.title}"`,
        authorId: "a2",
        createdAt: now,
      }, ...prev]);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-16">
        {/* Back */}
        <Link href="/admin/clients" className="inline-flex items-center gap-1.5 mb-4 hover:opacity-70 transition-opacity" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          <ArrowLeft size={14} /> All clients
        </Link>

        {/* ── Header card ─────────────────────────────────────────── */}
        <div className="rounded-xl p-4 md:p-5 mb-3" style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}>
          <div className="flex items-start gap-4">
            <Avatar name={c.fullName} size={48} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{c.fullName}</h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: meta.bg, color: meta.color }}>
                  {meta.label}
                </span>
                {c.isVerified && (
                  <span className="flex items-center gap-1" style={{ fontSize: 11, color: "#1D7D5A" }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1" style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                {c.localities.join(" · ")} &nbsp;·&nbsp; {formatBudget(c.budgetMin)}–{formatBudget(c.budgetMax)}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                  Added by <strong style={{ color: "var(--ink-soft)" }}>{agent?.fullName ?? "—"}</strong> on {fmtDateLong(c.createdAt)}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                  Assigned to <strong style={{ color: "var(--ink-soft)" }}>{assigned?.fullName ?? "—"}</strong>
                </span>
                <span
                  className="px-1.5 py-0.5 rounded text-[11px] font-medium"
                  style={{
                    backgroundColor: c.source === "web" ? "#E5EEF8" : c.source === "agent" ? "#F5EDD4" : "#E0F2EB",
                    color: c.source === "web" ? "#2A6EBB" : c.source === "agent" ? "#A8863E" : "#1D7D5A",
                  }}
                >
                  {SOURCE_LABEL[c.source]}
                </span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="shrink-0 flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5">
                <a href={`tel:${c.phone}`} className="p-2 rounded-full hover:opacity-70 transition-opacity" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }} title="Call">
                  <Phone size={15} />
                </a>
                <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:opacity-70 transition-opacity" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }} title="WhatsApp">
                  <MessageSquare size={15} />
                </a>
                {c.email && (
                  <a href={`mailto:${c.email}`} className="p-2 rounded-full hover:opacity-70 transition-opacity" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }} title="Email">
                    <Mail size={15} />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowLogModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)", border: "1px solid var(--rule)" }}
                >
                  <Plus size={11} /> Log
                </button>
                <button
                  onClick={() => openSchedule("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
                >
                  <Calendar size={11} /> Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Next action banner */}
          <div className="mt-3">
            <NextActionBanner followup={nextFollowUp} onSchedule={() => openSchedule("")} />
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0"
              style={{
                backgroundColor: tab === t.key ? "var(--ink)" : "var(--paper)",
                color: tab === t.key ? "var(--paper)" : "var(--ink-soft)",
                border: "1px solid var(--rule)",
              }}
            >
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: tab === t.key ? "rgba(255,255,255,0.25)" : "var(--paper-warm)",
                    color: tab === t.key ? "var(--paper)" : (overdueCount > 0 && t.key === "followups") ? "#B03030" : "var(--ink)",
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Profile ────────────────────────────────────────── */}
        {tab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <Section title="Contact">
                <Field label="Phone" value={c.phone} />
                <Field label="Email" value={c.email} />
              </Section>
              <Section title="Property criteria">
                <Field label="Localities" value={c.localities.join(", ")} />
                <Field label="Budget" value={`${formatBudget(c.budgetMin)} – ${formatBudget(c.budgetMax)}`} />
                <Field label="Property type" value={c.propertyTypes.map(t => PROP_LABEL[t]).join(", ")} />
                <Field label="Bedrooms" value={c.bedrooms.length > 0 ? c.bedrooms.join(", ") + " BHK" : "Flexible"} />
                <Field label="Timeline" value={`Within ${formatTimeline(c.timelineMonths)}`} />
              </Section>
            </div>
            <div className="flex flex-col gap-4">
              <Section title="Must-haves">
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {c.perks.length > 0
                    ? c.perks.map(p => (
                        <span key={p} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}>
                          {p}
                        </span>
                      ))
                    : <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>None specified</span>
                  }
                </div>
              </Section>
              {c.personalNote && (
                <Section title="Personal note">
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{c.personalNote}</p>
                </Section>
              )}
              <Section title="CRM metadata">
                <Field label="Client ID" value={c.id} />
                <Field label="Source" value={SOURCE_LABEL[c.source]} />
                <Field label="Added by" value={agent?.fullName} />
                <Field label="Assigned to" value={assigned?.fullName} />
                <Field label="Created" value={fmtDateLong(c.createdAt)} />
                <Field label="Last updated" value={`${fmtDateLong(c.updatedAt)} (${daysSince(c.updatedAt)}d ago)`} />
                <Field label="Verified" value={c.isVerified ? `Yes — ${fmtDateLong(c.verifiedAt!)}` : "Not yet"} />
              </Section>
            </div>
          </div>
        )}

        {/* ── Tab: Timeline ───────────────────────────────────────── */}
        {tab === "timeline" && (
          <div className="flex flex-col gap-3">
            {/* Log trigger */}
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-3 rounded-xl p-3 w-full text-left hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}
            >
              <Avatar name="Divya Menon" size={32} />
              <span
                className="flex-1 px-3 py-2 rounded-full"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink-faint)", fontSize: 13 }}
              >
                Log a call, meeting, WhatsApp, or note…
              </span>
            </button>

            {updates.length === 0 && (
              <p style={{ fontSize: 14, color: "var(--ink-faint)", padding: "24px 0", textAlign: "center" }}>
                No activity logged yet.
              </p>
            )}

            <div className="flex flex-col gap-2">
              {updates.map(u => {
                const Icon = UPDATE_ICONS[u.type] ?? FileText;
                const author = u.authorId ? getAgent(u.authorId) : null;
                const isSystem = u.type === "system" || !u.authorId;
                return (
                  <div
                    key={u.id}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{ backgroundColor: isSystem ? "var(--paper-cool)" : "var(--paper)", border: "1px solid var(--rule)" }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--paper-warm)", color: isSystem ? "var(--ink-faint)" : "var(--ink-soft)" }}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontSize: 12, fontWeight: 600, color: isSystem ? "var(--ink-faint)" : "var(--ink)" }}>
                          {UPDATE_LABEL[u.type]}
                        </span>
                        {u.prevStatus && u.nextStatus && (
                          <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                            {STATUS_META[u.prevStatus].label} → {STATUS_META[u.nextStatus].label}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: "var(--ink-faint)", marginLeft: "auto" }}>
                          {fmtDateTime(u.createdAt)}{author ? ` · ${author.fullName}` : ""}
                        </span>
                      </div>
                      {u.body && (
                        <p className="mt-1" style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                          {u.body}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: Matches ────────────────────────────────────────── */}
        {tab === "matches" && (
          <div className="flex flex-col gap-3">
            {matches.length === 0 && (
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}>
                <Home size={24} style={{ color: "var(--ink-faint)", margin: "0 auto 8px" }} />
                <p style={{ fontSize: 14, color: "var(--ink-faint)" }}>No matched homes yet.</p>
                <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>Matches appear once the profile is published.</p>
              </div>
            )}
            {matches.map(m => (
              <div
                key={m.id}
                className="rounded-xl p-4"
                style={{ backgroundColor: "var(--paper)", border: m.isPinned ? "1.5px solid var(--gold)" : "1px solid var(--rule)", boxShadow: "var(--lift)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{m.home.locality}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}>
                        {Math.round(m.score * 100)}% match
                      </span>
                      {m.isPinned && <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600 }}>★ Pinned</span>}
                    </div>
                    <p className="mt-1" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                      {m.home.bedrooms > 0 ? `${m.home.bedrooms}BHK ` : ""}{PROP_LABEL[m.home.propertyType]} · {m.home.areaSqft.toLocaleString("en-IN")} sqft · {formatINR(m.home.priceAsking)}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 2 }}>{m.home.address}</p>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Owner: {m.home.ownerName} · {m.home.ownerPhone}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 shrink-0" style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}>
                    Notify owner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Follow-ups ─────────────────────────────────────── */}
        {tab === "followups" && (
          <div className="flex flex-col gap-3">
            {/* Add trigger */}
            <button
              onClick={() => openSchedule("")}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm hover:opacity-80 transition-opacity"
              style={{ border: "1.5px dashed var(--rule)", color: "var(--ink-faint)", backgroundColor: "var(--paper)" }}
            >
              <Plus size={14} />
              Schedule a call, meeting, or site visit…
            </button>

            {/* Upcoming */}
            {followups.filter(f => !f.completedAt).length > 0 && (
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-faint)", padding: "4px 0" }}>
                Upcoming
              </p>
            )}
            {followups
              .filter(f => !f.completedAt)
              .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
              .map(f => {
                const overdue = isOverdue(f.dueAt, f.completedAt);
                const assignedAgent = getAgent(f.assignedToId);
                return (
                  <div
                    key={f.id}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{
                      backgroundColor: "var(--paper)",
                      border: overdue ? "1.5px solid #B03030" : "1px solid var(--rule)",
                      boxShadow: "var(--lift)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 cursor-pointer hover:opacity-70 transition-opacity"
                      style={{ borderColor: overdue ? "#B03030" : "var(--rule)", backgroundColor: "transparent" }}
                      onClick={() => markDone(f.id)}
                      title="Mark as done"
                    />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{f.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span style={{ fontSize: 12, color: overdue ? "#B03030" : "var(--ink-faint)" }}>
                          <Clock size={11} style={{ display: "inline", marginRight: 3 }} />
                          {fmtDue(f.dueAt)}
                          {overdue && " — Overdue"}
                        </span>
                        {assignedAgent && (
                          <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>→ {assignedAgent.fullName}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => markDone(f.id)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0 hover:opacity-80 transition-opacity"
                      style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "var(--paper-cool)" }}
                    >
                      Mark done
                    </button>
                  </div>
                );
              })}

            {/* Completed */}
            {followups.filter(f => !!f.completedAt).length > 0 && (
              <>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ink-faint)", padding: "4px 0 0" }}>
                  Completed
                </p>
                {followups
                  .filter(f => !!f.completedAt)
                  .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                  .map(f => {
                    const assignedAgent = getAgent(f.assignedToId);
                    return (
                      <div
                        key={f.id}
                        className="flex items-start gap-3 rounded-xl p-4"
                        style={{ backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)", opacity: 0.65 }}
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "#1D7D5A" }}>
                          <CheckCircle size={12} color="white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", textDecoration: "line-through" }}>{f.title}</p>
                          <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 2 }}>
                            Done {f.completedAt ? fmtDateLong(f.completedAt) : ""}
                            {assignedAgent ? ` · ${assignedAgent.fullName}` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}

            {followups.length === 0 && (
              <p style={{ fontSize: 14, color: "var(--ink-faint)", padding: "24px 0", textAlign: "center" }}>
                No follow-ups yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      {showLogModal && (
        <LogUpdateModal
          clientName={c.fullName}
          currentStatus={currentStatus}
          onClose={() => setShowLogModal(false)}
          onSubmit={(type, body, newStatus) => {
            handleLogSubmit(type, body, newStatus);
            setShowLogModal(false);
          }}
          onSchedule={(prefillTitle) => {
            setShowLogModal(false);
            openSchedule(prefillTitle);
          }}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          clientName={c.fullName}
          initialTitle={scheduleInitialTitle}
          onClose={() => setShowScheduleModal(false)}
          onSubmit={handleScheduleSubmit}
        />
      )}
    </>
  );
}
