"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ChevronLeft, ChevronRight, Check, User, Building2,
  Sparkles, MapPin, Info, ExternalLink,
} from "lucide-react";
import { PROP_LABEL, type PropertyType } from "@/lib/admin/types";
import { parseGoogleMapsUrl } from "@/components/admin/PropertyMapPreview";

const PropertyMapPreview = dynamic(
  () => import("@/components/admin/PropertyMapPreview"),
  { ssr: false }
);

// ── Constants ─────────────────────────────────────────────────────────────────

const LOCALITIES = [
  "Gachibowli","Kokapet","Madhapur","Kondapur","Banjara Hills",
  "Jubilee Hills","Narsingi","Nallagandla","Tellapur","Kukatpally","Sainikpuri",
];

const PROP_TYPES: PropertyType[] = [
  "apartment","villa","plot","penthouse","farmhouse","studio","row_house","duplex",
];

const FACING_OPTIONS = ["East","West","North","South","North-East","North-West","South-East","South-West"];

const FURNISHING_OPTIONS = [
  { value: "unfurnished" as const,    label: "Unfurnished" },
  { value: "semi_furnished" as const, label: "Semi-furnished" },
  { value: "fully_furnished" as const,label: "Fully furnished" },
];

const AMENITIES_OPTIONS = [
  "Swimming pool","Gym","Gated community","Power backup","Lift","Car parking",
  "Security","Clubhouse","Children play area","Garden","EV charging","Smart home",
  "Concierge","Intercom","Private pool","Private terrace","GHMC approved","Vastu",
  "Home theater","Servant room","Solar panels","Rainwater harvesting",
];

const WATER_OPTIONS = ["HMWS & SB (Corporation)", "Borewell", "Both", "Tanker supply"];

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1 — Owner
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  ownerEmail: string;
  submittedVia: "web" | "agent";
  relationToProperty: string;
  // Step 2 — Location
  locality: string;
  societyName: string;
  address: string;
  reraNumber: string;
  mapUrl: string;
  // Step 3 — Specs
  propertyType: PropertyType | "";
  bedrooms: string;
  bathrooms: string;
  areaSqft: string;
  plotSqyd: string;
  priceAsking: string;
  floor: string;
  totalFloors: string;
  facing: string;
  ageYears: string;
  furnishing: "unfurnished" | "semi_furnished" | "fully_furnished" | "";
  parkingSlots: string;
  waterSource: string;
  ownerOccupied: boolean | null;
  isTenanted: boolean | null;
  // Step 4 — Features
  amenities: string[];
  highlights: string;
  description: string;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  const STEPS = [
    { n: 1, label: "Owner" },
    { n: 2, label: "Location" },
    { n: 3, label: "Specs" },
    { n: 4, label: "Features" },
  ];
  return (
    <div className="flex items-center gap-1 mb-8 flex-wrap">
      {STEPS.map(({ n, label }, i) => {
        const done = step > n;
        const active = step === n;
        return (
          <div key={n} className="flex items-center gap-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: done ? "#126940" : active ? "var(--ink)" : "var(--paper-warm)",
                color: done || active ? "var(--paper)" : "var(--ink-faint)",
                border: active || done ? "none" : "1px solid var(--rule)",
                flexShrink: 0,
              }}
            >
              {done ? <Check size={11} /> : n}
            </div>
            <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : "var(--ink-faint)" }}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="w-4 h-px mx-1" style={{ backgroundColor: done ? "#126940" : "var(--rule)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
      style={{
        backgroundColor: selected ? "var(--ink)" : "var(--paper-warm)",
        color: selected ? "var(--paper)" : "var(--ink-soft)",
        border: selected ? "none" : "1px solid var(--rule)",
      }}
    >
      {label}
    </button>
  );
}

function Field({ label, required, hint, children, error }: {
  label: string; required?: boolean; hint?: string;
  children: React.ReactNode; error?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}>
        {label} {required && <span style={{ color: "#B03030" }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 5 }}>{hint}</p>}
      {children}
      {error && <p className="mt-1" style={{ fontSize: 12, color: "#B03030" }}>{error}</p>}
    </div>
  );
}

function TInput({
  value, onChange, placeholder, type = "text",
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm"
      style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
    />
  );
}

function YesNoToggle({
  value, onChange, labels = ["Yes", "No"],
}: { value: boolean | null; onChange: (v: boolean) => void; labels?: [string, string] }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
        style={{
          backgroundColor: value === true ? "var(--ink)" : "var(--paper-warm)",
          color: value === true ? "var(--paper)" : "var(--ink-soft)",
          border: value === true ? "none" : "1px solid var(--rule)",
        }}
      >{labels[0]}</button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
        style={{
          backgroundColor: value === false ? "var(--ink)" : "var(--paper-warm)",
          color: value === false ? "var(--paper)" : "var(--ink-soft)",
          border: value === false ? "none" : "1px solid var(--rule)",
        }}
      >{labels[1]}</button>
    </div>
  );
}

function fmtINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2).replace(/\.?0+$/, "")}Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    ownerName: "", ownerPhone: "", ownerWhatsapp: "", ownerEmail: "",
    submittedVia: "agent", relationToProperty: "",
    locality: "", societyName: "", address: "", reraNumber: "", mapUrl: "",
    propertyType: "", bedrooms: "", bathrooms: "",
    areaSqft: "", plotSqyd: "", priceAsking: "",
    floor: "", totalFloors: "", facing: "",
    ageYears: "", furnishing: "", parkingSlots: "",
    waterSource: "", ownerOccupied: null, isTenanted: null,
    amenities: [], highlights: "", description: "",
  });

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  function toggleAmenity(item: string) {
    set("amenities", form.amenities.includes(item)
      ? form.amenities.filter(x => x !== item)
      : [...form.amenities, item]);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.ownerName.trim()) e.ownerName = "Required";
      if (!form.ownerPhone.trim()) e.ownerPhone = "Required";
    }
    if (step === 2) {
      if (!form.locality) e.locality = "Select a locality";
      if (!form.address.trim()) e.address = "Enter the property address";
    }
    if (step === 3) {
      if (!form.propertyType) e.propertyType = "Select a type";
      if (!form.areaSqft) e.areaSqft = "Required";
      if (!form.priceAsking) e.priceAsking = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate()) {
      if (step < 4) setStep(s => (s + 1) as Step);
      else setSubmitted(true);
    }
  }

  const coords = parseGoogleMapsUrl(form.mapUrl);

  // ── Success ─────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D4F0E3" }}>
            <Check size={28} style={{ color: "#126940" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Property submitted!</h2>
          <p style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 8 }}>
            <strong style={{ color: "var(--ink)" }}>{form.societyName || form.address || form.locality}</strong> has been sent for admin review.
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 24 }}>
            It will go live once the manager approves it. Usually within 24–48 hours.
          </p>
          {coords && (
            <div
              className="rounded-xl overflow-hidden mb-5"
              style={{ height: 160, border: "1px solid var(--rule)" }}
            >
              <PropertyMapPreview mapUrl={form.mapUrl} label={form.societyName || form.locality} height={160} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Link
              href="/agent/properties"
              className="block w-full py-2.5 rounded-xl text-sm font-medium text-center"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              View My Properties
            </Link>
            <button
              onClick={() => {
                setForm({
                  ownerName: "", ownerPhone: "", ownerWhatsapp: "", ownerEmail: "",
                  submittedVia: "agent", relationToProperty: "",
                  locality: "", societyName: "", address: "", reraNumber: "", mapUrl: "",
                  propertyType: "", bedrooms: "", bathrooms: "",
                  areaSqft: "", plotSqyd: "", priceAsking: "",
                  floor: "", totalFloors: "", facing: "",
                  ageYears: "", furnishing: "", parkingSlots: "",
                  waterSource: "", ownerOccupied: null, isTenanted: null,
                  amenities: [], highlights: "", description: "",
                });
                setStep(1);
                setSubmitted(false);
                setErrors({});
              }}
              className="w-full py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)", border: "1px solid var(--rule)" }}
            >
              Add Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Link href="/agent/properties" className="flex items-center gap-1 mb-6 text-sm hover:opacity-80" style={{ color: "var(--ink-faint)" }}>
        <ChevronLeft size={14} /> My Properties
      </Link>

      <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Add Property</h1>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 24 }}>Complete all details for the best match results</p>

        <ProgressBar step={step} />

        {/* ── Step 1: Owner ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <User size={15} style={{ color: "var(--ink-faint)" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Owner details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Owner full name" required error={errors.ownerName}>
                <TInput value={form.ownerName} onChange={v => set("ownerName", v)} placeholder="e.g. Shekhar Goud" />
              </Field>
              <Field label="Phone number" required error={errors.ownerPhone}>
                <TInput value={form.ownerPhone} onChange={v => set("ownerPhone", v)} placeholder="+91 98000 00000" type="tel" />
              </Field>
              <Field label="WhatsApp (if different)">
                <TInput value={form.ownerWhatsapp} onChange={v => set("ownerWhatsapp", v)} placeholder="+91 98000 00000" type="tel" />
              </Field>
              <Field label="Email address">
                <TInput value={form.ownerEmail} onChange={v => set("ownerEmail", v)} placeholder="owner@gmail.com" type="email" />
              </Field>
            </div>

            <Field label="Owner's relation to property">
              <div className="flex flex-wrap gap-2 mt-1">
                {["Self-occupied owner","NRI owner","Investor / Landlord","Legal heir","Power of attorney"].map(r => (
                  <Chip key={r} label={r} selected={form.relationToProperty === r} onClick={() => set("relationToProperty", form.relationToProperty === r ? "" : r)} />
                ))}
              </div>
            </Field>

            <Field label="How was this submitted?">
              <div className="flex gap-2">
                {[
                  { value: "agent" as const, label: "Agent submitted (you)" },
                  { value: "web" as const,   label: "Owner submitted online" },
                ].map(({ value, label }) => (
                  <Chip key={value} label={label} selected={form.submittedVia === value} onClick={() => set("submittedVia", value)} />
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── Step 2: Location ────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={15} style={{ color: "var(--ink-faint)" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Location</h2>
            </div>

            <Field label="Locality / Area" required error={errors.locality}>
              <div className="flex flex-wrap gap-2 mt-1">
                {LOCALITIES.map(l => (
                  <Chip key={l} label={l} selected={form.locality === l} onClick={() => set("locality", l)} />
                ))}
              </div>
            </Field>

            <Field label="Society / Project name">
              <TInput value={form.societyName} onChange={v => set("societyName", v)} placeholder="e.g. Kokapet Rise, Prestige Gachibowli" />
            </Field>

            <Field label="Full address" required error={errors.address}>
              <TInput value={form.address} onChange={v => set("address", v)} placeholder="e.g. Block B, Flat 704, Kokapet Rise" />
            </Field>

            <Field label="RERA registration number" hint="Check RERA Telangana portal if unsure">
              <TInput value={form.reraNumber} onChange={v => set("reraNumber", v)} placeholder="P02400000123" />
            </Field>

            {/* Google Maps link */}
            <Field
              label="Google Maps link"
              hint="Paste the 'Copy link' URL from Google Maps — the pin will appear below automatically"
            >
              <div className="relative">
                <TInput
                  value={form.mapUrl}
                  onChange={v => set("mapUrl", v)}
                  placeholder="https://maps.google.com/…"
                />
                {form.mapUrl && coords && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#126940" }} />
                    <span style={{ fontSize: 11, color: "#126940", fontWeight: 600 }}>Found</span>
                  </div>
                )}
                {form.mapUrl && !coords && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#B05B15" }} />
                    <span style={{ fontSize: 11, color: "#B05B15", fontWeight: 600 }}>Can&apos;t parse</span>
                  </div>
                )}
              </div>

              {/* How-to hint */}
              <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--paper-cool)" }}>
                <Info size={12} style={{ color: "var(--ink-faint)", marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                  Open Google Maps → find the property → tap <strong>Share</strong> → <strong>Copy link</strong>.
                  Works with links containing <code>@lat,lng</code> or <code>?q=lat,lng</code>.
                  Short links (goo.gl) don&apos;t work — use the full link.
                </p>
              </div>

              {/* Live map preview */}
              {form.mapUrl && coords && (
                <div className="mt-3">
                  <PropertyMapPreview
                    mapUrl={form.mapUrl}
                    label={form.societyName || form.locality || "Property"}
                    height={240}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontSize: 11, color: "#126940", fontWeight: 500 }}>
                      ✓ Location pinned · {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
                    </span>
                    <a href={form.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-faint)" }}>
                      Open Maps <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              )}
            </Field>
          </div>
        )}

        {/* ── Step 3: Property Specs ──────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={15} style={{ color: "var(--ink-faint)" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Property specifications</h2>
            </div>

            <Field label="Property type" required error={errors.propertyType}>
              <div className="flex flex-wrap gap-2 mt-1">
                {PROP_TYPES.map(t => (
                  <Chip key={t} label={PROP_LABEL[t]} selected={form.propertyType === t} onClick={() => set("propertyType", t)} />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Bedrooms">
                <TInput value={form.bedrooms} onChange={v => set("bedrooms", v)} placeholder="e.g. 3" type="number" />
              </Field>
              <Field label="Bathrooms">
                <TInput value={form.bathrooms} onChange={v => set("bathrooms", v)} placeholder="e.g. 2" type="number" />
              </Field>
              <Field label="Parking slots">
                <TInput value={form.parkingSlots} onChange={v => set("parkingSlots", v)} placeholder="e.g. 2" type="number" />
              </Field>
              <Field label="Age (years)" hint="0 = new">
                <TInput value={form.ageYears} onChange={v => set("ageYears", v)} placeholder="e.g. 3" type="number" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Built-up area (sqft)" required error={errors.areaSqft}>
                <TInput value={form.areaSqft} onChange={v => set("areaSqft", v)} placeholder="e.g. 1820" type="number" />
              </Field>
              <Field label="Plot size (sq yd)" hint="For villas / plots only">
                <TInput value={form.plotSqyd} onChange={v => set("plotSqyd", v)} placeholder="e.g. 200" type="number" />
              </Field>
            </div>

            <Field label="Asking price (₹)" required error={errors.priceAsking}>
              <TInput value={form.priceAsking} onChange={v => set("priceAsking", v)} placeholder="e.g. 14500000" type="number" />
              {form.priceAsking && Number(form.priceAsking) > 0 && (
                <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 3 }}>
                  {fmtINR(Number(form.priceAsking))}
                  {form.areaSqft && Number(form.areaSqft) > 0 && (
                    <span> · ₹{Math.round(Number(form.priceAsking) / Number(form.areaSqft)).toLocaleString("en-IN")}/sqft</span>
                  )}
                </p>
              )}
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Floor number">
                <TInput value={form.floor} onChange={v => set("floor", v)} placeholder="e.g. 7" type="number" />
              </Field>
              <Field label="Total floors">
                <TInput value={form.totalFloors} onChange={v => set("totalFloors", v)} placeholder="e.g. 14" type="number" />
              </Field>
            </div>

            <Field label="Facing direction">
              <div className="flex flex-wrap gap-2 mt-1">
                {FACING_OPTIONS.map(f => (
                  <Chip key={f} label={f} selected={form.facing === f} onClick={() => set("facing", form.facing === f ? "" : f)} />
                ))}
              </div>
            </Field>

            <Field label="Furnishing">
              <div className="flex flex-wrap gap-2 mt-1">
                {FURNISHING_OPTIONS.map(o => (
                  <Chip key={o.value} label={o.label} selected={form.furnishing === o.value} onClick={() => set("furnishing", form.furnishing === o.value ? "" : o.value)} />
                ))}
              </div>
            </Field>

            <Field label="Water source">
              <div className="flex flex-wrap gap-2 mt-1">
                {WATER_OPTIONS.map(w => (
                  <Chip key={w} label={w} selected={form.waterSource === w} onClick={() => set("waterSource", form.waterSource === w ? "" : w)} />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Is owner currently living here?">
                <div className="mt-1">
                  <YesNoToggle value={form.ownerOccupied} onChange={v => set("ownerOccupied", v)} />
                </div>
              </Field>
              <Field label="Is property currently tenanted?">
                <div className="mt-1">
                  <YesNoToggle value={form.isTenanted} onChange={v => set("isTenanted", v)} />
                </div>
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 4: Features & Summary ──────────────────────────── */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} style={{ color: "var(--ink-faint)" }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Amenities &amp; description</h2>
            </div>

            <Field label="Amenities available">
              <div className="flex flex-wrap gap-2 mt-1">
                {AMENITIES_OPTIONS.map(a => (
                  <Chip key={a} label={a} selected={form.amenities.includes(a)} onClick={() => toggleAmenity(a)} />
                ))}
              </div>
            </Field>

            <Field label="Key highlights" hint="2–3 short selling points (e.g. 'East facing high floor · OC in hand · Corner unit')">
              <TInput value={form.highlights} onChange={v => set("highlights", v)} placeholder="e.g. East facing · OC in hand · Corner unit" />
            </Field>

            <Field label="Full description">
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Describe the property in detail — views, condition, neighbourhood, why the owner is selling, any unique features…"
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
            </Field>

            {/* Summary card */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Summary
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  ["Owner",    `${form.ownerName} · ${form.ownerPhone}`],
                  ["Locality", form.locality || "—"],
                  ["Society",  form.societyName || "—"],
                  ["Type",     form.propertyType ? `${PROP_LABEL[form.propertyType]}${form.bedrooms ? ` · ${form.bedrooms}BHK` : ""}` : "—"],
                  ["Area",     form.areaSqft ? `${Number(form.areaSqft).toLocaleString()} sqft` : "—"],
                  ["Price",    form.priceAsking ? fmtINR(Number(form.priceAsking)) : "—"],
                  ["Facing",   form.facing || "—"],
                  ["Map",      coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : "—"],
                  ["RERA",     form.reraNumber || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <span style={{ fontSize: 11, color: "var(--ink-faint)", minWidth: 58 }}>{k}</span>
                    <span style={{ fontSize: 12, color: "var(--ink)", fontWeight: 500 }} className="truncate">{v}</span>
                  </div>
                ))}
              </div>

              {/* Map mini-preview in summary */}
              {coords && (
                <div className="mt-3 rounded-xl overflow-hidden" style={{ height: 140, border: "1px solid var(--rule)" }}>
                  <PropertyMapPreview mapUrl={form.mapUrl} label={form.societyName || form.locality} height={140} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-8 pt-4" style={{ borderTop: "1px solid var(--rule)" }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(s => (s - 1) as Step)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "var(--paper-warm)" }}
            >
              <ChevronLeft size={14} /> Back
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{step} / 4</span>
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              {step === 4 ? <><Check size={14} /> Submit for Review</> : <>Next <ChevronRight size={14} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
