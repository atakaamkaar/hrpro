import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support HRProa" };

export default function SupportPage() {
  return (
    <section className="flex-1 bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <span className="text-4xl" aria-hidden="true">
          ☕
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Buy Me a Coffee
        </h1>
        <p className="mt-4 text-foreground/70">
          If HRProa has helped you out, you can support the project with a small donation.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-foreground/20 p-8">
          <p className="font-semibold text-foreground">Payments aren&apos;t live here yet.</p>
          <p className="mt-2 text-sm text-foreground/70">
            Real payment processing needs the merchant credentials to be connected on this site
            (ZarrinPal). Once that&apos;s wired up, this page will let you send a small donation
            (e.g. 300–400 Tomans) directly.
          </p>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex cursor-not-allowed items-center justify-center rounded-full bg-foreground/20 px-7 py-3 text-base font-semibold text-foreground/50"
          >
            Donate — coming soon
          </button>
        </div>
      </div>
    </section>
  );
}
