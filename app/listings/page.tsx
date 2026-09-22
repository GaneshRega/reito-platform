"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Map, Building2, Home, ArrowLeft } from "lucide-react";
import { listings, localities, type PropertyType } from "@/lib/mockData";
import ListingCard from "@/components/ListingCard";
import ListingModal from "@/components/ListingModal";
import ClientMap from "@/components/ClientMap";
import SiteNav from "@/components/SiteNav";

/* ── Only two live types ─────────────────────────────────── */
const LIVE_TYPES: { type: PropertyType; icon: React.ElementType; desc: string }[] = [
  { type: "Villa",     icon: Home,      desc: "Independent villa homes"  },
  { type: "Apartment", icon: Building2, desc: "Flats in gated complexes" },
];

/* ── Price bands ─────────────────────────────────────────── */
const PRICE_BANDS = [
  { label: "Any price",    min: 0,          max: Infinity    },
  { label: "Under ₹1Cr",  min: 0,          max: 10_000_000  },
  { label: "₹1Cr – ₹2Cr", min: 10_000_000, max: 20_000_000  },
  { label: "₹2Cr – ₹5Cr", min: 20_000_000, max: 50_000_000  },
  { label: "₹5Cr+",       min: 50_000_000, max: Infinity    },
];

const BED_OPTS = [
  { label: "Any", min: 0 },
  { label: "2+",  min: 2 },
  { label: "3+",  min: 3 },
  { label: "4+",  min: 4 },
];

