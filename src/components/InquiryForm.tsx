"use client";

import { useState } from "react";
import Captcha from "@/components/Captcha";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function InquiryForm({
  messageLabel = "Message",
  type = "CONTACT",
  requirePhone = false,
}: {
  messageLabel?: string;
  type?: "CONTACT" | "CONSULTATION";
  requirePhone?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [captcha, setCaptcha] = useState({ token: "", answer: "", honeypot: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (captcha.honeypot) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phone || undefined,
        message,
        type,
        captchaToken: captcha.token,
        captchaAnswer: captcha.answer,
      }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-8 text-center">
        <p className="font-heading text-xl font-semibold text-foreground">Got it, thanks.</p>
        <p className="mt-2 text-foreground/70">A real person will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
      </div>

      {requirePhone && (
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-foreground/60">
            We confirm every consultation by phone before it's final.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          {messageLabel}
        </label>
        <textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClasses} />
      </div>

      <Captcha onChange={setCaptcha} />

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
