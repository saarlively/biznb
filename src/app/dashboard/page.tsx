import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateBookingStatus } from "@/app/actions/bookings";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const [listings, pendingBookings] = await Promise.all([
    prisma.listing.findMany({
      where: { hostId: session.user.id },
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { listing: { hostId: session.user.id }, status: "pending" },
      include: { guest: true, listing: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const thisMonthRevenue = await prisma.booking.aggregate({
    where: {
      listing: { hostId: session.user.id },
      status: { in: ["confirmed", "completed"] },
      createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    },
    _sum: { total: true },
  });

  const name = session.user.name?.split(" ")[0] ?? "there";
  const initials = session.user.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  async function acceptBooking(bookingId: string) {
    "use server";
    await updateBookingStatus(bookingId, "confirmed");
  }

  async function declineBooking(bookingId: string) {
    "use server";
    await updateBookingStatus(bookingId, "cancelled");
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid var(--line)", padding: "28px 16px", background: "var(--bg)", position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", gap: 28 }}>
        <Link href="/" className="logo" style={{ padding: "0 8px 14px", borderBottom: "1px solid var(--line)" }}>
          <span className="logo-mark">B/</span><span>Biznb</span>
        </Link>
        <nav style={{ display: "grid", gap: 2 }}>
          {[
            { href: "/dashboard", label: "Today", active: true },
            { href: "/inbox", label: "Inbox", badge: pendingBookings.length > 0 ? String(pendingBookings.length) : null },
            { href: "/host/new", label: "New listing" },
            { href: "/trips", label: "Trips" },
            { href: "/", label: "Browse" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--r)", fontSize: 14, fontWeight: item.active ? 600 : 500, color: item.active ? "var(--citron)" : "var(--text)", background: item.active ? "var(--ink)" : "transparent", textDecoration: "none" }}>
              {item.label}
              {item.badge && <span style={{ marginLeft: "auto", background: "var(--ink)", color: "var(--citron)", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", padding: 14, borderRadius: "var(--r)", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12, fontSize: 13.5 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{initials}</div>
          <div>
            <b>{session.user.name}</b>
            <div className="muted" style={{ fontSize: 12 }}>{listings.length} listing{listings.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </aside>

      <main style={{ padding: "28px 36px 80px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 400, margin: "0 0 4px", lineHeight: 1.1 }}>Welcome back, {name}</h1>
        <p style={{ color: "var(--text-2)", margin: "0 0 28px" }}>
          {pendingBookings.length > 0 ? `${pendingBookings.length} booking request${pendingBookings.length > 1 ? "s" : ""} waiting on your reply` : "No pending requests right now"}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { dark: true, label: "This month", num: `$${(thisMonthRevenue._sum.total ?? 0).toLocaleString()}`, delta: "Revenue earned" },
            { dark: false, label: "Total listings", num: String(listings.length), delta: `${listings.filter(l => l.status === "live").length} live` },
            { dark: false, label: "Pending requests", num: String(pendingBookings.length), delta: "Need your reply" },
            { dark: false, label: "Total bookings", num: String(listings.reduce((a, l) => a + l._count.bookings, 0)), delta: "Across all spaces" },
          ].map((stat) => (
            <div key={stat.label} style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "18px 18px 16px", background: stat.dark ? "var(--ink)" : "#fff", borderColor: stat.dark ? "var(--ink)" : "var(--line)" }}>
              <div style={{ color: stat.dark ? "rgba(255,255,255,.6)" : "var(--text-2)", fontSize: 12.5, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 38, lineHeight: 1.05, margin: "8px 0 4px", color: stat.dark ? "var(--citron)" : "var(--text)" }}>{stat.num}</div>
              <div style={{ fontSize: 12.5, color: stat.dark ? "rgba(255,255,255,.7)" : "var(--text-2)" }}>{stat.delta}</div>
            </div>
          ))}
        </div>

        {pendingBookings.length > 0 && (
          <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", padding: 22, background: "#fff", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, margin: "0 0 16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              Booking requests
              <Link href="/inbox" style={{ fontFamily: "var(--font-ui)", fontSize: 13, textDecoration: "underline", color: "var(--text)" }}>Inbox →</Link>
            </h3>
            {pendingBookings.map((req) => {
              const guestInitials = req.guest.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={req.id}>
                  <div style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, padding: "14px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{guestInitials}</div>
                    <div>
                      <b style={{ fontSize: 14, fontWeight: 600 }}>{req.guest.name}</b>
                      <div style={{ color: "var(--text-2)", fontSize: 13 }}>{req.listing.title} · {req.startDate.toLocaleDateString()} · {req.guests} guests</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, textAlign: "right" }}>
                      ${req.total.toLocaleString()}<small style={{ display: "block", color: "var(--text-2)", fontWeight: 500, fontSize: 12 }}>all-in</small>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", paddingBottom: 8 }}>
                    <form action={declineBooking.bind(null, req.id)}>
                      <button type="submit" style={{ padding: "6px 12px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 600, border: "1px solid var(--line)", background: "#fff", cursor: "pointer" }}>Decline</button>
                    </form>
                    <form action={acceptBooking.bind(null, req.id)}>
                      <button type="submit" style={{ padding: "6px 12px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 600, border: 0, background: "var(--ink)", color: "#fff", cursor: "pointer" }}>Accept</button>
                    </form>
                    <Link href="/inbox" style={{ padding: "6px 12px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 600, border: "1px solid var(--line)", background: "#fff", textDecoration: "none", color: "var(--text)" }}>Message</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r)", padding: 22, background: "#fff" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, margin: "0 0 16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            Your listings
            <Link href="/host/new" style={{ fontFamily: "var(--font-ui)", fontSize: 13, textDecoration: "underline", color: "var(--text)" }}>+ List a new space</Link>
          </h3>
          {listings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-2)" }}>
              <p style={{ marginBottom: 16 }}>No listings yet.</p>
              <Link href="/host/new" style={{ padding: "10px 20px", background: "var(--ink)", color: "#fff", borderRadius: "var(--r-pill)", textDecoration: "none", fontWeight: 600 }}>List your first space</Link>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "64px 1.5fr 1fr 1fr 80px", gap: 14, padding: "0 0 14px", fontWeight: 700, color: "var(--text-2)", fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase" }}>
                <div /><div>Space</div><div>Status</div><div>Bookings</div><div />
              </div>
              {listings.map((l) => (
                <div key={l.id} style={{ display: "grid", gridTemplateColumns: "64px 1.5fr 1fr 1fr 80px", gap: 14, padding: "14px 0", borderTop: "1px solid var(--line)", alignItems: "center", fontSize: 13.5 }}>
                  <div style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", background: "var(--cream)" }}>
                    <img src={l.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <b style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{l.title}</b>
                    <div className="muted" style={{ fontSize: 12.5 }}>{l.neighborhood} · ${l.price}/hr</div>
                  </div>
                  <div>
                    <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: "var(--r-pill)", fontSize: 11.5, fontWeight: 700, background: l.status === "live" ? "#D9F2DA" : "#F2E2A6", color: l.status === "live" ? "#1B4D2A" : "#614A06" }}>
                      {l.status === "live" ? "Live" : "Draft"}
                    </span>
                  </div>
                  <div>{l._count.bookings}</div>
                  <div>
                    <Link href={`/listing/${l.id}`} style={{ textDecoration: "underline", fontWeight: 600, color: "var(--text)", fontSize: 13.5 }}>View</Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
