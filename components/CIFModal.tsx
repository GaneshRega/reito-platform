"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CIFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function multiToggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function singleSelect(current: Set<string>, value: string): Set<string> {
  return current.has(value) ? new Set() : new Set([value]);
}

function Pills({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.has(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1.5px solid ${active ? "var(--ink)" : "var(--rule)"}`,
              backgroundColor: active ? "var(--ink)" : "transparent",
              color: active ? "var(--paper)" : "var(--ink-soft)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeader({
  n,
  title,
  note,
}: {
  n?: string;
  title: string;
  note?: string;
}) {
  return (
    <p className="mb-3" style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
      {n && (
        <span style={{ color: "var(--ink-faint)", marginRight: 6 }}>{n}.</span>
      )}
      {title}
      {note && (
        <span
          style={{ fontSize: 12, color: "var(--ink-faint)", fontWeight: 400, marginLeft: 8 }}
        >
          ({note})
        </span>
      )}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-1.5"
      style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}
    >
      {children}
    </p>
  );
}

const baseInput: React.CSSProperties = {
  width: "100%",
  padding: "9px 14px",
  borderRadius: 10,
  border: "1.5px solid var(--rule)",
  backgroundColor: "var(--paper-cool)",
  fontSize: 14,
  color: "var(--ink)",
  outline: "none",
  fontFamily: "inherit",
};

function TInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={baseInput}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
    />
  );
}

function TArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...baseInput, resize: "vertical" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
    />
  );
}

function Rule() {
  return (
    <div style={{ borderTop: "1px solid var(--rule)", margin: "28px 0" }} />
  );
}

function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-5"
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "var(--ink-faint)",
      }}
    >
      {children}
    </p>
  );
}

export default function CIFModal({ isOpen, onClose }: CIFModalProps) {
  /* ── Basic Info ─────────────────────────────────────────── */
  const [date, setDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [company, setCompany] = useState("");
  const [currentLoc, setCurrentLoc] = useState("");
  const [officeLoc, setOfficeLoc] = useState("");
  const [commMode, setCommMode] = useState<Set<string>>(new Set());
  const [rm, setRm] = useState("");
  const [familyInfo, setFamilyInfo] = useState("");

  /* ── 1. Purpose ─────────────────────────────────────────── */
  const [purpose, setPurpose] = useState<Set<string>>(new Set());

  /* ── 2. Property Stage ──────────────────────────────────── */
  const [stage, setStage] = useState<Set<string>>(new Set());
  const [timeline, setTimeline] = useState<Set<string>>(new Set());

  /* ── 3. Investment Preference ───────────────────────────── */
  const [investPref, setInvestPref] = useState<Set<string>>(new Set());

  /* ── 4. Vastu ───────────────────────────────────────────── */
  const [vastu, setVastu] = useState<Set<string>>(new Set());
  const [facing, setFacing] = useState<Set<string>>(new Set());

  /* ── 5. Budget ──────────────────────────────────────────── */
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [payMode, setPayMode] = useState<Set<string>>(new Set());
  const [loanReq, setLoanReq] = useState<Set<string>>(new Set());
  const [downPayment, setDownPayment] = useState("");
  const [emiComfort, setEmiComfort] = useState("");

  /* ── 6. Villa Config ────────────────────────────────────── */
  const [villaConfig, setVillaConfig] = useState<Set<string>>(new Set());
  const [villaSize, setVillaSize] = useState("");
  const [plotSize, setPlotSize] = useState("");

  /* ── 7. Travel ──────────────────────────────────────────── */
  const [travelOffice, setTravelOffice] = useState("");
  const [maxTravel, setMaxTravel] = useState("");
  const [orrTravel, setOrrTravel] = useState("");
  const [airportImportance, setAirportImportance] = useState("");

  /* ── 8a. Location Preference ────────────────────────────── */
  const [locationPref, setLocationPref] = useState<Set<string>>(new Set());

  /* ── 8b. Buying Factors ─────────────────────────────────── */
  const [buyFactors, setBuyFactors] = useState<Set<string>>(new Set());

  /* ── 9. Pain Points ─────────────────────────────────────── */
  const [painPoints, setPainPoints] = useState<Set<string>>(new Set());

  /* ── 10. Lifestyle ──────────────────────────────────────── */
  const [lifestyle, setLifestyle] = useState<Set<string>>(new Set());

  /* ── 11. Parking ────────────────────────────────────────── */
  const [parkingSlots, setParkingSlots] = useState<Set<string>>(new Set());
  const [parkingType, setParkingType] = useState<Set<string>>(new Set());

  /* ── 12. Comm Preferences ───────────────────────────────── */
  const [callTime, setCallTime] = useState("");
  const [callDay, setCallDay] = useState("");
  const [siteVisitAvail, setSiteVisitAvail] = useState<Set<string>>(new Set());
  const [visitMode, setVisitMode] = useState<Set<string>>(new Set());

  /* ── 13. Site Visit ─────────────────────────────────────── */
  const [projectInterest, setProjectInterest] = useState("");
  const [villaTypePref, setVillaTypePref] = useState("");

  /* ── 14. Family Approval ────────────────────────────────── */
  const [familyApproval, setFamilyApproval] = useState<Set<string>>(new Set());

  /* ── 15. Assistance ─────────────────────────────────────── */
  const [assistance, setAssistance] = useState<Set<string>>(new Set());

  /* ── 16. After Sale ─────────────────────────────────────── */
  const [afterSale, setAfterSale] = useState<Set<string>>(new Set());

  /* ── 17. Visited Projects ───────────────────────────────── */
  const [visitedProjects, setVisitedProjects] = useState("");

  /* ── 18. Customer Journey ───────────────────────────────── */
  const [journey, setJourney] = useState("");

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.52)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-2xl flex flex-col rounded-t-[20px] sm:rounded-[20px]"
        style={{
          backgroundColor: "var(--paper)",
          maxHeight: "95dvh",
          boxShadow: "0 32px 64px rgba(0,0,0,0.30)",
        }}
      >

        {/* ── Modal header ─────────────────────────────────── */}
        <div
          className="flex items-start justify-between px-5 sm:px-7 py-5 shrink-0"
          style={{ borderBottom: "1px solid var(--rule)" }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: 3,
              }}
            >
              Villa Concierge Service
            </p>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                lineHeight: 1.2,
              }}
            >
              Customer Evaluation Form
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: 8,
              borderRadius: 999,
              border: "1px solid var(--rule)",
              color: "var(--ink-soft)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────── */}
        <div
          className="overflow-y-auto flex-1"
          style={{ padding: "24px 20px 32px", scrollbarWidth: "thin" }}
        >
          {/* CLIENT BASIC INFORMATION */}
          <BlockLabel>Client Basic Information</BlockLabel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <FieldLabel>Date</FieldLabel>
              <TInput type="date" value={date} onChange={setDate} />
            </div>
            <div>
              <FieldLabel>Client Name</FieldLabel>
              <TInput value={clientName} onChange={setClientName} placeholder="Full name" />
            </div>
            <div>
              <FieldLabel>Mobile Number</FieldLabel>
              <TInput type="tel" value={mobile} onChange={setMobile} placeholder="+91 00000 00000" />
            </div>
            <div>
              <FieldLabel>Email ID</FieldLabel>
              <TInput type="email" value={email} onChange={setEmail} placeholder="email@example.com" />
            </div>
            <div>
              <FieldLabel>Occupation</FieldLabel>
              <TInput value={occupation} onChange={setOccupation} placeholder="e.g. Business Owner" />
            </div>
            <div>
              <FieldLabel>Company Name</FieldLabel>
              <TInput value={company} onChange={setCompany} placeholder="Company / Organisation" />
            </div>
            <div>
              <FieldLabel>Current Location</FieldLabel>
              <TInput value={currentLoc} onChange={setCurrentLoc} placeholder="City / Area" />
            </div>
            <div>
              <FieldLabel>Office Location</FieldLabel>
              <TInput value={officeLoc} onChange={setOfficeLoc} placeholder="Office area / landmark" />
            </div>
            <div>
              <FieldLabel>Relationship Manager</FieldLabel>
              <TInput value={rm} onChange={setRm} placeholder="RM name" />
            </div>
          </div>

          <div className="mb-4">
            <FieldLabel>Preferred Communication</FieldLabel>
            <Pills
              options={["Call", "WhatsApp", "Email"]}
              selected={commMode}
              onToggle={(v) => setCommMode(multiToggle(commMode, v))}
            />
          </div>

          <div className="mb-0">
            <FieldLabel>Family Information</FieldLabel>
            <TArea
              value={familyInfo}
              onChange={setFamilyInfo}
              placeholder="Spouse, children, dependants, joint-family notes…"
              rows={3}
            />
          </div>

          <Rule />

          {/* 1. Purpose */}
          <SectionHeader n="1" title="Purpose of Purchase" />
          <Pills
            options={["End Use", "Investment", "Rental Income", "NRI Investment", "Future Family Use", "Retirement Home"]}
            selected={purpose}
            onToggle={(v) => setPurpose(multiToggle(purpose, v))}
          />

          <Rule />

          {/* 2. Property Stage */}
          <SectionHeader n="2" title="Property Stage Preference" />
          <Pills
            options={["Pre-Launch", "New Launch", "Under Construction", "Near Possession", "Ready to Move In", "Resale Villa"]}
            selected={stage}
            onToggle={(v) => setStage(multiToggle(stage, v))}
          />
          <div className="mt-4">
            <FieldLabel>Preferred Possession Timeline</FieldLabel>
            <Pills
              options={["Immediate", "Within 6 Months", "Within 1 Year", "Flexible"]}
              selected={timeline}
              onToggle={(v) => setTimeline(singleSelect(timeline, v))}
            />
          </div>

          <Rule />

          {/* 3. Investment Preference */}
          <SectionHeader n="3" title="Investment Preference" />
          <Pills
            options={["High Appreciation Potential", "Rental Income Focus", "Luxury End Use", "Long-Term Investment", "Short-Term Flip", "Safe Investment"]}
            selected={investPref}
            onToggle={(v) => setInvestPref(multiToggle(investPref, v))}
          />

          <Rule />

          {/* 4. Vastu */}
          <SectionHeader n="4" title="Vastu Preference" />
          <Pills
            options={["Mandatory", "Preferred", "Not Important"]}
            selected={vastu}
            onToggle={(v) => setVastu(singleSelect(vastu, v))}
          />
          <div className="mt-4">
            <FieldLabel>Facing</FieldLabel>
            <Pills
              options={["East", "West", "North East", "Others"]}
              selected={facing}
              onToggle={(v) => setFacing(singleSelect(facing, v))}
            />
          </div>

          <Rule />

          {/* 5. Budget */}
          <SectionHeader n="5" title="Budget Analysis" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <FieldLabel>Minimum Budget</FieldLabel>
              <TInput value={minBudget} onChange={setMinBudget} placeholder="e.g. ₹2 Cr" />
            </div>
            <div>
              <FieldLabel>Maximum Budget</FieldLabel>
              <TInput value={maxBudget} onChange={setMaxBudget} placeholder="e.g. ₹5 Cr" />
            </div>
            <div>
              <FieldLabel>Expected Down Payment</FieldLabel>
              <TInput value={downPayment} onChange={setDownPayment} placeholder="Amount" />
            </div>
            <div>
              <FieldLabel>Monthly EMI Comfort</FieldLabel>
              <TInput value={emiComfort} onChange={setEmiComfort} placeholder="₹ / month" />
            </div>
          </div>
          <div className="mb-4">
            <FieldLabel>Payment Mode</FieldLabel>
            <Pills
              options={["Loan", "Self Funded", "Mixed", "Mix Split %"]}
              selected={payMode}
              onToggle={(v) => setPayMode(singleSelect(payMode, v))}
            />
          </div>
          <div>
            <FieldLabel>Loan Requirement</FieldLabel>
            <Pills
              options={["Yes", "No"]}
              selected={loanReq}
              onToggle={(v) => setLoanReq(singleSelect(loanReq, v))}
            />
          </div>

          <Rule />

          {/* 6. Villa Config */}
          <SectionHeader n="6" title="Preferred Villa Configuration" />
          <Pills
            options={["3 BHK", "4 BHK", "5 BHK", "Ultra Luxury Villa"]}
            selected={villaConfig}
            onToggle={(v) => setVillaConfig(multiToggle(villaConfig, v))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <FieldLabel>Preferred Villa Size</FieldLabel>
              <TInput value={villaSize} onChange={setVillaSize} placeholder="e.g. 3000–4000 sq ft" />
            </div>
            <div>
              <FieldLabel>Preferred Plot Size</FieldLabel>
              <TInput value={plotSize} onChange={setPlotSize} placeholder="e.g. 200–300 sq yd" />
            </div>
          </div>

          <Rule />

          {/* 7. Travel */}
          <SectionHeader n="7" title="Travel & Commute Analysis" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Office Location</FieldLabel>
              <TInput value={travelOffice} onChange={setTravelOffice} placeholder="Area / landmark" />
            </div>
            <div>
              <FieldLabel>Max Travel Time Accepted</FieldLabel>
              <TInput value={maxTravel} onChange={setMaxTravel} placeholder="e.g. 30 mins" />
            </div>
            <div>
              <FieldLabel>Preferred Travel Time from ORR</FieldLabel>
              <TInput value={orrTravel} onChange={setOrrTravel} placeholder="e.g. Within 10 mins" />
            </div>
            <div>
              <FieldLabel>Airport Connectivity Importance</FieldLabel>
              <TInput value={airportImportance} onChange={setAirportImportance} placeholder="High / Medium / Low" />
            </div>
          </div>

          <Rule />

          {/* 8a. Location Preference */}
          <SectionHeader n="8" title="Location Preference" />
          <Pills
            options={["Kollur", "Tellapur", "Osman Nagar", "Narsingi", "Kokapet", "Rajendra Nagar", "Tukkuguda", "Others"]}
            selected={locationPref}
            onToggle={(v) => setLocationPref(multiToggle(locationPref, v))}
          />

          {/* 8b. Buying Factors */}
          <div className="mt-6">
            <SectionHeader title="Important Buying Factors" />
            <Pills
              options={["Price Appreciation", "Builder Reputation", "Luxury Amenities", "Connectivity", "School Access", "Privacy", "Clubhouse", "Construction Quality", "Rental Potential", "Resale Potential"]}
              selected={buyFactors}
              onToggle={(v) => setBuyFactors(multiToggle(buyFactors, v))}
            />
          </div>

          <Rule />

          {/* 9. Pain Points */}
          <SectionHeader n="9" title="Pain Point Analysis" />
          <p className="mb-3" style={{ fontSize: 13, color: "var(--ink-faint)" }}>
            What problem are we solving?
          </p>
          <Pills
            options={["Apartment Lifestyle Frustration", "Need More Privacy", "Luxury Lifestyle Upgrade", "Investment Diversification"]}
            selected={painPoints}
            onToggle={(v) => setPainPoints(multiToggle(painPoints, v))}
          />

          <Rule />

          {/* 10. Lifestyle */}
          <SectionHeader n="10" title="Lifestyle Requirements" />
          <Pills
            options={["Private Garden", "Home Theater", "Lift Provision", "Swimming Pool", "Home Office", "Servant Room", "Terrace Lounge", "Solar Setup", "EV Charging"]}
            selected={lifestyle}
            onToggle={(v) => setLifestyle(multiToggle(lifestyle, v))}
          />

          <Rule />

          {/* 11. Parking */}
          <SectionHeader n="11" title="Parking Preference" />
          <div className="mb-4">
            <FieldLabel>Number of Slots</FieldLabel>
            <Pills
              options={["2", "3", "Visitor Parking"]}
              selected={parkingSlots}
              onToggle={(v) => setParkingSlots(multiToggle(parkingSlots, v))}
            />
          </div>
          <div>
            <FieldLabel>Type</FieldLabel>
            <Pills
              options={["Covered", "Semi Covered"]}
              selected={parkingType}
              onToggle={(v) => setParkingType(singleSelect(parkingType, v))}
            />
          </div>

          <Rule />

          {/* 12. Communication Preferences */}
          <SectionHeader n="12" title="Communication Preferences" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <FieldLabel>Preferred Time of Calling</FieldLabel>
              <TInput value={callTime} onChange={setCallTime} placeholder="e.g. 10 AM – 12 PM" />
            </div>
            <div>
              <FieldLabel>Preferred Day</FieldLabel>
              <TInput value={callDay} onChange={setCallDay} placeholder="e.g. Mon – Fri" />
            </div>
          </div>
          <div className="mb-4">
            <FieldLabel>Site Visit Availability</FieldLabel>
            <Pills
              options={["Weekdays", "Weekends"]}
              selected={siteVisitAvail}
              onToggle={(v) => setSiteVisitAvail(multiToggle(siteVisitAvail, v))}
            />
          </div>
          <div>
            <FieldLabel>Preferred Mode</FieldLabel>
            <Pills
              options={["Day Visit", "Weekend Viewing", "Family Visit"]}
              selected={visitMode}
              onToggle={(v) => setVisitMode(multiToggle(visitMode, v))}
            />
          </div>

          <Rule />

          {/* 13. Site Visit Evaluation */}
          <SectionHeader n="13" title="Site Visit Evaluation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Project Interested In</FieldLabel>
              <TInput value={projectInterest} onChange={setProjectInterest} placeholder="Project name" />
            </div>
            <div>
              <FieldLabel>Villa Type Preferred</FieldLabel>
              <TInput value={villaTypePref} onChange={setVillaTypePref} placeholder="e.g. Independent / Gated" />
            </div>
          </div>

          <Rule />

          {/* 14. Family Approval */}
          <SectionHeader n="14" title="Family Approval Status" />
          <Pills
            options={["Self Decision Maker", "Spouse Approval", "Parents Approval", "Joint Family Decision"]}
            selected={familyApproval}
            onToggle={(v) => setFamilyApproval(multiToggle(familyApproval, v))}
          />

          <Rule />

          {/* 15. Assistance */}
          <SectionHeader n="15" title="Assistance Throughout the Journey" />
          <Pills
            options={["Loan Service", "Legal Service", "Interior Service", "Move-in Service"]}
            selected={assistance}
            onToggle={(v) => setAssistance(multiToggle(assistance, v))}
          />

          <Rule />

          {/* 16. After Sale */}
          <SectionHeader n="16" title="After Sale Dependence" note="Not Mandatory" />
          <Pills
            options={["Full Concierge Service", "Minimal Support", "Self Managed Client"]}
            selected={afterSale}
            onToggle={(v) => setAfterSale(singleSelect(afterSale, v))}
          />

          <Rule />

          {/* 17. Already Visited */}
          <SectionHeader n="17" title="Already Visited Projects" />
          <TArea
            value={visitedProjects}
            onChange={setVisitedProjects}
            placeholder="List projects the client has already visited…"
            rows={3}
          />

          <Rule />

          {/* 18. Customer Journey */}
          <SectionHeader n="18" title="Customer Journey With Us" />
          <TArea
            value={journey}
            onChange={setJourney}
            placeholder="Notes on interactions, follow-ups, key observations…"
            rows={4}
          />

          {/* Submit */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 999,
                border: "none",
                backgroundColor: submitted ? "var(--gold)" : "var(--ink)",
                color: "var(--paper)",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
                fontFamily: "inherit",
              }}
            >
              {submitted ? "Saved ✓" : "Save & Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
