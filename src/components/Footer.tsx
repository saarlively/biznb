import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo" style={{ marginBottom: 14 }}>
              <span className="logo-mark">B/</span>
              <span>Biznb</span>
            </Link>
            <p className="muted" style={{ fontSize: 14, maxWidth: 320, marginTop: 8 }}>
              A new kind of marketplace for the working hours of the city.
              Rent the spaces around you, by the hour or by the month.
            </p>
          </div>
          <div>
            <h5>Discover</h5>
            <ul>
              <li><Link href="/search">All spaces</Link></li>
              <li><Link href="/search">Pop-up dining</Link></li>
              <li><Link href="/search">Photo + film locations</Link></li>
              <li><Link href="/search">Day offices</Link></li>
              <li><Link href="/search">Event venues</Link></li>
            </ul>
          </div>
          <div>
            <h5>Hosting</h5>
            <ul>
              <li><Link href="/host/new">List your space</Link></li>
              <li><Link href="#">Host requirements</Link></li>
              <li><Link href="#">Cleaning + insurance</Link></li>
              <li><Link href="#">Payouts</Link></li>
              <li><Link href="#">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h5>Biznb</h5>
            <ul>
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Trust + safety</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Press</Link></li>
              <li><Link href="#">Help center</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Biznb, Inc. · Privacy · Terms · Cookies</span>
          <span>English (US) · USD</span>
        </div>
      </div>
    </footer>
  );
}
