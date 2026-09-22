"use client";

import { useState, useMemo, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, Search, Filter, MapPin, Bed, Maximize2,
  Users, Eye, CheckCircle2, X, Plus, Upload, Trash2, ChevronDown,
} from "lucide-react";
import { HOMES, CLIENTS, getAgent } from "@/lib/admin/data";
import {
  LISTING_STATUS_META, HOME_STATUS_META, PROP_LABEL,
  type ListingStatus, type PropertyType, type Home,
} from "@/lib/admin/types";
import { formatINR } from "@/lib/format";

/* ── Types ───────────────────────────────────────────────────── */
type HomeWithImages = Home & { images?: string[] };

/* ── Constants ───────────────────────────────────────────────── */
const LOCALITIES = Array.from(new Set(HOMES.map(h => h.locality))).sort();
const PROP_TYPES: PropertyType[] = ["apartment", "villa", "plot", "penthouse", "farmhouse", "studio", "row_house", "duplex"];
const FACINGS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const AMENITY_OPTIONS = [
  "Swimming Pool", "Gymnasium", "Clubhouse", "Power Backup",
  "24/7 Security", "CCTV", "Lift", "24/7 Water Supply",
  "Covered Parking", "Children's Play Area", "Jogging Track",
  "Tennis Court", "EV Charging", "Rainwater Harvesting",
  "Landscaped Gardens", "Multipurpose Hall", "Concierge",
  "Intercom", "Fire Safety", "Visitor Parking",
];

type MapStatus = "idle" | "loading" | "ok" | "error";

const ROOM_LABEL_OPTIONS = [
  "Cover", "Living Room", "Kitchen", "Bedroom", "Bathroom",
  "Balcony", "Hall", "Dining", "Study", "Terrace", "Others",
];

type ImageEntry = { src: string; label: string };

type FormDraft = {
  ownerName: string; ownerPhone: string; ownerEmail: string;
  locality: string; societyName: string; address: string; reraNumber: string;
  mapUrl: string; lat: number; lng: number;
  propertyType: PropertyType;
  bedrooms: number; bathrooms: number; areaSqft: number; plotSqyd: number;
  floor: number; totalFloors: number;
  priceAsking: number;
  facing: string; ageYears: number;
  furnishing: "unfurnished" | "semi_furnished" | "fully_furnished" | "";
  parkingSlots: number; waterSource: string; ownerOccupied: boolean;
  amenities: string[]; highlights: string; description: string;
  listingStatus: ListingStatus;
  images: ImageEntry[];
};

const DRAFT_DEFAULT: FormDraft = {
  ownerName: "", ownerPhone: "", ownerEmail: "",
  locality: "", societyName: "", address: "", reraNumber: "",
  mapUrl: "", lat: 0, lng: 0,
  propertyType: "apartment",
  bedrooms: 2, bathrooms: 2, areaSqft: 0, plotSqyd: 0,
  floor: 0, totalFloors: 0,
  priceAsking: 0,
  facing: "", ageYears: 0, furnishing: "",
  parkingSlots: 1, waterSource: "", ownerOccupied: false,
  amenities: [], highlights: "", description: "",
  listingStatus: "available",
  images: [] as ImageEntry[],
};

/* ── Tiny helpers ────────────────────────────────────────────── */
function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="text-sm rounded-lg px-3 py-1.5 pr-8 appearance-none"
      style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)", color: value ? "var(--ink)" : "var(--ink-faint)", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A9187' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
    >
      {children}
    </select>
  );
}

function StatusBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: bg, color }}>
      {label}
    </span>
  );
}

function StatPill({ label, value, meta, active, onClick }: { label: string; value: number; meta: { color: string; bg: string }; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all" style={{ backgroundColor: active ? meta.bg : "var(--paper)", border: active ? `2px solid ${meta.color}` : "1px solid var(--rule)", boxShadow: "var(--lift)" }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: meta.color }}>{value}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: active ? meta.color : "var(--ink-soft)" }}>{label}</span>
    </button>
  );
}

