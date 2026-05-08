"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: string;
  text: string;
  createdAt: string | Date;
  sender: { id: string; name: string };
};

type Thread = {
  id: string;
  host: { id: string; name: string };
  guest: { id: string; name: string };
  listing: { id: string; title: string; img: string; neighborhood: string };
  booking: { id: string; status: string; total: number; startDate: string | Date; guests: number; useCase: string } | null;
  messages: Message[];
  createdAt: string | Date;
};

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function relTime(dateStr: string | Date) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function InboxClient({ threads, userId, userName }: { threads: Thread[]; userId: string; userName: string }) {
  const [activeId, setActiveId] = useState(threads[0]?.id ?? null);
  const [msgs, setMsgs] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(threads.map(t => [t.id, t.messages]))
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeId);
  const activeMessages = activeId ? (msgs[activeId] ?? []) : [];
  const otherPerson = activeThread
    ? (activeThread.host.id === userId ? activeThread.guest : activeThread.host)
    : null;

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  async function sendMsg() {
    if (!draft.trim() || !activeId || sending) return;
    setSending(true);
    const text = draft;
    setDraft("");

    const res = await fetch(`/api/threads/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMsgs(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    }
    setSending(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <header style={{ height: 76, display: "flex", alignItems: "center", padding: "0 28px", borderBottom: "1px solid var(--line)", flexShrink: 0, background: "#fff" }}>
        <Link href="/" className="logo"><span className="logo-mark">B/</span><span>Biznb</span></Link>
        <nav style={{ display: "flex", gap: 28, marginLeft: 40 }}>
          {[
            { href: "/search", label: "Browse" },
            { href: "/trips", label: "Trips" },
            { href: "/inbox", label: "Inbox", active: true },
            { href: "/dashboard", label: "Hosting" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{ fontSize: 14.5, fontWeight: item.active ? 700 : 500, color: item.active ? "var(--ink)" : "var(--text-2)", textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", fontSize: 13.5, color: "var(--text-2)" }}>{userName}</div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 360px", flex: 1, overflow: "hidden" }}>
        {/* Thread list */}
        <aside style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 16, borderBottom: "1px solid var(--line)" }}>
            <input placeholder="Search messages" style={{ width: "100%", height: 40, padding: "0 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", fontFamily: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {threads.length === 0 && (
              <div style={{ padding: 24, color: "var(--text-2)", fontSize: 14 }}>No messages yet.</div>
            )}
            {threads.map((thread) => {
              const other = thread.host.id === userId ? thread.guest : thread.host;
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isActive = thread.id === activeId;
              return (
                <div key={thread.id} onClick={() => setActiveId(thread.id)}
                  style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--line)", cursor: "pointer", alignItems: "start", background: isActive ? "var(--cream)" : "#fff", borderLeft: `3px solid ${isActive ? "var(--ink)" : "transparent"}`, paddingLeft: isActive ? 13 : 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>
                    {initials(other.name)}
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <b style={{ fontWeight: 600, fontSize: 14 }}>{other.name}</b>
                      {lastMsg && <time style={{ color: "var(--text-2)", fontSize: 12 }}>{relTime(lastMsg.createdAt)}</time>}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink)", fontWeight: 700, marginTop: 2, letterSpacing: ".03em", textTransform: "uppercase" }}>
                      {thread.listing.title}
                    </div>
                    {lastMsg && (
                      <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2, lineHeight: 1.4, overflow: "hidden", maxHeight: 36 }}>
                        {lastMsg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Conversation */}
        <section style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {activeThread && otherPerson ? (
            <>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--line)", display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--ink)", color: "var(--citron)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 15 }}>{initials(otherPerson.name)}</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{otherPerson.name}</h2>
                  <div style={{ color: "var(--text-2)", fontSize: 13 }}>{activeThread.listing.title}</div>
                </div>
                {activeThread.booking?.status === "pending" && activeThread.host.id === userId && (
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button style={{ padding: "8px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--line)", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Decline</button>
                    <button style={{ padding: "8px 14px", borderRadius: "var(--r-pill)", border: 0, background: "var(--ink)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Accept</button>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10, background: "#fff" }}>
                {activeMessages.length === 0 && (
                  <div style={{ alignSelf: "center", color: "var(--text-2)", fontSize: 14, marginTop: 40 }}>No messages yet. Say hello!</div>
                )}
                {activeMessages.map((msg) => {
                  const isMe = msg.sender.id === userId;
                  return (
                    <div key={msg.id} style={{ maxWidth: "70%", marginLeft: isMe ? "auto" : 0 }}>
                      <div style={{ padding: "12px 16px", borderRadius: 18, borderBottomRightRadius: isMe ? 6 : 18, borderBottomLeftRadius: isMe ? 18 : 6, fontSize: 14.5, lineHeight: 1.5, background: isMe ? "var(--ink)" : "var(--cream)", color: isMe ? "#fff" : "var(--text)" }}>
                        {msg.text}
                      </div>
                      <time style={{ fontSize: 11, color: "var(--text-2)", marginTop: 4, display: "block", textAlign: isMe ? "right" : "left" }}>
                        {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </time>
                    </div>
                  );
                })}
                <div ref={msgsEndRef} />
              </div>

              <div style={{ borderTop: "1px solid var(--line)", padding: "14px 18px", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  placeholder={`Write a message to ${otherPerson.name}…`}
                  style={{ flex: 1, resize: "none", border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "12px 14px", fontFamily: "inherit", fontSize: 14.5, outline: "none", minHeight: 44, maxHeight: 120 }}
                />
                <button onClick={sendMsg} disabled={sending || !draft.trim()} aria-label="Send" style={{ background: "var(--ink)", color: "#fff", border: 0, height: 44, width: 44, borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0, opacity: sending || !draft.trim() ? 0.5 : 1 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 16-8-6 18-3-7Z"/></svg>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--text-2)" }}>
              Select a conversation
            </div>
          )}
        </section>

        {/* Right rail */}
        {activeThread && (
          <aside style={{ borderLeft: "1px solid var(--line)", padding: 24, overflowY: "auto", background: "var(--bg)" }}>
            {activeThread.booking && (
              <>
                <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-2)", margin: "0 0 10px" }}>Booking</h4>
                <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "12px 14px", fontSize: 13.5, marginBottom: 8 }}>
                  <b>{new Date(activeThread.booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</b>
                  <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 2 }}>{activeThread.booking.guests} guests · {activeThread.booking.useCase}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "12px 14px", fontSize: 13.5, marginBottom: 20 }}>
                  <div>
                    <b>Total</b>
                    <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 2 }}>All-in · escrow</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <b>${activeThread.booking.total.toLocaleString()}</b>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--r-pill)", background: activeThread.booking.status === "confirmed" ? "#D9F2DA" : "#F2E2A6", color: activeThread.booking.status === "confirmed" ? "#1B4D2A" : "#614A06" }}>
                      {activeThread.booking.status.charAt(0).toUpperCase() + activeThread.booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </>
            )}

            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-2)", margin: "0 0 10px" }}>Listing</h4>
            <Link href={`/listing/${activeThread.listing.id}`} style={{ display: "block", background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--r)", overflow: "hidden", marginBottom: 18, textDecoration: "none" }}>
              <div style={{ aspectRatio: "16/9", background: "var(--cream)" }}>
                <img src={activeThread.listing.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 16 }}>
                <b style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{activeThread.listing.title}</b>
                <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2 }}>{activeThread.listing.neighborhood}</div>
              </div>
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}
