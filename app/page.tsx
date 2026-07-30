"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ChevronLeft, ChevronRight, Search, ChevronDown,
  Eye, Shield, Users, TrendingUp, Star, Lock, Zap, PhoneOff,
} from "lucide-react";
import isosData from "@/data/isos.json";
import { formatBudget, formatTimeline } from "@/lib/format";
import { listings } from "@/lib/mockData";
import ListingCard from "@/components/ListingCard";
import CIFModal from "@/components/CIFModal";

/* ── ISO type ─────────────────────────────────────────────── */
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

/* ── Animation variant ───────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.09,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  }),
};

/* ── Static data ─────────────────────────────────────────── */
const STATS = [
  { value: "2,400+",   label: "Active buyer profiles"       },
  { value: "680+",     label: "Verified homes"              },
  { value: "₹850 Cr+", label: "In matched transactions"    },
  { value: "< 48 hrs", label: "Average owner response time" },
];

const FEATURES = [
  {
    icon: Eye,
    title: "First look, always",
    body: "Homes appear on DISCOVER before any public portal. Queue early, decide calmly — not in a bidding frenzy.",
  },
  {
    icon: PhoneOff,
    title: "Owner-initiated contact",
    body: "No cold calls. No agent pressure. Owners review your profile and reach out only when genuinely interested.",
  },
  {
    icon: Users,
    title: "Verified buyers only",
    body: "Every ISO is a real person with a verified budget and timeline. Owners know exactly who's waiting.",
  },
  {
    icon: TrendingUp,
    title: "Zero commission. Ever.",
    body: "Direct owner-to-buyer. The money saved on broker fees stays exactly where it belongs — with you.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Found our villa in Kokapet before it was listed anywhere. The owner called us directly — no agents, no runaround. We closed in three weeks.",
    name: "Priya & Arjun Menon",
    role: "Buyers · Kokapet",
    initials: "PM",
  },
  {
    quote: "Five serious buyers reached out within ten days of claiming my home. I chose the right family on my terms. No broker fees. No drama.",
    name: "Venkat Rao",
    role: "Owner · Jubilee Hills",
    initials: "VR",
  },
  {
    quote: "Published our ISO on a Tuesday. By Friday, three homeowners had contacted us directly. This is what finding a home should feel like.",
    name: "Rahul Krishnan",
    role: "Buyer · Financial District",
    initials: "RK",
  },
];

const TRUST = [
  {
    icon: Lock,
    title: "Your data stays yours",
    body: "We never sell your information to third parties. No spam. No cold calls from brokers who bought a list.",
  },
  {
    icon: Shield,
    title: "Every home is verified",
    body: "Our team reviews each property claim before it goes live. No ghost listings, no bait-and-switch.",
  },
  {
    icon: Zap,
    title: "Real people, real properties",
    body: "Owners are real. Buyers are real. What you see on DISCOVER actually exists — and is actually available.",
  },
];

const HOW: { side: string; steps: { n: number; title: string; body: string }[] }[] = [
  {
    side: "For Buyers",
    steps: [
      { n: 1, title: "Describe what you want", body: "Location, timeline, budget, must-haves. This is your ISO — a profile of the home you're looking for." },
      { n: 2, title: "Publish it", body: "Owners of matching homes can see you're out there. No cold contact — you wait, they reach out." },
      { n: 3, title: "The owner comes to you", body: "When they're ready, they initiate the conversation. On their terms, in their time." },
    ],
  },
  {
    side: "For Owners",
    steps: [
      { n: 1, title: "Claim your home", body: "Tell us a little about it. No listing fee, no commitment to sell." },
      { n: 2, title: "See who's queued", body: "Browse buyers looking for something exactly like yours. Real names, real budgets, real timelines." },
      { n: 3, title: "Open the door when you're ready", body: "Reach out when it suits you. No agents, no pressure, no noise." },
    ],
  },
];

const ARTICLES = [
  { title: "How Hyderabad's micro-markets move at different speeds", date: "June 2026", href: "#" },
  { title: "Why the first offer is rarely the last",               date: "May 2026",  href: "#" },
  { title: "Owner control: the missing half of every property transaction", date: "April 2026", href: "#" },
];

