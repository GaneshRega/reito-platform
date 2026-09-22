"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Phone, User, MapPin, Home, IndianRupee, MessageSquare, ArrowRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";

const LOCALITIES = [
  "Gachibowli", "Kondapur", "Jubilee Hills", "Banjara Hills", "Madhapur",
  "Hitec City", "Nanakramguda", "Kokapet", "Manikonda", "Kukatpally",
  "Miyapur", "Bachupally", "Kompally", "Alwal", "Secunderabad",
  "Begumpet", "Somajiguda", "Ameerpet", "Panjagutta", "Nampally",
];

const PROP_TYPES = [
  "Apartment", "Villa", "Plot", "Penthouse",
  "Farm House", "Studio", "Row House", "Duplex",
];

const BHK_OPTS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK", "N/A"];

type Draft = {
  name: string;
  phone: string;
  email: string;
  locality: string;
  propertyType: string;
  bhk: string;
  price: string;
  note: string;
};

const EMPTY: Draft = {
  name: "", phone: "", email: "",
  locality: "", propertyType: "", bhk: "",
  price: "", note: "",
};

const inputCls = "w-full px-3 py-2.5 rounded-xl text-[14px] outline-none transition-colors";
const inputStyle = {
  border: "1.5px solid var(--rule)",
  backgroundColor: "var(--paper)",
  color: "var(--ink)",
};
const inputFocusStyle = {
  border: "1.5px solid var(--ink)",
};

function Field({ label, icon: Icon, error, children }: {
  label: string;
  icon?: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-soft)" }}>
        {Icon && <Icon size={10} className="inline mr-1.5" style={{ verticalAlign: "middle" }} />}
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#B03030" }}>{error}</p>}
    </div>
  );
}

