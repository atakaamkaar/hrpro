import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCard from "@/components/AuthCard";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Log in to view your submission or manage the site.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