/* ── Property card ───────────────────────────────────────────── */
function PropertyCard({ home }: { home: HomeWithImages }) {
  const lsMeta = LISTING_STATUS_META[home.listingStatus];
  const hsMeta = HOME_STATUS_META[home.status];
  const agent = home.handledById ? getAgent(home.handledById) : undefined;
  const dealClient = home.dealClientId ? CLIENTS.find(c => c.id === home.dealClientId) : undefined;

  return (
    <div className="rounded-xl flex flex-col gap-3 hover:shadow-md transition-shadow overflow-hidden" style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}>

      {/* Images */}
      {home.images && home.images.length > 0 && (
        <div className="relative h-44 shrink-0 bg-gray-100">
          <img src={home.images[0]} alt={home.address} className="w-full h-full object-cover" />
          {home.images.length > 1 && (
            <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(33,29,25,0.65)", color: "#fff" }}>
              +{home.images.length - 1} more
            </span>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge label={lsMeta.label} color={lsMeta.color} bg={lsMeta.bg} />
              {home.status !== "approved" && <StatusBadge label={hsMeta.label} color={hsMeta.color} bg={hsMeta.bg} />}
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)" }}>
                {PROP_LABEL[home.propertyType]}
              </span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }} className="truncate">{home.address || home.societyName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} style={{ color: "var(--ink-faint)" }} />
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.locality}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{formatINR(home.priceAsking)}</p>
            {home.areaSqft > 0 && (
              <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                ₹{Math.round(home.priceAsking / home.areaSqft / 100) / 10}k/sqft
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 flex-wrap">
          {home.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed size={12} style={{ color: "var(--ink-faint)" }} />
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.bedrooms}BHK</span>
            </div>
          )}
          {home.areaSqft > 0 && (
            <div className="flex items-center gap-1">
              <Maximize2 size={12} style={{ color: "var(--ink-faint)" }} />
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.areaSqft.toLocaleString()} sqft</span>
            </div>
          )}
          {home.floor != null && home.totalFloors != null && home.floor > 0 && (
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Floor {home.floor}/{home.totalFloors}</span>
          )}
          {home.facing && <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.facing} facing</span>}
          {home.ageYears !== undefined && (
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{home.ageYears === 0 ? "New" : `${home.ageYears}yr old`}</span>
          )}
        </div>

        {/* Amenity chips (first 4) */}
        {home.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {home.amenities.slice(0, 4).map(a => (
              <span key={a} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9999, border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "var(--paper-cool)" }}>{a}</span>
            ))}
            {home.amenities.length > 4 && (
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9999, color: "var(--ink-faint)" }}>+{home.amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Owner */}
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "var(--paper-cool)" }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 1 }}>Owner</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{home.ownerName}</p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>{home.ownerPhone}</p>
          </div>
          <div className="text-right">
            {agent && (
              <div>
                <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 1 }}>Handled by</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)" }}>{agent.fullName}</p>
              </div>
            )}
            {home.matchedClientCount != null && home.matchedClientCount > 0 && (
              <div className="flex items-center gap-1 mt-1 justify-end">
                <Users size={11} style={{ color: "var(--ink-faint)" }} />
                <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{home.matchedClientCount} matched</span>
              </div>
            )}
          </div>
        </div>

        {dealClient && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: lsMeta.bg }}>
            <CheckCircle2 size={13} style={{ color: lsMeta.color }} />
            <div className="flex-1 min-w-0">
              <span style={{ fontSize: 12, color: lsMeta.color, fontWeight: 500 }}>
                {home.listingStatus === "sold" ? "Sold to" : "In deal with"}
              </span>
              <span style={{ fontSize: 12, color: lsMeta.color }}> · </span>
              <Link href={`/admin/clients/${dealClient.id}`} style={{ fontSize: 12, fontWeight: 600, color: lsMeta.color }}>
                {dealClient.fullName}
              </Link>
            </div>
          </div>
        )}

        {home.adminNote && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#F5DADA", color: "#B03030" }}>
            {home.adminNote}
          </p>
        )}

        <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--rule)" }}>
          <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>
            via {home.submittedVia} · {new Date(home.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <Link href="/admin/claims" className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--ink-soft)" }}>
            <Eye size={11} /> View claim
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Form section header ─────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid var(--rule)", paddingBottom: open ? 16 : 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-soft)" }}>
          {title}
        </span>
        <ChevronDown size={14} style={{ color: "var(--ink-faint)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
}

/* ── Form field ──────────────────────────────────────────────── */
function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div className={half ? "" : ""}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13, color: "var(--ink)",
  border: "1px solid var(--rule)", backgroundColor: "var(--paper)", outline: "none",
};

