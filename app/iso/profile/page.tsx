"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Check } from "lucide-react";
import ClientMap from "@/components/ClientMap";
import { formatBudget, formatTimeline } from "@/lib/format";
import isosData from "@/data/isos.json";

const INSPIRATION = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
];

/* Mock Hyderabad useful data */
const USEFUL = [
  { label: "Avg ₹/sqft",          value: "₹7,200"       },
  { label: "1-year price movement",value: "+8.4%"        },
  { label: "Nearest metro",        value: "~1.2 km"      },
  { label: "Water supply",         value: "HMWSSB"       },
  { label: "Power backup",         value: "Society gen." },
  { label: "Dominant property age",value: "5–10 years"   },
];

const COMPLETENESS_FIELDS = [
  "Location",
  "Timeline",
  "Budget",
  "Type",
  "Perks",
  "Headline",
];

/* Use first ISO as the "just published" example */
const DEMO = isosData[0] as {
  id: string;
  buyer: { name: string; initials: string };
  location: string;
  budget: number;
  timeline: number;
  propertyType: string;
  perks: string[];
  headline: string;
};

/* Map the demo ISO to a Leaflet-compatible listing shape */
const DEMO_AS_LISTING = {
  id: DEMO.id,
  title: DEMO.headline,
  lat: 17.4326,
  lng: 78.4071,
  price: DEMO.budget,
  locality: DEMO.location.split(",")[0],
  images: [] as string[],
  address: DEMO.location,
  city: "Hyderabad",
  pincode: "",
  pricePerSqft: 0,
  beds: 0, baths: 0, sqft: 0,
  propertyType: "Apartment" as const,
  status: "For Sale" as const,
  furnishing: "Unfurnished" as const,
  facing: "",
  floor: null, totalFloors: null,
  yearBuilt: 0, parking: 0,
  description: "",
  amenities: [] as string[],
  agent: { name: "", phone: "", email: "", agency: "", avatar: "" },
  listedDate: "",
  featured: false,
};

export default function ISOProfilePage() {
  const [note, setNote] = useState("");
  const [imgIdx, setImgIdx] = useState(0);

  const filled = ["Location", "Timeline", "Budget", "Type", "Perks"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-5 h-14 flex items-center justify-between"
        style={{ backgroundColor: "var(--paper)", borderBottom: "1px solid var(--rule)" }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 500, fontSize: 15,
            letterSpacing: "0.42em", textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          REITO
        </Link>
        <Link
          href="/iso"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--ink-soft)" }}
        >
          ← Edit ISO
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10">
        <p
          className="mb-6"
          style={{
            fontSize: 12, fontWeight: 500, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--ink-faint)",
          }}
        >
          Your ISO · Published
        </p>

        {/* ── Four-column editorial grid ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Inspiration */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <p
              style={{
                fontSize: 12, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              Inspiration
            </p>
            <div
              className="relative rounded-[14px] overflow-hidden aspect-square"
              style={{ backgroundColor: "var(--paper-warm)" }}
            >
              <Image
                src={INSPIRATION[imgIdx]}
                alt="Inspiration"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            <div className="flex gap-1.5">
              {INSPIRATION.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className="flex-1 h-1 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      i === imgIdx ? "var(--gold)" : "var(--rule)",
                  }}
                  aria-label={`Inspiration ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <p
              style={{
                fontSize: 12, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              Location
            </p>
            <div className="rounded-[14px] overflow-hidden h-48" style={{ border: "1px solid var(--rule)" }}>
              <ClientMap listings={[DEMO_AS_LISTING]} center={[17.4326, 78.4071]} zoom={12} singleMarker />
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} style={{ color: "var(--ink-faint)" }} />
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{DEMO.location}</span>
            </div>
          </div>

          {/* Perks */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <p
              style={{
                fontSize: 12, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              Perks
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO.perks.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 text-xs font-medium rounded-full"
                  style={{
                    border: "1px solid var(--rule)",
                    color: "var(--ink-soft)",
                    backgroundColor: "var(--paper-cool)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
            <div
              className="rounded-[14px] p-4 mt-auto"
              style={{ backgroundColor: "var(--paper-warm)" }}
            >
              <p style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 400 }}>
                {DEMO.headline}
              </p>
            </div>
          </div>

          {/* Useful data */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <p
              style={{
                fontSize: 12, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              Useful data
            </p>
            <div
              className="rounded-[14px] divide-y overflow-hidden"
              style={{
                border: "1px solid var(--rule)",
                backgroundColor: "var(--paper-cool)",
              }}
            >
              {USEFUL.map(({ label, value }) => (
                <div key={label} className="px-4 py-3 flex flex-col">
                  <span
                    style={{
                      fontSize: 11, fontWeight: 500,
                      textTransform: "uppercase", letterSpacing: "0.12em",
                      color: "var(--ink-faint)",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginTop: 2 }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ISO summary bar ────────────────────────────── */}
        <div
          className="rounded-[14px] p-5 mb-6"
          style={{
            border: "1px solid var(--rule)",
            backgroundColor: "var(--paper-cool)",
          }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
            {[
              { label: "Budget",   value: formatBudget(DEMO.budget) },
              { label: "Timeline", value: formatTimeline(DEMO.timeline) },
              { label: "Type",     value: DEMO.propertyType },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  style={{
                    fontSize: 11, fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: "0.14em",
                    color: "var(--ink-faint)",
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Completeness bar */}
          <div>
            <p
              className="mb-2"
              style={{
                fontSize: 11, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              Completeness
            </p>
            <div className="flex flex-wrap gap-3">
              {COMPLETENESS_FIELDS.map((f) => {
                const done = filled.includes(f);
                return (
                  <div key={f} className="flex items-center gap-1.5">
                    {done ? (
                      <Check size={12} style={{ color: "var(--gold)" }} />
                    ) : (
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: "var(--rule)" }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: done ? 500 : 400,
                        color: done ? "var(--ink-soft)" : "var(--ink-faint)",
                      }}
                    >
                      {f}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Say more */}
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ border: "1px solid var(--rule)" }}
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Say more… What would make this home feel like home?"
            rows={4}
            className="w-full resize-none px-5 py-4 outline-none"
            style={{
              backgroundColor: "var(--paper-cool)",
              fontSize: 15,
              color: "var(--ink)",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>
    </div>
  );
}
