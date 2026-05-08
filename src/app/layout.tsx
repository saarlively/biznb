import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Biznb — Rent the spaces you need, by the hour or by the month",
  description:
    "Rent restaurants, storefronts, offices, galleries and venues — by the hour, day, week, or month. Payment is held in escrow, cleaning is included, and every host is verified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
