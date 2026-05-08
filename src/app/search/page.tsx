"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Listing = { id: string; title: string; type: string; neighborhood: string; price: number; capacity: number; img: string; host: { name: string } };

export default function SearchPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeChips, setActiveChips] = useState<string[]>(["By the hour"]);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch("/api/listings").then(r => r.json()).then(setListings).catch(() => {});
  }, []);

  function toggleChip(label: string) {
    setActiveChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  }

  return (
    <>
      {/* Nav with inline searchbar */}
      <header className="nav" style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)", position: "sticky", top: 0, zIndex: 40 }}>
        <div className="container" style={{ height: "auto", paddingTop: 14, paddingBottom: 18, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
          <Link href="/" className="logo">
            <span className="logo-mark">B/</span>
            <span>Biznb</span>
          </Link>
          <form className="searchbar compact" onSubmit={(e) => e.preventDefault()}>
            <div className="field"><span className="field-label">Where</span><span className="field-value filled">New York, NY</span></div>
            <div className="field"><span className="field-label">Space type</span><span className="field-value filled">Restaurant</span></div>
            <div className="field"><span className="field-label">Dates</span><span className="field-value filled">May 14 – 16</span></div>
            <div className="field"><span className="field-label">Hours</span><span className="field-value">6 – 11 pm</span></div>
            <div className="field"><span className="field-label">Capacity</span><span className="field-value">40 ppl</span></div>
            <div className="field"><span className="field-label">Use case</span><span className="field-value">Pop-up</span></div>
            <div className="field"><span className="field-label">Budget</span><span className="field-value">Any</span></div>
            <button type="submit" className="search-submit" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/>
              </svg>
            </button>
          </form>
          <Link href="/auth" className="nav-account" aria-label="Account">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <span className="avatar">JD</span>
          </Link>
        </div>

        {/* Filter chips */}
        <div className="container">
          <div style={{ display: "flex", gap: 10, padding: "14px 0 18px", overflowX: "auto", scrollbarWidth: "none", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
            <button onClick={() => setDrawerOpen(true)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "var(--cream)", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
              All filters
            </button>
            <span style={{ width: 1, height: 20, background: "var(--line)", margin: "0 6px", flexShrink: 0 }}></span>
            {["By the hour", "By the day", "By the week", "By the month"].map((label) => (
              <button key={label} onClick={() => toggleChip(label)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: activeChips.includes(label) ? "var(--ink)" : "#fff", color: activeChips.includes(label) ? "#fff" : "var(--text)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                {label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: "var(--line)", margin: "0 6px", flexShrink: 0 }}></span>
            {["Price ▾", "Capacity: 40+ ▾", "Space type ▾", "Use case ▾", "Amenities ▾", "Instant book", "Cleaning included"].map((label) => (
              <button key={label} onClick={() => toggleChip(label)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: activeChips.includes(label) ? "var(--ink)" : "#fff", color: activeChips.includes(label) ? "#fff" : "var(--text)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                {label}
              </button>
            ))}
            <button onClick={() => setActiveChips([])} style={{ marginLeft: "auto", flexShrink: 0, padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main split layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 520px", alignItems: "start" }}>
        {/* Results */}
        <main style={{ padding: "24px var(--pad) 60px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, margin: "0 0 4px", lineHeight: 1.1 }}>
                Brooklyn — <em style={{ fontStyle: "italic" }}>May 14–16</em>
              </h1>
              <div style={{ color: "var(--text-2)", fontSize: 14 }}>240 spaces · prices show all-in (cleaning + fee included)</div>
            </div>
            <button style={{ padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", gap: 8, alignItems: "center" }}>
              Sort: Recommended
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>

          {/* Duration banner */}
          <div style={{ background: "var(--cream)", borderRadius: "var(--r)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, fontSize: 14 }}>
            <div>
              <b style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400 }}>Showing hourly rates</b>
              <div className="muted" style={{ fontSize: 13 }}>Prices include the verified cleaner and Biznb&apos;s flat fee.</div>
            </div>
            <div style={{ display: "inline-flex", gap: 6, background: "#fff", borderRadius: "var(--r-pill)", padding: 4, border: "1px solid var(--line)" }}>
              {["Hour", "Day", "Week", "Month"].map((t, i) => (
                <button key={t} style={{ border: 0, background: i === 0 ? "var(--ink)" : "transparent", padding: "6px 12px", borderRadius: "var(--r-pill)", fontWeight: 600, fontSize: 12.5, color: i === 0 ? "var(--citron)" : "var(--text-2)", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px 18px" }}>
            {listings.map((l) => (
              <Link key={l.id} className="listing" href={`/listing/${l.id}`}>
                <div className="listing-photo">
                  <img src={l.img} alt={l.title} />
                  <span className="badge">{l.type} · {l.capacity} max</span>
                  <button className="heart" aria-label="Save" onClick={(e) => e.preventDefault()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-7-4.5-9.5-9C.8 8.6 3 5 6.5 5 8.5 5 10.5 6 12 8c1.5-2 3.5-3 5.5-3C21 5 23.2 8.6 21.5 12 19 16.5 12 21 12 21Z"/>
                    </svg>
                  </button>
                </div>
                <div className="listing-meta">
                  <div>
                    <div className="listing-title">{l.title}</div>
                    <div className="listing-sub">{l.neighborhood}</div>
                    <div className="listing-price" style={{ marginTop: 6 }}><b>${l.price}/hr</b> · all-in</div>
                  </div>
                  <div className="listing-rating">
                    <svg className="star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 7 8 .8-6 5.4 1.8 7.8L12 19l-6.8 4 1.8-7.8L0 9.8 8 9Z"/></svg>
                    <span>5.0</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <button className="btn btn-ghost">Show more spaces</button>
          </div>
        </main>

        {/* Map */}
        <aside style={{ position: "sticky", top: 0, height: "100vh", background: "#E8E4DA", borderLeft: "1px solid var(--line)", overflow: "hidden" }}>
          <MapCanvas />
        </aside>
      </div>

      {/* Filter drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,42,31,.55)", backdropFilter: "blur(2px)", zIndex: 60 }} onClick={() => setDrawerOpen(false)}>
          <aside style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", borderRadius: "var(--r-lg)", width: "min(720px, 92vw)", maxHeight: "85vh", overflowY: "auto", boxShadow: "var(--shadow-3)", zIndex: 70 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "sticky", top: 0, background: "#fff", padding: "18px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0, fontWeight: 400 }}>Filters</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "transparent", border: 0, width: 28, height: 28, borderRadius: "50%", fontSize: 18, lineHeight: 1, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 24, display: "grid", gap: 28 }}>
              <FilterSection title="How long do you need it?">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--line)", borderRadius: "var(--r-pill)", overflow: "hidden" }}>
                  {["Hours", "Days", "Weeks", "Months"].map((t, i) => (
                    <button key={t} style={{ padding: 14, background: i === 0 ? "var(--ink)" : "#fff", border: 0, fontSize: 14, fontWeight: 600, color: i === 0 ? "var(--citron)" : "var(--text-2)", cursor: "pointer" }}>{t}</button>
                  ))}
                </div>
              </FilterSection>
              <FilterSection title="Space type">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {["Restaurant", "Retail storefront", "Office / law firm", "Gallery", "Event venue", "Pro kitchen", "Bar / lounge", "Photo + film studio"].map((t, i) => (
                    <label key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `1px solid ${i < 3 ? "var(--ink)" : "var(--line)"}`, borderRadius: "var(--r)", fontSize: 14, cursor: "pointer", background: i < 3 ? "var(--cream)" : "#fff" }}>
                      <input type="checkbox" defaultChecked={i < 3} style={{ accentColor: "var(--ink)" }} /> {t}
                    </label>
                  ))}
                </div>
              </FilterSection>
              <FilterSection title="Capacity">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {["1–10", "10–30", "30–80", "80+"].map((t, i) => (
                    <label key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `1px solid ${i === 2 ? "var(--ink)" : "var(--line)"}`, borderRadius: "var(--r)", fontSize: 14, cursor: "pointer", background: i === 2 ? "var(--cream)" : "#fff" }}>
                      <input type="checkbox" defaultChecked={i === 2} style={{ accentColor: "var(--ink)" }} /> {t}
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
            <div style={{ position: "sticky", bottom: 0, background: "#fff", padding: "16px 24px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <a href="#" className="link-u">Clear all</a>
              <button className="btn btn-primary" onClick={() => setDrawerOpen(false)}>Show 240 spaces</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>{title}</h4>
      {children}
    </div>
  );
}

function MapCanvas() {
  const pins = [
    { top: "18%", left: "26%", price: "$220/hr" },
    { top: "32%", left: "48%", price: "$340/hr", active: true },
    { top: "24%", left: "68%", price: "$95/hr" },
    { top: "42%", left: "22%", price: "$180/hr" },
    { top: "54%", left: "56%", price: "$420/hr" },
    { top: "60%", left: "38%", price: "$280/hr" },
    { top: "70%", left: "70%", price: "$640/hr" },
    { top: "78%", left: "26%", price: "$140/hr" },
    { top: "50%", left: "80%", price: "$310/hr" },
    { top: "84%", left: "54%", price: "$1.1k/d" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(180deg, #EFEAE0 0%, #E0DCD0 100%)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, transparent 1px 100%), linear-gradient(90deg, rgba(255,255,255,.5) 0 1px, transparent 1px 100%)", backgroundSize: "80px 80px", transform: "rotate(-8deg) scale(1.5)", transformOrigin: "center", opacity: .9 }} />
      <div style={{ position: "absolute", left: "-20%", right: "-20%", top: "30%", height: 110, background: "linear-gradient(180deg, #B8C9D4, #9CB3C2)", transform: "rotate(-12deg)", borderRadius: 80 }} />
      {pins.map((pin) => (
        <button key={pin.price} style={{ position: "absolute", background: pin.active ? "var(--ink)" : "#fff", color: pin.active ? "#fff" : "var(--ink)", padding: "8px 12px", borderRadius: "var(--r-pill)", fontSize: 13, fontWeight: 700, boxShadow: "var(--shadow-2)", border: "1px solid var(--line)", transform: "translate(-50%, -50%)", cursor: "pointer", top: pin.top, left: pin.left, zIndex: 2 }}>
          {pin.price}
        </button>
      ))}
      <div style={{ position: "absolute", top: 16, right: 16, display: "grid", gap: 6, zIndex: 5 }}>
        {["+", "−", "⌖"].map((c) => (
          <button key={c} style={{ width: 38, height: 38, borderRadius: 8, background: "#fff", border: "1px solid var(--line)", boxShadow: "var(--shadow-1)", display: "grid", placeItems: "center", fontSize: 18, color: "var(--text)", cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <button style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--ink)", color: "#fff", padding: "10px 18px", borderRadius: "var(--r-pill)", fontSize: 13, fontWeight: 600, boxShadow: "var(--shadow-2)", border: 0, zIndex: 5, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        Show list
      </button>
    </div>
  );
}
