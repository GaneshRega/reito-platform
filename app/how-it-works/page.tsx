"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Search, Bell, MessageCircle,
  Home, Phone, CheckCircle2, ChevronDown,
  MapPin, IndianRupee, Clock,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";

/* ── Data ─────────────────────────────────────────────────── */
const BUYER_STEPS = [
  {
    n: 1, icon: Search,
    title: "Describe your dream home",
    short: "Tell us what you want",
    body: "Location, budget, bedrooms — fill a quick profile. Takes 2 minutes. No account needed.",
    visual: "search",
  },
  {
    n: 2, icon: Bell,
    title: "AI matches you instantly",
    short: "Get matched homes",
    body: "Our AI scans all listed properties and surfaces the ones that actually fit. No scrolling through 500 irrelevant results.",
    visual: "match",
  },
  {
    n: 3, icon: MessageCircle,
    title: "Connect with the agent",
    short: "Talk to agent directly",
    body: "Each match comes with the agent's direct contact — call, email, or WhatsApp. No middlemen. No delays.",
    visual: "connect",
  },
];

const SELLER_STEPS = [
  {
    n: 1, icon: Home,
    title: "Submit your property details",
    short: "Fill a quick form",
    body: "Name, phone, location, property type. That's all we need to get started. Free — no listing fee.",
    visual: "submit",
  },
  {
    n: 2, icon: Phone,
    title: "Our agent calls you within 24hrs",
    short: "Agent contacts you",
    body: "A verified Discover agent reaches out, visits your property, and handles photos and listing — end to end.",
    visual: "call",
  },
  {
    n: 3, icon: CheckCircle2,
    title: "Your home goes live to verified buyers",
    short: "Property goes live",
    body: "Once verified, your listing appears in front of serious buyers — not time-wasters. Real budgets, real intent.",
    visual: "live",
  },
];

const STATS = [
  { icon: Clock,        value: "24 hrs",   label: "Agent responds in" },
  { icon: IndianRupee,  value: "₹0",       label: "Owner brokerage" },
  { icon: MapPin,       value: "50+",      label: "Hyderabad localities" },
];

const FAQS = [
  { q: "Is it free?", a: "Completely free for buyers. For sellers, there is zero brokerage — we charge only on a successful deal, never upfront." },
  { q: "How is this different from MagicBricks or 99acres?", a: "Portals show you thousands of listings — most irrelevant, most stale. Discover uses AI to match you to homes that actually fit, and connects you directly to the agent." },
  { q: "Do I need to create an account?", a: "No account needed to search. Enter your WhatsApp number to get your matches — that's it." },
  { q: "How are listings verified?", a: "Every property is visited and verified by a Discover agent before it goes live. No ghost listings." },
];

/* ── Visual mockups ───────────────────────────────────────── */
function Visual({ type }: { type: string }) {
  const base = { borderRadius: 16, overflow: "hidden" as const, border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", padding: 20, minHeight: 200 };

  if (type === "search") return (
    <div style={base} className="flex flex-col gap-3">
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Home Match Profile</p>
      {[["Locality", "Gachibowli, Kondapur"], ["Budget", "₹1.5Cr – ₹2.5Cr"], ["Bedrooms", "3 BHK"]].map(([label, val]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}>
          <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{val}</span>
        </div>
      ))}
      <div style={{ marginTop: 4, padding: "10px 14px", borderRadius: 10, backgroundColor: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--paper)" }}>Find my matches</span>
        <ArrowRight size={13} color="var(--paper)" />
      </div>
    </div>
  );

  if (type === "match") return (
    <div style={base} className="flex flex-col gap-2.5">
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 4 }}>3 matches found</p>
      {[
        { title: "3BHK Villa · Kondapur", price: "₹2.1Cr", pct: "97%" },
        { title: "3BHK Apt · Gachibowli", price: "₹1.8Cr", pct: "94%" },
        { title: "3BHK Apt · Madhapur",   price: "₹1.6Cr", pct: "91%" },
      ].map((h, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "var(--paper-warm)", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.title}</p>
            <p style={{ fontSize: 10, color: "var(--ink-faint)" }}>{h.price}</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#1D7D5A", backgroundColor: "#EDFAF3", padding: "2px 7px", borderRadius: 999 }}>{h.pct}</span>
        </div>
      ))}
    </div>
  );

  if (type === "connect") return (
    <div style={base} className="flex flex-col gap-3">
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Your Agent</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--paper)" }}>RK</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Ravi Kumar</p>
          <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>Discover Agent · Gachibowli</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Call", "WhatsApp", "Email"].map((a, i) => (
          <div key={a} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "1px solid var(--rule)", backgroundColor: i === 1 ? "#25D366" : "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: i === 1 ? "#fff" : "var(--ink)" }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (type === "submit") return (
    <div style={base} className="flex flex-col gap-3">
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Sell your home</p>
      {[["Your name", "Suresh Reddy"], ["WhatsApp", "+91 98491 XXXXX"], ["Locality", "Jubilee Hills"]].map(([label, val]) => (
        <div key={label} style={{ padding: "8px 12px", borderRadius: 10, backgroundColor: "var(--paper)", border: "1px solid var(--rule)" }}>
          <p style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 1 }}>{label}</p>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{val}</p>
        </div>
      ))}
      <div style={{ padding: "10px 14px", borderRadius: 10, backgroundColor: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--paper)" }}>Submit</span>
        <ArrowRight size={13} color="var(--paper)" />
      </div>
    </div>
  );

  if (type === "call") return (
    <div style={{ ...base, minHeight: 220 }} className="flex flex-col items-center justify-center gap-4 text-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "var(--paper-warm)", border: "2px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Phone size={26} style={{ color: "var(--ink)" }} />
      </motion.div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Agent calling…</p>
        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 3 }}>Ravi Kumar · Discover Agent</p>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Phone size={18} style={{ color: "#fff", transform: "rotate(135deg)" }} />
        </div>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Phone size={18} style={{ color: "#fff" }} />
        </div>
      </div>
    </div>
  );

  if (type === "live") return (
    <div style={base} className="flex flex-col gap-3">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E" }} />
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#22C55E" }}>Live</p>
      </div>
      <div style={{ height: 80, borderRadius: 10, backgroundColor: "var(--paper-warm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Home size={28} style={{ color: "var(--ink-faint)", opacity: 0.4 }} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>3BHK Villa · Jubilee Hills</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>₹2.8 Cr · 2,400 sqft</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#2A6EBB", backgroundColor: "#EFF6FF", padding: "2px 8px", borderRadius: 999 }}>8 interested</span>
      </div>
    </div>
  );

  return null;
}

