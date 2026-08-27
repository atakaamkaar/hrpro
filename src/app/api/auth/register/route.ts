import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { verifyCaptcha } from "@/lib/captcha";

// Letters, numbers, underscore, hyphen only — the username becomes the name
// of this user's upload folder on disk (see src/lib/uploads.ts), so it can't
// contain path separators or other characters that would be unsafe there.
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password, captchaToken, captchaAnswer } = body ?? {};

  if (!verifyCaptcha(captchaToken, captchaAnswer)) {
    return NextResponse.json({ error: "Captcha check failed. Please try again." }, { status: 400 });
  }

  if (typeof username !== "string" || username.trim().length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
  }
  if (!USERNAME_PATTERN.test(username.trim())) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, underscores, and hyphens." },
      { status: 400 }
    );
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
  }

  // First account ever created becomes the admin, so the site is usable
  // out of the box without a separate seed step. Every account after that
  // is a normal user; promote further admins directly in the database.
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "ADMIN" : "USER";

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username: username.trim(), passwordHash, role },
  });

  await createSession(user.id);

  return NextResponse.json({ username: user.username, role: user.role });
}
