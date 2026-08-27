import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { UPLOAD_DIR, contentTypeFor } from "@/lib/uploads";

// Streams a candidate's resume/video back only to the admin who's reviewing
// it or the candidate who uploaded it — this is personal data, so it's
// intentionally not under /public.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string; kind: string }> }
) {
  const { submissionId, kind } = await params;
  if (kind !== "resume" && kind !== "video") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = submission.userId === user.id;
  if (!isOwner && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const relativePath = kind === "resume" ? submission.resumePath : submission.videoPath;
  if (!relativePath) return NextResponse.json({ error: "No file for this submission" }, { status: 404 });

  const fullPath = path.join(UPLOAD_DIR, relativePath);

  // Guard against a submissionId/kind combo ever resolving outside UPLOAD_DIR.
  if (!fullPath.startsWith(UPLOAD_DIR)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const data = await fs.readFile(fullPath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentTypeFor(fullPath),
        "Content-Disposition": `inline; filename="${path.basename(fullPath)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing on disk" }, { status: 404 });
  }
}
