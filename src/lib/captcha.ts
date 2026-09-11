import crypto from "crypto";

// A deliberately simple CAPTCHA: a signed "what's a + b" challenge. No
// external service, no API keys, no database row — the challenge carries its
// own answer and expiry, tamper-evident via an HMAC signature. This stops
// naive bots/spam scripts; it is not meant to stop a determined human or a
// bot built specifically to solve it. Swap in reCAPTCHA/hCaptcha later if
// abuse gets more sophisticated (needs a site key from whoever owns the
// domain's Google/hCaptcha account).

const SECRET = process.env.CAPTCHA_SECRET ?? "dev-only-insecure-captcha-secret";
const TTL_MS = 5 * 60 * 1000; // challenge must be answered within 5 minutes

export type Captcha = {
  question: string;
  token: string; // "a.b.expiresAt.signature", safe to send to the client
};

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function generateCaptcha(): Captcha {
  const a = crypto.randomInt(1, 10);
  const b = crypto.randomInt(1, 10);
  const expiresAt = Date.now() + TTL_MS;
  const payload = `${a}.${b}.${expiresAt}`;
  const token = `${payload}.${sign(payload)}`;

  return { question: `${a} + ${b}`, token };
}

export function verifyCaptcha(token: string | undefined | null, answer: string | undefined | null) {
  if (!token || !answer) return false;

  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [aStr, bStr, expiresAtStr, signature] = parts;

  const payload = `${aStr}.${bStr}.${expiresAtStr}`;
  const expected = sign(payload);
  const validSignature =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!validSignature) return false;

  if (Date.now() > Number(expiresAtStr)) return false;

  const expectedAnswer = Number(aStr) + Number(bStr);
  return Number(answer) === expectedAnswer;
}
