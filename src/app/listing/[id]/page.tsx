"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createBooking } from "@/app/actions/bookings";

const AMENITIES = [
  "Track lighting on dimmers",
  "Bose sound system",
  "Catering kitchen + ice maker",
  "24-hour smart-lock access",
  "Freight elevator (4,000 lb)",
  "High-speed Wi-Fi (1 GBps)",
  "Tables, chairs, hi-tops",
  "Bar setup + glassware",
];

const REVIEWS = [
  { initials: "SK", name: "Sasha · Brand director", date: "April 2026", body: "The smart-lock worked on first try, the lighting rig was already set up, and the cleaner showed up on the dot. Worth every dollar." },
  { initials: "MJ", name: "Marcus · Photographer", date: "March 2026", body: "Shot a 22-look editorial here in eight hours and didn't move the kit once. Will be back." },
  { initials: "RA", name: "Rina · Founder", date: "March 2026", body: "Needed a venue that didn't look like a venue. The escrow + cleaner setup was a relief — the day-of was just showing up and pouring drinks." },
];

type Listing = {
  id: string;
  title: string;
  type: string;
  location: string;
  neighborhood: string;
  description: string;
  price: number;
  capacity: number;
  sqft: number | null;
  status: string;
  img: string;
  availability: string;
  host: { id: string; name: string; email: string };
};

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [priceTab, setPriceTab] = useState("Hour");
  const [guests, setGuests] = useState(20);
  const [useCase, setUseCase] = useState("Private event");
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    fetch(`/api/listings/${params.id}`)
      .then(r => r.json())
      .then(data => { setListing(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  async function handleBook() {
    if (!listing) return;
    setBooking(true);
    setBookError("");
    try {
      const hours = priceTab === "Hour" ? 4 : priceTab === "Day" ? 8 : priceTab === "Week" ? 40 : 160;
      const multiplier = priceTab === "Hour" ? 1 : priceTab === "Day" ? 8 : priceTab === "Week" ? 35 : 120;
      const total = Math.round(listing.price * multiplier * 1.09);
      const start = new Date();
      start.setDate(start.getDate() + 7);
      const end = new Date(start);
      end.setHours(end.getHours() + hours);

      const b = await createBooking({
        listingId: listing.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        hours,
        guests,
        total,
        useCase,
      });
      router.push(`/checkout?bookingId=${b.id}`);
    } catch {
      setBookError("Please sign in to book this space.");
      setBooking(false);
    }
  }

  const hostInitials = listing?.host.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  if (loading) return (
    <>
      <Nav />
      <div style={{ display: "grid", placeItems: "center", height: "60vh", color: "var(--text-2)" }}>Loading…</div>
    </>
  );

  if (!listing) return (
    <>
      <Nav />
      <div style={{ display: "grid", placeItems: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <h2>Listing not found</h2>
          <Link href="/search" style={{ color: "var(--ink)", textDecoration: "underline" }}>Browse spaces</Link>
        </div>
      </div>
    </>
  );

  const priceDisplay = priceTab === "Hour" ? `$${listing.price}` :
    priceTab === "Day" ? `$${listing.price * 8}` :
    priceTab === "Week" ? `$${Math.round(listing.price * 35)}` :
    `$${Math.round(listing.price * 120)}`;

  const totalDisplay = priceTab === "Hour" ? listing.price * 4 :
    priceTab === "Day" ? listing.price * 8 :
    priceTab === "Week" ? Math.round(listing.price * 35) :
    Math.round(listing.price * 120);

  return (
    <>
      <Nav />
      <main style={{ padding: "24px 0 60px" }}>
        <div className="container">
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 14 }}>
            <Link href="/search" style={{ textDecoration: "underline" }}>Spaces in NYC</Link> · {listing.neighborhood} · This space
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.05, margin: "0 0 10px" }}>
            {listing.title}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", color: "var(--text-2)", fontSize: 14, marginBottom: 24 }}>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center", color: "var(--text)", fontWeight: 600 }}>
              <svg className="star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 7 8 .8-6 5.4 1.8 7.8L12 19l-6.8 4 1.8-7.8L0 9.8 8 9Z"/></svg>
              5.00 · {REVIEWS.length} reviews
            </span>
            <span>·</span>
            <span>{listing.location}</span>
            <span>·</span>
            <span>Up to {listing.capacity} guests</span>
            {listing.sqft && <><span>·</span><span>{listing.sqft.toLocaleString()} sqft</span></>}
          </div>

          {/* Gallery */}
          <div style={{ position: "relative", marginBottom: 32 }}>
            <div style={{ height: 480, borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--cream)" }}>
              <img src={listing.img} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* Two-col body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "start" }}>
            <div>
              {/* Host strip */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 22, flexShrink: 0 }}>{hostInitials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>Hosted by {listing.host.name}</div>
                  <div style={{ color: "var(--text-2)", fontSize: 14 }}>{listing.type} · {listing.availability}</div>
                </div>
              </div>

              {/* Features */}
              {[
                { title: "Bookable in any duration", body: "Two-hour openings to three-month residencies — host keeps a flexible calendar." },
                { title: "Payment held in escrow", body: "Your card is authorized at booking; funds release to the host 24 hours after a clean check-out." },
                { title: "Cleaning + insurance baked in", body: "A Biznb-verified cleaner closes every booking. $1M damage protection per session." },
                { title: "Smart-lock entry", body: "Your unique code is texted 30 minutes before your booking." },
              ].map((f) => (
                <div key={f.title} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ width: 32, height: 32, color: "var(--ink)", display: "grid", placeItems: "center", marginTop: 2 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                  </span>
                  <div>
                    <h5 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>{f.title}</h5>
                    <p style={{ margin: 0, color: "var(--text-2)", fontSize: 14, lineHeight: 1.5 }}>{f.body}</p>
                  </div>
                </div>
              ))}

              {/* Description */}
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, lineHeight: 1.15, margin: "36px 0 16px" }}>
                About this <em>space</em>
              </h2>
              <p style={{ color: "var(--text)", fontSize: 15.5, lineHeight: 1.7, maxWidth: 640 }}>{listing.description}</p>

              {/* Amenities */}
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, lineHeight: 1.15, margin: "36px 0 16px" }}>
                What this space <em>offers</em>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px 24px", maxWidth: 640 }}>
                {AMENITIES.map((a) => (
                  <div key={a} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 14.5 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{ width: 20, height: 20, color: "var(--ink)", flexShrink: 0 }}>
                      <path d="M5 12h14"/>
                    </svg>
                    {a}
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, lineHeight: 1.15, margin: "36px 0 16px" }}>
                Where you&apos;ll <em>be</em>
              </h2>
              <p className="muted" style={{ margin: "0 0 14px" }}>{listing.location} · Exact address shared after booking confirms.</p>
              <div style={{ height: 240, background: "#E8E4DA", borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative", maxWidth: 920 }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 0 1px, transparent 1px)", backgroundSize: "80px 80px", transform: "rotate(-8deg) scale(1.5)", opacity: .9 }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "var(--ink)", color: "#fff", padding: "12px 16px", borderRadius: "var(--r-pill)", fontSize: 13, fontWeight: 700, zIndex: 2 }}>
                  {listing.neighborhood}
                </div>
              </div>

              {/* Reviews */}
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, lineHeight: 1.15, marginTop: 48, marginBottom: 0, display: "inline-flex", gap: 8, alignItems: "center" }}>
                <svg className="star" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 7 8 .8-6 5.4 1.8 7.8L12 19l-6.8 4 1.8-7.8L0 9.8 8 9Z"/></svg>
                5.00 · {REVIEWS.length} <em>reviews</em>
              </h2>
              <div style={{ display: "grid", gap: "28px 36px", maxWidth: 720, marginTop: 24 }}>
                {REVIEWS.map((r) => (
                  <div key={r.initials + r.date}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 }}>{r.initials}</span>
                      <div>
                        <b style={{ display: "block", fontSize: 14.5 }}>{r.name}</b>
                        <span style={{ color: "var(--text-2)", fontSize: 13 }}>{r.date}</span>
                      </div>
                    </div>
                    <div style={{ color: "var(--ink)", marginBottom: 4, fontSize: 13 }}>★★★★★</div>
                    <p style={{ margin: "4px 0 0", color: "var(--text)", fontSize: 14.5, lineHeight: 1.55 }}>{r.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking widget */}
            <aside style={{ position: "sticky", top: 96 }}>
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 24, background: "#fff", boxShadow: "var(--shadow-2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <b style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400 }}>{priceDisplay}</b>
                  <span style={{ color: "var(--text-2)", fontSize: 15 }}>/ {priceTab.toLowerCase()}, all-in</span>
                </div>
                <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>Includes Biznb&apos;s 9% fee, cleaner, $1M insurance.</div>

                <div style={{ display: "inline-flex", background: "var(--cream)", borderRadius: "var(--r-pill)", padding: 4, marginBottom: 18 }}>
                  {["Hour", "Day", "Week", "Month"].map((t) => (
                    <button key={t} onClick={() => setPriceTab(t)} style={{ border: 0, background: t === priceTab ? "var(--ink)" : "transparent", padding: "7px 14px", borderRadius: "var(--r-pill)", fontWeight: 600, fontSize: 12.5, color: t === priceTab ? "var(--citron)" : "var(--text-2)", cursor: "pointer" }}>
                      {t}
                    </button>
                  ))}
                </div>

                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", overflow: "hidden", marginBottom: 14 }}>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", color: "var(--text)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Guests</label>
                    <input type="number" value={guests} onChange={e => setGuests(Number(e.target.value))} min={1} max={listing.capacity} style={{ border: 0, fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%" }} />
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", color: "var(--text)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Use case</label>
                    <input type="text" value={useCase} onChange={e => setUseCase(e.target.value)} placeholder="Private event, photoshoot…" style={{ border: 0, fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%" }} />
                  </div>
                </div>

                {bookError && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--r)", padding: "10px 14px", color: "#991B1B", fontSize: 13, marginBottom: 12 }}>
                    {bookError} <Link href="/auth" style={{ textDecoration: "underline", color: "#991B1B" }}>Sign in →</Link>
                  </div>
                )}

                <button onClick={handleBook} disabled={booking} style={{ width: "100%", height: 52, borderRadius: "var(--r-pill)", background: "var(--ink)", color: "#fff", border: 0, fontWeight: 700, fontSize: 16, marginBottom: 12, cursor: booking ? "not-allowed" : "pointer", opacity: booking ? 0.7 : 1 }}>
                  {booking ? "Creating request…" : `Reserve · $${totalDisplay.toLocaleString()}`}
                </button>
                <div style={{ textAlign: "center", color: "var(--text-2)", fontSize: 13, marginBottom: 16 }}>
                  You won&apos;t be charged yet — host approves within 4 hours.
                </div>

                <div style={{ display: "grid", gap: 10, paddingTop: 18, borderTop: "1px solid var(--line)", fontSize: 14 }}>
                  {[
                    [`${priceDisplay} × ${priceTab === "Hour" ? "4 hours" : priceTab === "Day" ? "1 day" : priceTab === "Week" ? "1 week" : "1 month"}`, `$${totalDisplay.toLocaleString()}`],
                    ["Biznb fee (9%)", `$${Math.round(totalDisplay * 0.09).toLocaleString()}`],
                    ["Damage protection", "Included"],
                  ].map(([label, amount]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-2)" }}>{label}</span>
                      <span>{amount}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 6, borderTop: "1px solid var(--line)", fontWeight: 700, fontSize: 15 }}>
                    <span>Total</span><span>${Math.round(totalDisplay * 1.09).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
