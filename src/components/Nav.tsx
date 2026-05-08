"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav({ variant }: { variant?: "default" | "logged-in" }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = status === "authenticated" || variant === "logged-in";
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "JD";

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo">
          <span className="logo-mark">B/</span>
          <span>Biznb</span>
        </Link>

        {isLoggedIn ? (
          <>
            <nav className="nav-links">
              <Link href="/search">Browse</Link>
              <Link href="/trips" style={pathname === "/trips" ? { color: "var(--ink)", fontWeight: 700 } : {}}>Trips</Link>
              <Link href="/inbox" style={pathname === "/inbox" ? { color: "var(--ink)", fontWeight: 700 } : {}}>Inbox</Link>
              <Link href="/dashboard" style={pathname === "/dashboard" ? { color: "var(--ink)", fontWeight: 700 } : {}}>Hosting</Link>
            </nav>
            <div style={{ position: "relative" }}>
              <button
                className="nav-account"
                aria-label="Account"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span className="avatar">{initials}</span>
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--r)", boxShadow: "var(--shadow-2)", minWidth: 180, zIndex: 100 }} onClick={() => setMenuOpen(false)}>
                  {session?.user?.name && (
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>
                      <b style={{ display: "block" }}>{session.user.name}</b>
                      <span style={{ color: "var(--text-2)", fontSize: 12 }}>{session.user.email}</span>
                    </div>
                  )}
                  <Link href="/host/new" style={{ display: "block", padding: "12px 16px", fontSize: 14, textDecoration: "none", color: "var(--text)" }}>List your space</Link>
                  <Link href="/dashboard" style={{ display: "block", padding: "12px 16px", fontSize: 14, textDecoration: "none", color: "var(--text)" }}>Dashboard</Link>
                  <Link href="/trips" style={{ display: "block", padding: "12px 16px", fontSize: 14, textDecoration: "none", color: "var(--text)" }}>Your trips</Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", fontSize: 14, color: "var(--text)", background: "transparent", border: 0, borderTop: "1px solid var(--line)", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <nav className="nav-links">
              <Link href="/search">Browse spaces</Link>
              <Link href="/#how">How it works</Link>
              <Link href="/#host">For hosts</Link>
            </nav>
            <Link href="/host/new" className="nav-host">List your space</Link>
            <Link href="/auth" className="nav-account" aria-label="Account">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span className="avatar">JD</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