/* ── Add Property slide-over ─────────────────────────────────── */
function AddPropertyDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: (h: HomeWithImages) => void }) {
  const [draft, setDraft] = useState<FormDraft>(DRAFT_DEFAULT);
  const [errors, setErrors] = useState<Partial<Record<keyof FormDraft, string>>>({});
  const [mapStatus, setMapStatus] = useState<MapStatus>("idle");
  const [mapError, setMapError]   = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormDraft>(key: K, val: FormDraft[K]) =>
    setDraft(d => ({ ...d, [key]: val }));

  function handleImages(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const src = e.target?.result as string;
        setDraft(d => ({
          ...d,
          images: [
            ...d.images,
            { src, label: d.images.length === 0 ? "Cover" : "" },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  function setImageLabel(i: number, label: string) {
    setDraft(d => ({
      ...d,
      images: d.images.map((img, j) => j === i ? { ...img, label } : img),
    }));
  }

  async function resolveMapUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    setMapStatus("loading");
    setMapError("");
    try {
      const res  = await fetch(`/api/expand-maps-url?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json() as { lat?: number; lng?: number; error?: string };
      if (data.lat && data.lng) {
        setDraft(d => ({ ...d, lat: data.lat!, lng: data.lng! }));
        setMapStatus("ok");
      } else {
        setMapError("Couldn't extract coordinates. Try the full Google Maps link (not a short link).");
        setMapStatus("error");
      }
    } catch {
      setMapError("Network error — check your connection.");
      setMapStatus("error");
    }
  }

  function toggleAmenity(a: string) {
    set("amenities", draft.amenities.includes(a)
      ? draft.amenities.filter(x => x !== a)
      : [...draft.amenities, a]);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormDraft, string>> = {};
    if (!draft.ownerName.trim())  e.ownerName  = "Required";
    if (!draft.ownerPhone.trim()) e.ownerPhone = "Required";
    if (!draft.locality.trim())   e.locality   = "Required";
    if (!draft.address.trim())    e.address    = "Required";
    if (!draft.priceAsking)       e.priceAsking = "Required";
    if (!draft.areaSqft)          e.areaSqft   = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const now = new Date().toISOString();
    const newHome: HomeWithImages = {
      id: `agent-${Date.now()}`,
      ownerName: draft.ownerName,
      ownerPhone: draft.ownerPhone,
      ownerEmail: draft.ownerEmail || undefined,
      locality: draft.locality,
      societyName: draft.societyName || undefined,
      address: draft.address,
      reraNumber: draft.reraNumber || undefined,
      mapUrl: draft.mapUrl || undefined,
      lat: draft.lat || undefined,
      lng: draft.lng || undefined,
      propertyType: draft.propertyType,
      bedrooms: draft.bedrooms,
      bathrooms: draft.bathrooms,
      areaSqft: draft.areaSqft,
      plotSqyd: draft.plotSqyd || undefined,
      priceAsking: draft.priceAsking,
      floor: draft.floor || undefined,
      totalFloors: draft.totalFloors || undefined,
      facing: draft.facing || undefined,
      ageYears: draft.ageYears,
      furnishing: draft.furnishing || undefined,
      parkingSlots: draft.parkingSlots,
      waterSource: draft.waterSource || undefined,
      ownerOccupied: draft.ownerOccupied,
      amenities: draft.amenities,
      highlights: draft.highlights || undefined,
      description: draft.description || undefined,
      status: "pending",
      listingStatus: draft.listingStatus,
      submittedVia: "agent",
      createdAt: now,
      updatedAt: now,
      images: draft.images.map(img => img.src),
    };
    onSubmit(newHome);
    onClose();
  }

  const err = (k: keyof FormDraft) => errors[k]
    ? <p style={{ fontSize: 11, color: "#B03030", marginTop: 3 }}>{errors[k]}</p>
    : null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(33,29,25,0.45)" }} onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-[520px] overflow-hidden"
        style={{ backgroundColor: "var(--paper)", borderLeft: "1px solid var(--rule)", boxShadow: "-16px 0 48px rgba(33,29,25,0.12)" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--rule)" }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Add Property</h2>
            <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 1 }}>Fill in all details — submitted as Agent</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[rgba(33,29,25,0.06)] transition-colors" style={{ color: "var(--ink-soft)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          <div className="flex flex-col gap-1">

            {/* ── Owner ── */}
            <Section title="Owner Details">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Owner Name *">
                  <input style={inputStyle} value={draft.ownerName} onChange={e => set("ownerName", e.target.value)} placeholder="Full name" />
                  {err("ownerName")}
                </Field>
                <Field label="Phone *">
                  <input style={inputStyle} value={draft.ownerPhone} onChange={e => set("ownerPhone", e.target.value)} placeholder="+91 98XXX XXXXX" />
                  {err("ownerPhone")}
                </Field>
              </div>
              <Field label="Email">
                <input style={inputStyle} type="email" value={draft.ownerEmail} onChange={e => set("ownerEmail", e.target.value)} placeholder="owner@email.com" />
              </Field>
            </Section>

            {/* ── Location ── */}
            <Section title="Location">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Locality *">
                  <input style={inputStyle} value={draft.locality} list="locality-list" onChange={e => set("locality", e.target.value)} placeholder="e.g. Gachibowli" />
                  <datalist id="locality-list">{LOCALITIES.map(l => <option key={l} value={l} />)}</datalist>
                  {err("locality")}
                </Field>
                <Field label="Society / Project">
                  <input style={inputStyle} value={draft.societyName} onChange={e => set("societyName", e.target.value)} placeholder="Society name" />
                </Field>
              </div>
              <Field label="Full Address *">
                <input style={inputStyle} value={draft.address} onChange={e => set("address", e.target.value)} placeholder="Plot/flat no., street, area…" />
                {err("address")}
              </Field>
              <Field label="RERA Number">
                <input style={inputStyle} value={draft.reraNumber} onChange={e => set("reraNumber", e.target.value)} placeholder="P02400XXXXXX" />
              </Field>
              <Field label="Google Maps Link">
                <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 5 }}>
                  Paste the &lsquo;Copy link&rsquo; or &lsquo;Share&rsquo; URL from Google Maps — the pin will appear automatically.
                </p>
                <div className="flex gap-2">
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={draft.mapUrl}
                    placeholder="https://maps.app.goo.gl/… or full Maps URL"
                    onChange={e => {
                      set("mapUrl", e.target.value);
                      setMapStatus("idle");
                      setMapError("");
                      setDraft(d => ({ ...d, mapUrl: e.target.value, lat: 0, lng: 0 }));
                    }}
                    onPaste={e => {
                      const pasted = e.clipboardData.getData("text");
                      setDraft(d => ({ ...d, mapUrl: pasted }));
                      setMapStatus("idle");
                      setMapError("");
                      setTimeout(() => resolveMapUrl(pasted), 0);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => resolveMapUrl(draft.mapUrl)}
                    disabled={mapStatus === "loading" || !draft.mapUrl.trim()}
                    className="px-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink-soft)", flexShrink: 0 }}
                  >
                    {mapStatus === "loading" ? (
                      <span className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--rule)", borderTopColor: "var(--ink)" }} />
                    ) : "Resolve"}
                  </button>
                </div>

                {/* Error */}
                {mapStatus === "error" && (
                  <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#FEF2F2", color: "#B03030", border: "1px solid #FECACA" }}>
                    {mapError}
                  </div>
                )}

                {/* Success — show OSM pin preview */}
                {mapStatus === "ok" && draft.lat !== 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <p style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                      📍 {draft.lat.toFixed(5)}, {draft.lng.toFixed(5)}
                    </p>
                    <div style={{ borderRadius: 10, overflow: "hidden", height: 150, border: "1px solid var(--rule)" }}>
                      <iframe
                        title="Location preview"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${draft.lng - 0.008},${draft.lat - 0.008},${draft.lng + 0.008},${draft.lat + 0.008}&layer=mapnik&marker=${draft.lat},${draft.lng}`}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </Field>
            </Section>

            {/* ── Property ── */}
            <Section title="Property Details">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Property Type">
                  <select style={{ ...inputStyle }} value={draft.propertyType} onChange={e => set("propertyType", e.target.value as PropertyType)}>
                    {PROP_TYPES.map(t => <option key={t} value={t}>{PROP_LABEL[t]}</option>)}
                  </select>
                </Field>
                <Field label="Listing Status">
                  <select style={{ ...inputStyle }} value={draft.listingStatus} onChange={e => set("listingStatus", e.target.value as ListingStatus)}>
                    {(["available","in_deal","reserved","sold","off_market"] as ListingStatus[]).map(s => (
                      <option key={s} value={s}>{LISTING_STATUS_META[s].label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Bedrooms">
                  <input style={inputStyle} type="number" min={0} max={10} value={draft.bedrooms} onChange={e => set("bedrooms", Number(e.target.value))} />
                </Field>
                <Field label="Bathrooms">
                  <input style={inputStyle} type="number" min={0} max={10} value={draft.bathrooms} onChange={e => set("bathrooms", Number(e.target.value))} />
                </Field>
                <Field label="Built-up Area (sqft) *">
                  <input style={inputStyle} type="number" min={0} value={draft.areaSqft || ""} onChange={e => set("areaSqft", Number(e.target.value))} placeholder="e.g. 2400" />
                  {err("areaSqft")}
                </Field>
                <Field label="Plot Area (sqyd)">
                  <input style={inputStyle} type="number" min={0} value={draft.plotSqyd || ""} onChange={e => set("plotSqyd", Number(e.target.value))} placeholder="Optional" />
                </Field>
                <Field label="Floor No.">
                  <input style={inputStyle} type="number" min={0} value={draft.floor || ""} onChange={e => set("floor", Number(e.target.value))} placeholder="e.g. 3" />
                </Field>
                <Field label="Total Floors">
                  <input style={inputStyle} type="number" min={0} value={draft.totalFloors || ""} onChange={e => set("totalFloors", Number(e.target.value))} placeholder="e.g. 12" />
                </Field>
              </div>
            </Section>

            {/* ── Pricing ── */}
            <Section title="Pricing">
              <Field label="Asking Price (₹) *">
                <input style={inputStyle} type="number" min={0} value={draft.priceAsking || ""} onChange={e => set("priceAsking", Number(e.target.value))} placeholder="e.g. 15000000" />
                {draft.priceAsking > 0 && (
                  <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 3 }}>{formatINR(draft.priceAsking)}</p>
                )}
                {err("priceAsking")}
              </Field>
            </Section>

            {/* ── Additional details ── */}
            <Section title="Additional Details">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Facing">
                  <select style={{ ...inputStyle }} value={draft.facing} onChange={e => set("facing", e.target.value)}>
                    <option value="">Select…</option>
                    {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Age (years)">
                  <input style={inputStyle} type="number" min={0} value={draft.ageYears} onChange={e => set("ageYears", Number(e.target.value))} placeholder="0 = new" />
                </Field>
                <Field label="Furnishing">
                  <select style={{ ...inputStyle }} value={draft.furnishing} onChange={e => set("furnishing", e.target.value as FormDraft["furnishing"])}>
                    <option value="">Select…</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi_furnished">Semi-furnished</option>
                    <option value="fully_furnished">Fully Furnished</option>
                  </select>
                </Field>
                <Field label="Parking Slots">
                  <input style={inputStyle} type="number" min={0} max={10} value={draft.parkingSlots} onChange={e => set("parkingSlots", Number(e.target.value))} />
                </Field>
                <Field label="Water Source">
                  <input style={inputStyle} value={draft.waterSource} onChange={e => set("waterSource", e.target.value)} placeholder="Municipal / Borewell…" />
                </Field>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={draft.ownerOccupied} onChange={e => set("ownerOccupied", e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: "var(--ink)" }} />
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Owner currently occupied</span>
              </label>
            </Section>

            {/* ── Amenities ── */}
            <Section title="Amenities">
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={draft.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "var(--ink)" }} />
                    <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{a}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* ── Description ── */}
            <Section title="Description">
              <Field label="Highlights">
                <input style={inputStyle} value={draft.highlights} onChange={e => set("highlights", e.target.value)} placeholder="Key selling points…" />
              </Field>
              <Field label="Full Description">
                <textarea
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                  value={draft.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe the property in detail…"
                />
              </Field>
            </Section>

            {/* ── Images ── */}
            <Section title="Images">
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleImages(e.target.files)} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-6 rounded-xl border-2 border-dashed transition-colors hover:border-[var(--ink-soft)]"
                style={{ borderColor: "var(--rule)", backgroundColor: "var(--paper-cool)" }}
              >
                <Upload size={20} style={{ color: "var(--ink-faint)" }} />
                <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>Click to upload photos</span>
                <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>JPG, PNG, WEBP — multiple allowed</span>
              </button>

              {draft.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {draft.images.map((img, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
                        <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => set("images", draft.images.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(33,29,25,0.7)" }}
                        >
                          <Trash2 size={10} style={{ color: "#fff" }} />
                        </button>
                      </div>
                      <select
                        value={img.label}
                        onChange={e => setImageLabel(i, e.target.value)}
                        className="w-full appearance-none rounded-md px-2 py-1 text-[11px] font-medium"
                        style={{
                          border: "1.5px solid var(--rule)",
                          backgroundColor: img.label ? "var(--ink)" : "var(--paper-cool)",
                          color: img.label ? "var(--paper)" : "var(--ink-faint)",
                          outline: "none",
                        }}
                      >
                        <option value="">Label…</option>
                        {ROOM_LABEL_OPTIONS.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </Section>

          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-4" style={{ borderTop: "1px solid var(--rule)", backgroundColor: "var(--paper)" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
            style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "transparent" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)", border: "none" }}
          >
            Submit Property
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
function PropertiesPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery]                     = useState("");
  const [listingFilter, setListingFilter]     = useState<string>(searchParams.get("listing") ?? "");
  const [localityFilter, setLocalityFilter]   = useState("");
  const [typeFilter, setTypeFilter]           = useState<string>("");
  const [homeStatusFilter, setHomeStatusFilter] = useState<string>("");
  const [showForm, setShowForm]               = useState(false);
  const [addedHomes, setAddedHomes]           = useState<HomeWithImages[]>([]);

  const allHomes = useMemo<HomeWithImages[]>(
    () => [...addedHomes, ...(HOMES as HomeWithImages[])],
    [addedHomes],
  );

  const counts = useMemo(() => ({
    total:      allHomes.length,
    available:  allHomes.filter(h => h.listingStatus === "available").length,
    in_deal:    allHomes.filter(h => h.listingStatus === "in_deal").length,
    reserved:   allHomes.filter(h => h.listingStatus === "reserved").length,
    sold:       allHomes.filter(h => h.listingStatus === "sold").length,
    off_market: allHomes.filter(h => h.listingStatus === "off_market").length,
  }), [allHomes]);

  const filtered = useMemo(() => {
    let list = [...allHomes];
    if (listingFilter)    list = list.filter(h => h.listingStatus === listingFilter);
    if (localityFilter)   list = list.filter(h => h.locality === localityFilter);
    if (typeFilter)       list = list.filter(h => h.propertyType === typeFilter);
    if (homeStatusFilter) list = list.filter(h => h.status === homeStatusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(h =>
        h.ownerName.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.locality.toLowerCase().includes(q) ||
        h.ownerPhone.includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allHomes, listingFilter, localityFilter, typeFilter, homeStatusFilter, query]);

  const hasFilters = !!(listingFilter || localityFilter || typeFilter || homeStatusFilter || query);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>Properties</h1>
          <p style={{ fontSize: 14, color: "var(--ink-faint)", marginTop: 2 }}>
            All homes submitted by owners or agents
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90 shrink-0"
          style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
        >
          <Plus size={14} /> Add Property
        </button>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <StatPill label="All" value={counts.total} meta={{ color: "var(--ink)", bg: "var(--paper-warm)" } as { color: string; bg: string }} active={listingFilter === ""} onClick={() => setListingFilter("")} />
        {(["available", "in_deal", "reserved", "sold", "off_market"] as ListingStatus[]).map(ls => (
          <StatPill key={ls} label={LISTING_STATUS_META[ls].label} value={counts[ls]} meta={LISTING_STATUS_META[ls]} active={listingFilter === ls} onClick={() => setListingFilter(listingFilter === ls ? "" : ls)} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-40 max-w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-faint)" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search owner, address…" className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg" style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper)", color: "var(--ink)" }} />
        </div>
        <FilterSelect value={localityFilter} onChange={setLocalityFilter}>
          <option value="">All localities</option>
          {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={setTypeFilter}>
          <option value="">All types</option>
          {PROP_TYPES.map(t => <option key={t} value={t}>{PROP_LABEL[t]}</option>)}
        </FilterSelect>
        <FilterSelect value={homeStatusFilter} onChange={setHomeStatusFilter}>
          <option value="">Claim status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="more_info_requested">Info Requested</option>
          <option value="rejected">Rejected</option>
        </FilterSelect>
        {hasFilters && (
          <button onClick={() => { setListingFilter(""); setLocalityFilter(""); setTypeFilter(""); setHomeStatusFilter(""); setQuery(""); }} className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--ink-faint)" }}>
            <Filter size={11} /> Clear
          </button>
        )}
        <span className="ml-auto text-sm" style={{ color: "var(--ink-faint)" }}>{filtered.length} of {allHomes.length}</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--ink-faint)" }}>
          <Building2 size={32} className="mx-auto mb-3" style={{ opacity: 0.3 }} />
          <p style={{ fontSize: 14 }}>No properties match the current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(home => <PropertyCard key={home.id} home={home} />)}
        </div>
      )}

      {/* Drawer */}
      {showForm && (
        <AddPropertyDrawer
          onClose={() => setShowForm(false)}
          onSubmit={home => setAddedHomes(prev => [home, ...prev])}
        />
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesPageInner />
    </Suspense>
  );
}
