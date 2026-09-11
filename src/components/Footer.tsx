import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

const companyLinks: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const candidateLinks: FooterLink[] = [
  { label: "Job Opportunities", href: "/candidates/job-opportunities" },
  { label: "Submit Resume", href: "/candidates/submit-resume" },
  { label: "Career Resources", href: "/candidates/career-resources" },
];

const employerLinks: FooterLink[] = [
  { label: "Employer Recruitment", href: "/employers/recruitment" },
  { label: "Book Consultation", href: "/book-consultation" },
];

const linkClasses =
  "rounded-sm text-sm text-background/70 transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.8c0-1.38-.03-3.16-2-3.16-2 0-2.3 1.5-2.3 3.06V21h-4V9Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.6L5 22H2l8.1-9.3L1 2h6.9l4.8 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.6 1.6-1.6h1.7V3.3C16.5 3.2 15.5 3 14.4 3c-2.5 0-4.2 1.5-4.2 4.3v2.5H7.5v3.2h2.7v8h3.3Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="rounded-sm font-heading text-xl font-bold tracking-tight text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              HR<span className="text-secondary">Proa</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
              Helping people find the right job, and companies find the
              right people — one honest conversation at a time.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-background">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-background">
              For Candidates
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {candidateLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-background">
              For Employers
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {employerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p className="text-sm text-background/60">
            © {year} HRProa. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/support"
              className="rounded-full bg-accent/90 px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              ☕ Buy Me a Coffee
            </Link>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="rounded-sm text-background/60 transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
