"use client";

import propertyTypes from "@/data/propertyTypes.json";

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export default function StepPropertyType({ value, onChange }: Props) {
  const toggle = (t: string) => {
    onChange(
      value.includes(t) ? value.filter((v) => v !== t) : [...value, t]
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
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
          What kind of home?
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(propertyTypes as string[]).map((t) => {
          const selected = value.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              className="rounded-[14px] p-4 text-left transition-all duration-180"
              style={{
                border: selected
                  ? "1.5px solid var(--gold)"
                  : "1.5px solid var(--rule)",
                backgroundColor: selected
                  ? "var(--gold-soft)"
                  : "var(--paper-cool)",
                color: selected ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: selected ? 500 : 400,
                fontSize: 14,
              }}
              aria-pressed={selected}
            >
              {t}
            </button>
          );
        })}
      </div>

      {value.length === 0 && (
        <p
          className="text-center text-sm"
          style={{ color: "var(--ink-faint)" }}
        >
          Select one or more — you can refine later.
        </p>
      )}
    </div>
  );
}
