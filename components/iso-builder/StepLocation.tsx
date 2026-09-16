"use client";

import { useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import localitiesData from "@/data/localities.json";

interface LocalityEntry { name: string; city: string }
interface ProjectEntry  { name: string; locality: string; city: string }

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function StepLocation({ value, onChange }: Props) {
  const [query, setQuery] = useState(value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;
    return {
      localities: (localitiesData.localities as LocalityEntry[]).filter((l) =>
        l.name.toLowerCase().includes(q)
      ),
      cities: localitiesData.cities.filter((c) =>
        c.toLowerCase().includes(q)
      ),
      projects: (localitiesData.projects as ProjectEntry[]).filter((p) =>
        p.name.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  const pick = (label: string) => {
    setQuery(label);
    onChange(label);
  };

  const hasResults =
    filtered &&
    (filtered.localities.length > 0 ||
      filtered.cities.length > 0 ||
      filtered.projects.length > 0);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      {/* Question */}
      <div className="text-center">
        <h2
          style={{
            fontSize: "clamp(34px, 5vw, 56px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--ink)",
          }}
        >
          Where are you looking?
        </h2>
      </div>

      {/* Search input */}
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--ink-faint)" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) onChange("");
          }}
          placeholder="Locality, city or project…"
          autoFocus
          style={{
            width: "100%",
            paddingLeft: 40,
            paddingRight: 16,
            paddingTop: 14,
            paddingBottom: 14,
            borderRadius: "var(--r-input)",
            border: "1.5px solid var(--rule)",
            backgroundColor: "var(--paper-cool)",
            fontSize: 15,
            color: "var(--ink)",
            outline: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--ink)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--rule)")
          }
        />
      </div>

      {/* Results */}
      {hasResults && (
        <div
          className="rounded-[14px] overflow-hidden divide-y"
          style={{
            border: "1px solid var(--rule)",
            backgroundColor: "var(--paper-cool)",
          }}
        >
          {filtered.localities.length > 0 && (
            <Group
              label="Localities"
              items={filtered.localities.map((l) => `${l.name}, ${l.city}`)}
              onPick={pick}
            />
          )}
          {filtered.cities.length > 0 && (
            <Group label="Cities" items={filtered.cities} onPick={pick} />
          )}
          {filtered.projects.length > 0 && (
            <Group
              label="Projects"
              items={filtered.projects.map(
                (p) => `${p.name}, ${p.locality}`
              )}
              onPick={pick}
            />
          )}
        </div>
      )}

      {query && !hasResults && filtered && (
        <p
          className="text-center text-sm"
          style={{ color: "var(--ink-faint)" }}
        >
          No results for &ldquo;{query}&rdquo; — type a city or locality name.
        </p>
      )}
    </div>
  );
}

function Group({
  label,
  items,
  onPick,
}: {
  label: string;
  items: string[];
  onPick: (v: string) => void;
}) {
  return (
    <div>
      <p
        className="px-4 pt-3 pb-1"
        style={{
          fontSize: 11,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--ink-faint)",
        }}
      >
        {label}
      </p>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onPick(item)}
          className="w-full text-left px-4 py-2.5 transition-colors"
          style={{ fontSize: 14, color: "var(--ink-soft)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(33,29,25,0.04)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {item}
        </button>
      ))}
    </div>
  );
}
