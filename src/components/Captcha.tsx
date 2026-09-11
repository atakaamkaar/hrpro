"use client";

import { useEffect, useState } from "react";

type CaptchaProps = {
  onChange: (value: { token: string; answer: string; honeypot: string }) => void;
};

// Renders the "a + b" challenge from /api/captcha and reports the current
// token + typed answer + honeypot value up to the parent form on every
// change, so the parent just reads captcha.token/.answer/.honeypot when it
// submits (this component is also used inside plain <form> submissions,
// where the honeypot input's `name="company"` gets picked up automatically).
export default function Captcha({ onChange }: CaptchaProps) {
  const [question, setQuestion] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [answer, setAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    fetch("/api/captcha")
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
        setToken(data.token);
      });
  }, []);

  useEffect(() => {
    onChange({ token, answer, honeypot });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, answer, honeypot]);

  return (
    <div>
      <label htmlFor="captcha-answer" className="block text-sm font-medium text-foreground">
        Quick check: what&apos;s {question ?? "…"}?
      </label>
      <input
        id="captcha-answer"
        type="text"
        inputMode="numeric"
        required
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        className="mt-1.5 w-32 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Honeypot: hidden from sighted users via CSS, but present in the DOM,
          so most form-filling bots fill it in and out themselves. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>
    </div>
  );
}
