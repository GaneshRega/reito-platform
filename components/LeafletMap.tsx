"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/lib/mockData";
import { formatINR } from "@/lib/mockData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icon 404 in bundled environments.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
}

export default function LeafletMap({ listings, center, zoom, singleMarker }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const layerRef     = useRef<L.LayerGroup | null>(null);

  // Initialise map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: center ?? [17.4239, 78.4083],
      zoom: zoom ?? 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current   = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current  = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-draw markers when listings change.
  useEffect(() => {
    const map   = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    // Register global brochure download so popup button can call it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__discoverDlBrochure = (id: string) => {
      const l = listings.find(x => x.id === id);
      if (!l) return;
      const txt = [
        "DISCOVER — PROPERTY BROCHURE",
        "==============================",
        "",
        `Project: ${l.title}`,
        `Location: ${l.address}`,
        `Price: ${formatINR(l.price)} (₹${l.pricePerSqft.toLocaleString("en-IN")}/sqft)`,
        `Config: ${l.beds}BHK + Home Theatre | ${l.sqft.toLocaleString("en-IN")} sq ft`,
        `Status: ${l.status}`,
        "",
        "Amenities:",
        ...l.amenities.map(a => `  • ${a}`),
        "",
        "Contact:",
        `  ${l.agent.name}  |  ${l.agent.phone}`,
        `  ${l.agent.email}`,
        "",
        "discover.in",
      ].join("\n");
      const blob = new Blob([txt], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${l.id}_brochure.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    layer.clearLayers();
    if (listings.length === 0) return;

    listings.forEach((listing) => {
      const marker = L.marker([listing.lat, listing.lng]);
      const img    = listing.images[0] ?? "";
      const popupHtml = `
        <div style="width:230px;font-family:system-ui,sans-serif;border-radius:8px;overflow:hidden">
          ${img ? `<img src="${img}" alt="${listing.title}" style="width:100%;height:120px;object-fit:cover;display:block"/>` : ""}
          <div style="padding:10px 10px 8px">
            <p style="font-weight:700;font-size:13px;margin:0 0 3px;line-height:1.35;color:#211D19">${listing.title}</p>
            <p style="font-size:15px;font-weight:800;color:#1B3A2D;margin:0 0 2px">${formatINR(listing.price)}</p>
            <p style="font-size:11px;color:#888;margin:0 0 10px">${listing.locality} · ${listing.beds}BHK+HT · ${listing.status}</p>
            <div style="display:flex;gap:6px">
              <a href="/listings/${listing.id}"
                 style="flex:1;text-align:center;padding:6px 4px;background:#211D19;color:#F7F4EF;border-radius:6px;text-decoration:none;font-size:11px;font-weight:600">
                View Details
              </a>
              <button onclick="window.__discoverDlBrochure('${listing.id}')"
                      style="flex:1;padding:6px 4px;background:#F5EDD4;color:#211D19;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer">
                ⬇ Brochure
              </button>
            </div>
          </div>
        </div>`;

      marker.bindPopup(popupHtml, { maxWidth: 250 });
      layer.addLayer(marker);
    });

    if (!singleMarker && listings.length > 1) {
      const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    } else if (listings.length === 1) {
      map.setView([listings[0].lat, listings[0].lng], zoom ?? 14);
    }
  }, [listings, singleMarker, zoom]);

  return <div ref={containerRef} className="w-full h-full" />;
}
