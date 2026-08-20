"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
}

export default function PropertyMapLeaflet({ lat, lng, label, zoom = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { center: [lat, lng], zoom, zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    L.marker([lat, lng])
      .bindPopup(
        `<div style="font-family:inherit;min-width:140px">
          <p style="font-weight:700;font-size:13px;margin:0 0 2px;color:#211D19">${label ?? "Property"}</p>
          <p style="font-size:11px;color:#9A9187;margin:0">${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</p>
        </div>`,
        { maxWidth: 220 }
      )
      .addTo(map)
      .openPopup();
    mapRef.current = map;
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update view if lat/lng change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom]);

  return <div ref={ref} className="w-full h-full" />;
}
