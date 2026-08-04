import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <ComingSoon
      title="Contact Us"
      description="Our contact page is still being built. In the meantime, booking a free consultation is the fastest way to reach a real person."
    />
  );
}
