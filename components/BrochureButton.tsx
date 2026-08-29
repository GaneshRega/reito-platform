"use client";

import { Download } from "lucide-react";
import type { Listing } from "@/lib/mockData";
import { formatINR } from "@/lib/mockData";

export default function BrochureButton({ listing }: { listing: Listing }) {
  function handleDownload() {
    const content = [
      "DISCOVER — PROPERTY BROCHURE",
      "==============================",
      "",
      `Project: ${listing.title}`,
      `Location: ${listing.address}`,
      `Price: ${formatINR(listing.price)} (₹${listing.pricePerSqft.toLocaleString("en-IN")}/sqft)`,
      `Configuration: ${listing.beds}BHK + Home Theatre | ${listing.sqft.toLocaleString("en-IN")} sq ft`,
      `Status: ${listing.status}`,
      `Facing: ${listing.facing}`,
      `Parking: ${listing.parking} covered`,
      "",
      "Amenities:",
      ...listing.amenities.map((a) => `  • ${a}`),
      "",
      "Contact Agent:",
      `  ${listing.agent.name}`,
      `  ${listing.agent.phone}`,
      `  ${listing.agent.email}`,
      "",
      "─────────────────────────────",
      "DISCOVER | discover.in",
      "Hyderabad's premium villa marketplace.",
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
    <button
      onClick={handleDownload}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
      style={{
        border: "1.5px solid var(--rule)",
        color: "var(--ink)",
        backgroundColor: "var(--paper-warm)",
      }}
    >
      <Download size={14} />
      Download Brochure
    </button>
  );
}
