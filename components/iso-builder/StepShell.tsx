"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { X, ArrowLeft } from "lucide-react";

/* Each step supplies its own gradient positions so the light shifts. */
const STEP_GRADIENTS = [
  "radial-gradient(ellipse 70% 60% at 20% 80%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 80% 10%, #D9CDC2, transparent)",
  "radial-gradient(ellipse 70% 60% at 80% 90%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 10% 10%, #D9CDC2, transparent)",
  "radial-gradient(ellipse 80% 60% at 50% 100%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 90% 0%, #D9CDC2, transparent)",
  "radial-gradient(ellipse 60% 70% at 10% 70%, #E8D9D0, transparent), radial-gradient(ellipse 70% 60% at 70% 20%, #D9CDC2, transparent)",
  "radial-gradient(ellipse 80% 60% at 0% 50%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 100% 50%, #D9CDC2, transparent)",
  "radial-gradient(ellipse 70% 80% at 30% 90%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 70% 0%, #D9CDC2, transparent)",
];

const STEP_LABELS = [
  "Location",
  "Timeline",
  "Budget",
  "Type",
  "Perks",
  "Ready",
];

interface Props {
  step: number;         // 0-based, 0=Location … 5=Ready
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}

export default function StepShell({
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  children,
}: Props) {
  const reduced = useReducedMotion();
  const gradient = STEP_GRADIENTS[step % STEP_GRADIENTS.length];
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* Gradient ground */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: gradient,
          opacity: 0.45,
          filter: reduced ? "none" : "blur(60px)",
        }}
        aria-hidden
      />

      {/* ── Top bar ────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4">
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          DISCOVER
        </Link>

        {/* Progress bar */}
        <div className="flex-1 mx-8 max-w-xs">
          <div
            className="h-0.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--rule)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--gold)",
              }}
            />
          </div>
          <p
            className="text-center mt-1.5"
            style={{
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--ink-faint)",
            }}
          >
            {STEP_LABELS[step]} · {step + 1} of {totalSteps}
          </p>
        </div>

        {/* Close */}
        <Link
          href="/"
          aria-label="Discard and return home"
          className="p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
          style={{ color: "var(--ink-soft)" }}
        >
          <X size={18} />
        </Link>
      </header>

      {/* ── Step content ───────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8">
        {children}
      </main>

      {/* ── Nav arrows ─────────────────────────────────────── */}
      <nav
        className="relative z-10 flex items-center justify-between px-5 pb-8 pt-4"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-opacity"
          style={{
            color: step === 0 ? "var(--ink-faint)" : "var(--ink-soft)",
            fontSize: 14,
            fontWeight: 500,
            opacity: step === 0 ? 0.4 : 1,
            cursor: step === 0 ? "default" : "pointer",
          }}
          disabled={step === 0}
          aria-label="Previous step"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="px-8 py-3 rounded-full transition-opacity"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--paper)",
            fontSize: 14,
            fontWeight: 500,
            opacity: nextDisabled ? 0.35 : 1,
            cursor: nextDisabled ? "default" : "pointer",
          }}
        >
          {nextLabel}
        </button>
      </nav>
    </div>
  );
}
