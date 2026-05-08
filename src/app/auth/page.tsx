"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      if (mode === "signup") {
        const result = await registerUser(form);
        if (result?.error) { setError(result.error); setLoading(false); return; }
      }

      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Left art panel */}
      <aside style={{ background: "var(--ink)", color: "#fff", padding: 56, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <Link href="/" className="logo" style={{ color: "#fff", fontSize: 30 }}>
          <span className="logo-mark" style={{ background: "var(--citron)", color: "var(--ink)" }}>B/</span>
          <span>Biznb</span>
        </Link>

        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 400, lineHeight: 1.05, color: "var(--citron)", margin: "0 0 18px", maxWidth: 420 }}>
            Rent the spaces around you, by the hour or by the month.
          </h2>
          <p style={{ color: "rgba(255,255,255,.8)", fontSize: 16, lineHeight: 1.55, maxWidth: 380 }}>
            Restaurants. Storefronts. Galleries. Offices. Whole event venues — booked the way you book everything else now.
          </p>

          <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "var(--r)", padding: 22, fontSize: 14.5, lineHeight: 1.55, marginTop: 32, maxWidth: 460 }}>
            &ldquo;We&apos;re closed on Mondays anyway. The first month on Biznb covered our linen budget for the year.&rdquo;
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, fontSize: 12.5, color: "rgba(255,255,255,.6)" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--citron)", color: "var(--ink)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 11 }}>RM</span>
              <span>Renata Marín — Chef-owner, Le Pigeon</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 28, maxWidth: 460 }}>
            {[["9k+", "Hosts in 14 cities"], ["$0", "Surprise fees ever"], ["$1M", "Damage protection / booking"]].map(([num, label]) => (
              <div key={label} style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)" }}>
                <b style={{ display: "block", color: "var(--citron)", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, marginBottom: 4 }}>{num}</b>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>© 2026 Biznb, Inc.</div>
      </aside>

      {/* Right form */}
      <main style={{ background: "#fff", padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>
          {/* Toggle */}
          <div style={{ display: "flex", gap: 4, background: "var(--cream)", borderRadius: "var(--r-pill)", padding: 4, marginBottom: 28 }}>
            {(["signin", "signup"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: 10, border: 0, background: m === mode ? "var(--ink)" : "transparent", borderRadius: "var(--r-pill)", fontWeight: 600, fontSize: 14, cursor: "pointer", color: m === mode ? "var(--citron)" : "var(--text-2)" }}>
                {m === "signin" ? "Sign in" : "Create an account"}
              </button>
            ))}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.1 }}>
            {mode === "signin" ? "Welcome back." : "Join Biznb."}
          </h1>
          <p style={{ color: "var(--text-2)", margin: "0 0 28px", fontSize: 14.5 }}>
            {mode === "signin" ? "Sign in with the email you book or host with." : "Create your account to start booking spaces."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text)", marginBottom: 6, display: "block" }}>Full name</label>
                <input name="name" type="text" placeholder="Your name" required style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, background: "#fff", outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text)", marginBottom: 6, display: "block" }}>Email</label>
              <input name="email" type="email" placeholder="you@business.com" required style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, background: "#fff", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text)", marginBottom: 6, display: "block" }}>Password</label>
              <input name="password" type="password" placeholder="••••••••" required minLength={8} style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "var(--r)", fontFamily: "inherit", fontSize: 15, background: "#fff", outline: "none", boxSizing: "border-box" }} />
              {mode === "signin" && (
                <div style={{ textAlign: "right", marginTop: 6 }}>
                  <a href="#" style={{ fontSize: 12.5, color: "var(--text)", textDecoration: "underline" }}>Forgot password?</a>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--r)", padding: "12px 14px", color: "#991B1B", fontSize: 13.5 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: "100%", height: 52, border: 0, borderRadius: "var(--r-pill)", background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 6 }}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div style={{ background: "var(--cream)", borderRadius: "var(--r)", padding: "14px 16px", fontSize: 13, color: "var(--text)", lineHeight: 1.55, display: "flex", gap: 10, marginTop: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--ink)", flexShrink: 0, marginTop: 2 }}>
              <rect x="3" y="6" width="18" height="14" rx="1"/><path d="M3 10h18"/>
            </svg>
            <div>
              <b>Booking on behalf of a business?</b> When you create an account, choose &ldquo;I&apos;m booking for a business&rdquo; so we can verify your EIN and set up Net-30 invoicing if you want it.
            </div>
          </div>

          <div style={{ marginTop: 22, color: "var(--text-2)", fontSize: 12, lineHeight: 1.55 }}>
            By continuing, you agree to Biznb&apos;s{" "}
            <a href="#" style={{ color: "var(--text)", textDecoration: "underline" }}>Terms</a>,{" "}
            <a href="#" style={{ color: "var(--text)", textDecoration: "underline" }}>Privacy Policy</a>, and{" "}
            <a href="#" style={{ color: "var(--text)", textDecoration: "underline" }}>Booking Terms</a>.
          </div>
        </div>
      </main>
    </div>
  );
}
