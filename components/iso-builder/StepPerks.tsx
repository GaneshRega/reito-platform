"use client";

import { X } from "lucide-react";
import perksData from "@/data/perks.json";

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export default function StepPerks({ value, onChange }: Props) {
  const toggle = (p: string) => {
    onChange(
      value.includes(p) ? value.filter((v) => v !== p) : [...value, p]
    );
  };
  const remove = (p: string) => onChange(value.filter((v) => v !== p));

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 14 }}>
          Last question
        </p>
        <h2
          style={{
            fontSize: "clamp(34px, 5vw, 56px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--ink)",
          }}
        >
          What are your<br />must-haves?
        </h2>
      </div>

      {/* Selected pills echoed above the grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 border-b" style={{ borderColor: "var(--rule)" }}>
          {value.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm"
              style={{
                backgroundColor: "var(--gold-soft)",
                border: "1px solid var(--gold)",
                color: "var(--ink)",
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              {p}
              <button
                onClick={() => remove(p)}
                aria-label={`Remove ${p}`}
                className="rounded-full transition-opacity hover:opacity-70"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Chip grid */}
      <div className="flex flex-wrap gap-2">
        {(perksData as string[]).map((p) => {
          const selected = value.includes(p);
          return (
            <button
              key={p}
              onClick={() => toggle(p)}
              aria-pressed={selected}
              className="px-4 py-2 text-sm transition-all duration-180"
              style={{
                borderRadius: "var(--r-chip)",
                border: selected
                  ? "1.5px solid var(--gold)"
                  : "1.5px solid var(--rule)",
                backgroundColor: selected
                  ? "var(--gold-soft)"
                  : "var(--paper-cool)",
                color: selected ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: selected ? 500 : 400,
              }}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
