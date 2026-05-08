"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createBooking(data: {
  listingId: string;
  startDate: string;
  endDate: string;
  hours: number;
  guests: number;
  total: number;
  useCase: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const listing = await prisma.listing.findUnique({ where: { id: data.listingId } });
  if (!listing) throw new Error("Listing not found");

  const booking = await prisma.booking.create({
    data: {
      listingId: data.listingId,
      guestId: session.user.id,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      hours: data.hours,
      guests: data.guests,
      total: data.total,
      useCase: data.useCase,
      status: "pending",
    },
  });

  // Create a message thread automatically
  await prisma.thread.create({
    data: {
      bookingId: booking.id,
      listingId: data.listingId,
      hostId: listing.hostId,
      guestId: session.user.id,
    },
  });

  return booking;
}

export async function confirmBooking(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const booking = await prisma.booking.update({
    where: { id: bookingId, guestId: session.user.id },
    data: { status: "confirmed" },
  });

  return booking;
}

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "cancelled") {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
}
