"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createListing(data: {
  title: string;
  type: string;
  location: string;
  neighborhood: string;
  description: string;
  price: number;
  capacity: number;
  sqft?: number;
  img: string;
  availability: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const listing = await prisma.listing.create({
    data: {
      ...data,
      status: "live",
      hostId: session.user.id,
    },
  });

  return listing;
}

export async function updateListingStatus(listingId: string, status: "live" | "draft") {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  await prisma.listing.update({
    where: { id: listingId, hostId: session.user.id },
    data: { status },
  });
}
