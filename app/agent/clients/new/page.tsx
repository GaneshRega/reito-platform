"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Check, User, MapPin,
  IndianRupee, Heart, Clipboard,
} from "lucide-react";
import { PROP_LABEL, SOURCE_LABEL, type PropertyType, type ClientSource } from "@/lib/admin/types";
import { TEAM } from "@/lib/admin/data";
import { useAuth } from "@/lib/admin/auth";

/* ─── Constants ──────────────────────────────────────────── */

const LOCALITIES = [
  "Gachibowli", "Kokapet", "Madhapur", "Kondapur", "Banjara Hills",
  "Jubilee Hills", "Narsingi", "Nallagandla", "Tellapur", "Kukatpally",
  "Sainikpuri", "Kollur", "Osman Nagar", "Rajendra Nagar", "Tukkuguda",
];

const PROP_TYPES: PropertyType[] = ["apartment", "villa", "plot", "penthouse", "farmhouse", "studio", "row_house", "duplex"];
const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

const PURPOSE_OPTIONS = ["End Use", "Investment", "Rental Income", "NRI Investment", "Future Family Use", "Retirement Home"];
const STAGE_OPTIONS = ["Pre-Launch", "New Launch", "Under Construction", "Near Possession", "Ready to Move In", "Resale Villa"];
const TIMELINE_MAP: Record<string, number> = {
  "Immediate": 1, "Within 6 Months": 6, "Within 1 Year": 12, "Flexible": 24,
};
const INVEST_PREF_OPTIONS = ["High Appreciation Potential", "Rental Income Focus", "Luxury End Use", "Long-Term Investment", "Short-Term Flip", "Safe Investment"];
const VASTU_OPTIONS = ["Mandatory", "Preferred", "Not Important"];
const FACING_OPTIONS = ["East", "West", "North", "North East", "South", "Others"];
const PAYMENT_OPTIONS = ["Loan", "Self Funded", "Mixed"];
const LIFESTYLE_OPTIONS = ["Private Garden", "Home Theater", "Lift Provision", "Swimming Pool", "Home Office", "Servant Room", "Terrace Lounge", "Solar Setup", "EV Charging"];
const PARKING_SLOT_OPTIONS = ["1", "2", "3", "Visitor Parking"];
const PARKING_TYPE_OPTIONS = ["Covered", "Semi Covered"];
const LOCATION_PREF_OPTIONS = ["Kollur", "Tellapur", "Osman Nagar", "Narsingi", "Kokapet", "Rajendra Nagar", "Tukkuguda", "Others"];
const BUY_FACTOR_OPTIONS = ["Price Appreciation", "Builder Reputation", "Luxury Amenities", "Connectivity", "School Access", "Privacy", "Clubhouse", "Construction Quality", "Rental Potential", "Resale Potential"];
const PAIN_POINT_OPTIONS = ["Apartment Lifestyle Frustration", "Need More Privacy", "Luxury Lifestyle Upgrade", "Investment Diversification"];
const SITE_VISIT_OPTIONS = ["Weekdays", "Weekends"];
const VISIT_MODE_OPTIONS = ["Day Visit", "Weekend Viewing", "Family Visit"];
const FAMILY_APPROVAL_OPTIONS = ["Self Decision Maker", "Spouse Approval", "Parents Approval", "Joint Family Decision"];
const ASSISTANCE_OPTIONS = ["Loan Service", "Legal Service", "Interior Service", "Move-in Service"];
const AFTER_SALE_OPTIONS = ["Full Concierge Service", "Minimal Support", "Self Managed Client"];
const COMM_MODE_OPTIONS = ["Call", "WhatsApp", "Email"];
const PERKS_OPTIONS = [
  "Gated community", "Swimming pool", "Gym", "Vastu compliant", "Power backup",
  "EV charging", "Smart home", "Lift", "Car parking", "Security", "Clubhouse",
  "Garden", "Children play area", "School nearby", "Intercom",
];

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Step 1 — Contact & Basic Info
  date: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  occupation: string;
  company: string;
  currentCity: string;
  officeLocation: string;
  rm: string;
  commMode: string[];
  familyInfo: string;

  // Step 2 — Requirements
  purpose: string[];
  stage: string[];
  timelineLabel: string;
  propertyTypes: PropertyType[];
  bedrooms: number[];
  localities: string[];
  areaSqftMin: string;
  areaSqftMax: string;
  villaSize: string;
  plotSize: string;
  investPref: string[];

  // Step 3 — Financial
  budgetMin: string;
  budgetMax: string;
  downPayment: string;
  emiComfort: string;
  paymentMode: string;
  loanRequired: string;
  loanBank: string;
  loanAmount: string;
  vastuRequired: string;
  facing: string[];

  // Step 4 — Lifestyle & Preferences
  lifestyle: string[];
  perks: string[];
  parkingSlots: string[];
  parkingType: string;
  locationPref: string[];
  buyFactors: string[];
  painPoints: string[];
  travelOffice: string;
  maxTravel: string;
  orrTravel: string;
  airportImportance: string;

  // Step 5 — Context & Follow-up
  callTime: string;
  callDay: string;
  siteVisitAvail: string[];
  visitMode: string[];
  projectInterest: string;
  villaTypePref: string;
  familyApproval: string[];
  assistance: string[];
  afterSale: string;
  visitedProjects: string;
  source: ClientSource | "";
  personalNote: string;
  assignedToId: string;
}

