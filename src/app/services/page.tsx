import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Our Services",
};

export default function ServicesPage() {
  return (
    <ComingSoon
      title="Our Services"
      description="This page is still coming together. For a quick overview of how we help, take a look at our homepage — or just book a call and we'll walk you through it."
    />
  );
}
