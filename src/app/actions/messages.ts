"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function sendMessage(threadId: string, text: string) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  if (!text.trim()) return;

  await prisma.message.create({
    data: {
      threadId,
      senderId: session.user.id,
      text: text.trim(),
    },
  });

  revalidatePath("/inbox");
}
