import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import SubmitResumeForm from "@/components/SubmitResumeForm";

export const metadata: Metadata = { title: "Submit Your Resume" };

export default async function SubmitResumePage() {
  const user = await getCurrentUser();

  return (
    <section className="flex-1 bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Submit Your Resume
        </h1>
        <p className="mt-3 text-foreground/70">
          Tell us who you are: send your resume and, if you&apos;re comfortable, a short video
          introduction. A real person on our team will take it from there.
        </p>

        <div className="mt-8">
          {user ? (
            <SubmitResumeForm />
          ) : (
            <div className="rounded-2xl border border-foreground/10 bg-background p-8 text-center shadow-sm">
              <p className="text-foreground/80">
                Create a free account first, so we know who this belongs to and you can check its
                status later.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Create an account
                </Link>
                <Link
                  href="/login?next=/candidates/submit-resume"
                  className="inline-flex items-center justify-center rounded-full border-2 border-foreground/25 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-secondary"
                >
                  Log in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
