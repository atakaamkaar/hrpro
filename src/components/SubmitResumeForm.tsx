"use client";

import { useState } from "react";
import Captcha from "@/components/Captcha";

export default function SubmitResumeForm() {
  const [captcha, setCaptcha] = useState({ token: "", answer: "", honeypot: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("captchaToken", captcha.token);
    formData.set("captchaAnswer", captcha.answer);

    const res = await fetch("/api/submissions", { method: "POST", body: formData });
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
        <p className="font-heading text-xl font-semibold text-foreground">Thanks — we&apos;ve got it.</p>
        <p className="mt-2 text-foreground/70">
          You can check the status any time from your{" "}
          <a href="/dashboard" className="font-medium text-primary hover:underline">
            dashboard
          </a>
          .
        </p>
      </div>
    );
  }

  const inputClasses =
    "mt-1.5 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" encType="multipart/form-data">
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-foreground">
          Resume <span className="text-red-600">*</span>
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx"
          className={`${inputClasses} file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary`}
        />
        <p className="mt-1 text-xs text-foreground/60">PDF or Word, up to 10 MB.</p>
      </div>

      <div>
        <label htmlFor="video" className="block text-sm font-medium text-foreground">
          Video introduction <span className="text-foreground/50">(optional)</span>
        </label>
        <input
          id="video"
          name="video"
          type="file"
          accept=".mp4,.mov,.webm"
          className={`${inputClasses} file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary`}
        />
        <p className="mt-1 text-xs text-foreground/60">
          Only if you&apos;re comfortable — a short hello is plenty. MP4, MOV, or WebM, up to 200 MB.
        </p>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-foreground">
          Anything else you&apos;d like us to know? <span className="text-foreground/50">(optional)</span>
        </label>
        <textarea id="note" name="note" rows={4} className={inputClasses} />
      </div>

      <Captcha onChange={setCaptcha} />

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send it over"}
      </button>
    </form>
  );
}
