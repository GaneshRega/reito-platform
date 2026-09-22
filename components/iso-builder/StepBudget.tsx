"use client";

import { useState, useCallback, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatBudget } from "@/lib/format";

/* ── Log-scale helpers ───────────────────────────────────── */
const LOG_MIN = Math.log10(4_000_000);   // ₹40L
const LOG_MAX = Math.log10(100_000_000); // ₹10Cr

function sliderToRupees(v: number): number {
  const log = LOG_MIN + (v / 100) * (LOG_MAX - LOG_MIN);
  // Round to nearest ₹1L
  return Math.round(Math.pow(10, log) / 100_000) * 100_000;
}

function rupeesToSlider(r: number): number {
  return ((Math.log10(r) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
}

/* Tick labels and their slider positions */
const TICKS: { label: string; rupees: number }[] = [
  { label: "₹50L", rupees: 5_000_000 },
  { label: "₹1Cr", rupees: 10_000_000 },
  { label: "₹2Cr", rupees: 20_000_000 },
  { label: "₹5Cr", rupees: 50_000_000 },
  { label: "₹10Cr", rupees: 100_000_000 },
];

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function StepBudget({ value, onChange }: Props) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(true);
  const sliderId = useId();

  const sliderVal = rupeesToSlider(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettled(false);
      onChange(sliderToRupees(Number(e.target.value)));
    },
    [onChange]
  );

  const handleSettle = useCallback(() => setSettled(true), []);

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-lg mx-auto">
      {/* ── Question ─────────────────────────────────────── */}
      <div className="text-center">
        <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 14 }}>
          Help our AI narrow it down
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
          What&apos;s your budget?
        </h2>
      </div>

      {/* ── Numeral display ──────────────────────────────── */}
      <div className="flex flex-col items-center gap-1 select-none">
        <motion.p
          animate={
            reduced
              ? { opacity: settled ? 1 : 0.7 }
              : { scale: settled ? 1 : 0.96, opacity: settled ? 1 : 0.85 }
          }
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.045em",
            fontVariantNumeric: "tabular-nums",
            color: "var(--ink)",
            lineHeight: 1,
          }}
        >
          {formatBudget(value)}
        </motion.p>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--ink-faint)",
          }}
        >
          Budget
        </p>
      </div>

      {/* ── Slider ───────────────────────────────────────── */}
      <div className="w-full relative pb-6">
        {/* Track */}
        <div className="relative h-1.5 rounded-full bg-[rgba(33,29,25,0.10)] mb-6">
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-none"
            style={{
              width: `${sliderVal}%`,
              backgroundColor: "var(--gold)",
            }}
          />
          {/* Thumb overlay handled by native input */}
        </div>

        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={sliderVal}
          onChange={handleChange}
          onMouseUp={handleSettle}
          onTouchEnd={handleSettle}
          onKeyUp={handleSettle}
          aria-label="Budget slider"
          aria-valuetext={formatBudget(value)}
          className="absolute inset-x-0 top-0 w-full h-1.5 opacity-0 cursor-pointer"
          style={{ height: "24px", marginTop: "-12px" }}
        />

        {/* Tick marks */}
        <div className="relative h-4">
          {TICKS.map(({ label, rupees }) => {
            const pos = rupeesToSlider(rupees);
            const active = value >= rupees;
            return (
              <span
                key={label}
                className="absolute flex flex-col items-center"
                style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
              >
                <span
                  className="block w-px h-2 rounded-full mb-1 transition-colors duration-200"
                  style={{
                    backgroundColor: active
                      ? "var(--gold)"
                      : "rgba(33,29,25,0.15)",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: active ? "var(--gold)" : "var(--ink-faint)",
                    transition: "color 200ms",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
