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

  // Admin is granted only to the one username named by ADMIN_USERNAME. This
  // used to be "whoever registers first", which meant that on a public site
  // with an empty database, a passing stranger could claim admin — and admin
  // can read every candidate's resume. Fails closed: with ADMIN_USERNAME
  // unset, nobody is auto-promoted (see documentation.md "Accounts & roles").
  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  const role = adminUsername && username.trim() === adminUsername ? "ADMIN" : "USER";

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username: username.trim(), passwordHash, role },
  });

  await createSession(user.id);

  return NextResponse.json({ username: user.username, role: user.role });
}
