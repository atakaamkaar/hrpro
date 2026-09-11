import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.inquiry.update({
    where: { id },
    data: { status: inquiry.status === "NEW" ? "REVIEWED" : "NEW" },
  });

  return NextResponse.redirect(new URL("/admin", request.url));
}
