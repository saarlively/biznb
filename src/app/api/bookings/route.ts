import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { guestId: session.user.id },
    include: { listing: { include: { host: { select: { name: true } } } } },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(bookings);
}
