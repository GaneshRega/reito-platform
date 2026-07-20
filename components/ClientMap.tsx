"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/lib/mockData";

// ssr: false is only valid inside a Client Component in Next.js 16.
// LeafletMap uses the DOM + Leaflet directly — it must never run on the server.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <span className="text-sm text-gray-400">Loading map…</span>
    </div>
  ),
});

interface Props {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
}

export default function ClientMap(props: Props) {
  return <LeafletMap {...props} />;
}
