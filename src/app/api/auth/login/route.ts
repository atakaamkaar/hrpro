import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body ?? {};

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    // Same message either way, so a bad guess can't reveal which usernames exist.
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({ username: user.username, role: user.role });
}
