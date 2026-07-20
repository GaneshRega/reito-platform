"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import isosData from "@/data/isos.json";
import { formatBudget, formatTimeline } from "@/lib/format";
import { featuredListings } from "@/lib/mockData";
import ListingCard from "@/components/ListingCard";

/* ── ISO card type ───────────────────────────────────────── */
interface ISO {
  id: string;
  buyer: { name: string; initials: string };
  location: string;
  budget: number;
  timeline: number;
  propertyType: string;
  perks: string[];
  headline: string;
}

const isos = isosData as ISO[];

/* ── How it works copy ───────────────────────────────────── */
const HOW: {
  side: string;
  steps: { n: number; title: string; body: string }[];
}[] = [
  {
    side: "For Buyers",
    steps: [
      {
        n: 1,
        title: "Describe what you want",
        body: "Location, timeline, budget, must-haves. This is your ISO — a profile of the home you're looking for.",
      },
      {
        n: 2,
        title: "Publish it",
        body: "Owners of matching homes can see you're out there. No cold contact — you wait, they reach out.",
      },
      {
        n: 3,
        title: "The owner comes to you",
        body: "When they're ready, they initiate the conversation. On their terms, in their time.",
      },
    ],
  },
  {
    side: "For Owners",
    steps: [
      {
        n: 1,
        title: "Claim your home",
        body: "Tell us a little about it. No listing fee, no commitment to sell.",
      },
      {
        n: 2,
        title: "See who's queued",
        body: "Browse buyers looking for something exactly like yours. Real names, real budgets, real timelines.",
      },
      {
        n: 3,
        title: "Open the door when you're ready",
        body: "Reach out when it suits you. No agents, no pressure, no noise.",
      },
    ],
  },
];

const ARTICLES = [
  {
    title: "How Hyderabad's micro-markets move at different speeds",
    date: "June 2026",
    href: "#",
  },
  {
    title: "Why the first offer is rarely the last",
    date: "May 2026",
    href: "#",
  },
  {
    title: "Owner control: the missing half of every property transaction",
    date: "April 2026",
    href: "#",
  },
];