export default function SellPage() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Partial<Draft>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft(d => ({ ...d, [k]: v }));

  function validate(): boolean {
    const e: Partial<Draft> = {};
    if (!draft.name.trim())     e.name     = "Required";
    if (!draft.phone.trim())    e.phone    = "Required";
    if (!draft.locality.trim()) e.locality = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ backgroundColor: "var(--paper)" }}>
      <SiteNav />

      <div className="flex-1 flex items-start justify-center px-5 py-10 md:py-16">
        <div className="w-full max-w-lg">

          <AnimatePresence mode="wait">

            {/* ── Form ── */}
            {!submitted && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {/* Heading */}
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--ink-faint)", marginBottom: 10 }}>
                  Hyderabad
                </p>
                <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 8, lineHeight: 1.15 }}>
                  List your property
                </h1>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 32, lineHeight: 1.6 }}>
                  Share your property details and our agent will reach out to you within 24 hours to get it listed.
                </p>

                {/* How it works strip */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-8"
                  style={{ backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}
                >
                  {[
                    { n: "1", label: "Fill this form" },
                    { n: "→" },
                    { n: "2", label: "Agent calls you" },
                    { n: "→" },
                    { n: "3", label: "Property goes live" },
                  ].map((step, i) =>
                    step.label ? (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "var(--ink)" }}
                        >
                          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--paper)" }}>{step.n}</span>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 500 }}>{step.label}</span>
                      </div>
                    ) : (
                      <span key={i} style={{ fontSize: 12, color: "var(--ink-faint)", flexShrink: 0 }}>→</span>
                    )
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                  {/* Name + Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Your Name *" icon={User} error={errors.name}>
                      <input
                        className={inputCls}
                        style={inputStyle}
                        placeholder="Full name"
                        value={draft.name}
                        onChange={e => set("name", e.target.value)}
                        onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                        onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                      />
                    </Field>
                    <Field label="WhatsApp / Phone *" icon={Phone} error={errors.phone}>
                      <input
                        className={inputCls}
                        style={inputStyle}
                        placeholder="+91 98XXX XXXXX"
                        value={draft.phone}
                        onChange={e => set("phone", e.target.value)}
                        onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                        onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                      />
                    </Field>
                  </div>

                  {/* Email */}
                  <Field label="Email (optional)">
                    <input
                      className={inputCls}
                      style={inputStyle}
                      type="email"
                      placeholder="you@email.com"
                      value={draft.email}
                      onChange={e => set("email", e.target.value)}
                      onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </Field>

                  {/* Locality */}
                  <Field label="Locality *" icon={MapPin} error={errors.locality}>
                    <input
                      className={inputCls}
                      style={inputStyle}
                      placeholder="e.g. Gachibowli"
                      list="locality-list"
                      value={draft.locality}
                      onChange={e => set("locality", e.target.value)}
                      onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                    <datalist id="locality-list">
                      {LOCALITIES.map(l => <option key={l} value={l} />)}
                    </datalist>
                  </Field>

                  {/* Property Type + BHK */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Property Type" icon={Home}>
                      <select
                        className={inputCls}
                        style={{ ...inputStyle, appearance: "none" as const }}
                        value={draft.propertyType}
                        onChange={e => set("propertyType", e.target.value)}
                      >
                        <option value="">Select type…</option>
                        {PROP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Configuration">
                      <div
                        className="flex flex-wrap gap-1.5 p-2 rounded-xl"
                        style={{ border: "1.5px solid var(--rule)", backgroundColor: "var(--paper)" }}
                      >
                        {BHK_OPTS.map(b => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => set("bhk", draft.bhk === b ? "" : b)}
                            className="px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors"
                            style={{
                              backgroundColor: draft.bhk === b ? "var(--ink)" : "var(--paper-cool)",
                              color: draft.bhk === b ? "var(--paper)" : "var(--ink-soft)",
                              border: "1px solid var(--rule)",
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>

                  {/* Expected Price */}
                  <Field label="Expected Price (optional)" icon={IndianRupee}>
                    <input
                      className={inputCls}
                      style={inputStyle}
                      placeholder="e.g. ₹1.5 Cr or 80 Lakhs"
                      value={draft.price}
                      onChange={e => set("price", e.target.value)}
                      onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </Field>

                  {/* Note */}
                  <Field label="Anything else?" icon={MessageSquare}>
                    <textarea
                      className={inputCls}
                      style={{ ...inputStyle, resize: "vertical" }}
                      rows={3}
                      placeholder="Furnishing, parking, urgent sale, special features…"
                      value={draft.note}
                      onChange={e => set("note", e.target.value)}
                      onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
                    />
                  </Field>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-opacity hover:opacity-90 mt-2"
                    style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
                  >
                    Submit — Agent will call you
                    <ArrowRight size={14} />
                  </button>

                  <p style={{ fontSize: 11, color: "var(--ink-faint)", textAlign: "center", marginTop: -8 }}>
                    Free service · No brokerage from owner · We connect you with verified buyers
                  </p>
                </form>
              </motion.div>
            )}

            {/* ── Success ── */}
            {submitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                className="flex flex-col items-center text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "var(--paper-warm)", border: "2px solid var(--rule)" }}
                >
                  <CheckCircle2 size={36} style={{ color: "var(--ink)" }} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                  style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 10 }}
                >
                  Details saved!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.35 }}
                  style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 340, marginBottom: 32 }}
                >
                  Our agent will reach out to you on{" "}
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{draft.phone}</span>{" "}
                  within 24 hours to discuss listing your property.
                </motion.p>

                {/* What happens next */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.35 }}
                  className="w-full rounded-2xl p-5 text-left mb-8"
                  style={{ backgroundColor: "var(--paper-cool)", border: "1px solid var(--rule)" }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-faint)", marginBottom: 14 }}>
                    What happens next
                  </p>
                  {[
                    { n: "1", title: "Agent calls you", desc: "Our agent will call to verify details and schedule a property visit." },
                    { n: "2", title: "Property gets listed", desc: "After verification, your property goes live on Discover Hyderabad." },
                    { n: "3", title: "Buyers reach out", desc: "Verified buyers and their agents will contact you directly." },
                  ].map(step => (
                    <div key={step.n} className="flex gap-3 mb-3 last:mb-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: "var(--ink)" }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--paper)" }}>{step.n}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{step.title}</p>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 1 }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  onClick={() => { setDraft(EMPTY); setSubmitted(false); }}
                  className="text-sm underline transition-opacity hover:opacity-70"
                  style={{ color: "var(--ink-faint)" }}
                >
                  Submit another property
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
