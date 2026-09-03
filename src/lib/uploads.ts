import "server-only";
import path from "path";
import { put, head, del } from "@vercel/blob";

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

// Each user gets one folder — a path prefix in Blob storage, since Blob
// doesn't have real directories — named after their username (validated at
// registration in src/app/api/auth/register/route.ts to only ever contain
// filesystem-safe characters, see USERNAME_PATTERN there). All of a user's
// uploads across every submission live under that prefix; files are
// prefixed with the submission id so multiple submissions from the same
// person don't overwrite each other.
export async function saveSubmissionFile(
  username: string,
  submissionId: string,
  kind: "resume" | "video",
  file: File
) {
  const pathname = `${username}/${submissionId}-${kind}${extensionFor(file)}`;

  // `addRandomSuffix: false` keeps the pathname predictable so it can be
  // reconstructed from (username, submissionId, kind) alone — no separate
  // "here's the real URL" bookkeeping needed. Access is still gated: this
  // pathname is only ever read back through the authenticated route at
  // src/app/api/files/[submissionId]/[kind]/route.ts, which fetches the blob
  // server-side rather than handing out its public URL.
  const blob = await put(pathname, file, { access: "public", addRandomSuffix: false });

  // Stored as-is in the database; contentTypeFor()/fetchSubmissionFile() are
  // the only other places that need to know how this is shaped.
  return blob.pathname;
}

export async function fetchSubmissionFile(pathname: string) {
  const blob = await head(pathname);
  const response = await fetch(blob.downloadUrl);
  return { data: Buffer.from(await response.arrayBuffer()), contentType: blob.contentType };
}

export async function deleteSubmissionFile(pathname: string) {
  await del(pathname);
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
