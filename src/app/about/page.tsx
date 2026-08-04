import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <ComingSoon
      title="About Us"
      description="We're still writing this page. In the meantime, know that there are real people behind HRProa who'd genuinely like to help — book a call and say hello."
    />
  );
}
