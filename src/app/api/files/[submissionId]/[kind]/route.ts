import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fetchSubmissionFile, contentTypeFor } from "@/lib/uploads";

// Streams a candidate's resume/video back only to the admin who's reviewing
// it or the candidate who uploaded it. The file itself lives in Vercel Blob
// storage under a "public" (but unguessable, cuid-keyed) pathname — this
// route is what actually enforces access control: it fetches the blob
// server-side and streams the bytes back, and the direct Blob URL is never
// handed to the browser.
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

  const pathname = kind === "resume" ? submission.resumePath : submission.videoPath;
  if (!pathname) return NextResponse.json({ error: "No file for this submission" }, { status: 404 });

  try {
    const { data, contentType } = await fetchSubmissionFile(pathname);
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType || contentTypeFor(pathname),
        "Content-Disposition": `inline; filename="${path.basename(pathname)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing in storage" }, { status: 404 });
  }
}