const EMPTY_FORM: FormData = {
  date: "", fullName: "", phone: "", whatsapp: "", email: "",
  occupation: "", company: "", currentCity: "", officeLocation: "",
  rm: "", commMode: [], familyInfo: "",
  purpose: [], stage: [], timelineLabel: "", propertyTypes: [], bedrooms: [],
  localities: [], areaSqftMin: "", areaSqftMax: "", villaSize: "", plotSize: "", investPref: [],
  budgetMin: "", budgetMax: "", downPayment: "", emiComfort: "",
  paymentMode: "", loanRequired: "", loanBank: "", loanAmount: "",
  vastuRequired: "", facing: [],
  lifestyle: [], perks: [], parkingSlots: [], parkingType: "",
  locationPref: [], buyFactors: [], painPoints: [],
  travelOffice: "", maxTravel: "", orrTravel: "", airportImportance: "",
  callTime: "", callDay: "", siteVisitAvail: [], visitMode: [],
  projectInterest: "", villaTypePref: "", familyApproval: [],
  assistance: [], afterSale: "", visitedProjects: "",
  source: "", personalNote: "", assignedToId: "",
};

const STEP_META: { label: string; icon: React.ReactNode }[] = [
  { label: "Contact", icon: <User size={13} /> },
  { label: "Requirements", icon: <MapPin size={13} /> },
  { label: "Financial", icon: <IndianRupee size={13} /> },
  { label: "Lifestyle", icon: <Heart size={13} /> },
  { label: "Context", icon: <Clipboard size={13} /> },
];

