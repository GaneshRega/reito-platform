"use client";

import { useState, useCallback, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatTimeline } from "@/lib/format";

const MIN = 3;   // 3 months
const MAX = 48;  // 4 years

const TICKS = [
  { label: "6mo", months: 6 },
  { label: "1yr", months: 12 },
  { label: "2yr", months: 24 },
  { label: "3yr", months: 36 },
  { label: "4yr", months: 48 },
];

interface Props {
  value: number; // months
  onChange: (v: number) => void;
}

export default function StepTimeline({ value, onChange }: Props) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(true);
  const sliderId = useId();

  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettled(false);
      onChange(Number(e.target.value));
    },
    [onChange]
  );
  const handleSettle = useCallback(() => setSettled(true), []);

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-lg mx-auto">
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
          When are you hoping to move?
        </h2>
        <p
          className="mt-3"
          style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.55 }}
        >
          The more flexible the timeline, the better your options.
        </p>
      </div>

      {/* Numeral */}
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
          {formatTimeline(value)}
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
          Timeline
        </p>
      </div>

      {/* Slider */}
      <div className="w-full relative pb-6">
        <div className="relative h-1.5 rounded-full bg-[rgba(33,29,25,0.10)] mb-6">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pct}%`, backgroundColor: "var(--gold)" }}
          />
        </div>

        <input
          id={sliderId}
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={value}
          onChange={handleChange}
          onMouseUp={handleSettle}
          onTouchEnd={handleSettle}
          onKeyUp={handleSettle}
          aria-label="Timeline slider"
          aria-valuetext={formatTimeline(value)}
          className="absolute inset-x-0 top-0 w-full opacity-0 cursor-pointer"
          style={{ height: "24px", marginTop: "-12px" }}
        />

        {/* Ticks */}
        <div className="relative h-4">
          {TICKS.map(({ label, months }) => {
            const pos = ((months - MIN) / (MAX - MIN)) * 100;
            const active = value >= months;
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
