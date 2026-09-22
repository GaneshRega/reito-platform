"use client";

import Image from "next/image";

const PROPERTY_TYPES = [
  {
    label: "Villa",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=70",
  },
  {
    label: "Apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=70",
  },
];

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export default function StepPropertyType({ value, onChange }: Props) {
  const toggle = (t: string) => {
    onChange(value.includes(t) ? value.filter((v) => v !== t) : [...value, t]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div className="text-center">
        <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 14 }}>
          First, tell our AI
        </p>
        <h2
          style={{
            fontSize: "clamp(26px, 3.8vw, 46px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: "var(--ink)",
          }}
        >
          What kind of home<br />are you looking for?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
        {PROPERTY_TYPES.map(({ label, image }) => {
          const selected = value.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className="group relative rounded-[14px] overflow-hidden text-left transition-all duration-200"
              style={{
                border: selected ? "2px solid var(--gold)" : "1.5px solid var(--rule)",
                outline: "none",
                boxShadow: selected
                  ? "0 0 0 3px rgba(168,134,62,0.15)"
                  : "0 1px 4px rgba(33,29,25,0.06)",
              }}
              aria-pressed={selected}
            >
              {/* Property image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{
                    background: selected
                      ? "rgba(168,134,62,0.22)"
                      : "rgba(33,29,25,0.08)",
                  }}
                />
                {selected && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--gold)" }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Label */}
              <div
                className="px-3 py-2.5 transition-colors duration-200"
                style={{
                  backgroundColor: selected ? "var(--gold-soft)" : "var(--paper-cool)",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? "var(--ink)" : "var(--ink-soft)",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {value.length === 0 && (
        <p className="text-center text-sm" style={{ color: "var(--ink-faint)" }}>
          Select one or more — you can refine later.
        </p>
      )}
    </div>
  );
}