/* ── FAQ accordion ────────────────────────────────────────── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="cursor-pointer py-5 select-none"
      style={{ borderBottom: "1px solid var(--rule)" }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between gap-4">
        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{q}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown size={16} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginTop: 10, overflow: "hidden" }}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function HowItWorksPage() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [activeStep, setActiveStep] = useState(0);

  const steps = role === "buyer" ? BUYER_STEPS : SELLER_STEPS;

  return (
    <div style={{ backgroundColor: "var(--paper)", minHeight: "100dvh" }}>
      <SiteNav />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="px-5 md:px-16 pt-16 pb-14 text-center" style={{ borderBottom: "1px solid var(--rule)" }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-faint)", marginBottom: 14 }}
        >
          How it works
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
          style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.08, color: "var(--ink)", maxWidth: 640, margin: "0 auto 16px" }}
        >
          Find your home.<br />Sell with zero hassle.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
          style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 440, margin: "0 auto 32px" }}
        >
          AI-matched homes for buyers. One call away for sellers.
        </motion.p>

        {/* Role toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.22 }}
          className="inline-flex rounded-full p-1"
          style={{ border: "1.5px solid var(--rule)", backgroundColor: "var(--paper-cool)" }}
        >
          {(["buyer", "seller"] as const).map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setActiveStep(0); }}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: role === r ? "var(--ink)" : "transparent",
                color: role === r ? "var(--paper)" : "var(--ink-soft)",
              }}
            >
              {r === "buyer" ? "I'm buying" : "I'm selling"}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section
        className="grid grid-cols-3"
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        {STATS.map(({ icon: Icon, value, label }, i) => (
          <div key={label} className="flex flex-col items-center justify-center py-6 gap-1.5 px-4" style={{ borderRight: i < STATS.length - 1 ? "1px solid var(--rule)" : "none" }}>
            <Icon size={16} style={{ color: "var(--ink-faint)" }} />
            <p style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", textAlign: "center" }}>{label}</p>
          </div>
        ))}
      </section>

      {/* ── Interactive steps ──────────────────────────────── */}
      <section className="px-5 md:px-16 py-16 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start"
          >
            {/* Steps list */}
            <div className="flex flex-col gap-3">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeStep === i;
                return (
                  <motion.button
                    key={step.n}
                    onClick={() => setActiveStep(i)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="text-left w-full rounded-2xl p-5 transition-all"
                    style={{
                      border: isActive ? "1.5px solid var(--ink)" : "1.5px solid var(--rule)",
                      backgroundColor: isActive ? "var(--paper-warm)" : "var(--paper-cool)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: isActive ? "var(--ink)" : "var(--paper)", border: "1px solid var(--rule)" }}
                      >
                        <Icon size={16} style={{ color: isActive ? "var(--paper)" : "var(--ink-faint)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "var(--ink)" : "var(--ink-faint)", letterSpacing: "0.08em" }}>
                            STEP {step.n}
                          </span>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                          {step.title}
                        </p>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 6, overflow: "hidden" }}
                            >
                              {step.body}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              <div className="mt-2">
                <Link
                  href={role === "buyer" ? "/iso" : "/sell"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
                >
                  {role === "buyer" ? "Find your home" : "List your property"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual panel */}
            <div className="hidden lg:block sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${role}-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <Visual type={steps[activeStep].visual} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="px-5 md:px-16 py-14 max-w-2xl mx-auto" style={{ borderTop: "1px solid var(--rule)" }}>
        <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 4 }}>
          Common questions
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 24 }}>Click to expand</p>
        <div>
          {FAQS.map(({ q, a }) => <FAQ key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <section className="px-5 md:px-16 py-16" style={{ borderTop: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 500, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.15, marginBottom: 12 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", marginBottom: 28, lineHeight: 1.6 }}>
            Whether you're buying or selling — it starts with one click.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/iso"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 15 }}
            >
              Find my home match <ArrowRight size={15} />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-colors"
              style={{ border: "1.5px solid var(--rule)", color: "var(--ink)", fontSize: 15, backgroundColor: "var(--paper)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--rule)")}
            >
              Sell your home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-16 py-8" style={{ borderTop: "1px solid var(--rule)" }}>
        <p style={{ fontSize: 20, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink-faint)" }}>DISCOVER</p>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--ink-faint)" }}>© 2026 Discover. All rights reserved.</p>
      </footer>
    </div>
  );
}
