import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
};

export default function FaqPage() {
  return (
    <ComingSoon
      title="Frequently Asked Questions"
      description="We're gathering the questions we hear most so you don't have to ask twice. Until it's ready, just ask us directly."
    />
  );
}
