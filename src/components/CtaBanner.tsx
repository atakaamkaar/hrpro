import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function CtaBanner() {
  return (
    <section className="bg-linear-to-br from-primary via-primary to-primary-light py-20 lg:py-24">
      <Reveal className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stuck somewhere in the process? Let&apos;s talk about it.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/80">
          You don&apos;t need to have it all figured out before you reach
          out. Tell us where you&apos;re at, and we&apos;ll take it from
          there — together.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/book-consultation"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Book Your Free Consultation
          </Link>
          <Link
            href="/candidates/submit-resume"
            className="rounded-sm text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Or send us your resume
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
