import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const allListings = await prisma.listing.findMany({
    where: { status: "live" },
    orderBy: { createdAt: "asc" },
    take: 8,
  });
  const popular = allListings.slice(0, 4);
  const weekend = allListings.slice(4);
  return (
    <>
      <Nav variant="default" />

      {/* Hero */}
      <section style={{ padding: "28px 0 56px" }}>
        <div className="container">

          {/* Image strip */}
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 12, height: 380, marginBottom: 36 }}>
            <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative", background: "var(--cream)" }}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", left: 16, bottom: 16, background: "rgba(255,255,255,.96)", padding: "8px 14px", borderRadius: "var(--r-pill)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                Le Pigeon — Williamsburg · Mondays + Tuesdays
              </span>
            </div>
            <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative", background: "var(--cream)" }}>
              <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", left: 16, bottom: 16, background: "rgba(255,255,255,.96)", padding: "8px 14px", borderRadius: "var(--r-pill)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                Madison Counsel — full floor · weekdays after 6
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
              <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative", background: "var(--cream)" }}>
                <img src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=700&auto=format&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", left: 14, bottom: 14, background: "rgba(255,255,255,.96)", padding: "6px 12px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 600 }}>
                  Gallery on Orchard
                </span>
              </div>
              <div style={{ borderRadius: "var(--r-lg)", background: "var(--ink)", color: "var(--bg)", padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: 30, lineHeight: 1.1, margin: 0, color: "var(--bg)" }}>
                  Hours.<br />Days. Weeks.<br />Months.
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(["2 hrs", "1 day", "1 week", "3 mo"] as const).map((d, i) => (
                    <span key={d} style={{ border: `1px solid ${i === 0 ? "var(--citron)" : "rgba(255,255,255,.16)"}`, borderRadius: "var(--r-pill)", padding: "8px 12px", fontSize: 13, textAlign: "center", background: i === 0 ? "var(--citron)" : "transparent", color: i === 0 ? "var(--ink)" : "inherit", fontWeight: i === 0 ? 600 : 400 }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ textAlign: "center", margin: "16px auto 28px", maxWidth: 980 }}>
            <span className="eyebrow">A new kind of marketplace</span>
            <h1 className="display h1" style={{ margin: "8px 0 0" }}>
              The <em style={{ fontStyle: "italic", color: "var(--ink)" }}>businesses</em> around you,<br />
              <span style={{ background: "var(--citron)", padding: "0 14px", borderRadius: 80 }}>open for booking.</span>
            </h1>
          </div>

          <p style={{ maxWidth: 640, margin: "0 auto 36px", textAlign: "center", color: "var(--text-2)", fontSize: 17, lineHeight: 1.55 }}>
            Rent restaurants, storefronts, offices, galleries and venues — by the hour, day, week, or month.
            Payment is held in escrow, cleaning is included, and every host is verified.
            Like the apartment booking you know, but for the city&apos;s working hours.
          </p>

          {/* Search bar */}
          <SearchBar />
        </div>
      </section>

      {/* Categories strip */}
      <CategoriesStrip />

      {/* Popular listings */}
      <section style={{ padding: "36px 0" }}>
        <div className="container">
          <div className="row between" style={{ marginBottom: 22, alignItems: "baseline" }}>
            <h2 className="display h2" style={{ margin: 0 }}>Popular near <em>Brooklyn</em></h2>
            <Link href="/search" className="link-u">See all 240 →</Link>
          </div>
          <div className="listing-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px 18px" }}>
            {popular.map((l) => (
              <ListingCard key={l.id} img={l.img} badge={l.type} title={l.title} sub={l.neighborhood} price={`$${l.price.toLocaleString()}/hr`} meta={`${l.capacity} guests`} rating="4.9 (12)" href={`/listing/${l.id}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial */}
      <section id="how" className="container">
        <div style={{ background: "var(--cream)", borderRadius: "var(--r-lg)", padding: 56, marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "center" }}>
          <div>
            <span className="eyebrow">How Biznb works</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1.05, margin: "12px 0 18px" }}>
              One platform. Every kind of space. Every kind of timeline.
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.6 }}>
              Hosts list the hours their business is closed, slow, or otherwise empty.
              Guests book that space — for an evening, a weekend, or a season. Biznb handles
              access, payment, cleaning, and the paperwork in between.
            </p>
            <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
              {[
                { n: "1", title: "Search like you mean it", body: "Filter by space type, capacity, the exact hours you need, and what you'll be using it for." },
                { n: "2", title: "Book with one tap", body: "Pricing is final — cleaning, the platform fee, and insurance are baked in. Payment is held in escrow until check-out." },
                { n: "3", title: "Show up, do your thing, leave", body: "Smart-lock entry codes, a check-in checklist, and a verified cleaner after every booking." },
              ].map((p) => (
                <div key={p.n} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 14, alignItems: "start" }}>
                  <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{p.n}</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{p.title}</div>
                    <div className="muted">{p.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", aspectRatio: "5/4", background: "#fff" }}>
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1100&auto=format&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* Weekend listings */}
      <section style={{ padding: "36px 0" }}>
        <div className="container">
          <div className="row between" style={{ marginBottom: 22, alignItems: "baseline" }}>
            <h2 className="display h2" style={{ margin: 0 }}>Open <em>this weekend</em></h2>
            <Link href="/search" className="link-u">See all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px 18px" }}>
            {weekend.map((l) => (
              <ListingCard key={l.id} img={l.img} badge={l.type} title={l.title} sub={l.neighborhood} price={`$${l.price.toLocaleString()}/hr`} meta={`${l.capacity} guests`} rating="4.9 (12)" href={`/listing/${l.id}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, padding: "56px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginTop: 64 }}>
          {[
            { title: "Payment held in escrow", body: "Funds release to the host 24 hours after a clean check-out. No surprises, no chasing." },
            { title: "Cleaning is included", body: "Every booking ends with a Biznb-verified cleaner. No stripping beds, no scrubbing kitchens." },
            { title: "One transparent fee", body: "Cleaning, the platform fee, and damage protection are quoted up front, never tacked on later." },
            { title: "Verified hosts and guests", body: "Business licenses on the host side, ID + reviews on the guest side. Trust built in." },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cream)", color: "var(--ink)", display: "grid", placeItems: "center", marginBottom: 14 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}>
                  <rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                </svg>
              </div>
              <h5 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 6px", lineHeight: 1.1 }}>{item.title}</h5>
              <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Host CTA */}
      <section id="host" className="container">
        <div className="host-cta-grid" style={{ marginTop: 64, borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--ink)", color: "var(--bg)", display: "grid", gridTemplateColumns: "1.1fr 1fr", minHeight: 460 }}>
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span className="eyebrow" style={{ color: "var(--citron)" }}>For hosts</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 1.0, margin: "0 0 20px", color: "var(--bg)" }}>
              Your <span style={{ color: "var(--citron)", fontStyle: "italic" }}>closed hours</span> are someone else&apos;s prime time.
            </h2>
            <p style={{ color: "rgba(250,250,247,.75)", fontSize: 16, maxWidth: 480, lineHeight: 1.6 }}>
              Restaurants closed Monday lunch. Law firms empty after 7. Galleries dark on Tuesdays.
              Biznb turns every empty hour into revenue, automatically.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button className="btn btn-citron">Estimate my earnings</button>
              <button className="btn btn-ghost" style={{ background: "transparent", color: "var(--bg)", borderColor: "rgba(255,255,255,.25)" }}>How hosting works</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.12)" }}>
              {[["$3.4k", "Avg. monthly host payout"], ["11 min", "To list a space"], ["$1M", "Damage protection per booking"]].map(([num, lab]) => (
                <div key={lab}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 1, color: "var(--citron)", marginBottom: 4 }}>{num}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(250,250,247,.6)" }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--ink-2)", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1100&auto=format&fit=crop" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 32, right: 32, bottom: 32, background: "rgba(15,42,31,.86)", backdropFilter: "blur(10px)", color: "var(--bg)", padding: 22, borderRadius: "var(--r)", fontSize: 14.5, lineHeight: 1.55 }}>
              &ldquo;We&apos;re closed on Mondays anyway. The first month on Biznb covered our linen budget for the year.&rdquo;
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "rgba(250,250,247,.7)" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--citron)", color: "var(--ink)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11 }}>RM</span>
                <span>Renata Marín — Chef-owner, Le Pigeon · Williamsburg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function SearchBar() {
  "use client";
  return (
    <form className="searchbar" action="/search">
      <div className="field">
        <span className="field-label">Where</span>
        <input className="field-value filled" name="where" defaultValue="New York, NY" />
      </div>
      <div className="field">
        <span className="field-label">Space type</span>
        <span className="field-value filled">Any</span>
      </div>
      <div className="field">
        <span className="field-label">Dates</span>
        <span className="field-value">May 14 – May 16</span>
      </div>
      <div className="field">
        <span className="field-label">Hours</span>
        <span className="field-value">6 pm – 11 pm</span>
      </div>
      <div className="field">
        <span className="field-label">Capacity</span>
        <span className="field-value">40 people</span>
      </div>
      <div className="field">
        <span className="field-label">Use case</span>
        <span className="field-value">Pop-up dinner</span>
      </div>
      <div className="field">
        <span className="field-label">Budget</span>
        <span className="field-value">Any</span>
      </div>
      <button type="submit" className="search-submit expanded" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Search</span>
      </button>
    </form>
  );
}

function CategoriesStrip() {
  const cats = [
    "All spaces", "Restaurants", "Retail", "Offices", "Galleries",
    "Event venues", "Pro kitchens", "Photo + film", "Bars + lounges", "Studios", "Co-working",
  ];
  return (
    <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--bg)", position: "sticky", top: 76, zIndex: 30 }}>
      <div className="container">
        <div style={{ display: "flex", gap: 36, overflowX: "auto", padding: "14px 0", scrollbarWidth: "none" }}>
          {cats.map((cat, i) => (
            <Link key={cat} href="/search" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, padding: "6px 4px", color: i === 0 ? "var(--text)" : "var(--text-2)", borderBottom: i === 0 ? "2px solid var(--ink)" : "2px solid transparent", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>
              <span style={{ width: 30, height: 30, display: "grid", placeItems: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{ width: 22, height: 22 }}>
                  <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16"/><path d="M9 21V12h6v9"/><path d="M3 12h18"/>
                </svg>
              </span>
              <span>{cat}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
