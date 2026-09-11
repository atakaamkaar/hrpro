"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Captcha from "@/components/Captcha";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState({ token: "", answer: "", honeypot: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (captcha.honeypot) return; // bots only
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
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

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-foreground">
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          minLength={3}
          pattern="[a-zA-Z0-9_-]+"
          title="Letters, numbers, underscores, and hyphens only"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={inputClasses}
        />
        <p className="mt-1 text-xs text-foreground/60">Letters, numbers, underscores, and hyphens only.</p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClasses}
        />
        <p className="mt-1 text-xs text-foreground/60">At least 8 characters.</p>
      </div>

      <Captcha onChange={setCaptcha} />

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
