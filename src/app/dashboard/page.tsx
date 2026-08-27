import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Your Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const submissions = await prisma.submission.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="flex-1 bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Hi, {user.username}
        </h1>
        <p className="mt-2 text-foreground/70">
          {user.role === "ADMIN"
            ? "You're an admin — head to the "
            : "Here's what you've sent us so far."}
          {user.role === "ADMIN" && (
            <Link href="/admin" className="font-medium text-primary hover:underline">
              admin inbox
            </Link>
          )}
          {user.role === "ADMIN" && " to review everyone's submissions."}
        </p>

        {submissions.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-foreground/20 p-8 text-center">
            <p className="text-foreground/70">You haven&apos;t submitted a resume yet.</p>
            <Link
              href="/candidates/submit-resume"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Submit your resume
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {submissions.map((submission) => (
              <li
                key={submission.id}
                className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground/60">
                    Submitted {submission.createdAt.toLocaleDateString()}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      submission.status === "NEW"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {submission.status === "NEW" ? "Received" : "Reviewed"}
                  </span>
                </div>
                {submission.note && <p className="mt-3 text-sm text-foreground/80">{submission.note}</p>}
                <div className="mt-4 flex gap-4 text-sm font-medium text-primary">
                  <a href={`/api/files/${submission.id}/resume`} target="_blank" rel="noreferrer" className="hover:underline">
                    View resume
                  </a>
                  {submission.videoPath && (
                    <a href={`/api/files/${submission.id}/video`} target="_blank" rel="noreferrer" className="hover:underline">
                      View video
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
