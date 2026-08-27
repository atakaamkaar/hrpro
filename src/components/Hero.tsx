import Link from "next/link";
import fs from "fs";
import path from "path";

// Drop the real photo at public/hero-photo.jpg and it replaces the abstract
// illustration automatically — no code change needed. See documentation.md
// "Adding the hero image".
const HERO_PHOTO_EXISTS = fs.existsSync(path.join(process.cwd(), "public", "hero-photo.jpg"));

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-8 -right-4 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-linear-to-br from-primary/10 via-background to-secondary/10 shadow-sm">
        {HERO_PHOTO_EXISTS ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero-photo.jpg" alt="The HRProa team" className="h-full w-full object-cover" />
        ) : (
          <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className="h-2/5 w-2/5 lg:h-1/3 lg:w-1/3"
          >
            <circle
              cx="100"
              cy="100"
              r="72"
              className="fill-none stroke-primary/40"
              strokeWidth="3"
            />
            <circle cx="100" cy="100" r="6" className="fill-primary" />
            <path d="M100 40 L112 100 L100 100 Z" className="fill-primary" />
            <path d="M100 160 L88 100 L100 100 Z" className="fill-secondary" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Real people, ready to help
          </span>

          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            You don&apos;t have to figure this out{" "}
            <span className="text-primary">alone</span>.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-foreground/70">
            Whether you&apos;re job hunting, hiring, or just not sure what&apos;s
            next in your career, we&apos;re here to help — no jargon, no
            pressure. Just real people, ready to sit down and figure it out
            with you.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book-consultation"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Book a Free Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border-2 border-foreground/25 px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
