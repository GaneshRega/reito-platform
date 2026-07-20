import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getListingById, listings } from "@/lib/mockData";
import { formatINR, formatPerSqft } from "@/lib/format";
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

function img(src: string, id: string, i: number) {
  if (src.startsWith("http")) return src;
  const n = parseInt(id.replace("rt-", ""), 10);
  return UNSPLASH[(n + i) % UNSPLASH.length];
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
  const l = getListingById(id);
  if (!l) return { title: "Not found" };
  return { title: `${l.title} — REITO`, description: l.description.slice(0, 160) };
}

export default async function HomeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const l = getListingById(id);
  if (!l) notFound();

  const images = l.images.map((s, i) => img(s, l.id, i));

  /* Mock valuation data */
  const ownerVal  = Math.round(l.price * 1.06 / 100_000) * 100_000;
  const marketEst = Math.round(l.price * 0.98 / 100_000) * 100_000;
  const lastSold  = Math.round(l.price * 0.83 / 100_000) * 100_000;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-5 md:px-10 h-14 flex items-center justify-between"
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
          style={{ fontSize: 14, color: "var(--ink-soft)" }}
          className="transition-opacity hover:opacity-70"
        >
          ← Back
        </Link>
      </header>

      {/* ── Masonry photo grid ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 px-5 md:px-10 pt-8 pb-6 max-h-[520px] overflow-hidden">
        <div className="col-span-2 row-span-2 relative rounded-[14px] overflow-hidden min-h-[280px]">
          <Image src={images[0]} alt={l.title} fill className="object-cover" priority sizes="50vw" />
        </div>
        {images.slice(1, 5).map((src, i) => (
          <div key={i} className="relative rounded-[14px] overflow-hidden min-h-[130px]">
            <Image src={src} alt={`${l.title} ${i + 2}`} fill className="object-cover" sizes="25vw" />
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Main ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Drop-cap opening */}
            <div>
              <h1
                className="mb-4"
                style={{
                  fontSize: 34, fontWeight: 500,
                  letterSpacing: "-0.02em", color: "var(--ink)",
                }}
              >
                {l.title}
              </h1>
              <p
                style={{
                  fontSize: 17, color: "var(--ink-soft)",
                  lineHeight: 1.55, maxWidth: 600,
                }}
              >
                <span
                  style={{
                    float: "left", fontSize: 64, lineHeight: 0.75,
                    fontWeight: 700, marginRight: 8, marginTop: 10,
                    color: "var(--ink)",
                  }}
                >
                  {l.description.charAt(0)}
                </span>
                {l.description.slice(1)}
              </p>
            </div>

            {/* Stat rail */}
            {l.beds > 0 && (
              <div
                className="flex gap-8 py-6"
                style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}
              >
                {[
                  { n: l.beds,  label: "Bedrooms"  },
                  { n: l.baths, label: "Bathrooms" },
                  { n: l.sqft.toLocaleString("en-IN"), label: "sq ft" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <p
                      style={{
                        fontWeight: 900,
                        fontSize: "clamp(40px, 6vw, 64px)",
                        letterSpacing: "-0.045em",
                        fontVariantNumeric: "tabular-nums",
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {n}
                    </p>
                    <p
                      style={{
                        fontSize: 12, fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.14em",
                        color: "var(--ink-faint)", marginTop: 4,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Valuation row */}
            <div>
              <p
                className="mb-4"
                style={{
                  fontSize: 12, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--ink-faint)",
                }}
              >
                Valuation
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Owner estimate", value: ownerVal,  note: "Your figure" },
                  { label: "Market estimate",value: marketEst, note: "Algorithmic" },
                  { label: "Last sold",       value: lastSold,  note: `${l.yearBuilt}` },
                ].map(({ label, value, note }) => (
                  <div
                    key={label}
                    className="rounded-[14px] p-4"
                    style={{
                      border: "1px solid var(--rule)",
                      backgroundColor: "var(--paper-cool)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11, fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.12em",
                        color: "var(--ink-faint)",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: 17, fontWeight: 700,
                        color: "var(--ink)", marginTop: 4,
                      }}
                    >
                      {formatINR(value)}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 2 }}>
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Details */}
            <div>
              <p
                className="mb-4"
                style={{
                  fontSize: 12, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--ink-faint)",
                }}
              >
                Home details
              </p>
              <div
                className="rounded-[14px] overflow-hidden divide-y"
                style={{
                  border: "1px solid var(--rule)",
                  backgroundColor: "var(--paper-cool)",
                }}
              >
                {[
                  ["Address",  l.address],
                  ["Type",     l.propertyType],
                  ["Status",   l.status],
                  ["Furnishing", l.furnishing],
                  ["Facing",   l.facing],
                  ...(l.floor !== null ? [["Floor", `${l.floor} of ${l.totalFloors}`] as [string, string]] : []),
                  ["Year built", String(l.yearBuilt)],
                  ["Parking", l.parking > 0 ? `${l.parking} covered` : "None"],
                  ["₹/sqft",   formatPerSqft(l.pricePerSqft)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3.5">
                    <span
                      style={{
                        fontSize: 13, fontWeight: 500,
                        color: "var(--ink-faint)",
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <p
                className="mb-3"
                style={{
                  fontSize: 12, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--ink-faint)",
                }}
              >
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {l.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-3.5 py-1.5 text-sm rounded-full"
                    style={{
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

            {/* Location map */}
            <div>
              <p
                className="mb-3"
                style={{
                  fontSize: 12, fontWeight: 500,
                  textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--ink-faint)",
                }}
              >
                Location
              </p>
              <div className="h-56 rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--rule)" }}>
                <ClientMap listings={[l]} center={[l.lat, l.lng]} zoom={15} singleMarker />
              </div>
            </div>
          </div>

          {/* ── Sidebar ────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div
              className="lg:sticky lg:top-[72px] rounded-[20px] p-6 flex flex-col gap-5"
              style={{
                border: "1px solid var(--rule)",
                backgroundColor: "var(--paper-cool)",
                boxShadow: "var(--lift)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 30, fontWeight: 700,
                    letterSpacing: "-0.03em", color: "var(--ink)",
                  }}
                >
                  {formatINR(l.price)}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>
                  {formatPerSqft(l.pricePerSqft)}
                </p>
              </div>

              <button
                className="w-full py-4 rounded-full font-medium text-center transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--ink)",
                  color: "var(--paper)",
                  fontSize: 15,
                }}
              >
                Join Waitlist
              </button>

              {/* Agent */}
              <div
                className="pt-4"
                style={{ borderTop: "1px solid var(--rule)" }}
              >
                <p
                  className="mb-3"
                  style={{
                    fontSize: 11, fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: "0.14em",
                    color: "var(--ink-faint)",
                  }}
                >
                  Contact agent
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0"
                    style={{
                      backgroundColor: "var(--paper-warm)",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {l.agent.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                      {l.agent.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                      {l.agent.agency}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${l.agent.phone}`}
                  className="block w-full py-3 rounded-full text-center text-sm font-medium transition-colors"
                  style={{
                    border: "1.5px solid var(--rule)",
                    color: "var(--ink-soft)",
                  }}
                >
                  {l.agent.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
