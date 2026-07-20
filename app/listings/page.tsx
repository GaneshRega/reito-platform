"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LayoutGrid, Map } from "lucide-react";
import { listings, localities, propertyTypes } from "@/lib/mockData";
import ListingCard from "@/components/ListingCard";
import ClientMap from "@/components/ClientMap";

const PRICE_BANDS = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₹1Cr", min: 0, max: 10_000_000 },
  { label: "₹1Cr – ₹2Cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2Cr – ₹5Cr", min: 20_000_000, max: 50_000_000 },
  { label: "₹5Cr+", min: 50_000_000, max: Infinity },
];

const BED_OPTS = [
  { label: "Any", min: 0 },
  { label: "2+", min: 2 },
  { label: "3+", min: 3 },
  { label: "4+", min: 4 },
];

export default function ListingsPage() {
  const [locality, setLocality] = useState("");
  const [propType, setPropType] = useState("");
  const [bandIdx, setBandIdx] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [mobileView, setMobileView] = useState<"grid" | "map">("grid");

  const filtered = useMemo(() => {
    const { min, max } = PRICE_BANDS[bandIdx];
    return listings.filter(
      (l) =>
        (!locality || l.locality === locality) &&
        (!propType || l.propertyType === propType) &&
        l.price >= min &&
        l.price <= max &&
        (minBeds === 0 || l.beds >= minBeds)
    );
  }, [locality, propType, bandIdx, minBeds]);

  const hasFilters = !!locality || !!propType || bandIdx > 0 || minBeds > 0;

  function clearFilters() {
    setLocality("");
    setPropType("");
    setBandIdx(0);
    setMinBeds(0);
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100dvh", backgroundColor: "var(--paper)" }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-5 md:px-10 h-14"
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
            style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}
          >
            Browse homes
          </Link>
          <a
            href="/#how"
            style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-soft)" }}
            className="transition-opacity hover:opacity-70"
          >
            How it works
          </a>
        </nav>

        <Link
          href="/iso"
          className="text-sm font-medium px-5 py-2 rounded-full transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--ink)",
            color: "var(--paper)",
            fontSize: 13,
          }}
        >
          Post an ISO
        </Link>
      </header>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center gap-2.5 px-5 md:px-10 py-2.5 overflow-x-auto"
        style={{
          borderBottom: "1px solid var(--rule)",
          backgroundColor: "var(--paper-cool)",
          scrollbarWidth: "none",
        }}
      >
        <FilterSelect
          value={locality}
          onChange={setLocality}
          options={[
            { value: "", label: "All localities" },
            ...localities.map((l) => ({ value: l, label: l })),
          ]}
        />

        <FilterSelect
          value={propType}
          onChange={setPropType}
          options={[
            { value: "", label: "Any type" },
            ...propertyTypes.map((t) => ({ value: t, label: t })),
          ]}
        />

        <FilterSelect
          value={String(bandIdx)}
          onChange={(v) => setBandIdx(Number(v))}
          options={PRICE_BANDS.map((b, i) => ({
            value: String(i),
            label: b.label,
          }))}
        />

        {/* Beds — segmented control */}
        <div
          className="flex shrink-0 items-center rounded-full p-0.5"
          style={{
            border: "1.5px solid var(--rule)",
            backgroundColor: "var(--paper)",
          }}
        >
          {BED_OPTS.map(({ label, min }) => (
            <button
              key={label}
              onClick={() => setMinBeds(min)}
              className="px-3 py-1 rounded-full text-[13px] font-medium transition-colors"
              style={{
                backgroundColor:
                  minBeds === min ? "var(--ink)" : "transparent",
                color: minBeds === min ? "var(--paper)" : "var(--ink-soft)",
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
            style={{
              fontSize: 13,
              color: "var(--ink-faint)",
              textDecoration: "underline",
            }}
          >
            Clear
          </button>
        )}

        {/* Mobile grid / map toggle */}
        <div
          className="ml-auto flex lg:hidden shrink-0 items-center rounded-full p-0.5"
          style={{
            border: "1.5px solid var(--rule)",
            backgroundColor: "var(--paper)",
          }}
        >
          <button
            onClick={() => setMobileView("grid")}
            className="p-1.5 rounded-full transition-colors"
            style={{
              backgroundColor:
                mobileView === "grid" ? "var(--ink)" : "transparent",
              color:
                mobileView === "grid" ? "var(--paper)" : "var(--ink-soft)",
            }}
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setMobileView("map")}
            className="p-1.5 rounded-full transition-colors"
            style={{
              backgroundColor:
                mobileView === "map" ? "var(--ink)" : "transparent",
              color:
                mobileView === "map" ? "var(--paper)" : "var(--ink-soft)",
            }}
            aria-label="Map view"
          >
            <Map size={14} />
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Grid */}
        <div
          className={`overflow-y-auto lg:flex-[3] ${
            mobileView === "map" ? "hidden lg:block" : "flex-1 lg:flex-[3]"
          }`}
        >
          <div className="p-5 md:p-6">
            <p
              className="mb-4"
              style={{ fontSize: 12, color: "var(--ink-faint)" }}
            >
              {filtered.length} home{filtered.length !== 1 ? "s" : ""} in
              Hyderabad
            </p>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p style={{ fontSize: 17, color: "var(--ink-soft)" }}>
                  No homes match your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm underline transition-opacity hover:opacity-70"
                  style={{ color: "var(--ink-faint)" }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div
          className={`lg:flex-[2] relative border-l ${
            mobileView === "grid" ? "hidden lg:block" : "flex-1"
          }`}
          style={{ borderColor: "var(--rule)" }}
        >
          <ClientMap listings={filtered} />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
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
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
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
