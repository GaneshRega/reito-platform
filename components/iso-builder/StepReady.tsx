"use client";

import { formatBudget, formatTimeline } from "@/lib/format";

interface ISOState {
  location: string;
  timeline: number;
  budget: number;
  propertyTypes: string[];
  perks: string[];
}

interface Props {
  state: ISOState;
  onPublish: () => void;
  onMoreDetails: () => void;
}

export default function StepReady({ state, onPublish, onMoreDetails }: Props) {
  const rows: { label: string; value: string }[] = [
    { label: "Location",  value: state.location || "—" },
    { label: "Timeline",  value: formatTimeline(state.timeline) },
    { label: "Budget",    value: formatBudget(state.budget) },
    {
      label: "Type",
      value: state.propertyTypes.length > 0
        ? state.propertyTypes.join(", ")
        : "Any",
    },
    {
      label: "Perks",
      value: state.perks.length > 0
        ? state.perks.join(" · ")
        : "None selected",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-10">
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
          Your ISO is ready.
        </h2>
        <p
          className="mt-3"
          style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.55 }}
        >
          Publish it and owners of matching homes will be able to see you're looking.
        </p>
      </div>

      {/* Summary */}
      <div
        className="rounded-[14px] overflow-hidden divide-y"
        style={{
          border: "1px solid var(--rule)",
          backgroundColor: "var(--paper-cool)",
        }}
      >
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between px-5 py-3.5">
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink)",
                textAlign: "right",
                maxWidth: "60%",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onPublish}
          className="w-full py-4 rounded-full text-center transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--paper)",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Publish &amp; view my ISO
        </button>
        <button
          onClick={onMoreDetails}
          className="w-full py-3 rounded-full text-center transition-colors"
          style={{
            border: "1.5px solid var(--rule)",
            color: "var(--ink-soft)",
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--ink-soft)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--rule)")
          }
        >
          Add more details first
        </button>
      </div>
    </div>
  );
}
