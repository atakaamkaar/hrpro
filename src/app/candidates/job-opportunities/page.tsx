import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Job Opportunities",
};

export default function JobOpportunitiesPage() {
  return (
    <ComingSoon
      title="Job Opportunities"
      description="We're building a place to browse open roles right here. Until then, tell us what you're looking for and we'll help you find it."
    />
  );
}
