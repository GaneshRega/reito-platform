"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import StepShell from "@/components/iso-builder/StepShell";
import StepLocation from "@/components/iso-builder/StepLocation";
import StepBudget from "@/components/iso-builder/StepBudget";
import StepPropertyType from "@/components/iso-builder/StepPropertyType";
import StepPerks from "@/components/iso-builder/StepPerks";
import StepReady from "@/components/iso-builder/StepReady";
import { listings } from "@/lib/mockData";
import { formatINR, formatBudget } from "@/lib/format";
import ClientMap from "@/components/ClientMap";

/* ── State ───────────────────────────────────────────────── */
interface ISOState {
  location: string;
  budget: number;
  propertyTypes: string[];
  perks: string[];
}

const INITIAL: ISOState = {
  location: "",
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

// TODO: add /home-match route as the canonical URL and redirect /iso → /home-match

// Step order: 0=PropertyType, 1=Budget, 2=Location, 3=Perks, 4=Results
const TOTAL_STEPS = 5;
const QUESTION_STEPS = TOTAL_STEPS - 1; // steps 0–3 are questions; step 4 is Results

type Stage = "intro" | "steps" | "gate" | "searching" | "published";
type GateStep = "phone" | "otp";

export default function ISOPage() {
  const reduced = useReducedMotion();
  const [stage, setStage]       = useState<Stage>("intro");
  const [step, setStep]         = useState(0);
  const [iso, setIso]           = useState<ISOState>(INITIAL);

  const [activeIdx, setActiveIdx] = useState(0);

  /* Gate sub-state */
  const [gateStep, setGateStep] = useState<GateStep>("phone");
  const [phone, setPhone]       = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [digits, setDigits]     = useState<string[]>(["","","","","",""]);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const update = <K extends keyof ISOState>(key: K, val: ISOState[K]) =>
    setIso((prev) => ({ ...prev, [key]: val }));

  const goNext = () => {
    // After last question step, show AI searching screen before StepReady
    if (step === QUESTION_STEPS - 1) { setStage("searching"); return; }
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else setStage("intro");
  };

  /* ── Intro screen ────────────────────────────────────── */
  if (stage === "intro") {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-5 text-center"
        style={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(200,175,145,0.72) 0%, rgba(200,175,145,0) 52%)",
            "radial-gradient(circle at 100% 0%, rgba(200,175,145,0.65) 0%, rgba(200,175,145,0) 52%)",
            "radial-gradient(circle at 0% 100%, rgba(200,175,145,0.72) 0%, rgba(200,175,145,0) 54%)",
            "radial-gradient(circle at 100% 100%, rgba(200,175,145,0.65) 0%, rgba(200,175,145,0) 54%)",
            "var(--paper)",
          ].join(", "),
        }}
      >
        <Link
          href="/"
          className="absolute top-6 right-5 p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
          style={{ color: "var(--ink-soft)" }}
          aria-label="Return home"
        >
          <X size={18} />
        </Link>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ border: "1px solid var(--rule)", color: "var(--ink-faint)", letterSpacing: "0.10em", textTransform: "uppercase" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M5 1L6.12 3.88L9 4.27L7 6.35L7.47 9.25L5 7.77L2.53 9.25L3 6.35L1 4.27L3.88 3.88L5 1Z" fill="var(--gold)" />
            </svg>
            AI-powered search
          </span>

          <h1
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--ink)" }}
          >
            Let AI find your ideal home in Hyderabad.
          </h1>

          <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            Answer {QUESTION_STEPS} quick questions. Our AI matches you with verified homes
            and connects you directly with owners — no agents, no portals.
          </p>

          <div className="flex flex-col w-full gap-3 mt-2">
            <button
              onClick={() => setStage("steps")}
              className="w-full py-4 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 15, fontWeight: 500 }}
            >
              Start AI Search
            </button>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center" }}>
              {QUESTION_STEPS} questions · under 1 minute · free
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Sign-in gate ────────────────────────────────────── */
  if (stage === "gate") {
    const maskedPhone = phone.replace(/(\d{5})(\d{5})/, "$1 $2");

    function startCountdown() {
      setCountdown(30);
    }

    function sendOtp() {
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length !== 10) {
        setPhoneError("Enter a valid 10-digit mobile number");
        return;
      }
      setPhoneError("");
      setDigits(["","","","","",""]);
      setOtpError("");
      setGateStep("otp");
      startCountdown();
    }

    function handleOtpDigit(idx: number, val: string) {
      if (!/^\d?$/.test(val)) return;
      const next = [...digits];
      next[idx] = val;
      setDigits(next);
      setOtpError("");
      if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    }

    function handleOtpKey(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Backspace" && !digits[idx] && idx > 0) {
        otpRefs.current[idx - 1]?.focus();
      }
    }

    function verifyOtp() {
      const code = digits.join("");
      if (code.length < 6) { setOtpError("Enter the 6-digit code"); return; }
      // Demo: any 6-digit code passes
      setStage("published");
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-5"
        style={{ backgroundColor: "rgba(33,29,25,0.60)", backdropFilter: "blur(4px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={gateStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-[24px] p-8 flex flex-col gap-6"
            style={{ backgroundColor: "var(--paper)", boxShadow: "0 24px 60px rgba(33,29,25,0.22)" }}
          >
            {/* Close */}
            <button
              onClick={() => { setStage("steps"); setGateStep("phone"); }}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
              style={{ color: "var(--ink-soft)" }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* WhatsApp icon */}
            <div className="flex flex-col gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--paper-warm)" }}
              >
                {/* WhatsApp logo */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1.023 13.396l-.215-.136c-1.216-.769-2.168-1.846-2.747-3.1l-.127-.277.8-.8a.75.75 0 00.166-.808l-.9-2.1A.75.75 0 007.25 8H7a2 2 0 00-2 2c0 3.866 3.134 7 7 7a2 2 0 002-2v-.25a.75.75 0 00-.454-.693l-2.1-.9a.75.75 0 00-.808.166l-.661.661z" fill="#25D366"/>
                </svg>
              </div>

              {gateStep === "phone" ? (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.2 }}>
                    Verify via WhatsApp
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                    We&apos;ll send a one-time code to your WhatsApp number.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGateStep("phone")} style={{ color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                      <ArrowLeft size={15} />
                    </button>
                    <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.2 }}>
                      Enter the code
                    </h2>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                    Sent to <strong style={{ color: "var(--ink)" }}>+91 {maskedPhone}</strong> via WhatsApp.{" "}
                    <button onClick={() => setGateStep("phone")} style={{ color: "var(--ink-soft)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", fontFamily: "inherit" }}>
                      Change
                    </button>
                  </p>
                </>
              )}
            </div>

            {/* ── Phone step ── */}
            {gateStep === "phone" && (
              <div className="flex flex-col gap-4">
                <div
                  className="flex items-center rounded-2xl overflow-hidden"
                  style={{ border: `1.5px solid ${phoneError ? "#c0392b" : "var(--rule)"}`, backgroundColor: "var(--paper-cool)" }}
                >
                  <span
                    className="px-4 py-3.5 shrink-0 select-none"
                    style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-soft)", borderRight: "1px solid var(--rule)", backgroundColor: "var(--paper-warm)" }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    placeholder="Mobile number"
                    autoFocus
                    className="flex-1 px-4 py-3.5 bg-transparent outline-none"
                    style={{ fontSize: 15, color: "var(--ink)", letterSpacing: "0.05em" }}
                  />
                </div>
                {phoneError && (
                  <p style={{ fontSize: 12, color: "#c0392b", marginTop: -8 }}>{phoneError}</p>
                )}
                <button
                  onClick={sendOtp}
                  className="w-full py-3.5 rounded-full font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 15 }}
                >
                  Send OTP on WhatsApp
                </button>
                <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center", lineHeight: 1.5 }}>
                  Your number is only used for verification.
                </p>
              </div>
            )}

            {/* ── OTP step ── */}
            {gateStep === "otp" && (
              <div className="flex flex-col gap-4">
                {/* 6 digit boxes */}
                <div className="flex gap-2 justify-center">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpDigit(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      autoFocus={i === 0}
                      className="text-center rounded-xl outline-none transition-colors"
                      style={{
                        width: 44, height: 52,
                        fontSize: 22, fontWeight: 600,
                        color: "var(--ink)",
                        border: `1.5px solid ${otpError ? "#c0392b" : d ? "var(--ink)" : "var(--rule)"}`,
                        backgroundColor: d ? "var(--paper-warm)" : "var(--paper-cool)",
                        letterSpacing: 0,
                      }}
                    />
                  ))}
                </div>
                {otpError && (
                  <p style={{ fontSize: 12, color: "#c0392b", textAlign: "center" }}>{otpError}</p>
                )}
                <button
                  onClick={verifyOtp}
                  className="w-full py-3.5 rounded-full font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 15 }}
                >
                  Verify &amp; publish
                </button>
                <ResendTimer
                  countdown={countdown}
                  setCountdown={setCountdown}
                  onResend={() => { setDigits(["","","","","",""]); setOtpError(""); startCountdown(); }}
                />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ── Searching: AI loading screen ───────────────────── */
  if (stage === "searching") {
    return <SearchingScreen onDone={() => { setStage("steps"); setStep(QUESTION_STEPS); }} />;
  }

  /* ── Published: AI Matches results dashboard ────────── */
  if (stage === "published") {
    let matched = listings.filter((l) => {
      if (iso.propertyTypes.length > 0 && !iso.propertyTypes.includes(l.propertyType)) return false;
      return l.price <= iso.budget * 1.25;
    });
    if (matched.length === 0) matched = listings.filter((l) => l.price <= iso.budget * 1.25);
    if (matched.length === 0) matched = listings.slice(0, 8);

    const total  = matched.length;
    const safIdx = ((activeIdx % total) + total) % total;
    const home   = matched[safIdx];
    const typeLabel = iso.propertyTypes.length > 0 ? iso.propertyTypes.join(" / ") : "Villa";
    const others = matched.filter((_, i) => i !== safIdx).slice(0, 2);

    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--paper)" }}>
        <style>{`
          .bento-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          @media (min-width: 1024px) {
            .bento-grid {
              grid-template-columns: 1.9fr 1fr 1.2fr 1fr;
              grid-template-rows: auto auto;
            }
            .bp { grid-column: 1; grid-row: 1 / span 2; }
            .bl { grid-column: 2; grid-row: 1; }
            .bb { grid-column: 3; grid-row: 1 / span 2; }
            .bd { grid-column: 4; grid-row: 1 / span 2; }
            .bt { grid-column: 2; grid-row: 2; }
          }
        `}</style>

        {/* ── Top bar ── */}
        <div style={{ padding: "15px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--rule)" }}>
          <span style={{ fontWeight: 500, letterSpacing: "0.4em", fontSize: 20, textTransform: "uppercase", color: "var(--ink)" }}>DISCOVER</span>
          <span style={{ fontSize: 12, color: "var(--ink-faint)", display: "none" }} className="sm:!inline">
            {typeLabel} · Up to {formatBudget(iso.budget)}{iso.location ? ` · ${iso.location}` : ""}
          </span>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-soft)", border: "1px solid var(--rule)", borderRadius: 9999, padding: "6px 14px", textDecoration: "none" }}
          >
            Save &amp; close <X size={11} />
          </Link>
        </div>

        {/* ── Profile live banner ── */}
        <div style={{ backgroundColor: "rgba(168,134,62,0.08)", borderBottom: "1px solid rgba(168,134,62,0.22)", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "var(--gold)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M2 5.5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            Your Discover profile is live —{" "}
            <strong style={{ color: "var(--ink)" }}>+91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</strong>.
            {" "}Matching owners will reach out directly on WhatsApp.
          </p>
        </div>

        {/* ── Main ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 20px 48px" }}>

          {/* Headline + nav arrows */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: "var(--ink-faint)", marginBottom: 5 }}>
                AI search complete
              </p>
              <h1 style={{ fontSize: "clamp(20px, 2.8vw, 34px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1.1 }}>
                {typeLabel} — Up to {formatBudget(iso.budget)}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setActiveIdx((i) => ((i - 1) + total) % total)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronLeft size={15} style={{ color: "var(--ink)" }} />
              </button>
              <span style={{ fontSize: 13, color: "var(--ink-soft)", minWidth: 52, textAlign: "center" }}>
                {safIdx + 1} of {total}
              </span>
              <button
                onClick={() => setActiveIdx((i) => (i + 1) % total)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronRight size={15} style={{ color: "var(--ink)" }} />
              </button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="bento-grid">

            {/* ── Inspiration / Photo ── */}
            <div className="bp" style={{ borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 300 }}>
              <Image src={home.images[0]} alt={home.title} fill style={{ objectFit: "cover" }} sizes="(max-width:1024px) 100vw, 35vw" />
              <div style={{ position: "absolute", top: 14, left: 14, backgroundColor: "rgba(247,244,239,0.94)", backdropFilter: "blur(6px)", borderRadius: 9999, padding: "4px 11px", fontSize: 11, fontWeight: 500, color: "var(--ink)", border: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M5 1L6.12 3.88L9 4.27L7 6.35L7.47 9.25L5 7.77L2.53 9.25L3 6.35L1 4.27L3.88 3.88L5 1Z" fill="var(--gold)" /></svg>
                AI Matched
              </div>
              <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
                {home.images.map((_, i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: i === 0 ? "#fff" : "rgba(255,255,255,0.45)" }} />
                ))}
              </div>
            </div>

            {/* ── Locations ── */}
            <div className="bl" style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}>
              <div style={{ padding: "18px 20px 14px" }}>
                <Label>Locations</Label>
                <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 2 }}>{home.locality}</p>
                <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>Hyderabad · {home.pincode}</p>
              </div>
              {/* Map */}
              <div style={{ height: 148, position: "relative" }}>
                <ClientMap
                  listings={[home]}
                  center={[home.lat, home.lng]}
                  zoom={14}
                  singleMarker
                />
              </div>
              <div style={{ padding: "12px 20px 18px", borderTop: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 8 }}>
                <RowStat label="Status"  value={home.status} />
                <RowStat label="Facing"  value={home.facing} />
                <RowStat label="Parking" value={`${home.parking} covered`} />
              </div>
            </div>

            {/* ── Budget + Similar Homes + CTA ── */}
            <div className="bb" style={{ borderRadius: 16, padding: "18px 20px", backgroundColor: "var(--paper-warm)", border: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label>Budget</Label>
                <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.045em", color: "var(--ink)", lineHeight: 1 }}>{formatINR(home.price)}</p>
                <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>₹{home.pricePerSqft.toLocaleString("en-IN")}/sqft · Max Price</p>
              </div>
              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
                <Label>Similar Homes</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
                  {others.map((o, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(matched.indexOf(o))}
                      style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--rule)", cursor: "pointer", background: "none", padding: 0, textAlign: "left" }}
                    >
                      <div style={{ position: "relative", aspectRatio: "4/3" }}>
                        <Image src={o.images[0]} alt={o.title} fill style={{ objectFit: "cover" }} sizes="12vw" />
                      </div>
                      <div style={{ padding: "7px 9px", backgroundColor: "var(--paper-cool)" }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.locality}</p>
                        <p style={{ fontSize: 9, color: "var(--ink-soft)" }}>{o.beds}BHK · {formatINR(o.price)}</p>
                        <p style={{ fontSize: 9, color: "var(--ink-faint)", marginTop: 2 }}>Join Waitlist</p>
                      </div>
                    </button>
                  ))}
                </div>
                {/* dots */}
                <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 10 }}>
                  {matched.slice(0, 5).map((_, i) => (
                    <span key={i} onClick={() => setActiveIdx(i)} style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: i === safIdx ? "var(--ink)" : "var(--rule)", cursor: "pointer", display: "inline-block" }} />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: "auto" }}>
                <button style={{ width: "100%", padding: "12px 0", borderRadius: 9999, backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white"/>
                  </svg>
                  Express Interest
                </button>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", textAlign: "center", marginTop: 7 }}>Owner will reach out via WhatsApp</p>
              </div>
            </div>

            {/* ── Useful Data / Key Stats ── */}
            <div className="bd" style={{ borderRadius: 16, padding: "18px 20px", backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}>
              <Label>Useful Data</Label>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 14, letterSpacing: "-0.015em" }}>{home.locality}, Hyd</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 10px" }}>
                <StatCell label="Bedrooms"   value={`${home.beds} BHK`} />
                <StatCell label="Bathrooms"  value={`${home.baths}`} />
                <StatCell label="Built-up"   value={`${home.sqft.toLocaleString()} sqft`} />
                <StatCell label="Year"       value={`${home.yearBuilt}`} />
                <StatCell label="Type"       value={home.propertyType} />
                <StatCell label="Furnishing" value={home.furnishing.replace(" ", " ")} />
              </div>
              <div style={{ borderTop: "1px solid var(--rule)", marginTop: 16, paddingTop: 14 }}>
                <Label>Amenities</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {home.amenities.slice(0, 6).map((a) => (
                    <span key={a} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 9999, border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "var(--paper)" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Timeline ── */}
            <div className="bt" style={{ borderRadius: 16, padding: "18px 20px", backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Label>Timeline</Label>
              <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1 }}>
                {home.status === "Ready to Move" ? "Move in" : home.yearBuilt}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
                {home.status === "Ready to Move" ? "Immediately available" : "Expected handover"}
              </p>
              <div style={{ marginTop: 14, padding: "7px 12px", borderRadius: 10, backgroundColor: home.status === "Ready to Move" ? "rgba(168,134,62,0.08)" : "var(--paper)", border: `1px solid ${home.status === "Ready to Move" ? "var(--gold)" : "var(--rule)"}`, display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: home.status === "Ready to Move" ? "var(--gold)" : "var(--ink-faint)", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: home.status === "Ready to Move" ? "var(--gold)" : "var(--ink-soft)" }}>{home.status}</span>
              </div>
            </div>

          </div>{/* /bento-grid */}

          {/* ── Agent Contact ── */}
          <div
            style={{
              marginTop: 12,
              borderRadius: 16,
              padding: "18px 20px",
              backgroundColor: "var(--paper-cool)",
              border: "1px solid var(--rule)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" }}>
              <div
                style={{
                  width: 46, height: 46, borderRadius: "50%",
                  backgroundColor: "var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--paper)", letterSpacing: "-0.01em" }}>
                  {home.agent.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{home.agent.name}</p>
                <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{home.agent.agency} · Discover Agent</p>
              </div>
            </div>

            {/* Contact buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
              <a
                href={`tel:${home.agent.phone.replace(/\s/g, "")}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 9999,
                  border: "1px solid var(--rule)",
                  backgroundColor: "var(--paper)",
                  fontSize: 12, fontWeight: 500, color: "var(--ink-soft)",
                  textDecoration: "none",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57 1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.59 1 1 0 01-.25 1.01l-2.2 2.19z" fill="var(--ink-soft)"/>
                </svg>
                {home.agent.phone}
              </a>

              <a
                href={`mailto:${home.agent.email}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 9999,
                  border: "1px solid var(--rule)",
                  backgroundColor: "var(--paper)",
                  fontSize: 12, fontWeight: 500, color: "var(--ink-soft)",
                  textDecoration: "none",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="var(--ink-soft)"/>
                </svg>
                Email agent
              </a>

              <a
                href={`https://wa.me/${home.agent.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 9999,
                  backgroundColor: "#25D366", color: "#fff",
                  fontSize: 12, fontWeight: 600, textDecoration: "none",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── Step flow ───────────────────────────────────────── */
  const nextDisabled =
    (step === 0 && iso.propertyTypes.length === 0) ||
    (step === 2 && !iso.location.trim());

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
            <StepPropertyType
              value={iso.propertyTypes}
              onChange={(v) => update("propertyTypes", v)}
            />
          )}
          {step === 1 && (
            <StepBudget
              value={iso.budget}
              onChange={(v) => update("budget", v)}
            />
          )}
          {step === 2 && (
            <StepLocation
              value={iso.location}
              onChange={(v) => update("location", v)}
            />
          )}
          {step === 3 && (
            <StepPerks
              value={iso.perks}
              onChange={(v) => update("perks", v)}
            />
          )}
          {step === 4 && (
            <StepReady state={iso} onPublish={() => setStage("gate")} />
          )}
        </motion.div>
      </AnimatePresence>
    </StepShell>
  );
}

/* ── Searching screen ────────────────────────────────────── */
const CORNER_BG_SEARCH = [
  "radial-gradient(circle at 0% 0%, rgba(200,175,145,0.72) 0%, rgba(200,175,145,0) 52%)",
  "radial-gradient(circle at 100% 0%, rgba(200,175,145,0.65) 0%, rgba(200,175,145,0) 52%)",
  "radial-gradient(circle at 0% 100%, rgba(200,175,145,0.72) 0%, rgba(200,175,145,0) 54%)",
  "radial-gradient(circle at 100% 100%, rgba(200,175,145,0.65) 0%, rgba(200,175,145,0) 54%)",
  "var(--paper)",
].join(", ");

const SEARCH_STEPS = [
  "Verifying your details…",
  "Scanning 500+ Hyderabad properties…",
  "Filtering by location & budget…",
  "Ranking by match score…",
  "Preparing your results…",
];

function SearchingScreen({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => {
        if (prev >= SEARCH_STEPS.length - 1) {
          clearInterval(interval);
          setDone(true);
          return prev;
        }
        return prev + 1;
      });
    }, 860);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [done, onDone]);

  const progress = ((current + 1) / SEARCH_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: CORNER_BG_SEARCH }}>

      {/* Same top bar as StepShell */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4 shrink-0">
        <span style={{ fontWeight: 500, fontSize: 20, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
          DISCOVER
        </span>
        {/* Gold progress bar */}
        <div className="flex-1 mx-8 max-w-xs">
          <div className="h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--rule)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--gold)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-center mt-1.5" style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)" }}>
            AI Matching
          </p>
        </div>
        <div style={{ width: 34 }} />
      </header>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">

          {/* Pulsing gold dot animation */}
          <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
            <motion.div
              className="absolute rounded-full"
              style={{ width: 72, height: 72, backgroundColor: "rgba(168,134,62,0.12)", border: "1.5px solid rgba(168,134,62,0.3)" }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: 44, height: 44, backgroundColor: "rgba(168,134,62,0.18)", border: "1.5px solid rgba(168,134,62,0.5)" }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
            />
            <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "var(--gold)" }} />
          </div>

          {/* Headline */}
          <div className="text-center">
            <p style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 6 }}>
              Finding your matches
            </p>
            <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
              Analysing Hyderabad properties for you
            </p>
          </div>

          {/* Step list */}
          <div className="w-full flex flex-col gap-3">
            {SEARCH_STEPS.map((label, i) => {
              const state = i < current ? "done" : i === current ? "active" : "pending";
              return (
                <motion.div
                  key={label}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: state === "pending" ? 0.28 : 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {state === "done" ? (
                      <motion.svg
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        width="18" height="18" viewBox="0 0 18 18" fill="none"
                      >
                        <circle cx="9" cy="9" r="8.5" fill="rgba(168,134,62,0.15)" stroke="var(--gold)" />
                        <path d="M6 9l2 2 4-4" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    ) : state === "active" ? (
                      <motion.div
                        style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--gold)" }}
                        animate={{ scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid var(--rule)" }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: state === "active" ? 600 : 400,
                    color: state === "done" ? "var(--ink)" : state === "active" ? "var(--ink)" : "var(--ink-faint)",
                  }}>
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Bento card helpers ──────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-faint)", marginBottom: 10 }}>
      {children}
    </p>
  );
}

function RowStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{value}</p>
    </div>
  );
}

/* ── Resend timer helper ──────────────────────────────────── */
function ResendTimer({
  countdown,
  setCountdown,
  onResend,
}: {
  countdown: number;
  setCountdown: (n: number) => void;
  onResend: () => void;
}) {
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, setCountdown]);

  return (
    <p style={{ fontSize: 13, color: "var(--ink-faint)", textAlign: "center" }}>
      {countdown > 0 ? (
        <>
          Resend code in{" "}
          <strong style={{ color: "var(--ink-soft)" }}>{countdown}s</strong>
        </>
      ) : (
        <button
          onClick={onResend}
          style={{
            color: "var(--ink-soft)",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
        >
          Resend code
        </button>
      )}
    </p>
  );
}
