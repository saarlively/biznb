import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { confirmBooking } from "@/app/actions/bookings";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const { bookingId } = await searchParams;
  if (!bookingId) redirect("/search");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, guestId: session.user.id },
    include: { listing: { include: { host: true } } },
  });

  if (!booking) redirect("/search");

  async function handleConfirm() {
    "use server";
    await confirmBooking(bookingId!);
    redirect("/trips?confirmed=1");
  }

  const dateStr = booking.startDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
  const timeStr = `${booking.startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – ${booking.endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  const fee = Math.round(booking.total * 0.09);
  const base = booking.total - fee;

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">B/</span><span>Biznb</span>
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: 18, alignItems: "center", color: "var(--text-2)", fontSize: 14 }}>
            <span>Confirm + pay</span>
          </div>
        </div>
      </header>

      <main style={{ padding: "28px 0 80px" }}>
        <div className="container">
          <Link href={`/listing/${booking.listingId}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text)", marginBottom: 18, textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to listing
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, margin: "0 0 32px", lineHeight: 1.1 }}>Confirm and pay</h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 460px", gap: 64, alignItems: "start", maxWidth: 1100 }}>
            <div>
              <div style={{ paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>Your booking</h3>
                <div style={{ display: "grid", gap: 14 }}>
                  {[
                    { label: "Date", value: dateStr },
                    { label: "Hours", value: `${timeStr} · ${booking.hours} hours` },
                    { label: "Guests", value: `${booking.guests} guests` },
                    { label: "Use case", value: booking.useCase },
                    { label: "Host", value: booking.listing.host.name },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
                      <div style={{ fontSize: 14.5 }}>
                        <b style={{ fontWeight: 600 }}>{row.label}</b>
                        <span style={{ color: "var(--text-2)", display: "block", marginTop: 2, fontSize: 14 }}>{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "24px 0", borderBottom: "1px solid var(--line)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px" }}>Cancellation policy</h3>
                <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>
                  Free cancellation before the booking date. After that, this reservation is non-refundable.
                </p>
              </div>

              <div style={{ padding: "24px 0", borderBottom: "1px solid var(--line)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px" }}>Ground rules</h3>
                <ul style={{ paddingLeft: 18, margin: "8px 0 0", color: "var(--text)", fontSize: 14, lineHeight: 1.7 }}>
                  <li>Follow the host&apos;s rules — capacity, music curfew, alcohol</li>
                  <li>Treat the host&apos;s space like your own business</li>
                  <li>Leave by your booked end time so the cleaner can do their job</li>
                </ul>
              </div>

              <div style={{ padding: "24px 0" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px" }}>Pay with</h3>
                <p style={{ color: "var(--text-2)", fontSize: 14, margin: "0 0 16px" }}>
                  Your card is authorized now. Funds release to the host 24 hours after a clean check-out.
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: "1px solid var(--ink)", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14.5, fontWeight: 500, background: "var(--cream)" }}>
                    <input type="radio" name="pay" defaultChecked style={{ accentColor: "var(--ink)" }} />
                    <span>Credit or debit card</span>
                    <span style={{ marginLeft: "auto", display: "flex", gap: 4, opacity: .7 }}>
                      {["VISA", "MC", "AMEX"].map((c) => <span key={c} style={{ padding: "2px 6px", border: "1px solid var(--line)", borderRadius: 4, fontSize: 11, fontWeight: 700, background: "#fff", color: "var(--text-2)" }}>{c}</span>)}
                    </span>
                  </label>
                  <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
                    <input type="text" placeholder="Card number" style={{ border: "1px solid var(--line)", borderRadius: "var(--r-xs)", padding: "14px", fontFamily: "inherit", fontSize: 14.5, outline: "none", width: "100%", boxSizing: "border-box" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input type="text" placeholder="MM/YY" style={{ border: "1px solid var(--line)", borderRadius: "var(--r-xs)", padding: "14px", fontFamily: "inherit", fontSize: 14.5, outline: "none" }} />
                      <input type="text" placeholder="CVC" style={{ border: "1px solid var(--line)", borderRadius: "var(--r-xs)", padding: "14px", fontFamily: "inherit", fontSize: 14.5, outline: "none" }} />
                    </div>
                  </div>
                </div>

                <div style={{ background: "var(--cream)", borderRadius: "var(--r)", padding: 18, display: "flex", gap: 14, marginTop: 16 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--ink)", flexShrink: 0, marginTop: 3 }}>
                    <rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                  </svg>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 14.5, fontWeight: 700 }}>Held in escrow with Biznb Trust.</h4>
                    <p style={{ margin: 0, color: "var(--text)", fontSize: 13.5, lineHeight: 1.55 }}>
                      The host doesn&apos;t see a dollar until 24 hours after check-out. Damage protection up to $1M is included automatically.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 28, color: "var(--text-2)", fontSize: 13, lineHeight: 1.55 }}>
                  By selecting <b>Confirm and pay</b>, I agree to the host&apos;s House Rules and Biznb&apos;s{" "}
                  <a href="#" style={{ textDecoration: "underline", color: "var(--text)" }}>Booking + Payments Terms</a>.
                </div>

                <form action={handleConfirm}>
                  <button type="submit" style={{ width: "100%", height: 54, border: 0, borderRadius: "var(--r-pill)", background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 16 }}>
                    Confirm and pay · ${booking.total.toLocaleString()}
                  </button>
                </form>
              </div>
            </div>

            {/* Right rail */}
            <aside>
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 22, boxShadow: "var(--shadow-2)", background: "#fff", position: "sticky", top: 96 }}>
                <div style={{ display: "flex", gap: 14, paddingBottom: 18, borderBottom: "1px solid var(--line)", marginBottom: 18 }}>
                  <div style={{ width: 96, height: 88, borderRadius: "var(--r)", overflow: "hidden", background: "var(--cream)", flexShrink: 0 }}>
                    <img src={booking.listing.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <span style={{ background: "var(--cream)", color: "var(--ink)", padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 6 }}>{booking.listing.type}</span>
                    <b style={{ fontWeight: 600, fontSize: 14.5, display: "block", marginBottom: 2 }}>{booking.listing.title}</b>
                    <span style={{ color: "var(--text-2)", fontSize: 13 }}>{booking.listing.neighborhood}</span>
                  </div>
                </div>

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, margin: "0 0 14px" }}>Price details</h3>
                <div style={{ display: "grid", gap: 12, fontSize: 14, paddingBottom: 18, borderBottom: "1px solid var(--line)" }}>
                  {[
                    [`$${booking.listing.price} × ${booking.hours} hours`, `$${base.toLocaleString()}`],
                    ["Biznb fee (9%)", `$${fee.toLocaleString()}`],
                    ["Damage protection", "Included"],
                  ].map(([label, amount]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-2)" }}>{label}</span>
                      <span>{amount}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 18, fontWeight: 700, fontSize: 16 }}>
                  <span>Total (USD)</span><span>${booking.total.toLocaleString()}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
