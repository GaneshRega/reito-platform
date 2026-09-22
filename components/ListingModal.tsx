"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Listing } from "@/lib/mockData";
import { formatINR, formatPerSqft } from "@/lib/format";
import ClientMap from "@/components/ClientMap";

interface Props {
  home:    Listing;
  idx:     number;
  total:   number;
  onClose: () => void;
  onPrev:  () => void;
  onNext:  () => void;
}

const ROOM_SETS = [
  ["Living Area",  "Master Bedroom", "Kitchen",  "Balcony"     ],
  ["Hall",         "Kitchen",        "Bedroom",  "Terrace"     ],
  ["Exterior",     "Bedroom",        "Bathroom", "Living Room" ],
  ["Drawing Room", "Kitchen",        "Terrace",  "Master Suite"],
  ["Lobby",        "Master Suite",   "Balcony",  "Study"       ],
  ["Living Room",  "Study",          "Kitchen",  "Bedroom"     ],
];

export default function ListingModal({ home, idx, total, onClose, onPrev, onNext }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => { setImgIdx(0); }, [home.id]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const images = home.images;

  const sno = parseInt(home.id.replace(/[^0-9]/g, ""), 10) || 0;
  const roomLabels = images.map((_, i) => ROOM_SETS[sno % ROOM_SETS.length][i] ?? `Photo ${i + 1}`);

  const details = [
    { label: "Property type", value: home.propertyType },
    { label: "Year built",    value: String(home.yearBuilt) },
    { label: "Facing",        value: home.facing },
    { label: "Parking",       value: home.parking > 0 ? `${home.parking} covered` : "None" },
    { label: "Furnishing",    value: home.furnishing },
    { label: "Floor",         value: home.floor !== null ? `${home.floor} of ${home.totalFloors}` : "—" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      style={{ backgroundColor: "rgba(33,29,25,0.68)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 10, scale: 0.98  }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full flex flex-col rounded-[22px] overflow-hidden"
        style={{
          maxWidth: 720,
          maxHeight: "92vh",
          backgroundColor: "var(--paper)",
          boxShadow: "0 32px 80px rgba(33,29,25,0.30)",
        }}
      >

        {/* ── Header ── */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <span style={{ fontWeight: 500, fontSize: 20, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--ink)" }}>
            DISCOVER
          </span>
          <div className="flex items-center gap-2.5">
            {home.featured && (
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wider"
                style={{ backgroundColor: "var(--gold-soft)", color: "var(--gold)", border: "1px solid var(--gold)" }}
              >
                FEATURED
              </span>
            )}
            <span
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "var(--paper-cool)", color: "var(--ink-soft)", border: "1px solid var(--rule)" }}
            >
              {home.status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
              style={{ color: "var(--ink-soft)" }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>

          {/* ── Image collage / selected room ── */}
          <div className="relative" style={{ height: 280 }}>
            {imgIdx === 0 ? (
              <>
                {/* Mobile: single full image */}
                <div className="sm:hidden relative h-full">
                  <Image src={images[0]} alt={home.title} fill style={{ objectFit: "cover" }} sizes="100vw" priority />
                </div>
                {/* Desktop: left big + right 2-stack */}
                <div className="hidden sm:grid h-full" style={{ gridTemplateColumns: "3fr 2fr", gap: 2 }}>
                  <div className="relative">
                    <Image src={images[0]} alt={home.title} fill style={{ objectFit: "cover" }} sizes="430px" priority />
                  </div>
                  <div className="grid h-full" style={{ gridTemplateRows: "1fr 1fr", gap: 2 }}>
                    {[images[1] ?? images[0], images[2] ?? images[0]].map((src, i) => (
                      <div key={i} className="relative">
                        <Image src={src} alt={`${home.title} — view ${i + 2}`} fill style={{ objectFit: "cover" }} sizes="290px" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Selected room: single full-bleed image */
              <div className="relative h-full">
                <Image
                  src={images[imgIdx]}
                  alt={roomLabels[imgIdx]}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="720px"
                />
                {/* Room label badge */}
                <span
                  className="absolute top-3 left-3 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(247,244,239,0.93)", backdropFilter: "blur(4px)", color: "var(--ink)" }}
                >
                  {roomLabels[imgIdx]}
                </span>
              </div>
            )}

            {/* See all photos */}
            <button
              className="absolute bottom-3 right-3 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "rgba(247,244,239,0.93)",
                backdropFilter: "blur(4px)",
                color: "var(--ink)",
                border: "1px solid rgba(33,29,25,0.10)",
              }}
            >
              See all {images.length} photos
            </button>
          </div>

          {/* ── Room tabs ── */}
          <div
            className="flex items-center gap-2 px-5 py-2.5 overflow-x-auto shrink-0"
            style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", scrollbarWidth: "none" }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: imgIdx === i ? 600 : 400,
                  border: imgIdx === i ? "1.5px solid var(--ink)" : "1px solid var(--rule)",
                  backgroundColor: imgIdx === i ? "var(--ink)" : "var(--paper)",
                  color: imgIdx === i ? "var(--paper)" : "var(--ink-soft)",
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
                }}
              >
                {roomLabels[i]}
              </button>
            ))}
          </div>

          {/* ── Title + address ── */}
          <div className="px-6 pt-5">
            <h2
              style={{
                fontSize: "clamp(18px, 3vw, 23px)",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: "var(--ink)",
                marginBottom: 6,
              }}
            >
              {home.title}
            </h2>
            <div className="flex items-start gap-1.5">
              <MapPin size={13} style={{ color: "var(--ink-faint)", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.4 }}>{home.address}</p>
            </div>
          </div>

          {/* ── Stats bar: beds | baths | sqft ── */}
          {home.beds > 0 && (
            <div
              className="mx-6 mt-5 flex"
              style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", paddingTop: 16, paddingBottom: 16 }}
            >
              {[
                { val: home.beds,                         unit: home.beds === 1 ? "bed" : "beds"   },
                { val: home.baths,                        unit: home.baths === 1 ? "bath" : "baths" },
                { val: home.sqft.toLocaleString("en-IN"), unit: "sqft"                               },
              ].map(({ val, unit }, i) => (
                <div
                  key={unit}
                  className="flex-1 text-center"
                  style={{ borderRight: i < 2 ? "1px solid var(--rule)" : "none" }}
                >
                  <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>
                    {val}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4 }}>{unit}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Price ── */}
          <div className="px-6 mt-5 flex items-end gap-8 flex-wrap">
            <div>
              <p style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Asking price
              </p>
              <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1 }}>
                {formatINR(home.price)}
              </p>
            </div>
            <div className="mb-1">
              <p style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Per sqft
              </p>
              <p style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink-soft)" }}>
                {formatPerSqft(home.pricePerSqft)}
              </p>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="px-6 mt-7">
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 10 }}>
              About this home
            </p>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.75 }}>
              {home.description}
            </p>
          </div>

          {/* ── Home details grid ── */}
          <div className="px-6 mt-7">
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 12 }}>
              Home details
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "var(--paper-cool)",
                    borderRadius: 10,
                    padding: "11px 13px",
                    border: "1px solid var(--rule)",
                  }}
                >
                  <p style={{ fontSize: 10, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Location map ── */}
          <div className="px-6 mt-7">
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 12 }}>
              Location
            </p>
            <div style={{ height: 200, borderRadius: 14, overflow: "hidden", border: "1px solid var(--rule)" }}>
              <ClientMap listings={[home]} center={[home.lat, home.lng]} zoom={14} singleMarker />
            </div>
          </div>

          {/* ── Amenities ── */}
          {home.amenities.length > 0 && (
            <div className="px-6 mt-7">
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 12 }}>
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {home.amenities.map((a) => (
                  <span
                    key={a}
                    style={{
                      fontSize: 12, fontWeight: 500,
                      padding: "5px 13px", borderRadius: 9999,
                      border: "1px solid var(--rule)",
                      color: "var(--ink-soft)",
                      backgroundColor: "var(--paper-cool)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Agent card ── */}
          <div className="px-6 mt-7">
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 12 }}>
              Contact agent
            </p>
            <div
              className="rounded-[14px] p-5"
              style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    backgroundColor: "var(--ink)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--paper)" }}>
                    {home.agent.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{home.agent.name}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.agent.agency}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <a
                  href={`tel:${home.agent.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-medium transition-opacity hover:opacity-80"
                  style={{ border: "1.5px solid var(--rule)", color: "var(--ink)", backgroundColor: "var(--paper)", textDecoration: "none" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57 1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.59 1 1 0 01-.25 1.01l-2.2 2.19z" fill="currentColor"/>
                  </svg>
                  Call
                </a>
                <a
                  href={`mailto:${home.agent.email}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-medium transition-opacity hover:opacity-80"
                  style={{ border: "1.5px solid var(--rule)", color: "var(--ink)", backgroundColor: "var(--paper)", textDecoration: "none" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                  </svg>
                  Email
                </a>
              </div>
              <a
                href={`https://wa.me/${home.agent.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366", color: "#fff", textDecoration: "none" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* ── Sell CTA ── */}
          <div className="px-6 mt-5 mb-7">
            <div
              className="rounded-[14px] p-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-warm)" }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>
                  Want to sell this home?
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  Our agent will reach out within 24 hours.
                </p>
              </div>
              <Link
                href="/sell"
                onClick={onClose}
                className="shrink-0 px-5 py-2.5 rounded-full text-[13px] font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--ink)", color: "var(--paper)", textDecoration: "none" }}
              >
                Get started
              </Link>
            </div>
          </div>

        </div>

        {/* ── Sticky footer ── */}
        <div
          className="shrink-0 flex items-center gap-2.5 px-5 py-3"
          style={{ borderTop: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
        >
          <Link
            href="/iso"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 13, textDecoration: "none" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            Join Waitlist
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{idx + 1} / {total}</span>
            <button
              onClick={onPrev}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(33,29,25,0.05)]"
              style={{ border: "1px solid var(--rule)", cursor: "pointer", backgroundColor: "var(--paper-cool)" }}
              aria-label="Previous home"
            >
              <ChevronLeft size={14} style={{ color: "var(--ink)" }} />
            </button>
            <button
              onClick={onNext}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(33,29,25,0.05)]"
              style={{ border: "1px solid var(--rule)", cursor: "pointer", backgroundColor: "var(--paper-cool)" }}
              aria-label="Next home"
            >
              <ChevronRight size={14} style={{ color: "var(--ink)" }} />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
