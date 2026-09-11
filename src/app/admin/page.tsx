import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Admin Inbox" };

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "NEW" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"
      }`}
    >
      {status === "NEW" ? "New" : "Reviewed"}
    </span>
  );
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const [submissions, inquiries, users] = await Promise.all([
    prisma.submission.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <section className="flex-1 bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-14">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Admin inbox</h1>
          <p className="mt-2 text-foreground/70">
            Everything candidates and visitors have sent in, in one place.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Candidate submissions ({submissions.length})
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {submissions.length === 0 && (
              <p className="text-sm text-foreground/60">No submissions yet.</p>
            )}
            {submissions.map((submission) => (
              <li
                key={submission.id}
                className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{submission.user.username}</p>
                    <p className="text-xs text-foreground/60">
                      {submission.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={submission.status} />
                </div>
                {submission.note && <p className="mt-3 text-sm text-foreground/80">{submission.note}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium">
                  <a
                    href={`/api/files/${submission.id}/resume`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    View resume
                  </a>
                  {submission.videoPath && (
                    <a
                      href={`/api/files/${submission.id}/video`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      View video
                    </a>
                  )}
                  <form action={`/api/submissions/${submission.id}/status`} method="POST">
                    <button type="submit" className="text-foreground/70 hover:text-foreground hover:underline">
                      Mark as {submission.status === "NEW" ? "reviewed" : "new"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Contact &amp; consultation requests ({inquiries.length})
          </h2>
          <ul className="mt-5 flex flex-col gap-4">
            {inquiries.length === 0 && (
              <p className="text-sm text-foreground/60">Nothing here yet.</p>
            )}
            {inquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {inquiry.name} <span className="font-normal text-foreground/60">· {inquiry.email}</span>
                      {inquiry.phone && <span className="font-normal text-foreground/60"> · {inquiry.phone}</span>}
                    </p>
                    <p className="text-xs text-foreground/60">{inquiry.createdAt.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        inquiry.type === "CONSULTATION" ? "bg-accent/15 text-accent" : "bg-foreground/10 text-foreground/70"
                      }`}
                    >
                      {inquiry.type === "CONSULTATION" ? "Consultation — call to confirm" : "Contact"}
                    </span>
                    <StatusBadge status={inquiry.status} />
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground/80">{inquiry.message}</p>
                <form action={`/api/inquiries/${inquiry.id}/status`} method="POST" className="mt-3">
                  <button type="submit" className="text-sm font-medium text-foreground/70 hover:text-foreground hover:underline">
                    Mark as {inquiry.status === "NEW" ? "reviewed" : "new"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Accounts ({users.length})
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-foreground/10">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="bg-foreground/5 text-foreground/70">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-foreground/10">
                    <td className="px-4 py-3 text-foreground">{u.username}</td>
                    <td className="px-4 py-3 text-foreground/70">{u.role}</td>
                    <td className="px-4 py-3 text-foreground/70">{u.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
