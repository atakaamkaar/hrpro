import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Submit Your Resume",
};

export default function SubmitResumePage() {
  return (
    <ComingSoon
      title="Submit Your Resume"
      description="We're setting up a simple way to send us your resume right from here. For now, book a quick call and we'll take it from there."
    />
  );
}
