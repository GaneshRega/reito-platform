"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/lib/mockData";
import { formatINR } from "@/lib/mockData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icon 404 in bundled environments.
// Webpack/Turbopack strips the _getIconUrl reference that Leaflet relies on
// to auto-locate its bundled images; pointing it to a CDN copy instead.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
}

export default function LeafletMap({
  listings,
  center,
  zoom,
  singleMarker,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Initialise the map exactly once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: center ?? [17.4239, 78.4083],
      zoom: zoom ?? 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-draw markers whenever the listings array changes.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (listings.length === 0) return;

    listings.forEach((listing) => {
      const marker = L.marker([listing.lat, listing.lng]);
      marker.bindPopup(
        `<div style="min-width:190px;font-family:system-ui,sans-serif">
          <p style="font-weight:600;font-size:13px;margin:0 0 4px;line-height:1.4">${listing.title}</p>
          <p style="font-size:15px;font-weight:700;color:#1B3A2D;margin:0 0 2px">${formatINR(listing.price)}</p>
          <p style="font-size:11px;color:#888;margin:0">${listing.locality}</p>
        </div>`,
        { maxWidth: 240 }
      );
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
