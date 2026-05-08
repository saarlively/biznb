import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InboxClient from "./InboxClient";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const threads = await prisma.thread.findMany({
    where: { OR: [{ hostId: session.user.id }, { guestId: session.user.id }] },
    include: {
      host: { select: { id: true, name: true } },
      guest: { select: { id: true, name: true } },
      listing: { select: { id: true, title: true, img: true, neighborhood: true } },
      booking: { select: { id: true, status: true, total: true, startDate: true, endDate: true, guests: true, useCase: true } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <InboxClient threads={threads} userId={session.user.id} userName={session.user.name ?? ""} />;
}