/* ─── Reusable UI ────────────────────────────────────────── */

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-1">
        {STEP_META.map((meta, i) => {
          const s = (i + 1) as Step;
          const done = step > s;
          const active = step === s;
          return (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: done ? "#126940" : active ? "var(--ink)" : "var(--paper-warm)",
                  color: done || active ? "var(--paper)" : "var(--ink-faint)",
                  border: done || active ? "none" : "1px solid var(--rule)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {done ? <Check size={11} /> : meta.icon}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : "var(--ink-faint)", whiteSpace: "nowrap" }}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2" style={{ height: 3, backgroundColor: "var(--rule)", borderRadius: 99 }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{ backgroundColor: "var(--ink)", width: `${((step - 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <p className="mb-4" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
      {label}
    </p>
  );
}

function Field({ label, required, children, error, hint }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}>
        {label} {required && <span style={{ color: "#B03030" }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 6 }}>{hint}</p>}
      {children}
      {error && <p className="mt-1" style={{ fontSize: 12, color: "#B03030" }}>{error}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm"
      style={{
        border: "1px solid var(--rule)",
        backgroundColor: disabled ? "var(--paper-warm)" : "var(--paper-cool)",
        color: "var(--ink)",
        opacity: disabled ? 0.6 : 1,
      }}
    />
  );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
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

function SingleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return <Chip label={label} selected={selected} onClick={onClick} />;
}

function ChipGroup({
  options, selected, onToggle, single,
}: { options: string[]; selected: string[]; onToggle: (v: string) => void; single?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        single
          ? <SingleChip key={opt} label={opt} selected={selected.includes(opt)} onClick={() => onToggle(opt)} />
          : <Chip key={opt} label={opt} selected={selected.includes(opt)} onClick={() => onToggle(opt)} />
      ))}
    </div>
  );
}

function formatINR(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

function Rule() {
  return <div style={{ borderTop: "1px solid var(--rule)", margin: "20px 0" }} />;
}

const activeAgents = TEAM.filter(t => t.status === "active" && (t.role === "agent" || t.role === "manager"));

/* ─── Page ───────────────────────────────────────────────── */

export default function AddClientPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    ...EMPTY_FORM,
    rm: user?.fullName ?? "",
    assignedToId: user?.id ?? activeAgents[0]?.id ?? "",
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  function toggleArr(arr: string[], item: string, key: keyof FormData) {
    const next = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    set(key, next as FormData[typeof key]);
  }

  function toggleSingle(current: string[], item: string, key: keyof FormData) {
    set(key, (current.includes(item) ? [] : [item]) as FormData[typeof key]);
  }

  function toggleNumArr(arr: number[], item: number, key: keyof FormData) {
    const next = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    set(key, next as FormData[typeof key]);
  }

  function togglePropType(t: PropertyType) {
    const next = form.propertyTypes.includes(t)
      ? form.propertyTypes.filter(x => x !== t)
      : [...form.propertyTypes, t];
    set("propertyTypes", next);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = "Name is required";
      if (!form.phone.trim()) errs.phone = "Phone number is required";
    }
    if (step === 2) {
      if (form.localities.length === 0) errs.localities = "Select at least one locality";
      if (form.propertyTypes.length === 0) errs.propertyTypes = "Select at least one type";
      if (form.bedrooms.length === 0) errs.bedrooms = "Select at least one bedroom option";
    }
    if (step === 3) {
      if (!form.budgetMin || !form.budgetMax) errs.budget = "Enter budget range";
    }
    if (step === 5) {
      if (!form.source) errs.source = "Select how you found this client";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validate()) {
      if (step < 5) setStep(s => (s + 1) as Step);
      else setSubmitted(true);
    }
  }

  function reset() {
    setForm({ ...EMPTY_FORM, rm: user?.fullName ?? "", assignedToId: user?.id ?? activeAgents[0]?.id ?? "" });
    setStep(1);
    setSubmitted(false);
    setErrors({});
  }

  /* ── Success screen ─────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D4F0E3" }}>
            <Check size={28} style={{ color: "#126940" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Client CIF saved!</h2>
          <p style={{ fontSize: 14, color: "var(--ink-faint)", marginBottom: 24 }}>
            <strong style={{ color: "var(--ink)" }}>{form.fullName}</strong> has been added to your client list.
            The manager will be notified for verification.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/agent/clients"
              className="block w-full py-2.5 rounded-xl text-sm font-medium text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
            >
              View My Clients
            </Link>
            <button
              onClick={reset}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--paper-warm)", color: "var(--ink-soft)", border: "1px solid var(--rule)" }}
            >
              Add Another Client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <Link
        href="/agent/clients"
        className="flex items-center gap-1 mb-6 text-sm hover:opacity-80 transition-opacity"
        style={{ color: "var(--ink-faint)" }}
      >
        <ChevronLeft size={14} />
        My Clients
      </Link>

      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: "var(--paper)", border: "1px solid var(--rule)", boxShadow: "var(--lift)" }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Customer Evaluation Form</h1>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 24 }}>Complete CIF — 5 steps</p>

        <ProgressBar step={step} />

        {/* ══ Step 1: Contact & Basic Info ══════════════════════ */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <SectionTitle label="Client Basic Information" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <Input type="date" value={form.date} onChange={v => set("date", v)} />
              </Field>
              <Field label="Full Name" required error={errors.fullName}>
                <Input value={form.fullName} onChange={v => set("fullName", v)} placeholder="e.g. Ravi Kumar Reddy" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Mobile" required error={errors.phone}>
                <Input type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="+91 98765 43210" />
              </Field>
              <Field label="WhatsApp">
                <Input type="tel" value={form.whatsapp} onChange={v => set("whatsapp", v)} placeholder="If different" />
              </Field>
            </div>

            <Field label="Email">
              <Input type="email" value={form.email} onChange={v => set("email", v)} placeholder="email@example.com" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Occupation">
                <Input value={form.occupation} onChange={v => set("occupation", v)} placeholder="e.g. Business Owner" />
              </Field>
              <Field label="Company">
                <Input value={form.company} onChange={v => set("company", v)} placeholder="Company / Organisation" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Current City / Area">
                <Input value={form.currentCity} onChange={v => set("currentCity", v)} placeholder="e.g. Kondapur" />
              </Field>
              <Field label="Office Location">
                <Input value={form.officeLocation} onChange={v => set("officeLocation", v)} placeholder="Office area / landmark" />
              </Field>
            </div>

            <Field label="Relationship Manager">
              <Input value={form.rm} onChange={v => set("rm", v)} placeholder="RM name" />
            </Field>

            <Field label="Preferred Communication">
              <div className="flex flex-wrap gap-2 mt-1">
                {COMM_MODE_OPTIONS.map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.commMode.includes(opt)}
                    onClick={() => toggleArr(form.commMode, opt, "commMode")}
                  />
                ))}
              </div>
            </Field>

            <Field label="Family Information" hint="Spouse, children, dependants, joint-family notes">
              <textarea
                value={form.familyInfo}
                onChange={e => set("familyInfo", e.target.value)}
                placeholder="e.g. Married with 2 kids, parents staying together…"
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
            </Field>
          </div>
        )}

        {/* ══ Step 2: Requirements ══════════════════════════════ */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <SectionTitle label="Property Requirements" />

            <Field label="Purpose of Purchase">
              <div className="flex flex-wrap gap-2 mt-1">
                {PURPOSE_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.purpose.includes(opt)} onClick={() => toggleArr(form.purpose, opt, "purpose")} />
                ))}
              </div>
            </Field>

            <Rule />

            <Field label="Property Stage Preference">
              <div className="flex flex-wrap gap-2 mt-1">
                {STAGE_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.stage.includes(opt)} onClick={() => toggleArr(form.stage, opt, "stage")} />
                ))}
              </div>
            </Field>

            <Field label="Possession Timeline">
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.keys(TIMELINE_MAP).map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.timelineLabel === opt}
                    onClick={() => set("timelineLabel", form.timelineLabel === opt ? "" : opt)}
                  />
                ))}
              </div>
            </Field>

            <Rule />

            <Field label="Property Type" required error={errors.propertyTypes}>
              <div className="flex flex-wrap gap-2 mt-1">
                {PROP_TYPES.map(t => (
                  <Chip key={t} label={PROP_LABEL[t]} selected={form.propertyTypes.includes(t)} onClick={() => togglePropType(t)} />
                ))}
              </div>
            </Field>

            <Field label="Preferred Configuration" required error={errors.bedrooms}>
              <div className="flex flex-wrap gap-2 mt-1">
                {BEDROOM_OPTIONS.map(b => (
                  <Chip
                    key={b}
                    label={`${b} BHK`}
                    selected={form.bedrooms.includes(b)}
                    onClick={() => toggleNumArr(form.bedrooms, b, "bedrooms")}
                  />
                ))}
              </div>
            </Field>

            <Field label="Preferred Localities" required error={errors.localities}>
              <div className="flex flex-wrap gap-2 mt-1">
                {LOCALITIES.map(l => (
                  <Chip key={l} label={l} selected={form.localities.includes(l)} onClick={() => toggleArr(form.localities, l, "localities")} />
                ))}
              </div>
            </Field>

            <Rule />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Area Min (sq ft)">
                <Input type="number" value={form.areaSqftMin} onChange={v => set("areaSqftMin", v)} placeholder="e.g. 2000" />
              </Field>
              <Field label="Area Max (sq ft)">
                <Input type="number" value={form.areaSqftMax} onChange={v => set("areaSqftMax", v)} placeholder="e.g. 4000" />
              </Field>
              <Field label="Preferred Villa Size">
                <Input value={form.villaSize} onChange={v => set("villaSize", v)} placeholder="e.g. 3000–4000 sq ft" />
              </Field>
              <Field label="Preferred Plot Size">
                <Input value={form.plotSize} onChange={v => set("plotSize", v)} placeholder="e.g. 200–300 sq yd" />
              </Field>
            </div>

            <Rule />

            <Field label="Investment Preference">
              <div className="flex flex-wrap gap-2 mt-1">
                {INVEST_PREF_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.investPref.includes(opt)} onClick={() => toggleArr(form.investPref, opt, "investPref")} />
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ══ Step 3: Financial Profile ══════════════════════════ */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <SectionTitle label="Budget Analysis" />

            <Field label="Budget Range" required error={errors.budget}>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input type="number" value={form.budgetMin} onChange={v => set("budgetMin", v)} placeholder="Min (₹)" />
                  {form.budgetMin && <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>{formatINR(Number(form.budgetMin))}</p>}
                </div>
                <div>
                  <Input type="number" value={form.budgetMax} onChange={v => set("budgetMax", v)} placeholder="Max (₹)" />
                  {form.budgetMax && <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>{formatINR(Number(form.budgetMax))}</p>}
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Expected Down Payment">
                <Input type="number" value={form.downPayment} onChange={v => set("downPayment", v)} placeholder="₹ amount" />
              </Field>
              <Field label="Monthly EMI Comfort">
                <Input type="number" value={form.emiComfort} onChange={v => set("emiComfort", v)} placeholder="₹ / month" />
              </Field>
            </div>

            <Field label="Payment Mode">
              <div className="flex flex-wrap gap-2 mt-1">
                {PAYMENT_OPTIONS.map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.paymentMode === opt}
                    onClick={() => set("paymentMode", form.paymentMode === opt ? "" : opt)}
                  />
                ))}
              </div>
            </Field>

            <Field label="Loan Required?">
              <div className="flex gap-2 mt-1">
                {["Yes", "No"].map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.loanRequired === opt}
                    onClick={() => set("loanRequired", form.loanRequired === opt ? "" : opt)}
                  />
                ))}
              </div>
            </Field>

            {form.loanRequired === "Yes" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Loan Bank">
                  <Input value={form.loanBank} onChange={v => set("loanBank", v)} placeholder="e.g. SBI, HDFC" />
                </Field>
                <Field label="Loan Amount (₹)">
                  <Input type="number" value={form.loanAmount} onChange={v => set("loanAmount", v)} placeholder="Amount" />
                </Field>
              </div>
            )}

            <Rule />
            <SectionTitle label="Vastu & Facing" />

            <Field label="Vastu Preference">
              <div className="flex flex-wrap gap-2 mt-1">
                {VASTU_OPTIONS.map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.vastuRequired === opt}
                    onClick={() => set("vastuRequired", form.vastuRequired === opt ? "" : opt)}
                  />
                ))}
              </div>
            </Field>

            <Field label="Preferred Facing">
              <div className="flex flex-wrap gap-2 mt-1">
                {FACING_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.facing.includes(opt)} onClick={() => toggleArr(form.facing, opt, "facing")} />
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ══ Step 4: Lifestyle & Preferences ══════════════════ */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <SectionTitle label="Lifestyle Requirements" />

            <Field label="Must-have Lifestyle Features">
              <div className="flex flex-wrap gap-2 mt-1">
                {LIFESTYLE_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.lifestyle.includes(opt)} onClick={() => toggleArr(form.lifestyle, opt, "lifestyle")} />
                ))}
              </div>
            </Field>

            <Field label="Amenities / Perks">
              <div className="flex flex-wrap gap-2 mt-1">
                {PERKS_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.perks.includes(opt)} onClick={() => toggleArr(form.perks, opt, "perks")} />
                ))}
              </div>
            </Field>

            <Rule />
            <SectionTitle label="Parking Preference" />

            <Field label="Number of Parking Slots">
              <div className="flex flex-wrap gap-2 mt-1">
                {PARKING_SLOT_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.parkingSlots.includes(opt)} onClick={() => toggleArr(form.parkingSlots, opt, "parkingSlots")} />
                ))}
              </div>
            </Field>

            <Field label="Parking Type">
              <div className="flex gap-2 mt-1">
                {PARKING_TYPE_OPTIONS.map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.parkingType === opt}
                    onClick={() => set("parkingType", form.parkingType === opt ? "" : opt)}
                  />
                ))}
              </div>
            </Field>

            <Rule />
            <SectionTitle label="Location & Buying Factors" />

            <Field label="Location Preference (Zone)">
              <div className="flex flex-wrap gap-2 mt-1">
                {LOCATION_PREF_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.locationPref.includes(opt)} onClick={() => toggleArr(form.locationPref, opt, "locationPref")} />
                ))}
              </div>
            </Field>

            <Field label="Important Buying Factors">
              <div className="flex flex-wrap gap-2 mt-1">
                {BUY_FACTOR_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.buyFactors.includes(opt)} onClick={() => toggleArr(form.buyFactors, opt, "buyFactors")} />
                ))}
              </div>
            </Field>

            <Field label="Pain Points" hint="What problem are we solving?">
              <div className="flex flex-wrap gap-2 mt-1">
                {PAIN_POINT_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.painPoints.includes(opt)} onClick={() => toggleArr(form.painPoints, opt, "painPoints")} />
                ))}
              </div>
            </Field>

            <Rule />
            <SectionTitle label="Travel & Commute Analysis" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Office Area / Landmark">
                <Input value={form.travelOffice} onChange={v => set("travelOffice", v)} placeholder="e.g. Hitech City" />
              </Field>
              <Field label="Max Travel Time Accepted">
                <Input value={form.maxTravel} onChange={v => set("maxTravel", v)} placeholder="e.g. 30 mins" />
              </Field>
              <Field label="Travel Time from ORR">
                <Input value={form.orrTravel} onChange={v => set("orrTravel", v)} placeholder="e.g. Within 10 mins" />
              </Field>
              <Field label="Airport Connectivity">
                <Input value={form.airportImportance} onChange={v => set("airportImportance", v)} placeholder="High / Medium / Low" />
              </Field>
            </div>
          </div>
        )}

        {/* ══ Step 5: Context & Follow-up ═══════════════════════ */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <SectionTitle label="Communication Preferences" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Preferred Call Time">
                <Input value={form.callTime} onChange={v => set("callTime", v)} placeholder="e.g. 10 AM – 12 PM" />
              </Field>
              <Field label="Preferred Day">
                <Input value={form.callDay} onChange={v => set("callDay", v)} placeholder="e.g. Mon – Fri" />
              </Field>
            </div>

            <Field label="Site Visit Availability">
              <div className="flex flex-wrap gap-2 mt-1">
                {SITE_VISIT_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.siteVisitAvail.includes(opt)} onClick={() => toggleArr(form.siteVisitAvail, opt, "siteVisitAvail")} />
                ))}
              </div>
            </Field>

            <Field label="Preferred Visit Mode">
              <div className="flex flex-wrap gap-2 mt-1">
                {VISIT_MODE_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.visitMode.includes(opt)} onClick={() => toggleArr(form.visitMode, opt, "visitMode")} />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Project Interest">
                <Input value={form.projectInterest} onChange={v => set("projectInterest", v)} placeholder="Project name / area" />
              </Field>
              <Field label="Villa Type Preferred">
                <Input value={form.villaTypePref} onChange={v => set("villaTypePref", v)} placeholder="Independent / Gated" />
              </Field>
            </div>

            <Rule />
            <SectionTitle label="Decision & Approval" />

            <Field label="Family Approval Status">
              <div className="flex flex-wrap gap-2 mt-1">
                {FAMILY_APPROVAL_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.familyApproval.includes(opt)} onClick={() => toggleArr(form.familyApproval, opt, "familyApproval")} />
                ))}
              </div>
            </Field>

            <Field label="Assistance Required">
              <div className="flex flex-wrap gap-2 mt-1">
                {ASSISTANCE_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={form.assistance.includes(opt)} onClick={() => toggleArr(form.assistance, opt, "assistance")} />
                ))}
              </div>
            </Field>

            <Field label="After-Sale Expectation">
              <div className="flex flex-wrap gap-2 mt-1">
                {AFTER_SALE_OPTIONS.map(opt => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={form.afterSale === opt}
                    onClick={() => set("afterSale", form.afterSale === opt ? "" : opt)}
                  />
                ))}
              </div>
            </Field>

            <Rule />
            <SectionTitle label="Background & Notes" />

            <Field label="Already Visited Projects">
              <textarea
                value={form.visitedProjects}
                onChange={e => set("visitedProjects", e.target.value)}
                placeholder="List projects the client has already visited…"
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
            </Field>

            <Field label="How did you find this client?" required error={errors.source}>
              <div className="flex flex-wrap gap-2 mt-1">
                {(Object.entries(SOURCE_LABEL) as [ClientSource, string][]).map(([s, l]) => (
                  <Chip key={s} label={l} selected={form.source === s} onClick={() => set("source", s)} />
                ))}
              </div>
            </Field>

            <Field label="Personal Note / Customer Journey" hint="Key observations, interactions, family notes, follow-up context">
              <textarea
                value={form.personalNote}
                onChange={e => set("personalNote", e.target.value)}
                placeholder="e.g. IT professional at Infosys, wife prefers east facing, mother needs ground floor due to mobility…"
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              />
            </Field>

            <Field label="Assign to">
              <select
                value={form.assignedToId}
                onChange={e => set("assignedToId", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm"
                style={{ border: "1px solid var(--rule)", backgroundColor: "var(--paper-cool)", color: "var(--ink)" }}
              >
                {activeAgents.map(a => (
                  <option key={a.id} value={a.id}>{a.fullName} ({a.role})</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => (s - 1) as Step)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ border: "1px solid var(--rule)", color: "var(--ink-soft)", backgroundColor: "var(--paper-warm)" }}
            >
              <ChevronLeft size={14} />
              Back
            </button>
          ) : <div />}

          <button
            onClick={next}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
          >
            {step === 5 ? (
              <><Check size={14} /> Save Client</>
            ) : (
              <>Next <ChevronRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
