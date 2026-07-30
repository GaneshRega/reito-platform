import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import {
  getListingById,
  listings,
  formatINR,
  formatPerSqft,
} from "@/lib/mockData";
import ClientMap from "@/components/ClientMap";

export const dynamic = "force-static";

const UNSPLASH = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=85",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=85",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=85",
];

function resolveImage(src: string, listingId: string, idx: number): string {
  if (src.startsWith("http")) return src;
  const num = parseInt(listingId.replace("rt-", ""), 10);
  return UNSPLASH[(num + idx) % UNSPLASH.length];
}

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: `${listing.title} — DISCOVER`,
    description: listing.description.slice(0, 160),
  };
}

/* ── Shared label style ──────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "var(--ink-faint)",
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const images = listing.images.map((src, i) =>
    resolveImage(src, listing.id, i)
  );

  const specs: { label: string; value: string | number }[] = [
    { label: "Property type", value: listing.propertyType },
    { label: "Status", value: listing.status },
    { label: "Furnishing", value: listing.furnishing },
    { label: "Facing", value: listing.facing },
    ...(listing.floor !== null
      ? [{ label: "Floor", value: `${listing.floor} of ${listing.totalFloors}` }]
      : []),
    { label: "Year built", value: listing.yearBuilt },
    {
      label: "Parking",
      value: listing.parking > 0 ? `${listing.parking} covered` : "None",
    },
    { label: "Pincode", value: listing.pincode },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 md:px-10 h-14"
        style={{
          backgroundColor: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontWeight: 400,
            fontSize: 15,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          DISCOVER
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex justify-center">
          <label
            className="flex items-center gap-2.5 px-4 w-full cursor-text"
            style={{
              maxWidth: 520,
              height: 36,
              borderRadius: 9999,
              border: "1px solid var(--rule)",
              backgroundColor: "var(--paper-warm)",
            }}
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

        {/* Right nav */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/listings"
              style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}
              className="transition-opacity hover:opacity-70"
            >
              Discover homes
            </Link>
            {["How it works", "For Owners"].map((label) => (
              <a
                key={label}
                href="/#how"
                style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 500 }}
                className="transition-opacity hover:opacity-70"
              >
                {label}
              </a>
            ))}
          </nav>
          <Link
            href="/claim"
            className="text-sm font-medium px-5 py-2 rounded-full transition-colors whitespace-nowrap"
            style={{ border: "1.5px solid var(--rule)", color: "var(--ink)" }}
          >
            Feature your home
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-10 py-10">

        {/* Back link */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 mb-8 transition-opacity hover:opacity-60"
          style={{ fontSize: 13, color: "var(--ink-faint)", fontWeight: 500 }}
        >
          <span aria-hidden>←</span> All listings
        </Link>

        {/* ── Gallery ──────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden mb-10"
          style={{ height: 420, borderRadius: 16 }}
        >
          <div className="relative row-span-2">
            <Image
              src={images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {images.slice(1, 3).map((src, i) => (
            <div key={i} className="relative hidden md:block">
              <Image
                src={src}
                alt={`${listing.title} — view ${i + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>

        {/* ── Two-column layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Price + title */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1
                  style={{
                    fontSize: "clamp(22px, 3vw, 30px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--ink)",
                  }}
                >
                  {listing.title}
                </h1>
                {listing.featured && (
                  <span
                    className="shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wider"
                    style={{
                      backgroundColor: "var(--gold-soft)",
                      color: "var(--gold)",
                      border: "1px solid var(--gold)",
                    }}
                  >
                    FEATURED
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: "clamp(28px, 4vw, 38px)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  color: "var(--ink)",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {formatINR(listing.price)}
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 4 }}>
                {formatPerSqft(listing.pricePerSqft)}
              </p>
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{listing.address}</p>
            </div>

            {/* Headline stats */}
            {listing.beds > 0 && (
              <div
                className="flex gap-10 py-5"
                style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}
              >
                {[
                  { val: listing.beds, unit: "Bedrooms" },
                  { val: listing.baths, unit: "Bathrooms" },
                  { val: listing.sqft.toLocaleString("en-IN"), unit: "sq ft" },
                ].map(({ val, unit }) => (
                  <div key={unit}>
                    <p
                      style={{
                        fontSize: 28,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {val}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4 }}>{unit}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <p style={{ ...labelStyle, marginBottom: 12 }}>About this property</p>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                {listing.description}
              </p>
            </div>

            {/* Property details grid */}
            <div>
              <p style={{ ...labelStyle, marginBottom: 12 }}>Property details</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      backgroundColor: "var(--paper-cool)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--rule)",
                    }}
                  >
                    <p style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <p style={{ ...labelStyle, marginBottom: 12 }}>Amenities</p>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span
                    key={a}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--ink-soft)",
                      border: "1px solid var(--rule)",
                      borderRadius: 9999,
                      padding: "6px 14px",
                      backgroundColor: "var(--paper-cool)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <p style={{ ...labelStyle, marginBottom: 12 }}>Location</p>
              <div
                className="overflow-hidden"
                style={{ height: 240, borderRadius: 14, border: "1px solid var(--rule)" }}
              >
                <ClientMap
                  listings={[listing]}
                  center={[listing.lat, listing.lng]}
                  zoom={15}
                  singleMarker
                />
              </div>
            </div>
          </div>

          {/* ── Agent card ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div
              className="lg:sticky"
              style={{
                top: 72,
                backgroundColor: "var(--paper-cool)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid var(--rule)",
                boxShadow: "var(--lift)",
              }}
            >
              {/* Join Waitlist CTA */}
              <div className="pb-5 mb-5" style={{ borderBottom: "1px solid var(--rule)" }}>
                <p style={{ fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.55, marginBottom: 12 }}>
                  Queue on this home before it re-lists. The owner reaches out when they&apos;re ready.
                </p>
                <Link
                  href="/iso"
                  className="block w-full text-center text-sm font-medium py-3 rounded-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 14 }}
                >
                  Join Waitlist
                </Link>
              </div>

              {/* Agent */}
              <p style={{ ...labelStyle, marginBottom: 14 }}>Contact agent</p>

              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
                  style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}
                >
                  {listing.agent.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                    {listing.agent.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>{listing.agent.agency}</p>
                </div>
              </div>

              <a
                href={`tel:${listing.agent.phone}`}
                className="block w-full text-center text-sm font-medium py-3 rounded-full transition-opacity hover:opacity-90 mb-2.5"
                style={{ backgroundColor: "var(--ink)", color: "var(--paper)", fontSize: 14 }}
              >
                {listing.agent.phone}
              </a>
              <a
                href={`mailto:${listing.agent.email}`}
                className="block w-full text-center text-sm font-medium py-3 rounded-full transition-colors"
                style={{
                  border: "1.5px solid var(--rule)",
                  color: "var(--ink)",
                  fontSize: 14,
                }}
              >
                Email agent
              </a>

              <p
                className="text-center mt-4 pt-4"
                style={{ fontSize: 12, color: "var(--ink-faint)", borderTop: "1px solid var(--rule)" }}
              >
                Listed{" "}
                {new Date(listing.listedDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
