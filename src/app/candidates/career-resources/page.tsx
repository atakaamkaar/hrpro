import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Career Resources",
};

export default function CareerResourcesPage() {
  return (
    <ComingSoon
      title="Career Resources"
      description="Guides, tips, and resources for your job search are on their way. Until then, a real conversation might get you further anyway."
    />
  );
}
