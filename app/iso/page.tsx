"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import StepShell from "@/components/iso-builder/StepShell";
import StepLocation from "@/components/iso-builder/StepLocation";
import StepTimeline from "@/components/iso-builder/StepTimeline";
import StepBudget from "@/components/iso-builder/StepBudget";
import StepPropertyType from "@/components/iso-builder/StepPropertyType";
import StepPerks from "@/components/iso-builder/StepPerks";
import StepReady from "@/components/iso-builder/StepReady";

/* ── State ───────────────────────────────────────────────── */
interface ISOState {
  location: string;
  timeline: number;
  budget: number;
  propertyTypes: string[];
  perks: string[];
}

const INITIAL: ISOState = {
  location: "",
  timeline: 12,
  budget: 15_000_000,
  propertyTypes: [],
  perks: [],
};

/* ── Animation variants ──────────────────────────────────── */
function variants(reduced: boolean | null) {
  return {
    enter:  { opacity: 0, y: reduced ? 0 : 12  },
    center: { opacity: 1, y: 0                   },
    exit:   { opacity: 0, y: reduced ? 0 : -12  },
  };
}

const TOTAL_STEPS = 6;

type Stage = "intro" | "steps" | "gate" | "published";

export default function ISOPage() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep]   = useState(0); // 0=location … 5=ready
  const [iso, setIso]     = useState<ISOState>(INITIAL);

  const update = <K extends keyof ISOState>(key: K, val: ISOState[K]) =>
    setIso((prev) => ({ ...prev, [key]: val }));

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else setStage("intro");
  };

  /* ── Intro screen (screen 2) ─────────────────────────── */
  if (stage === "intro") {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: "var(--paper)" }}
      >
        {/* Gradient ground */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 80%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 80% 10%, #D9CDC2, transparent)",
            opacity: 0.45,
            filter: "blur(60px)",
          }}
          aria-hidden
        />

        <Link
          href="/"
          className="absolute top-6 right-5 p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
          style={{ color: "var(--ink-soft)" }}
          aria-label="Return home"
        >
          <X size={18} />
        </Link>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
          {/* BETA pill */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              border: "1px solid var(--rule)",
              color: "var(--ink-faint)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Beta
          </span>

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--ink)",
            }}
          >
            Let&apos;s build your ISO.
          </h1>

          <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            An ISO is a profile of the home you&apos;re looking for.
            Publish it and let owners find you.
          </p>

          <div className="flex flex-col w-full gap-3 mt-2">
            <button
              onClick={() => setStage("steps")}
              className="w-full py-4 rounded-full transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--ink)",
                color: "var(--paper)",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Create an ISO
            </button>
            <Link
              href="/listings"
              className="w-full py-3 rounded-full text-center transition-colors"
              style={{
                border: "1.5px solid var(--rule)",
                color: "var(--ink-soft)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              No thanks — I&apos;ll browse instead
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Sign-in gate (fires only on publish) ────────────── */
  if (stage === "gate") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-5"
        style={{ backgroundColor: "rgba(33,29,25,0.55)" }}
      >
        <div
          className="relative w-full max-w-sm rounded-[20px] p-8 flex flex-col gap-5"
          style={{ backgroundColor: "var(--paper-cool)", boxShadow: "var(--lift)" }}
        >
          <button
            onClick={() => setStage("steps")}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
            style={{ color: "var(--ink-soft)" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div>
            <h2
              style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}
            >
              Save your ISO
            </h2>
            <p className="mt-1" style={{ fontSize: 14, color: "var(--ink-soft)" }}>
              Sign in to publish and let owners find you.
            </p>
          </div>

          {[
            { label: "Continue with Google", icon: "G" },
            { label: "Continue with Apple",  icon: "🍎" },
            { label: "Continue with Email",  icon: "✉" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className="w-full py-3.5 rounded-full flex items-center gap-3 px-5 transition-colors"
              style={{
                border: "1.5px solid var(--rule)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(33,29,25,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span className="w-5 text-center">{icon}</span>
              {label}
            </button>
          ))}

          <button
            onClick={() => setStage("intro")}
            className="text-center text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--ink-faint)" }}
          >
            No thanks, I&apos;ll start over later
          </button>
        </div>
      </div>
    );
  }

  /* ── Step flow (screens 3–8) ─────────────────────────── */
  const nextDisabled =
    (step === 0 && !iso.location.trim()) ||
    (step === 3 && iso.propertyTypes.length === 0);

  return (
    <StepShell
      step={step}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      onNext={step === TOTAL_STEPS - 1 ? () => setStage("gate") : goNext}
      nextLabel={step === TOTAL_STEPS - 1 ? "Publish" : "Continue"}
      nextDisabled={nextDisabled}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants(reduced)}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
          className="w-full"
        >
          {step === 0 && (
            <StepLocation
              value={iso.location}
              onChange={(v) => update("location", v)}
            />
          )}
          {step === 1 && (
            <StepTimeline
              value={iso.timeline}
              onChange={(v) => update("timeline", v)}
            />
          )}
          {step === 2 && (
            <StepBudget
              value={iso.budget}
              onChange={(v) => update("budget", v)}
            />
          )}
          {step === 3 && (
            <StepPropertyType
              value={iso.propertyTypes}
              onChange={(v) => update("propertyTypes", v)}
            />
          )}
          {step === 4 && (
            <StepPerks
              value={iso.perks}
              onChange={(v) => update("perks", v)}
            />
          )}
          {step === 5 && (
            <StepReady
              state={iso}
              onPublish={() => setStage("gate")}
              onMoreDetails={() => setStep(0)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </StepShell>
  );
}
