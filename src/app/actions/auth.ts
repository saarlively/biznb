"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "All fields are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hashed } });

  return { success: true };
}
