"use client";

import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/mockData";
import { formatINR, formatPerSqft } from "@/lib/mockData";

const UNSPLASH = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
];

function resolveImage(src: string, listingId: string): string {
  if (src.startsWith("http")) return src;
  const num = parseInt(listingId.replace("rt-", ""), 10);
  return UNSPLASH[num % UNSPLASH.length];
}

const STATUS_STYLES: Record<string, string> = {
  "For Sale": "bg-sky-50 text-sky-700",
  "New Launch": "bg-violet-50 text-violet-700",
  "Under Construction": "bg-amber-50 text-amber-700",
  "Ready to Move": "bg-emerald-50 text-emerald-700",
};

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const imgSrc = resolveImage(listing.images[0], listing.id);

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
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
          {/* Status pill */}
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[listing.status] ?? "bg-gray-100 text-gray-600"}`}
          >
            {listing.status}
          </span>
          {/* Featured badge */}
          {listing.featured && (
            <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C8A84B] text-white tracking-wide">
              FEATURED
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Price row */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-bold text-[#1B3A2D] tracking-tight">
              {formatINR(listing.price)}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {formatPerSqft(listing.pricePerSqft)}
            </span>
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1.5">
            {listing.title}
          </p>

          {/* Locality */}
          <p className="text-xs text-gray-400 mb-3">
            {listing.locality}, {listing.city}
          </p>

          {/* Beds / baths / sqft rail */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
            {listing.beds > 0 ? (
              <>
                <span>
                  <span className="font-semibold text-[#1B3A2D]">{listing.beds}</span>
                  {" "}bed{listing.beds !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-200">·</span>
                <span>
                  <span className="font-semibold text-[#1B3A2D]">{listing.baths}</span>
                  {" "}bath{listing.baths !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-200">·</span>
              </>
            ) : null}
            <span>
              <span className="font-semibold text-[#1B3A2D]">
                {listing.sqft.toLocaleString("en-IN")}
              </span>
              {" "}sqft
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