export default function HomePage() {
  const reduced = useReducedMotion();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [address, setAddress] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);

  const prev = () =>
    setCarouselIdx((i) => (i - 1 + isos.length) % isos.length);
  const next = () => setCarouselIdx((i) => (i + 1) % isos.length);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-10 h-14"
        style={{
          backgroundColor: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
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
          REITO
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/listings"
            style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}
            className="transition-opacity hover:opacity-70"
          >
            Browse homes
          </Link>
          {["How it works", "For Owners"].map((label) => (
            <a
              key={label}
              href="#how"
              style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}
              className="transition-opacity hover:opacity-70"
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          href="/claim"
          className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
          style={{
            border: "1.5px solid var(--rule)",
            color: "var(--ink)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--ink)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--rule)")
          }
        >
          Feature your home
        </Link>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 md:px-10 pt-24 pb-20 text-center">
        {/* Gradient ground */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 80%, #E8D9D0, transparent), radial-gradient(ellipse 60% 60% at 80% 10%, #D9CDC2, transparent)",
            opacity: 0.5,
            filter: reduced ? "none" : "blur(60px)",
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
          {/* Staggered load animation — first visit only */}
          <motion.h1
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--ink)",
            }}
          >
            Find the home that isn&apos;t for sale.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 480 }}
          >
            Describe the home you want. Owners of matching homes see you're
            waiting — and reach out when they're ready.
          </motion.p>

          {/* Two doors */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2"
          >
            <Link
              href="/iso"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-center font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--ink)",
                color: "var(--paper)",
                fontSize: 15,
              }}
            >
              Find your next home
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/claim"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-center font-medium transition-colors"
              style={{
                border: "1.5px solid var(--rule)",
                color: "var(--ink)",
                fontSize: 15,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--ink)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--rule)")
              }
            >
              Feature your current home
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ISO Carousel — full-bleed, bleeds off edges ──── */}
      <section className="py-14 overflow-hidden" aria-label="Recent ISOs">
        <div className="px-5 md:px-10 flex items-center justify-between mb-6">
          <p
            style={{
              fontSize: 12, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: "var(--ink-faint)",
            }}
          >
            Who&apos;s looking right now
          </p>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-full transition-colors"
              style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)" }}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full transition-colors"
              style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)" }}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Cards — overflow visible so they bleed */}
        <div
          ref={carouselRef}
          className="flex gap-4 pl-5 md:pl-10"
          style={{ overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {[...isos, ...isos].map((iso, i) => (
            <ISOCard key={`${iso.id}-${i}`} iso={iso} />
          ))}
        </div>
      </section>

      {/* ── Browse homes in Hyderabad ─────────────────────── */}
      <section className="px-5 md:px-10 py-16">
        <p
          style={{
            fontSize: 12, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--ink-faint)", marginBottom: 8,
          }}
        >
          For sale in Hyderabad
        </p>
        <div className="flex items-end justify-between mb-8">
          <h2
            style={{
              fontSize: 34, fontWeight: 500,
              letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.1,
            }}
          >
            Browse homes
          </h2>
          <Link
            href="/listings"
            className="hidden md:flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}
          >
            View all 20 homes <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {featuredListings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        <Link
          href="/listings"
          className="md:hidden flex items-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}
        >
          View all 20 homes <ArrowRight size={14} />
        </Link>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section id="how" className="px-5 md:px-10 py-20">
        <h2
          className="mb-12"
          style={{
            fontSize: 34, fontWeight: 500,
            letterSpacing: "-0.02em", color: "var(--ink)",
          }}
        >
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
          {HOW.map(({ side, steps }, sideIdx) => (
            <div
              key={side}
              className={sideIdx === 0 ? "md:pr-12 md:border-r" : "md:pl-12"}
              style={{ borderColor: "var(--rule)" }}
            >
              <p
                className="mb-8"
                style={{
                  fontSize: 12, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--ink-faint)",
                }}
              >
                {side}
              </p>
              <ol className="flex flex-col gap-8">
                {steps.map(({ n, title, body }) => (
                  <li key={n} className="flex gap-5">
                    <span
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{
                        border: "1px solid var(--rule)",
                        color: "var(--ink-faint)",
                      }}
                    >
                      {n}
                    </span>
                    <div>
                      <p
                        style={{
                          fontSize: 15, fontWeight: 500,
                          color: "var(--ink)", marginBottom: 6,
                        }}
                      >
                        {title}
                      </p>
                      <p
                        style={{
                          fontSize: 15, color: "var(--ink-soft)",
                          lineHeight: 1.55,
                        }}
                      >
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ── Own a home? See who's waiting ─────────────────── */}
      <section
        className="mx-5 md:mx-10 rounded-[20px] px-8 md:px-16 py-14 mb-20"
        style={{ backgroundColor: "var(--paper-warm)" }}
      >
        <div className="max-w-lg">
          <h2
            className="mb-2"
            style={{
              fontSize: 34, fontWeight: 500,
              letterSpacing: "-0.02em", color: "var(--ink)",
            }}
          >
            Own a home?
          </h2>
          <p className="mb-2" style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            See who&apos;s waiting.
          </p>
          <p
            className="mb-8"
            style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.55 }}
          >
            Enter your home&apos;s address to see ISOs from buyers looking for
            something like yours.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your home's address…"
              className="flex-1 px-5 py-3.5 outline-none"
              style={{
                borderRadius: "var(--r-input)",
                border: "1.5px solid var(--rule)",
                backgroundColor: "var(--paper-cool)",
                fontSize: 15,
                color: "var(--ink)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
            />
            <Link
              href="/claim"
              className="px-6 py-3.5 rounded-full font-medium transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{
                backgroundColor: "var(--ink)",
                color: "var(--paper)",
                fontSize: 14,
              }}
            >
              See who&apos;s waiting
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recent articles ───────────────────────────────── */}
      <section className="px-5 md:px-10 pb-20">
        <p
          className="mb-6"
          style={{
            fontSize: 12, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--ink-faint)",
          }}
        >
          Recent
        </p>
        <div className="flex flex-col divide-y" style={{ borderTop: "1px solid var(--rule)", borderColor: "var(--rule)" }}>
          {ARTICLES.map((a) => (
            <a
              key={a.title}
              href={a.href}
              className="flex items-start justify-between py-5 gap-4 group"
            >
              <p
                style={{
                  fontSize: 17, fontWeight: 500,
                  color: "var(--ink)", lineHeight: 1.4,
                }}
                className="group-hover:underline underline-offset-2"
              >
                {a.title}
              </p>
              <span
                className="shrink-0"
                style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}
              >
                {a.date}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-5 md:px-10 py-8"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <p
          style={{
            fontSize: 15, fontWeight: 500,
            letterSpacing: "0.42em", textTransform: "uppercase",
            color: "var(--ink-faint)",
          }}
        >
          REITO
        </p>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          © 2026 Reito. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* ── ISO card component ──────────────────────────────────── */
function ISOCard({ iso }: { iso: ISO }) {
  return (
    <div
      className="shrink-0 flex flex-col gap-4 p-5 rounded-[14px]"
      style={{
        width: 300,
        scrollSnapAlign: "start",
        backgroundColor: "var(--paper-cool)",
        border: "1px solid var(--rule)",
        boxShadow: "var(--lift)",
      }}
    >
      {/* Buyer */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
          style={{
            backgroundColor: "var(--paper-warm)",
            color: "var(--ink-soft)",
          }}
        >
          {iso.buyer.initials}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
            {iso.buyer.name}
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
            {iso.location}
          </p>
        </div>
      </div>

      {/* Headline */}
      <p
        style={{
          fontSize: 14,
          color: "var(--ink-soft)",
          lineHeight: 1.5,
          flexGrow: 1,
        }}
      >
        &ldquo;{iso.headline}&rdquo;
      </p>

      {/* Stats */}
      <div
        className="flex gap-4 pt-3"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <div>
          <p
            style={{
              fontSize: 11, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: "var(--ink-faint)",
            }}
          >
            Budget
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
            {formatBudget(iso.budget)}
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: 11, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: "var(--ink-faint)",
            }}
          >
            Timeline
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
            {formatTimeline(iso.timeline)}
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: 11, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: "var(--ink-faint)",
            }}
          >
            Type
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
            {iso.propertyType}
          </p>
        </div>
      </div>
    </div>
  );
}
