import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
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
    title: `${listing.title} — REITO`,
    description: listing.description.slice(0, 160),
  };
}

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
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Header */}
      <header className="bg-[#1B3A2D] text-white px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.38em] uppercase"
        >
          REITO
        </Link>
        <Link
          href="/"
          className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span aria-hidden>←</span> All listings
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* ── Gallery ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-72 md:h-[420px]">
          {/* Primary image — full height on left */}
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
          {/* Up to two secondary images stacked on right */}
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

        {/* ── Two-column layout ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price + title */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  {listing.title}
                </h1>
                {listing.featured && (
                  <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C8A84B] text-white tracking-wide">
                    FEATURED
                  </span>
                )}
              </div>
              <p className="text-3xl md:text-4xl font-bold text-[#1B3A2D] tracking-tight mb-1">
                {formatINR(listing.price)}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                {formatPerSqft(listing.pricePerSqft)}
              </p>
              <p className="text-sm text-gray-500">{listing.address}</p>
            </div>

            {/* Headline stats */}
            {listing.beds > 0 && (
              <div className="flex gap-8 py-5 border-y border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-[#1B3A2D]">
                    {listing.beds}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Bedrooms</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1B3A2D]">
                    {listing.baths}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Bathrooms</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1B3A2D]">
                    {listing.sqft.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">sq ft</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                About this property
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Property details grid */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Property details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl p-3.5 border border-gray-100"
                  >
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
                      {s.label}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span
                    key={a}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#1B3A2D]/8 text-[#1B3A2D] font-medium border border-[#1B3A2D]/10"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Location
              </h2>
              <div className="h-60 rounded-2xl overflow-hidden border border-gray-100">
                <ClientMap
                  listings={[listing]}
                  center={[listing.lat, listing.lng]}
                  zoom={15}
                  singleMarker
                />
              </div>
            </div>
          </div>

          {/* Agent card ──────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-[72px]">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Contact agent
              </h2>

              {/* Agent identity */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-[#1B3A2D]/10 flex items-center justify-center text-[#1B3A2D] font-bold text-base shrink-0">
                  {listing.agent.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {listing.agent.name}
                  </p>
                  <p className="text-xs text-gray-400">{listing.agent.agency}</p>
                </div>
              </div>

              <a
                href={`tel:${listing.agent.phone}`}
                className="block w-full text-center bg-[#1B3A2D] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#2a5442] transition-colors mb-3"
              >
                {listing.agent.phone}
              </a>
              <a
                href={`mailto:${listing.agent.email}`}
                className="block w-full text-center border border-[#1B3A2D] text-[#1B3A2D] text-sm font-semibold py-3 rounded-full hover:bg-[#1B3A2D]/5 transition-colors"
              >
                Email agent
              </a>

              <p className="text-xs text-gray-400 text-center mt-4 pt-4 border-t border-gray-100">
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
