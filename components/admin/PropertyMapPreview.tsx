"use client";

import dynamic from "next/dynamic";
import { MapPin, ExternalLink, AlertCircle } from "lucide-react";

const PropertyMapLeaflet = dynamic(
  () => import("./PropertyMapLeaflet"),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--paper-cool)" }}>
      <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "var(--rule)", borderTopColor: "var(--ink)" }} />
    </div>
  )}
);

export function parseGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  try {
    // @lat,lng,zoom (most common — "Copy link" from Google Maps)
    const at = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };

    // ?q=lat,lng or &q=lat,lng (simple query)
    const q = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };

    // ll=lat,lng
    const ll = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (ll) return { lat: parseFloat(ll[1]), lng: parseFloat(ll[2]) };
  } catch {}
  return null;
}

interface Props {
  mapUrl: string;
  label?: string;
  height?: number;
}

export default function PropertyMapPreview({ mapUrl, label, height = 280 }: Props) {
  const coords = parseGoogleMapsUrl(mapUrl);

  if (!mapUrl.trim()) return null;

  if (!coords) {
    return (
      <div
        className="rounded-xl flex flex-col items-center justify-center gap-2 p-4"
        style={{ height, backgroundColor: "var(--paper-cool)", border: "1px dashed var(--rule)" }}
      >
        <AlertCircle size={20} style={{ color: "var(--ink-faint)" }} />
        <p style={{ fontSize: 12, color: "var(--ink-faint)", textAlign: "center" }}>
          Couldn&apos;t parse coordinates from this URL.
          <br />Paste a Google Maps link that contains <code>@lat,lng</code>
        </p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "var(--ink-soft)" }}
        >
          Open in Maps <ExternalLink size={11} />
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden relative" style={{ height, border: "1px solid var(--rule)" }}>
      <PropertyMapLeaflet lat={coords.lat} lng={coords.lng} label={label} />
      {/* Overlay badge */}
      <div
        className="absolute bottom-2 left-2 z-[1000] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
        style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "0 2px 8px rgba(33,29,25,0.12)" }}
      >
        <MapPin size={12} style={{ color: "#1D7D5A" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>
          {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
        </span>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1"
          style={{ color: "var(--ink-faint)" }}
        >
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
