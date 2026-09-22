"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, Sparkles, SlidersHorizontal, ArrowLeft } from "lucide-react";

export default function HomePage() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<"hero" | "choose">("hero");

  return (
    <div className="h-screen overflow-hidden">

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="absolute top-0 left-0 right-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 md:px-10 h-14"
        style={{ backgroundColor: "transparent" }}
      >
        <button
          onClick={() => setStep("hero")}
          style={{ fontWeight: 500, fontSize: 20, letterSpacing: "0.4em", textTransform: "uppercase", color: "#FFFFFF", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          DISCOVER
        </button>

        <div className="hidden md:flex justify-center">
          <label
            className="flex items-center gap-2.5 px-4 w-full cursor-text"
            style={{ maxWidth: 520, height: 36, borderRadius: 9999, border: "1px solid rgba(255,255,255,0.22)", backgroundColor: "rgba(255,255,255,0.10)" }}
          >
            <Search size={14} style={{ color: "rgba(255,255,255,0.55)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search any locality in Hyderabad"
              className="flex-1 bg-transparent outline-none min-w-0 placeholder:text-white/40"
              style={{ fontSize: 13.5, color: "#FFFFFF" }}
            />
          </label>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }} className="transition-opacity hover:opacity-100">
              How it works
            </Link>
            <Link href="/sell" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }} className="transition-opacity hover:opacity-100">
              Sell your home
            </Link>
          </nav>

          {/* Discover Homes — animated CTA */}
          <div className="relative" style={{ paddingTop: 6 }}>
            <motion.div
              className="absolute right-0 z-10 pointer-events-none"
              style={{ top: -2 }}
              initial={{ opacity: 0, y: 4, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <motion.span
                className="flex items-center px-2 rounded-full"
                style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", backgroundColor: "var(--gold)", color: "#FFFFFF", height: 16, lineHeight: 1 }}
                animate={reduced ? {} : { y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Free
              </motion.span>
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: "1.5px solid rgba(255,255,255,0.50)", top: 6 }}
              animate={reduced ? {} : { scale: [1, 1.22], opacity: [0.6, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
            />
            <Link
              href="/listings"
              className="relative overflow-hidden flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap"
              style={{ backgroundColor: "#FFFFFF", color: "var(--ink)", fontFamily: "inherit" }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
                animate={reduced ? {} : { x: ["-200%", "200%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
              />
              Discover Homes
              <motion.span
                animate={reduced ? {} : { x: [0, 3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={13} />
              </motion.span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Background (always present) ──────────────────────── */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={reduced ? {} : { scale: 1.10 }}
          transition={{ duration: 22, ease: "linear" }}
        >
          <Image src="/hero-bg.png" alt="" fill priority style={{ objectFit: "cover", objectPosition: "center 40%" }} />
        </motion.div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(0,0,0,0.50)" }} aria-hidden />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10,26,16,0.52) 0%, rgba(10,26,16,0.14) 55%, rgba(10,26,16,0) 75%)" }} aria-hidden />
        {/* Ambient orbs */}
        <motion.div className="absolute rounded-full pointer-events-none" style={{ width: 480, height: 480, background: "radial-gradient(circle, rgba(168,134,62,0.14) 0%, transparent 70%)", left: "5%", top: "15%" }} animate={reduced ? {} : { x: [0, 28, 0], y: [0, -18, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute rounded-full pointer-events-none" style={{ width: 360, height: 360, background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)", right: "8%", top: "30%" }} animate={reduced ? {} : { x: [0, -22, 0], y: [0, 14, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        <motion.div className="absolute rounded-full pointer-events-none" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(168,134,62,0.10) 0%, transparent 70%)", right: "22%", bottom: "20%" }} animate={reduced ? {} : { x: [0, 18, 0], y: [0, 20, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
      </div>

      {/* ── Content layer ────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-5 md:px-10 pt-14 text-center">

        <AnimatePresence mode="wait">

          {/* ── Step 1: Hero ─────────────────────────────── */}
          {step === "hero" && (
            <motion.div
              key="hero"
              className="max-w-[620px] w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {/* AI badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex justify-center mb-6"
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.22)", backgroundColor: "rgba(255,255,255,0.10)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.80)", letterSpacing: "0.04em" }}
                >
                  <Sparkles size={11} style={{ color: "var(--gold)" }} />
                  AI-powered home discovery
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ fontSize: "clamp(40px, 5.8vw, 72px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.02, color: "#FFFFFF" }}
              >
                Discover the home<br />made for you.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ fontSize: 17, color: "rgba(255,255,255,0.70)", lineHeight: 1.6, marginTop: 22, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}
              >
                Tell our AI what you&apos;re looking for — or browse verified homes yourself.
                Either way, we connect you directly with owners.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                className="flex justify-center mt-12"
              >
                <div className="relative inline-flex">
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: "2px solid rgba(255,255,255,0.55)" }}
                    animate={reduced ? {} : { scale: [1, 1.22], opacity: [0.55, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: "1.5px solid rgba(255,255,255,0.30)" }}
                    animate={reduced ? {} : { scale: [1, 1.40], opacity: [0.35, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                  />
                  <button
                    onClick={() => setStep("choose")}
                    className="relative overflow-hidden flex items-center gap-2.5 px-10 py-5 rounded-full font-medium"
                    style={{ backgroundColor: "#FFFFFF", color: "var(--ink)", fontSize: 18, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
                      animate={reduced ? {} : { x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                    />
                    Find your next home
                    <motion.span
                      animate={reduced ? {} : { x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Step 2: Choose search mode ────────────────── */}
          {step === "choose" && (
            <motion.div
              key="choose"
              className="w-full max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {/* Back */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => setStep("hero")}
                className="flex items-center gap-1.5 mx-auto mb-8 transition-opacity hover:opacity-70"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.60)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                <ArrowLeft size={13} /> Back
              </motion.button>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 14 }}
              >
                How would you like to search?
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.13 }}
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#FFFFFF", marginBottom: 36, lineHeight: 1.1 }}
              >
                Choose your path to finding home.
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* AI Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.20, duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/iso"
                    className="flex flex-col items-start gap-4 p-7 rounded-[20px] w-full text-left"
                    style={{ backgroundColor: "#FFFFFF", color: "var(--ink)", display: "flex" }}
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "var(--paper-warm)" }}>
                      <Sparkles size={20} style={{ color: "var(--gold)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                        Search with AI
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 5, lineHeight: 1.55 }}>
                        Answer a few questions. Our AI builds your ideal home profile and matches you with the right owners.
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-medium mt-auto" style={{ color: "var(--ink)" }}>
                      Get started <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>

                {/* Manual Browse */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/listings"
                    className="flex flex-col items-start gap-4 p-7 rounded-[20px] w-full text-left"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(255,255,255,0.20)", display: "flex" }}
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                      <SlidersHorizontal size={20} style={{ color: "rgba(255,255,255,0.85)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 18, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                        I&apos;ll search myself
                      </p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 5, lineHeight: 1.55 }}>
                        Browse verified homes at your own pace. Filter by type, location, and budget.
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-medium mt-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
                      Browse homes <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
