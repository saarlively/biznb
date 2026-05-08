"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  hours: number;
  guests: number;
  total: number;
  status: string;
  useCase: string;
  listing: {
    id: string;
    title: string;
    location: string;
    neighborhood: string;
    img: string;
    host: { name: string };
  };
};

const STATUS_STYLE: Record<string, { background: string; color: string }> = {
  confirmed: { background: "#D9F2DA", color: "#1B4D2A" },
  pending: { background: "#F2E2A6", color: "#614A06" },
  completed: { background: "var(--cream)", color: "var(--ink)" },
  cancelled: { background: "#FEE2E2", color: "#991B1B" },
};

const TABS = ["Upcoming", "Pending", "Completed", "Cancelled"];

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Upcoming");

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tabMap: Record<string, string[]> = {
    Upcoming: ["confirmed"],
    Pending: ["pending"],
    Completed: ["completed"],
    Cancelled: ["cancelled"],
  };

  const filtered = bookings.filter(b => tabMap[activeTab].includes(b.status));
  const upcoming = bookings.filter(b => b.status === "confirmed")[0];

  return (
    <>
      <Nav />
      <main style={{ padding: "32px 0 80px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 400, margin: "0 0 28px", lineHeight: 1.05 }}>
            Your bookings
          </h1>

          <div style={{ display: "flex", gap: 18, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
            {TABS.map((tab) => {
              const count = bookings.filter(b => tabMap[tab].includes(b.status)).length;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "transparent", border: 0, padding: "14px 0", fontSize: 15, fontWeight: 600, color: activeTab === tab ? "var(--text)" : "var(--text-2)", cursor: "pointer", borderBottom: `2px solid ${activeTab === tab ? "var(--ink)" : "transparent"}`, marginBottom: -1, fontFamily: "inherit" }}>
                  {tab}{count > 0 ? ` · ${count}` : ""}
                </button>
              );
            })}
          </div>

          {loading && <div style={{ color: "var(--text-2)", padding: "40px 0" }}>Loading your bookings…</div>}

          {!loading && bookings.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: "var(--text-2)", fontSize: 16, marginBottom: 20 }}>No bookings yet.</p>
              <Link href="/search" style={{ padding: "12px 24px", background: "var(--ink)", color: "#fff", borderRadius: "var(--r-pill)", textDecoration: "none", fontWeight: 600 }}>Browse spaces</Link>
            </div>
          )}

          {activeTab === "Upcoming" && upcoming && (
            <div style={{ background: "var(--ink)", color: "#fff", borderRadius: "var(--r-lg)", padding: "24px 28px", marginBottom: 28, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, margin: "0 0 4px", color: "var(--citron)" }}>
                  {upcoming.listing.title}
                </h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,.8)", fontSize: 14 }}>
                  {new Date(upcoming.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Smart-lock code arrives 30 min before.
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "var(--r)", padding: "14px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>Door code</div>
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 28, color: "var(--citron)", letterSpacing: ".15em", marginTop: 4 }}>7•••</div>
              </div>
            </div>
          )}

          {!loading && filtered.map((b) => (
            <div key={b.id} style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", marginBottom: 18, overflow: "hidden", background: "#fff" }}>
              <div style={{ padding: "16px 22px", background: "var(--cream)", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <div>
                  <b>{new Date(b.startDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</b>
                  {" "}· {b.hours} hours · {b.useCase}
                </div>
                <span style={{ padding: "4px 10px", borderRadius: "var(--r-pill)", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em", ...STATUS_STYLE[b.status] }}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 24, padding: 22, alignItems: "center" }}>
                <div style={{ width: 200, height: 140, borderRadius: "var(--r)", overflow: "hidden", background: "var(--cream)" }}>
                  <img src={b.listing.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>{b.listing.title}</h3>
                  <div style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6 }}>
                    {b.listing.location} · Hosted by {b.listing.host.name}<br />
                    {b.guests} guests · {b.useCase}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, display: "block" }}>${b.total.toLocaleString()}</b>
                  <small style={{ color: "var(--text-2)", fontSize: 12.5 }}>all-in</small>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
                    <Link href="/inbox" style={{ padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textDecoration: "none", color: "var(--text)" }}>Message host</Link>
                    <Link href={`/listing/${b.listing.id}`} style={{ padding: "8px 14px", borderRadius: "var(--r-pill)", border: 0, background: "var(--ink)", color: "#fff", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>View listing</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && bookings.length > 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-2)", fontSize: 15 }}>
              No {activeTab.toLowerCase()} bookings
            </div>
          )}
        </div>
      </main>
    </>
  );
}