/* ── Animations ──────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 0.61, 0.36, 1] as [number,number,number,number] },
  }),
};

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */
export default function ListingsPage() {
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [locality,  setLocality]  = useState("");
  const [bandIdx,   setBandIdx]   = useState(0);
  const [minBeds,   setMinBeds]   = useState(0);
  const [mobileView, setMobileView] = useState<"grid" | "map">("grid");
  const [modalId, setModalId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const { min, max } = PRICE_BANDS[bandIdx];
    return listings.filter(
      (l) =>
        (!selectedType || l.propertyType === selectedType) &&
        (!locality    || l.locality      === locality)     &&
        l.price >= min && l.price <= max                   &&
        (minBeds === 0 || l.beds >= minBeds)
    );
  }, [selectedType, locality, bandIdx, minBeds]);

  const hasFilters = !!locality || bandIdx > 0 || minBeds > 0;

  function clearFilters() {
    setLocality("");
    setBandIdx(0);
    setMinBeds(0);
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100dvh", backgroundColor: "var(--paper)" }}
    >
      <div className="shrink-0">
        <SiteNav />
      </div>

      <AnimatePresence mode="wait">

        {/* ── Type Picker ─────────────────────────────────── */}
        {!selectedType && (
          <motion.div
            key="picker"
            className="flex-1 overflow-y-auto flex flex-col justify-center items-center px-5 md:px-10 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-faint)", marginBottom: 14 }}
            >
              Hyderabad
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 8, textAlign: "center" }}
            >
              What are you looking for?
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ fontSize: 16, color: "var(--ink-soft)", marginBottom: 44, textAlign: "center" }}
            >
              Choose a property type to see matching homes.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
              {LIVE_TYPES.map(({ type, icon: Icon, desc }, i) => {
                const count = listings.filter((l) => l.propertyType === type).length;
                return (
                  <motion.button
                    key={type}
                    custom={i + 3}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, transition: { duration: 0.18 } }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedType(type)}
                    className="flex flex-col items-start gap-5 p-7 rounded-[20px] text-left"
                    style={{
                      border: "1.5px solid var(--rule)",
                      backgroundColor: "var(--paper-cool)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "var(--paper-warm)" }}
                    >
                      <Icon size={24} style={{ color: "var(--ink)" }} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                        {type}
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 4 }}>
                        {desc}
                      </p>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-faint)" }}>
                      {count} home{count !== 1 ? "s" : ""} available
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Listings View ────────────────────────────────── */}
        {selectedType && (
          <motion.div
            key="listings"
            className="flex-1 flex flex-col overflow-hidden min-h-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Filter bar */}
            <div
              className="shrink-0 flex items-center gap-2.5 px-5 md:px-10 py-2.5 overflow-x-auto"
              style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", scrollbarWidth: "none" }}
            >
              {/* Back + type pill */}
              <button
                onClick={() => { setSelectedType(null); clearFilters(); }}
                className="flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-70"
                style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 }}
              >
                <ArrowLeft size={13} />
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
                >
                  {selectedType}
                </span>
              </button>

              <div style={{ width: 1, height: 18, backgroundColor: "var(--rule)", flexShrink: 0 }} />

              <FilterSelect
                value={locality}
                onChange={setLocality}
                options={[
                  { value: "", label: "All localities" },
                  ...localities.map((l) => ({ value: l, label: l })),
                ]}
              />

              <FilterSelect
                value={String(bandIdx)}
                onChange={(v) => setBandIdx(Number(v))}
                options={PRICE_BANDS.map((b, i) => ({ value: String(i), label: b.label }))}
              />

              {/* Beds */}
              <div
                className="flex shrink-0 items-center rounded-full p-0.5"
                style={{ border: "1.5px solid var(--rule)", backgroundColor: "var(--paper)" }}
              >
                {BED_OPTS.map(({ label, min }) => (
                  <button
                    key={label}
                    onClick={() => setMinBeds(min)}
                    className="px-3 py-1 rounded-full text-[13px] font-medium transition-colors"
                    style={{
                      backgroundColor: minBeds === min ? "var(--ink)" : "transparent",
                      color:           minBeds === min ? "var(--paper)" : "var(--ink-soft)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="shrink-0 transition-opacity hover:opacity-70"
                  style={{ fontSize: 13, color: "var(--ink-faint)", textDecoration: "underline" }}
                >
                  Clear
                </button>
              )}

              {/* Mobile grid/map toggle */}
              <div
                className="ml-auto flex lg:hidden shrink-0 items-center rounded-full p-0.5"
                style={{ border: "1.5px solid var(--rule)", backgroundColor: "var(--paper)" }}
              >
                <button
                  onClick={() => setMobileView("grid")}
                  className="p-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: mobileView === "grid" ? "var(--ink)" : "transparent", color: mobileView === "grid" ? "var(--paper)" : "var(--ink-soft)" }}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setMobileView("map")}
                  className="p-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: mobileView === "map" ? "var(--ink)" : "transparent", color: mobileView === "map" ? "var(--paper)" : "var(--ink-soft)" }}
                  aria-label="Map view"
                >
                  <Map size={14} />
                </button>
              </div>
            </div>

            {/* Grid + Map */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              <div className={`overflow-y-auto lg:flex-[3] ${mobileView === "map" ? "hidden lg:block" : "flex-1 lg:flex-[3]"}`}>
                <div className="p-5 md:p-6">
                  <p className="mb-4" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                    {filtered.length} {selectedType.toLowerCase()}{filtered.length !== 1 ? "s" : ""} in Hyderabad
                  </p>
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                      <p style={{ fontSize: 17, color: "var(--ink-soft)" }}>No homes match your filters.</p>
                      <button onClick={clearFilters} className="text-sm underline transition-opacity hover:opacity-70" style={{ color: "var(--ink-faint)" }}>
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filtered.map((l) => (
                        <ListingCard key={l.id} listing={l} onClick={() => setModalId(l.id)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`lg:flex-[2] relative border-l ${mobileView === "grid" ? "hidden lg:block" : "flex-1"}`}
                style={{ borderColor: "var(--rule)" }}
              >
                <ClientMap listings={filtered} />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Listing Modal ── */}
      <AnimatePresence>
        {(() => {
          if (!modalId) return null;
          const modalIdx = filtered.findIndex((l) => l.id === modalId);
          const home = filtered[modalIdx] ?? filtered[0];
          if (!home) return null;
          const goPrev = () => setModalId(filtered[((modalIdx - 1) + filtered.length) % filtered.length].id);
          const goNext = () => setModalId(filtered[(modalIdx + 1) % filtered.length].id);
          return (
            <ListingModal
              key={home.id}
              home={home}
              idx={modalIdx}
              total={filtered.length}
              onClose={() => setModalId(null)}
              onPrev={goPrev}
              onNext={goNext}
            />
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

/* ── Filter select ───────────────────────────────────────── */
function FilterSelect({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const isActive = value !== options[0].value;
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer pl-3.5 pr-8 py-1.5 rounded-full text-[13px] font-medium outline-none transition-colors"
        style={{
          border: "1.5px solid var(--rule)",
          backgroundColor: isActive ? "var(--ink)" : "var(--paper)",
          color: isActive ? "var(--paper)" : "var(--ink)",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px]"
        style={{ color: isActive ? "var(--paper)" : "var(--ink-faint)" }}
        aria-hidden
      >
        ▾
      </span>
    </div>
  );
}
