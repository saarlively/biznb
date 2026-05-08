"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createListing } from "@/app/actions/listings";

const SPACE_TYPES = [
  { label: "Restaurant", sub: "Dining room, bar, kitchen" },
  { label: "Retail storefront", sub: "Shops, showrooms, pop-ups" },
  { label: "Office / law firm", sub: "Desks, meeting rooms, full floors" },
  { label: "Gallery", sub: "White-wall, exhibition, project space" },
  { label: "Event venue", sub: "Lofts, halls, ceremony spaces" },
  { label: "Pro kitchen", sub: "Commissary, test kitchen, bake lab" },
  { label: "Photo + film studio", sub: "Cyc walls, daylight, sets" },
  { label: "Bar / lounge", sub: "After-hours, private rooms" },
];

const AVAIL_OPTIONS = ["Daily", "Weekdays only", "Weekends only", "Evenings only", "24/7", "By request"];

const IMG_BY_TYPE: Record<string, string> = {
  "Restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
  "Retail storefront": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop",
  "Office / law firm": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
  "Gallery": "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800&auto=format&fit=crop",
  "Event venue": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
  "Pro kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
  "Photo + film studio": "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop",
  "Bar / lounge": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop",
};

export default function HostOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [spaceType, setSpaceType] = useState("Gallery");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(20);
  const [price, setPrice] = useState(150);
  const [availability, setAvailability] = useState("By request");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handlePublish() {
    if (!title || !location || !description) { setError("Please fill in all required fields."); return; }
    setSaving(true);
    setError("");
    try {
      const listing = await createListing({
        title,
        type: spaceType,
        location,
        neighborhood: neighborhood || location,
        description,
        price,
        capacity,
        img: IMG_BY_TYPE[spaceType] ?? IMG_BY_TYPE["Gallery"],
        availability,
      });
      router.push(`/listing/${listing.id}?created=1`);
    } catch {
      setError("Please sign in to create a listing.");
      setSaving(false);
    }
  }

  const STAGES = [
    { step: "Step 1", label: "Tell us about your space", done: step > 1, active: step === 1 },
    { step: "Step 2", label: "Make it stand out", done: step > 2, active: step === 2 },
    { step: "Step 3", label: "Set your terms + price", done: false, active: step === 3 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateRows: "72px 1fr 88px", minHeight: "100vh" }}>
      <header style={{ display: "flex", alignItems: "center", padding: "0 28px", borderBottom: "1px solid var(--line)" }}>
        <Link href="/" className="logo" style={{ fontSize: 26 }}>
          <span className="logo-mark">B/</span><span>Biznb</span>
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Link href="/dashboard" style={{ padding: "10px 18px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", textDecoration: "none", color: "var(--text)" }}>Save + exit</Link>
        </div>
      </header>

      <main style={{ padding: "64px 28px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 64 }}>
          <aside style={{ display: "grid", gap: 14, alignContent: "start" }}>
            {STAGES.map((stage) => (
              <div key={stage.step} style={{ padding: "14px 16px", borderRadius: "var(--r)", border: `1px solid ${stage.active ? "var(--ink)" : "transparent"}`, background: stage.active ? "var(--cream)" : "transparent", fontSize: 13.5 }}>
                <b style={{ display: "block", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: stage.done ? "var(--ink)" : "var(--text-2)", marginBottom: 4, fontWeight: 700 }}>{stage.step}</b>
                <span style={{ display: "block", fontWeight: 600 }}>{stage.label}{stage.done ? " ✓" : ""}</span>
              </div>
            ))}
          </aside>

          <div>
            {step === 1 && (
              <>
                <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-2)", marginBottom: 14 }}>Step 1 · Tell us about your space</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, margin: "0 0 32px" }}>
                  Let&apos;s start with the basics.
                </h1>
                <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Space name *</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Orchard Gallery — 60-ft white wall" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>City / Address *</label>
                      <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Lower East Side, Manhattan" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Neighborhood</label>
                      <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Lower East Side" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Description *</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell guests what makes this space special — layout, unique features, what it&apos;s great for…" rows={5} style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Max capacity (guests)</label>
                    <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} min={1} style={{ width: 120, padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, outline: "none" }} />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-2)", marginBottom: 14 }}>Step 2 · Make it stand out</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, margin: "0 0 18px" }}>
                  Which kind of space is it?
                </h1>
                <p style={{ color: "var(--text-2)", fontSize: 17, lineHeight: 1.55, maxWidth: 640, marginBottom: 32 }}>
                  Pick the category that best matches what guests will use it for.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, maxWidth: 920 }}>
                  {SPACE_TYPES.map((type) => (
                    <button key={type.label} onClick={() => setSpaceType(type.label)} style={{ border: `1px solid ${spaceType === type.label ? "var(--ink)" : "var(--line)"}`, borderRadius: "var(--r)", padding: 22, textAlign: "left", cursor: "pointer", background: spaceType === type.label ? "var(--cream)" : "#fff" }}>
                      <b style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{type.label}</b>
                      <span style={{ color: "var(--text-2)", fontSize: 13, display: "block", marginTop: 2 }}>{type.sub}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-2)", marginBottom: 14 }}>Step 3 · Set your terms + price</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, margin: "0 0 32px" }}>
                  How much and when?
                </h1>
                <div style={{ display: "grid", gap: 24, maxWidth: 480 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Hourly rate (USD) *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>$</span>
                      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={10} style={{ width: 140, padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 18, outline: "none" }} />
                      <span style={{ color: "var(--text-2)", fontSize: 14 }}>/ hour</span>
                    </div>
                    <p style={{ color: "var(--text-2)", fontSize: 13, marginTop: 8 }}>Biznb&apos;s 9% fee + cleaning will be added at checkout.</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 10 }}>Availability</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {AVAIL_OPTIONS.map((opt) => (
                        <button key={opt} onClick={() => setAvailability(opt)} style={{ padding: "10px 14px", border: `1px solid ${availability === opt ? "var(--ink)" : "var(--line)"}`, borderRadius: "var(--r-pill)", background: availability === opt ? "var(--ink)" : "#fff", color: availability === opt ? "var(--citron)" : "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--r)", padding: "12px 14px", color: "#991B1B", fontSize: 13.5 }}>{error}</div>}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", padding: "0 28px" }}>
        {step > 1 ? (
          <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 22px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontWeight: 600, cursor: "pointer" }}>← Back</button>
        ) : (
          <Link href="/" style={{ padding: "12px 22px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontWeight: 600, textDecoration: "none", color: "var(--text)" }}>← Back</Link>
        )}
        <div style={{ flex: 1, height: 4, background: "var(--cream)", borderRadius: 4, margin: "0 32px", overflow: "hidden", maxWidth: 480 }}>
          <i style={{ display: "block", height: "100%", width: `${(step / 3) * 100}%`, background: "var(--ink)", transition: "width .3s" }} />
        </div>
        {step < 3 ? (
          <button onClick={() => { if (step === 1 && (!title || !location || !description)) { setError("Please fill in all fields."); return; } setError(""); setStep(s => s + 1); }} style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", border: 0, background: "var(--ink)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Next →</button>
        ) : (
          <button onClick={handlePublish} disabled={saving} style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", border: 0, background: "var(--ink)", color: "#fff", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Publishing…" : "Publish listing →"}
          </button>
        )}
      </footer>
    </div>
  );
}
