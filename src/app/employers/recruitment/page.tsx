import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Employer Recruitment",
};

export default function EmployerRecruitmentPage() {
  return (
    <ComingSoon
      title="Employer Recruitment"
      description="We're putting together the details on how we help you hire. In the meantime, let's talk — we can start finding the right people right away."
    />
  );
}
