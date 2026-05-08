"use client";

import Link from "next/link";

interface ListingCardProps {
  img: string;
  badge: string;
  title: string;
  sub: string;
  price: string;
  meta: string;
  rating: string;
  href?: string;
}

export default function ListingCard({
  img,
  badge,
  title,
  sub,
  price,
  meta,
  rating,
  href = "/listing",
}: ListingCardProps) {
  return (
    <Link className="listing" href={href}>
      <div className="listing-photo">
        <img src={img} alt={title} />
        <span className="badge">{badge} · {meta}</span>
        <button className="heart" aria-label="Save" onClick={(e) => e.preventDefault()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-4.5-9.5-9C.8 8.6 3 5 6.5 5 8.5 5 10.5 6 12 8c1.5-2 3.5-3 5.5-3C21 5 23.2 8.6 21.5 12 19 16.5 12 21 12 21Z" />
          </svg>
        </button>
      </div>
      <div className="listing-meta">
        <div>
          <div className="listing-title">{title}</div>
          <div className="listing-sub">{sub}</div>
          <div className="listing-price"><b>{price}</b> · all-in</div>
        </div>
        <div className="listing-rating">
          <svg className="star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="m12 2 3 7 8 .8-6 5.4 1.8 7.8L12 19l-6.8 4 1.8-7.8L0 9.8 8 9Z" />
          </svg>
          <span>{rating.split(" ")[0]}</span>
        </div>
      </div>
    </Link>
  );
}
