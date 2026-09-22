"use client";

import Link from "next/link";
import { X, ArrowLeft } from "lucide-react";

const CORNER_BG = [
  "radial-gradient(circle at 0% 0%, rgba(200,175,145,0.72) 0%, rgba(200,175,145,0) 52%)",
  "radial-gradient(circle at 100% 0%, rgba(200,175,145,0.65) 0%, rgba(200,175,145,0) 52%)",
  "radial-gradient(circle at 0% 100%, rgba(200,175,145,0.72) 0%, rgba(200,175,145,0) 54%)",
  "radial-gradient(circle at 100% 100%, rgba(200,175,145,0.65) 0%, rgba(200,175,145,0) 54%)",
  "var(--paper)",
].join(", ");

const STEP_LABELS = ["Property", "Budget", "Location", "Lifestyle", "Matches"];

interface Props {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
  stretch?: boolean;
}

export default function StepShell({
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  children,
  stretch = false,
}: Props) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div
      className={`relative flex flex-col overflow-hidden ${stretch ? "h-screen" : "min-h-screen"}`}
      style={{ background: CORNER_BG }}
    >

      {/* ── Top bar ────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4 shrink-0">
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
              style={{ width: `${progress}%`, backgroundColor: "var(--gold)" }}
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
            {step < totalSteps - 1
                ? `${step + 1} of ${totalSteps - 1} · ${STEP_LABELS[step]}`
                : "Your AI Matches"}
          </p>
        </div>

        <Link
          href="/"
          aria-label="Discard and return home"
          className="p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
          style={{ color: "var(--ink-soft)" }}
        >
          <X size={18} />
        </Link>
      </header>

      {/* ── Step content + Continue button ─────────────────── */}
      <main
        className={`relative z-10 flex-1 px-5 pt-8 ${
          stretch
            ? "overflow-y-auto pb-10"
            : "flex flex-col items-center justify-center pb-4"
        }`}
      >
        {children}

        {/* Continue / Publish — sits directly below step content */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="px-10 py-3.5 rounded-full transition-opacity"
            style={{
              backgroundColor: "var(--ink)",
              color: "var(--paper)",
              fontSize: 15,
              fontWeight: 500,
              opacity: nextDisabled ? 0.35 : 1,
              cursor: nextDisabled ? "default" : "pointer",
            }}
          >
            {nextLabel}
          </button>
        </div>
      </main>

      {/* ── Footer — Back button only ───────────────────────── */}
      <nav
        className="relative z-10 shrink-0 flex items-center px-5 pb-8 pt-4"
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
      </nav>
    </div>
  );
}
