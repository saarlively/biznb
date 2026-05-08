import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: threadId } = await params;
  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const message = await prisma.message.create({
    data: { threadId, senderId: session.user.id, text: text.trim() },
    include: { sender: { select: { id: true, name: true } } },
  });

  return NextResponse.json(message);
}
