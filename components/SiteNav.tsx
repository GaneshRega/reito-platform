"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";

export default function SiteNav() {
  const reduced = useReducedMotion();

  return (
    <header
      className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 md:px-10 h-14"
      style={{ backgroundColor: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
    >
      <Link href="/" style={{ fontWeight: 500, fontSize: 20, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
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
          <Link href="/how-it-works" style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }} className="transition-opacity hover:opacity-70">
            How it works
          </Link>
          <Link href="/sell" style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }} className="transition-opacity hover:opacity-70">
            Sell your home
          </Link>
        </nav>

        <div className="relative" style={{ paddingTop: 6 }}>
          <motion.div
            className="absolute right-0 z-10 pointer-events-none"
            style={{ top: -2 }}
            initial={{ opacity: 0, y: 4, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <motion.span
              className="flex items-center px-2 rounded-full"
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                backgroundColor: "var(--gold)",
                color: "#FFFFFF",
                height: 16,
                lineHeight: 1,
              }}
              animate={reduced ? {} : { y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Free
            </motion.span>
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: "1.5px solid rgba(33,29,25,0.45)", top: 6 }}
            animate={reduced ? {} : { scale: [1, 1.22], opacity: [0.6, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
          />
          <Link
            href="/listings"
            className="relative overflow-hidden flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap"
            style={{ backgroundColor: "var(--ink)", color: "#FFFFFF", fontFamily: "inherit" }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)" }}
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
  );
}
