import "server-only";
import fs from "fs/promises";
import path from "path";

// Uploaded files live outside /public on purpose: resumes and videos are
// personal candidate data, not public assets. They're only ever served
// through the authenticated route handler at
// src/app/api/files/[submissionId]/[kind]/route.ts.
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const RESUME_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
export const VIDEO_MAX_BYTES = 200 * 1024 * 1024; // 200 MB

export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

function extensionFor(file: File) {
  const fromName = path.extname(file.name);
  if (fromName) return fromName;
  const bySlash = file.type.split("/")[1];
  return bySlash ? `.${bySlash}` : "";
}

// Each user gets one folder (named after their username, which is validated
// at registration time in src/app/api/auth/register/route.ts to only ever
// contain filesystem-safe characters — see USERNAME_PATTERN there). All of a
// user's uploads across every submission live together in that folder;
// files are prefixed with the submission id so multiple submissions from
// the same person don't overwrite each other.
export async function saveSubmissionFile(
  username: string,
  submissionId: string,
  kind: "resume" | "video",
  file: File
) {
  const dir = path.join(UPLOAD_DIR, username);
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, `${submissionId}-${kind}${extensionFor(file)}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // Stored as a path relative to UPLOAD_DIR so the DB has no dependency on
  // the machine's absolute filesystem layout.
  return path.relative(UPLOAD_DIR, filePath);
}

export function contentTypeFor(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
  };
  return map[ext] ?? "application/octet-stream";
}
