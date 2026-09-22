"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/mockData";
import { formatINR, formatPerSqft } from "@/lib/mockData";

const STATUS_STYLES: Record<string, string> = {
  "For Sale":            "bg-sky-50 text-sky-700",
  "New Launch":          "bg-violet-50 text-violet-700",
  "Under Construction":  "bg-amber-50 text-amber-700",
  "Ready to Move":       "bg-emerald-50 text-emerald-700",
};

interface Props {
  listing: Listing;
  onClick?: () => void;
}

export default function ListingCard({ listing, onClick }: Props) {
  const imgSrc = listing.images[0];

  function handleBrochure(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const content = [
      "DISCOVER — PROPERTY BROCHURE",
      "==============================",
      "",
      `Project: ${listing.title}`,
      `Location: ${listing.address}`,
      `Price: ${formatINR(listing.price)} (₹${listing.pricePerSqft.toLocaleString("en-IN")}/sqft)`,
      `Config: ${listing.beds}BHK + Home Theatre | ${listing.sqft.toLocaleString("en-IN")} sqft`,
      `Status: ${listing.status}`,
      "",
      "Amenities:",
      ...listing.amenities.map((a) => `  • ${a}`),
      "",
      "Contact:",
      `  ${listing.agent.name}  |  ${listing.agent.phone}`,
      "",
      "discover.in",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${listing.id}_brochure.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block"
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
    >
      <article className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07),_0_8px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10),_0_20px_48px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[listing.status] ?? "bg-gray-100 text-gray-600"}`}>
            {listing.status}
          </span>
          {listing.featured && (
            <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C8A84B] text-white tracking-wide">
              FEATURED
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-bold text-[#1B3A2D] tracking-tight">
              {formatINR(listing.price)}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {formatPerSqft(listing.pricePerSqft)}
            </span>
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">
            {listing.title}
          </p>

          {/* Locality */}
          <p className="text-xs text-gray-400 mb-3">
            {listing.locality}, {listing.city}
          </p>

          {/* Beds / baths / sqft */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500 border-t border-gray-100 pt-3 mb-3">
            {listing.beds > 0 && (
              <>
                <span>
                  <span className="font-semibold text-[#1B3A2D]">{listing.beds}</span>
                  {" "}BHK+HT
                </span>
                <span className="text-gray-200">·</span>
              </>
            )}
            <span>
              <span className="font-semibold text-[#1B3A2D]">
                {listing.sqft.toLocaleString("en-IN")}
              </span>
              {" "}sqft
            </span>
          </div>

          {/* Download Brochure */}
          <button
            onClick={handleBrochure}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-colors hover:bg-gray-50"
            style={{ borderColor: "#E5E7EB", color: "#6B7280" }}
          >
            ⬇ Download Brochure
          </button>
        </div>
      </article>
    </Link>
  );
}
