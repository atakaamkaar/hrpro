import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
};

export default function BookConsultationPage() {
  return (
    <ComingSoon
      title="Book a Free Consultation"
      description="Our booking calendar is almost ready. For now, reach out through our contact page and we'll personally set up a time to talk."
      showBookingCta={false}
    />
  );
}
