import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { verifyCaptcha } from "@/lib/captcha";
import {
  saveSubmissionFile,
  ALLOWED_RESUME_TYPES,
  ALLOWED_VIDEO_TYPES,
  RESUME_MAX_BYTES,
  VIDEO_MAX_BYTES,
} from "@/lib/uploads";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You need to be signed in to submit a resume." }, { status: 401 });
  }

  const formData = await request.formData();
  const note = formData.get("note");
  const resume = formData.get("resume");
  const video = formData.get("video");
  const captchaToken = formData.get("captchaToken");
  const captchaAnswer = formData.get("captchaAnswer");
  const honeypot = formData.get("company"); // hidden field real users never fill in

  if (typeof honeypot === "string" && honeypot.length > 0) {
    // Silently "succeed" for bots so they don't learn to leave it blank.
    return NextResponse.json({ ok: true });
  }

  if (!verifyCaptcha(typeof captchaToken === "string" ? captchaToken : null, typeof captchaAnswer === "string" ? captchaAnswer : null)) {
    return NextResponse.json({ error: "Captcha check failed. Please try again." }, { status: 400 });
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }
  if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
    return NextResponse.json({ error: "Resume must be a PDF or Word document." }, { status: 400 });
  }
  if (resume.size > RESUME_MAX_BYTES) {
    return NextResponse.json({ error: "Resume must be under 10 MB." }, { status: 400 });
  }

  const hasVideo = video instanceof File && video.size > 0;
  if (hasVideo) {
    if (!ALLOWED_VIDEO_TYPES.includes((video as File).type)) {
      return NextResponse.json({ error: "Video must be MP4, MOV, or WebM." }, { status: 400 });
    }
    if ((video as File).size > VIDEO_MAX_BYTES) {
      return NextResponse.json({ error: "Video must be under 200 MB." }, { status: 400 });
    }
  }

  // Files are named after the submission id, so the row is created first
  // with placeholder paths and then updated once the files are on disk.
  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      note: typeof note === "string" && note.trim() ? note.trim() : null,
      resumePath: "",
    },
  });

  const resumePath = await saveSubmissionFile(user.username, submission.id, "resume", resume);
  const videoPath = hasVideo
    ? await saveSubmissionFile(user.username, submission.id, "video", video as File)
    : null;

  await prisma.submission.update({
    where: { id: submission.id },
    data: { resumePath, videoPath },
  });

  return NextResponse.json({ ok: true });
}
