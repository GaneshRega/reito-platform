"use client";

import { useState } from "react";
import { Search } from "lucide-react";

/* ── Tag tiers — brand colours only ─────────────────────── */
type TagTier = "hot" | "premium" | "growing" | "muted";

const LOCALITIES: { name: string; tag: string; tier: TagTier }[] = [
  { name: "Gachibowli",   tag: "High Demand",  tier: "hot"     },
  { name: "Banjara Hills",tag: "High Demand",  tier: "hot"     },
  { name: "Jubilee Hills",tag: "Premium",      tier: "premium" },
  { name: "Kokapet",      tag: "New Launches", tier: "hot"     },
  { name: "Kondapur",     tag: "Fast Growing", tier: "growing" },
  { name: "Madhapur",     tag: "IT Hub",       tier: "growing" },
  { name: "Nanakramguda", tag: "Finance City", tier: "growing" },
  { name: "Nallagandla",  tag: "Upcoming",     tier: "muted"   },
  { name: "Narsingi",     tag: "Upcoming",     tier: "muted"   },
  { name: "Manikonda",    tag: "Value Pick",   tier: "muted"   },
  { name: "Kukatpally",   tag: "Popular",      tier: "growing" },
  { name: "Kompally",     tag: "Upcoming",     tier: "muted"   },
  { name: "Begumpet",     tag: "Central",      tier: "muted"   },
  { name: "Miyapur",      tag: "Affordable",   tier: "muted"   },
  { name: "Sainikpuri",   tag: "Peaceful",     tier: "muted"   },
];

const TAG_COLOR: Record<TagTier, string> = {
  hot:     "var(--gold)",
  premium: "var(--ink)",
  growing: "var(--ink-soft)",
  muted:   "var(--ink-faint)",
};

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function StepLocation({ value, onChange }: Props) {
  const [query, setQuery] = useState("");

  const visible = query.trim()
    ? LOCALITIES.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
    : LOCALITIES;

  const pick = (name: string) => onChange(value === name ? "" : name);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

      {/* Question */}
      <div className="text-center">
        <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 12 }}>
          Almost there
        </p>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.06, color: "var(--ink)" }}>
          Which part of Hyderabad?
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 8 }}>
          Pick your preferred area.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter areas…"
          style={{
            width: "100%", paddingLeft: 34, paddingRight: 14,
            paddingTop: 8, paddingBottom: 8,
            borderRadius: 9999,
            border: "1px solid var(--rule)",
            backgroundColor: "var(--paper-warm)",
            fontSize: 13, color: "var(--ink)", outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink-soft)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--rule)")}
        />
      </div>

      {/* 5-col compact grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {visible.map(({ name, tag, tier }) => {
          const selected = value === name;
          return (
            <button
              key={name}
              onClick={() => pick(name)}
              className="flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
              style={{
                border: selected ? "1.5px solid var(--ink)" : "1px solid var(--rule)",
                backgroundColor: selected ? "var(--ink)" : "var(--paper-cool)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "var(--paper-warm)"; }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "var(--paper-cool)"; }}
            >
              <p style={{
                fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                color: selected ? "#FFFFFF" : "var(--ink)",
                letterSpacing: "-0.01em",
              }}>
                {name}
              </p>
              <p style={{
                fontSize: 10, fontWeight: 500, lineHeight: 1,
                color: selected ? "rgba(255,255,255,0.55)" : TAG_COLOR[tier],
                letterSpacing: "0.02em",
              }}>
                {tag}
              </p>
            </button>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm" style={{ color: "var(--ink-faint)" }}>
          No areas match &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );
}
