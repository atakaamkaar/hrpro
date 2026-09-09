import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fetchSubmissionFile, contentTypeFor } from "@/lib/uploads";

// Streams a candidate's resume/video back only to the admin who's reviewing
// it or the candidate who uploaded it. The files live in a *private* Vercel
// Blob store, so they have no anonymously-readable URL — reading one needs
// the store token, which only the server has. This route is the single way
// that content reaches a browser, and it checks permissions first.
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

  const file = await fetchSubmissionFile(pathname);
  if (!file) return NextResponse.json({ error: "File missing in storage" }, { status: 404 });

  return new NextResponse(file.stream, {
    headers: {
      "Content-Type": file.contentType || contentTypeFor(pathname),
      "Content-Disposition": `inline; filename="${path.basename(pathname)}"`,
    },
  });
}
