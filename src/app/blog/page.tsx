import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog"
      description="We're just getting started on our blog. Check back soon for stories, tips, and things we've learned along the way."
    />
  );
}
