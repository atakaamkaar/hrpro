import "server-only";
import path from "path";
import { put, get, del } from "@vercel/blob";

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

  // The store is private, so these blobs have no anonymous-readable URL at
  // all — reading one requires the store token, which only the server has.
  // `addRandomSuffix: false` keeps the pathname predictable so it can be
  // reconstructed from (username, submissionId, kind) alone.
  const blob = await put(pathname, file, { access: "private", addRandomSuffix: false });

  // Stored as-is in the database; fetchSubmissionFile() is the only other
  // place that needs to know how this is shaped.
  return blob.pathname;
}

// Returns the blob as a stream so large videos aren't buffered into memory,
// or null when nothing is stored at that pathname.
export async function fetchSubmissionFile(pathname: string) {
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return null;

  return { stream: result.stream, contentType: result.blob.contentType };
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
