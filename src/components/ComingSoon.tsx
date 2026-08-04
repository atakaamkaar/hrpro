import Link from "next/link";

type ComingSoonProps = {
  title: string;
  description: string;
  showBookingCta?: boolean;
};

export default function ComingSoon({
  title,
  description,
  showBookingCta = true,
}: ComingSoonProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
        Coming soon
      </span>

      <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
        {description}
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        {showBookingCta && (
          <Link
            href="/book-consultation"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Book a Free Consultation
          </Link>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border-2 border-foreground/25 px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
