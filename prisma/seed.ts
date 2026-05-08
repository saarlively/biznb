import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  // Clean slate
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("password123", 12);

  // Seed host
  const elena = await prisma.user.create({
    data: { name: "Elena Marquez", email: "elena@orchardgallery.com", password: pw },
  });

  // Seed guest
  const james = await prisma.user.create({
    data: { name: "James Donovan", email: "james@demo.com", password: pw },
  });

  const listingsData = [
    {
      title: "Orchard Gallery — 60-ft white wall",
      type: "Gallery",
      location: "Lower East Side, Manhattan",
      neighborhood: "Lower East Side",
      description: "A stunning 1,200-square-foot exhibition space set inside a converted 1920s textile loft. The main room features a 60-foot continuous white wall, polished concrete floors, and 14-foot ceilings with rigged track lighting on a four-circuit dimmer. Kitchen access and freight elevator included.",
      price: 340,
      capacity: 80,
      sqft: 1200,
      status: "live",
      img: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800&auto=format&fit=crop",
      availability: "Tue + Wed",
    },
    {
      title: "Cobble Hill Test Kitchen",
      type: "Pro kitchen",
      location: "Cobble Hill, Brooklyn",
      neighborhood: "Cobble Hill",
      description: "A professional commissary kitchen with 6 full stations, double convection ovens, and walk-in coolers. Ideal for recipe development, pop-up dinners, and catering prep. Health code compliant and fully ventilated.",
      price: 95,
      capacity: 12,
      sqft: 1200,
      status: "live",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
      availability: "24/7",
    },
    {
      title: "Greene Street Project Space",
      type: "Gallery",
      location: "Soho, Manhattan",
      neighborhood: "Soho",
      description: "1,600 sqft of raw project space in the heart of Soho. Concrete floors, 14-ft ceilings, and a freight elevator make this ideal for exhibitions, installations, showrooms, and brand activations.",
      price: 420,
      capacity: 50,
      sqft: 1600,
      status: "live",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
      availability: "Mondays",
    },
    {
      title: "Madison Counsel — meeting room",
      type: "Office / law firm",
      location: "Midtown, Manhattan",
      neighborhood: "Midtown",
      description: "A sleek 16-person boardroom in a full-service Midtown law firm. Full AV, whiteboard walls, park views, and dedicated receptionist during business hours.",
      price: 180,
      capacity: 16,
      sqft: 600,
      status: "draft",
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
      availability: "Eves + weekends",
    },
    {
      title: "The Wythe Loft — full floor",
      type: "Event venue",
      location: "Williamsburg, Brooklyn",
      neighborhood: "Williamsburg",
      description: "A 3,200 sqft industrial loft on the top floor of a converted factory. Exposed brick, original timber beams, and panoramic skyline views make this the perfect blank canvas for events, shoots, and productions.",
      price: 580,
      capacity: 150,
      sqft: 3200,
      status: "live",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
      availability: "Fri–Sun",
    },
    {
      title: "Canal Street Studio — daylight cyc",
      type: "Photo + film studio",
      location: "Tribeca, Manhattan",
      neighborhood: "Tribeca",
      description: "A 2,000 sqft photography and film studio with a 30-ft seamless cyclorama wall and north-facing skylights. Includes grip equipment, a makeup room, and client lounge.",
      price: 290,
      capacity: 20,
      sqft: 2000,
      status: "live",
      img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop",
      availability: "Mon–Fri",
    },
    {
      title: "Park Slope Wine Bar — after hours",
      type: "Bar / lounge",
      location: "Park Slope, Brooklyn",
      neighborhood: "Park Slope",
      description: "A 45-seat wine bar available after 11pm and all day Sunday. Full bar setup, wine on consignment available, and an intimate basement space for private tastings and small events.",
      price: 220,
      capacity: 45,
      sqft: 900,
      status: "live",
      img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop",
      availability: "Sun + after 11pm",
    },
    {
      title: "Nolita Storefront — pop-up ready",
      type: "Retail storefront",
      location: "Nolita, Manhattan",
      neighborhood: "Nolita",
      description: "A pristine 800 sqft ground-floor retail space with full glass frontage on Prince Street. Existing fixtures can stay or be removed. Perfect for pop-ups, trunk shows, and brand launches.",
      price: 480,
      capacity: 40,
      sqft: 800,
      status: "live",
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop",
      availability: "Daily",
    },
  ];

  const listings = [];
  for (const data of listingsData) {
    const l = await prisma.listing.create({ data: { ...data, hostId: elena.id } });
    listings.push(l);
  }

  // Seed a booking + thread + messages so inbox/trips have content
  const booking = await prisma.booking.create({
    data: {
      listingId: listings[0].id,
      guestId: james.id,
      startDate: new Date("2026-05-16T19:00:00"),
      endDate: new Date("2026-05-16T23:00:00"),
      hours: 4,
      guests: 60,
      total: 4580,
      status: "pending",
      useCase: "Pop-up dinner · 60 guests",
    },
  });

  const thread = await prisma.thread.create({
    data: {
      bookingId: booking.id,
      listingId: listings[0].id,
      hostId: elena.id,
      guestId: james.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        threadId: thread.id,
        senderId: james.id,
        text: "Hi Elena! Big fan of the gallery. We're hosting a 60-person launch dinner on Sat May 16. Mostly press + a few clients. Quiet music, candles on the tables, no crazy load-in.",
        createdAt: new Date("2026-05-08T19:42:00"),
      },
      {
        threadId: thread.id,
        senderId: james.id,
        text: "Caterer is Kismet — they'll bring everything plated, no cooking on site. Would love to know if your bar setup is included or if I should bring my own bartender.",
        createdAt: new Date("2026-05-08T19:43:00"),
      },
      {
        threadId: thread.id,
        senderId: elena.id,
        text: "Hi James — sounds lovely! Bar setup, glassware, and ice are included. You'd just need to bring the bartender + the booze (BYO with a one-day permit, happy to send the link).",
        createdAt: new Date("2026-05-08T21:10:00"),
      },
      {
        threadId: thread.id,
        senderId: elena.id,
        text: "A few quick things: candles need to be in glass holders, music off by midnight, and the cleaner will arrive at midnight to start. Sound okay?",
        createdAt: new Date("2026-05-08T21:11:00"),
      },
      {
        threadId: thread.id,
        senderId: james.id,
        text: "Sounds great. We'll have a small bar setup against the back wall — is the outlet there 20A? Want to make sure our two ice baths don't trip a breaker.",
        createdAt: new Date("2026-05-09T14:14:00"),
      },
    ],
  });

  console.log("✓ Seeded:", {
    users: 2,
    listings: listings.length,
    bookings: 1,
    threads: 1,
  });
  console.log("\nDemo accounts:");
  console.log("  Host:  elena@orchardgallery.com / password123");
  console.log("  Guest: james@demo.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
