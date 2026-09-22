"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
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

export default function ListingModal({ home, idx, total, onClose, onPrev, onNext }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  /* Reset image index when listing changes */
  useEffect(() => { setImgIdx(0); }, [home.id]);

  /* Keyboard: Esc → close, ← → → navigate */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onPrev();
      if (e.key === "ArrowRight")  onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  /* Prevent body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const images = home.images;

  /* Room labels — vary by listing serial so each home feels unique */
  const ROOM_SETS = [
    ["Living Area",  "Master Bedroom"],
    ["Hall",         "Kitchen"       ],
    ["Exterior",     "Bedroom"       ],
    ["Drawing Room", "Terrace"       ],
    ["Lobby",        "Master Suite"  ],
    ["Living Room",  "Study"         ],
  ];
  const sno = parseInt(home.id.replace("v-", "")) || 0;
  const roomLabels = images.map((_, i) => ROOM_SETS[sno % ROOM_SETS.length][i] ?? `Photo ${i + 1}`);

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
          maxWidth: 700,
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
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.04em", color: "var(--ink)" }}>
            DISCOVER
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

        {/* ── Hero image ── */}
        <div className="shrink-0 relative" style={{ height: 256 }}>
          <Image
            src={images[imgIdx]}
            alt={home.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="700px"
            priority
          />
          {/* Image navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "rgba(247,244,239,0.88)", backdropFilter: "blur(4px)" }}
              >
                <ChevronLeft size={14} style={{ color: "var(--ink)" }} />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: "rgba(247,244,239,0.88)", backdropFilter: "blur(4px)" }}
              >
                <ChevronRight size={14} style={{ color: "var(--ink)" }} />
              </button>
            </>
          )}
          {/* Status badge */}
          <span
            className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "rgba(247,244,239,0.92)", backdropFilter: "blur(4px)", color: "var(--ink)" }}
          >
            {home.status}
          </span>
        </div>

        {/* ── Room tabs ── */}
        <div
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 overflow-x-auto"
          style={{ borderBottom: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", scrollbarWidth: "none" }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              style={{
                padding: "5px 16px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: imgIdx === i ? 600 : 400,
                border: imgIdx === i ? "1.5px solid var(--ink)" : "1px solid var(--rule)",
                backgroundColor: imgIdx === i ? "var(--ink)" : "var(--paper)",
                color: imgIdx === i ? "var(--paper)" : "var(--ink-soft)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
              }}
            >
              {roomLabels[i]}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <style>{`
            .modal-body { display: grid; grid-template-columns: 1fr; }
            @media (min-width: 560px) { .modal-body { grid-template-columns: 1.1fr 1fr; } }
          `}</style>
          <div className="modal-body">

            {/* Left: text */}
            <div
              className="flex flex-col gap-4 p-5"
              style={{ borderRight: "1px solid var(--rule)" }}
            >
              <div>
                <p style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  ID: {home.id.toUpperCase()}
                </p>
                <h2
                  style={{
                    fontSize: 22, fontWeight: 700,
                    letterSpacing: "-0.025em", lineHeight: 1.2,
                    color: "var(--ink)", marginBottom: 4,
                  }}
                >
                  {home.title.split("—")[0].trim()}
                </h2>
                <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{home.address}</p>
              </div>

              {/* Map */}
              <div style={{ borderRadius: 12, overflow: "hidden", height: 154, border: "1px solid var(--rule)", flexShrink: 0 }}>
                <ClientMap
                  listings={[home]}
                  center={[home.lat, home.lng]}
                  zoom={14}
                  singleMarker
                />
              </div>

              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                {home.description}
              </p>

              {/* Owner CTA */}
              <div
                className="rounded-[14px] p-4 mt-auto"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)" }}
              >
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>
                  Want to sell this home?
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 12 }}>
                  List your property with us — our agent will contact you within 24 hours.
                </p>
                <Link
                  href="/sell"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)", textDecoration: "none" }}
                >
                  Sell your home
                </Link>
              </div>
            </div>

            {/* Right: stats */}
            <div className="flex flex-col gap-5 p-5">
              {/* Big beds + sqft */}
              <div
                className="grid grid-cols-2 gap-4 pb-5"
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <div>
                  <p style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1 }}>
                    {home.beds}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>beds</p>
                </div>
                <div>
                  <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1, marginTop: 4 }}>
                    {home.sqft.toLocaleString("en-IN")}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>sqft</p>
                </div>
              </div>

              {/* Price */}
              <div>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 3 }}>Price</p>
                <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.035em", color: "var(--ink)" }}>
                  {formatINR(home.price)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 3 }}>Per sqft</p>
                <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                  {formatPerSqft(home.pricePerSqft)}
                </p>
              </div>

              {/* Detail grid */}
              <div
                className="grid grid-cols-2 gap-3 pt-4"
                style={{ borderTop: "1px solid var(--rule)" }}
              >
                {[
                  ["Type",       home.propertyType ],
                  ["Year",       String(home.yearBuilt)],
                  ["Facing",     home.facing       ],
                  ["Parking",    `${home.parking} covered`],
                  ["Furnishing", home.furnishing   ],
                  ["Baths",      String(home.baths)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: 10, color: "var(--ink-faint)", marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-faint)", marginBottom: 8 }}>
                  Amenities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {home.amenities.map((a) => (
                    <span
                      key={a}
                      style={{
                        fontSize: 10, padding: "3px 9px", borderRadius: 9999,
                        border: "1px solid var(--rule)",
                        color: "var(--ink-soft)", backgroundColor: "var(--paper-warm)",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agent card */}
              <div
                style={{
                  borderTop: "1px solid var(--rule)",
                  paddingTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-faint)" }}>
                  Contact Agent
                </p>

                {/* Avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      backgroundColor: "var(--ink)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--paper)", letterSpacing: "-0.01em" }}>
                      {home.agent.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>
                      {home.agent.name}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{home.agent.agency}</p>
                  </div>
                </div>

                {/* Contact links */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <a
                    href={`tel:${home.agent.phone.replace(/\s/g, "")}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: 13, color: "var(--ink-soft)", textDecoration: "none",
                      padding: "7px 10px", borderRadius: 10,
                      border: "1px solid var(--rule)",
                      backgroundColor: "var(--paper-cool)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57 1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.59 1 1 0 01-.25 1.01l-2.2 2.19z" fill="var(--ink-soft)"/>
                    </svg>
                    {home.agent.phone}
                  </a>
                  <a
                    href={`mailto:${home.agent.email}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: 13, color: "var(--ink-soft)", textDecoration: "none",
                      padding: "7px 10px", borderRadius: 10,
                      border: "1px solid var(--rule)",
                      backgroundColor: "var(--paper-cool)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="var(--ink-soft)"/>
                    </svg>
                    {home.agent.email}
                  </a>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${home.agent.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "9px 0", borderRadius: 9999,
                    backgroundColor: "#25D366", color: "#fff",
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 flex items-center gap-2.5 px-5 py-3"
          style={{ borderTop: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}
        >
          {/* Join Waitlist */}
          <button
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 14, border: "none", cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.98-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white"/>
            </svg>
            Join Waitlist
          </button>

          {/* Save */}
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.05)]"
            style={{ border: "1px solid var(--rule)", fontSize: 13, color: "var(--ink-soft)", backgroundColor: "transparent", cursor: "pointer" }}
          >
            <Heart size={13} />
            Save
          </button>

          {/* Navigation arrows — pushed to right */}
          <div className="flex items-center gap-2 ml-auto">
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{idx + 1} / {total}</span>
            <button
              onClick={onPrev}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(33,29,25,0.05)]"
              style={{ border: "1px solid var(--rule)", cursor: "pointer", backgroundColor: "var(--paper-cool)" }}
              aria-label="Previous home"
            >
              <ChevronLeft size={15} style={{ color: "var(--ink)" }} />
            </button>
            <button
              onClick={onNext}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(33,29,25,0.05)]"
              style={{ border: "1px solid var(--rule)", cursor: "pointer", backgroundColor: "var(--paper-cool)" }}
              aria-label="Next home"
            >
              <ChevronRight size={15} style={{ color: "var(--ink)" }} />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
