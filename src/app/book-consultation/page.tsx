import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = { title: "Book a Free Consultation" };

export default function BookConsultationPage() {
  return (
    <section className="flex-1 bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Book a Free Consultation
        </h1>
        <p className="mt-3 text-foreground/70">
          Tell us a bit about what you&apos;re looking for and a good time to reach you. This
          isn&apos;t an instant booking — a real person will call you to confirm the time.
        </p>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm text-foreground/80">
          <p className="font-semibold text-foreground">Before you request a time</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Submitting this form isn&apos;t a confirmed booking — we&apos;ll call you to confirm the time.</li>
            <li>Please give us at least 24 hours&apos; notice if you need to cancel or reschedule.</li>
            <li>Repeated no-shows without notice may affect future scheduling.</li>
          </ul>
        </div>

        <div className="mt-8">
          <InquiryForm
            type="CONSULTATION"
            requirePhone
            messageLabel="What would you like to talk about?"
          />
        </div>
      </div>
    </section>
  );
}
