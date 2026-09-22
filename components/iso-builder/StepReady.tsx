"use client";

import Image from "next/image";
import { Lock, ArrowRight } from "lucide-react";
import { listings } from "@/lib/mockData";
import { formatBudget } from "@/lib/format";

interface ISOState {
  location: string;
  budget: number;
  propertyTypes: string[];
  perks: string[];
}

interface Props {
  state: ISOState;
  onPublish: () => void;
}

export default function StepReady({ state, onPublish }: Props) {
  let filtered = listings.filter((l) => {
    if (state.propertyTypes.length > 0) {
      if (!state.propertyTypes.includes(l.propertyType)) return false;
    }
    return l.price <= state.budget * 1.25;
  });

  if (filtered.length === 0) {
    filtered = listings.filter((l) => l.price <= state.budget * 1.25);
  }

  const count = filtered.length;
  // Pad to always show 3 teaser cards
  const teasers = Array.from({ length: 3 }, (_, i) => filtered[i % filtered.length]);

  const typeLabel =
    state.propertyTypes.length > 0 ? state.propertyTypes.join(", ") : "Any type";
  const locationLabel = state.location
    ? state.location.split(",")[0]
    : "Hyderabad";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">

      {/* ── Count headline ─────────────────────────────────── */}
      <div className="text-center flex flex-col gap-1.5">
        <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 6 }}>
          AI search complete
        </p>
        <h2
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            lineHeight: 1.1,
          }}
        >
          {count > 0
            ? `We found ${count} matching ${count === 1 ? "home" : "homes"} for you.`
            : "Your AI profile is ready."}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
          {locationLabel} · Up to {formatBudget(state.budget)} · {typeLabel}
        </p>
      </div>

      {/* ── Blurred teaser + lock overlay ──────────────────── */}
      {count > 0 ? (
        <div className="relative rounded-[20px] overflow-hidden">

          {/* Blurred property teasers behind the overlay */}
          <div
            className="grid grid-cols-3 gap-3 p-3"
            style={{
              backgroundColor: "var(--paper-warm)",
              filter: "blur(5px)",
              transform: "scale(1.04)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {teasers.map((listing, i) => (
              <div
                key={`${listing.id}-${i}`}
                className="rounded-[10px] overflow-hidden"
                style={{ border: "1px solid var(--rule)" }}
              >
                <div className="relative" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={listing.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
                <div className="p-3" style={{ backgroundColor: "var(--paper-cool)" }}>
                  <div
                    className="h-2.5 rounded-full mb-2"
                    style={{ backgroundColor: "var(--rule)", width: "72%" }}
                  />
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: "var(--rule)", width: "48%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Frosted lock panel */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(247,244,239,0.55)",
              backdropFilter: "blur(3px)",
            }}
          >
            <div
              className="mx-5 w-full max-w-xs rounded-[20px] px-8 py-8 flex flex-col items-center gap-5 text-center"
              style={{
                backgroundColor: "rgba(247,244,239,0.96)",
                border: "1px solid var(--rule)",
                boxShadow: "0 8px 40px rgba(33,29,25,0.14)",
              }}
            >
              {/* Lock icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--ink)" }}
              >
                <Lock size={20} style={{ color: "var(--paper)" }} />
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-1.5">
                <p
                  style={{
                    fontSize: 19,
                    fontWeight: 600,
                    color: "var(--ink)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.25,
                  }}
                >
                  {count} {count === 1 ? "home" : "homes"} matched by AI
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                  Publish your Discover profile so matching owners can reach out directly
                </p>
              </div>

              {/* CTA arrow */}
              <button
                onClick={onPublish}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--ink)",
                  color: "var(--paper)",
                  fontSize: 14,
                }}
              >
                Save &amp; publish <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-[16px] py-14 flex flex-col items-center gap-3 text-center"
          style={{ backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}
        >
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>
            No listings matched your criteria yet.
          </p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
            Publish your Discover profile and we&apos;ll notify you as soon as matching properties are listed.
          </p>
        </div>
      )}
    </div>
  );
}