/* ── 8 listing cards — two full rows of 4 ────────────────── */
const displayListings = listings.slice(0, 8);

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const reduced = useReducedMotion();
  const [address, setAddress] = useState("");
  const [cifOpen, setCifOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 316, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 md:px-10 h-14"
        style={{ backgroundColor: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
      >
        <Link href="/" style={{ fontWeight: 400, fontSize: 15, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
          DISCOVER
        </Link>

        <div className="hidden md:flex justify-center">
          <label
            className="flex items-center gap-2.5 px-4 w-full cursor-text"
            style={{ maxWidth: 520, height: 36, borderRadius: 9999, border: "1px solid var(--rule)", backgroundColor: "var(--paper-warm)" }}
          >
            <Search size={14} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search any locality in Hyderabad"
              className="flex-1 bg-transparent outline-none min-w-0"
              style={{ fontSize: 13.5, color: "var(--ink)" }}
            />
          </label>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/listings" style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }} className="transition-opacity hover:opacity-70">
              Discover homes
            </Link>
            {["How it works", "For Owners"].map((l) => (
              <a key={l} href="#how" style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }} className="transition-opacity hover:opacity-70">
                {l}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setCifOpen(true)}
            className="text-sm font-medium px-5 py-2 rounded-full transition-colors whitespace-nowrap"
            style={{ border: "1.5px solid var(--rule)", color: "var(--ink)", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
          >
            CIF
          </button>
        </div>
      </header>

      <CIFModal isOpen={cifOpen} onClose={() => setCifOpen(false)} />

      {/* ══════════════════════════════════════════════════════
          HERO — full viewport height
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: "100dvh", minHeight: 600 }}>
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=80"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(0,0,0,0.40)" }} aria-hidden />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(10,26,16,0.54) 0%, rgba(10,26,16,0.18) 55%, rgba(10,26,16,0) 75%)" }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-5 md:px-10 pt-14">
          <div className="max-w-[640px]">
            <motion.h1
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ fontSize: "clamp(38px, 5.5vw, 68px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.02, color: "#FFFFFF" }}
            >
              Find the home<br />that isn&apos;t for sale.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.09, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ fontSize: 17, color: "rgba(255,255,255,0.76)", lineHeight: 1.58, marginTop: 22, maxWidth: 460 }}
            >
              Describe the home you want. Owners of matching homes see you&apos;re
              waiting — and reach out when they&apos;re ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.17, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex items-center gap-4 mt-10 mb-5"
            >
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", whiteSpace: "nowrap" }}>
                How would you like to begin?
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.18)" }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3"
              style={{ maxWidth: 440 }}
            >
              <Link
                href="/iso"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#FFFFFF", color: "var(--ink)", fontSize: 15 }}
              >
                Find your next home <ArrowRight size={15} />
              </Link>
              <Link
                href="/claim"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-medium transition-colors"
                style={{ border: "1.5px solid rgba(255,255,255,0.44)", color: "#FFFFFF", fontSize: 15 }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.80)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.44)")}
              >
                Feature your home
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.div
            animate={reduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={22} style={{ color: "rgba(255,255,255,0.42)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP
          ══════════════════════════════════════════════════════ */}
      <section
        className="px-5 md:px-10 py-12"
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="text-center"
            >
              <p style={{ fontSize: "clamp(28px, 3.2vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em", color: "var(--ink)" }}>
                {s.value}
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 5, fontWeight: 500 }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES — Why DISCOVER
          ══════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 10 }}>
            Why DISCOVER
          </p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 500, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.08, maxWidth: 560 }}>
            Everything broken about property search, fixed.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col gap-5 p-6 rounded-[16px]"
              style={{ backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--paper-warm)" }}
              >
                <Icon size={18} style={{ color: "var(--ink-soft)" }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ISO CAROUSEL — Who's looking right now
          ══════════════════════════════════════════════════════ */}
      <section
        className="py-14 overflow-hidden"
        style={{ borderTop: "1px solid var(--rule)" }}
        aria-label="Recent ISOs"
      >
        <div className="px-5 md:px-10 flex items-center justify-between mb-6">
          <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)" }}>
            Who&apos;s looking right now
          </p>
          <div className="flex gap-2">
            <button onClick={() => scrollBy(-1)} className="p-2 rounded-full" style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", cursor: "pointer", background: "transparent" }} aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollBy(1)} className="p-2 rounded-full" style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", cursor: "pointer", background: "transparent" }} aria-label="Next">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

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

      {/* ══════════════════════════════════════════════════════
          DISCOVER HOMES — 4-column grid
          ══════════════════════════════════════════════════════ */}
      <section
        className="px-5 md:px-10 py-16"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 8 }}>
            For sale in Hyderabad
          </p>
          <div className="flex items-end justify-between mb-8">
            <h2 style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.1 }}>
              Discover homes
            </h2>
            <Link href="/listings" className="hidden md:flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}>
              View all 20 homes <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {displayListings.map((l, i) => (
            <motion.div
              key={l.id}
              custom={i % 4}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <ListingCard listing={l} />
            </motion.div>
          ))}
        </div>

        <Link href="/listings" className="md:hidden flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}>
          View all 20 homes <ArrowRight size={14} />
        </Link>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════════ */}
      <section
        className="px-5 md:px-10 py-20"
        style={{ backgroundColor: "var(--ink)" }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
            Stories
          </p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 500, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1.08 }}>
            Real people. Real results.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col gap-5 p-6 rounded-[16px]"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} size={13} style={{ color: "var(--gold)", fill: "var(--gold)" }} />
                ))}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.80)", lineHeight: 1.68, flexGrow: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.65)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST — Our Promise
          ══════════════════════════════════════════════════════ */}
      <section
        className="px-5 md:px-10 py-20"
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 10 }}>
            Our Promise
          </p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 500, letterSpacing: "-0.025em", color: "var(--ink)", lineHeight: 1.08 }}>
            Built on trust. Built to last.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TRUST.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex gap-5"
            >
              <div className="shrink-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--gold-soft)" }}
                >
                  <Icon size={18} style={{ color: "var(--gold)" }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.68 }}>{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════ */}
      <section id="how" className="px-5 md:px-10 py-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
          style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}
        >
          How it works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
          {HOW.map(({ side, steps }, sideIdx) => (
            <motion.div
              key={side}
              custom={sideIdx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className={sideIdx === 0 ? "md:pr-12 md:border-r" : "md:pl-12"}
              style={{ borderColor: "var(--rule)" }}
            >
              <p className="mb-8" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)" }}>
                {side}
              </p>
              <ol className="flex flex-col gap-8">
                {steps.map(({ n, title, body }) => (
                  <li key={n} className="flex gap-5">
                    <span
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ border: "1px solid var(--rule)", color: "var(--ink-faint)" }}
                    >
                      {n}
                    </span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", marginBottom: 6 }}>{title}</p>
                      <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55 }}>{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OWN A HOME? CTA
          ══════════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-5 md:mx-10 rounded-[20px] px-8 md:px-16 py-14 mb-20"
        style={{ backgroundColor: "var(--paper-warm)" }}
      >
        <div className="max-w-lg">
          <h2 style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            Own a home?
          </h2>
          <p className="mb-2" style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            See who&apos;s waiting.
          </p>
          <p className="mb-8 mt-2" style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            Enter your home&apos;s address to see ISOs from buyers looking for something like yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your home's address…"
              className="flex-1 px-5 py-3.5 outline-none min-w-0"
              style={{ borderRadius: 999, border: "1.5px solid var(--rule)", backgroundColor: "var(--paper-cool)", fontSize: 15, color: "var(--ink)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
            />
            <Link
              href="/claim"
              className="px-6 py-3.5 rounded-full font-medium transition-opacity hover:opacity-90 whitespace-nowrap text-center"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 14 }}
            >
              See who&apos;s waiting
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════
          RECENT ARTICLES
          ══════════════════════════════════════════════════════ */}
      <section className="px-5 md:px-10 pb-20">
        <p className="mb-6" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)" }}>
          Recent
        </p>
        <div className="flex flex-col" style={{ borderTop: "1px solid var(--rule)" }}>
          {ARTICLES.map((a) => (
            <a key={a.title} href={a.href} className="flex items-start justify-between py-5 gap-4 group" style={{ borderBottom: "1px solid var(--rule)" }}>
              <p style={{ fontSize: 17, fontWeight: 500, color: "var(--ink)", lineHeight: 1.4 }} className="group-hover:underline underline-offset-2">
                {a.title}
              </p>
              <span className="shrink-0" style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{a.date}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-10 py-8" style={{ borderTop: "1px solid var(--rule)" }}>
        <p style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          DISCOVER
        </p>
        <p className="mt-1" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          © 2026 Discover. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

/* ── ISO card ────────────────────────────────────────────── */
function ISOCard({ iso }: { iso: ISO }) {
  return (
    <div
      className="shrink-0 flex flex-col gap-4 p-5 rounded-[14px]"
      style={{ width: 300, scrollSnapAlign: "start", backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
          style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
        >
          {iso.buyer.initials}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{iso.buyer.name}</p>
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{iso.location}</p>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, flexGrow: 1 }}>
        &ldquo;{iso.headline}&rdquo;
      </p>
      <div className="flex gap-4 pt-3" style={{ borderTop: "1px solid var(--rule)" }}>
        {[
          { label: "Budget",   value: formatBudget(iso.budget)   },
          { label: "Timeline", value: formatTimeline(iso.timeline) },
          { label: "Type",     value: iso.propertyType            },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-faint)" }}>{label}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
