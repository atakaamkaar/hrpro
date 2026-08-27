import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyCaptcha } from "@/lib/captcha";

// Backs the Contact and Book Consultation forms. There's no email/SMTP
// account configured yet (that needs credentials from whoever owns the
// domain's email), so for now a submission is just stored and shows up in
// /admin — see documentation.md "What's not wired up yet".
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, message, type, captchaToken, captchaAnswer, company } = body ?? {};

  if (typeof company === "string" && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!verifyCaptcha(captchaToken, captchaAnswer)) {
    return NextResponse.json({ error: "Captcha check failed. Please try again." }, { status: 400 });
  }

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const inquiryType = type === "CONSULTATION" ? "CONSULTATION" : "CONTACT";
  if (inquiryType === "CONSULTATION" && (typeof phone !== "string" || !phone.trim())) {
    return NextResponse.json(
      { error: "A phone number is required so we can confirm the consultation." },
      { status: 400 }
    );
  }

  await prisma.inquiry.create({
    data: {
      type: inquiryType,
      name: name.trim(),
      email: email.trim(),
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      message: message.trim(),
    },
  });

  return NextResponse.json({ ok: true });
}
