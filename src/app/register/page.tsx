import type { Metadata } from "next";
import AuthCard from "@/components/AuthCard";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create an Account" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Tell us who you are — you'll be able to submit your resume and, if you're comfortable, a short video introduction."
    >
      <RegisterForm />
    </AuthCard>
  );
}
