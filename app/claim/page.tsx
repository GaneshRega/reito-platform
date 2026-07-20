"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layout, Image as ImageIcon, Type, AlignLeft,
  Star, Palette, ClipboardList, X, ChevronRight,
} from "lucide-react";

const TILES = [
  { icon: Layout,      label: "Layout",   desc: "Choose how your home's page is arranged." },
  { icon: ImageIcon,   label: "Photos",   desc: "Upload and order photos of your home."    },
  { icon: Type,        label: "Headline", desc: "Write the one line that defines your home."},
  { icon: AlignLeft,   label: "Content",  desc: "Tell your home's story in your own words." },
  { icon: Star,        label: "Perks",    desc: "Highlight what makes living here special."  },
  { icon: Palette,     label: "Style",    desc: "Pick a visual tone for your profile page."  },
  { icon: ClipboardList,label: "Details", desc: "Beds, baths, sqft, year built, and more."  },
];

/* Mock preview card data */
const PREVIEW = {
  title: "Contemporary 3BHK in Jubilee Hills",
  locality: "Jubilee Hills, Hyderabad",
  price: "₹2.8Cr",
  beds: 3,
  sqft: "2,400",
};

export default function ClaimPage() {
  const [address, setAddress] = useState("");
  const [active, setActive] = useState<string | null>(null);

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
          href="/"
          className="p-2 rounded-full transition-colors hover:bg-[rgba(33,29,25,0.06)]"
          style={{ color: "var(--ink-soft)" }}
          aria-label="Close"
        >
          <X size={18} />
        </Link>
      </header>

      {/* ── Split screen ──────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
        {/* Left — dark gradient + controls */}
        <div
          className="relative lg:w-1/2 flex flex-col justify-between px-8 md:px-14 pt-16 pb-12 overflow-hidden"
          style={{ backgroundColor: "#211D19" }}
        >
          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 0% 100%, rgba(168,134,62,0.18), transparent), radial-gradient(ellipse 60% 60% at 100% 0%, rgba(168,134,62,0.08), transparent)",
            }}
            aria-hidden
          />

          <div className="relative z-10">
            <h1
              className="mb-3"
              style={{
                fontSize: "clamp(34px, 4vw, 48px)", fontWeight: 500,
                letterSpacing: "-0.03em", lineHeight: 1.05,
                color: "#F7F4EF",
              }}
            >
              Control how your home shows up.
            </h1>
            <p
              className="mb-10"
              style={{ fontSize: 17, color: "rgba(247,244,239,0.55)", lineHeight: 1.55 }}
            >
              Claim your home, customise its profile, and decide when — and to
              whom — you open the door.
            </p>

            {/* Address claim input */}
            <div className="flex gap-3 mb-12">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your home's address…"
                className="flex-1 px-5 py-3.5 outline-none"
                style={{
                  borderRadius: "var(--r-input)",
                  border: "1.5px solid rgba(247,244,239,0.15)",
                  backgroundColor: "rgba(247,244,239,0.07)",
                  fontSize: 15,
                  color: "#F7F4EF",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(247,244,239,0.45)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(247,244,239,0.15)")
                }
              />
              <button
                className="px-5 py-3.5 rounded-full font-medium shrink-0 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#F7F4EF",
                  color: "#211D19",
                  fontSize: 14,
                }}
              >
                Claim
              </button>
            </div>

            {/* Customisation tile grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {TILES.map(({ icon: Icon, label, desc }) => (
                <button
                  key={label}
                  onClick={() => setActive(active === label ? null : label)}
                  className="text-left p-4 rounded-[14px] flex flex-col gap-2 transition-all duration-200"
                  style={{
                    border:
                      active === label
                        ? "1.5px solid rgba(168,134,62,0.6)"
                        : "1.5px solid rgba(247,244,239,0.10)",
                    backgroundColor:
                      active === label
                        ? "rgba(168,134,62,0.10)"
                        : "rgba(247,244,239,0.04)",
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color:
                        active === label
                          ? "var(--gold)"
                          : "rgba(247,244,239,0.4)",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 13, fontWeight: 500,
                        color: "#F7F4EF",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(247,244,239,0.4)",
                        marginTop: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — floating preview */}
        <div
          className="lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative"
          style={{ backgroundColor: "var(--paper-warm)" }}
        >
          {/* Profile preview card */}
          <div
            className="relative w-full max-w-xs"
            style={{ filter: "drop-shadow(0 20px 60px rgba(33,29,25,0.14))" }}
          >
            {/* Main card */}
            <div
              className="rounded-[20px] overflow-hidden"
              style={{
                backgroundColor: "var(--paper-cool)",
                border: "1px solid var(--rule)",
              }}
            >
              {/* Image placeholder */}
              <div
                className="h-48 relative"
                style={{ backgroundColor: "var(--paper-warm)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon size={28} style={{ color: "var(--ink-faint)", opacity: 0.3 }} />
                </div>
                <div
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "var(--paper-cool)",
                    color: "var(--ink-soft)",
                  }}
                >
                  Your photos
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <p
                  style={{
                    fontSize: 17, fontWeight: 500,
                    color: "var(--ink)", lineHeight: 1.3,
                  }}
                >
                  {PREVIEW.title}
                </p>
                <p
                  className="mt-1 mb-4"
                  style={{ fontSize: 13, color: "var(--ink-faint)" }}
                >
                  {PREVIEW.locality}
                </p>
                <div className="flex gap-4 text-sm">
                  <span style={{ color: "var(--ink-soft)" }}>
                    <strong style={{ color: "var(--ink)", fontWeight: 700 }}>
                      {PREVIEW.beds}
                    </strong>{" "}
                    beds
                  </span>
                  <span style={{ color: "var(--ink-soft)" }}>
                    <strong style={{ color: "var(--ink)", fontWeight: 700 }}>
                      {PREVIEW.sqft}
                    </strong>{" "}
                    sqft
                  </span>
                </div>
                <button
                  className="mt-4 w-full py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "var(--ink)",
                    color: "var(--paper)",
                  }}
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Tooltip overlay card */}
            <div
              className="absolute -bottom-4 -right-4 rounded-[14px] p-4 w-52"
              style={{
                backgroundColor: "var(--paper-cool)",
                border: "1px solid var(--rule)",
                boxShadow: "var(--lift)",
              }}
            >
              <p
                style={{
                  fontSize: 11, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--ink-faint)",
                }}
              >
                Buyers waiting
              </p>
              <p
                style={{
                  fontWeight: 900, fontSize: 40,
                  letterSpacing: "-0.045em",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--ink)", lineHeight: 1.1, marginTop: 4,
                }}
              >
                12
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex -space-x-2">
                  {["PM", "AR", "KI"].map((init) => (
                    <div
                      key={init}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-white"
                      style={{
                        backgroundColor: "var(--paper-warm)",
                        color: "var(--ink-soft)",
                      }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <ChevronRight size={14} style={{ color: "var(--ink-faint)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
