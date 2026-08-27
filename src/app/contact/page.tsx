import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <section className="flex-1 bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-foreground/70">
          Have a question or just want to say hello? Send us a message and a real person will
          reply.
        </p>
        <div className="mt-8">
          <InquiryForm messageLabel="What's on your mind?" />
        </div>
      </div>
    </section>
  );
}
