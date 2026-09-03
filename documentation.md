# HRProa — Documentation

What this project is, how it's built, and how to keep working on it.

## What this is

A marketing + intake site for HRProa, an HR consultancy / recruitment service. It has two
sides:

- **Public marketing pages** — Home, About, Services, FAQ, Blog, Contact, Book Consultation,
  Job Opportunities, Career Resources, Employer Recruitment. Most of these still have real
  placeholder copy to be filled in with the actual business content (pricing, differentiators,
  actual job listings, etc.) — that's a content task, not a code task.
- **A simple accounts + intake system**: candidates create an account, submit a resume and
  (optionally) a short video introduction, and an admin reviews everything from `/admin`.

## Getting started

You need two things before `npm install`: a Postgres database and a Vercel Blob store (for
resume/video uploads). Both have free tiers and take a couple of minutes:

1. **Database** — create a free project at [neon.tech](https://neon.tech), copy its connection
   string.
2. **File storage** — in the Vercel dashboard, open this project → **Storage** → **Create
   Database** → **Blob**. Once connected, `vercel env pull .env` will fetch the token for you
   (or copy it manually from the store's ".env.local" tab).

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL, BLOB_READ_WRITE_TOKEN, CAPTCHA_SECRET
npx prisma migrate dev    # creates the schema in your Postgres database
npm run dev
```

Open http://localhost:3000. The **first account you register becomes the admin** automatically
(see "Accounts & roles" below) — every account after that is a normal user.

Generate a real `CAPTCHA_SECRET` for `.env` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Project structure (what to know)

```
prisma/schema.prisma        Database schema (User, Session, Submission, Inquiry)
src/lib/db.ts                Prisma client
src/lib/auth.ts              Password hashing, sessions, requireUser()/requireRole()
src/lib/session-cookie.ts    Just the cookie name — kept separate so middleware.ts
                              (Edge runtime) doesn't have to load Prisma/bcrypt/crypto
src/lib/captcha.ts            Signed math-captcha challenge/verify
src/lib/uploads.ts            Saving/serving resume & video files
middleware.ts                 Redirects signed-out visitors away from /admin and /dashboard
src/app/api/**                All backend logic — see "How each piece works" below
src/app/{admin,dashboard,login,register}/  The account-related pages
src/components/*.tsx           UI components (mostly unchanged from the original build)
```

## Database

Runs on **PostgreSQL** — a free [Neon](https://neon.tech) project works for both local dev and
production; use the same `DATABASE_URL` in both, or a separate Neon project per environment if
you'd rather keep dev data separate from production. Run `npx prisma migrate deploy` against
whichever database `DATABASE_URL` points to.

Schema:

- **User** — `username`, `passwordHash`, `role` (`ADMIN` or `USER`)
- **Session** — an opaque random token tied to a user, with an expiry. Logging out = deleting
  the row. There's no JWT here on purpose — a session is valid exactly when a matching,
  unexpired row exists, which is easy to reason about and easy to revoke.
- **Submission** — a candidate's resume + optional video + note, linked to their account
- **Inquiry** — messages from the public Contact / Book Consultation forms (no account needed).
  Has a `type` (`CONTACT` or `CONSULTATION`) and an optional `phone`, required for
  `CONSULTATION` — see "Consultation workflow" below.

## Accounts & roles

Two roles: `ADMIN` and `USER`. There's no invite/promotion UI yet — the **first account ever
registered is automatically made admin** (see `src/app/api/auth/register/route.ts`), which
means the app is usable immediately without a manual seeding step. To promote someone else
later, update their `role` directly in the database (or with `npx prisma studio`, a GUI Prisma
ships with).

- `USER` can: register, log in, submit a resume/video, see their own submissions on
  `/dashboard`.
- `ADMIN` can: everything a `USER` can, plus see **everyone's** submissions, inquiries, and the
  full accounts list on `/admin`, and mark items as reviewed.

Passwords are hashed with bcrypt (`src/lib/auth.ts`), never stored or logged in plain text.
`middleware.ts` blocks signed-out visitors from `/admin/*` and `/dashboard/*` at the network
edge; each page then does a second, real check (`getCurrentUser()` / role check) against the
database, since middleware can't query the database itself.

## How candidate submissions work

1. A signed-in user fills out the form at `/candidates/submit-resume`
   (`src/components/SubmitResumeForm.tsx`), which posts to `POST /api/submissions` as
   `multipart/form-data` (needed because it includes files).
2. The server creates a `Submission` row, then uploads the resume (and video, if given) to
   **Vercel Blob** storage under `<username>/<submissionId>-<kind>.<ext>` (`saveSubmissionFile`
   in `src/lib/uploads.ts`). Every file a user has ever uploaded, across every submission, lives
   under that one path prefix named after their username (per the business decision to organize
   storage this way). Because the username becomes part of the storage path, registration only
   allows letters, numbers, underscores, and hyphens (`USERNAME_PATTERN` in
   `src/app/api/auth/register/route.ts`).
3. Files are only ever served back through `GET /api/files/[submissionId]/[kind]`, which checks
   that the requester is either the owner or an admin, then fetches the blob **server-side** and
   streams the bytes back — the browser never receives Blob's own URL for the file.

**On "public" access:** Vercel Blob doesn't have a private/authenticated access mode — every
blob has a URL that works for anyone who has it. What keeps these files from being wide open is
that the pathname includes the submission's `cuid` (long, random, effectively unguessable), and
the app never exposes that direct Blob URL anywhere — access control lives entirely in the
`/api/files` route above. This is "unguessable," not truly private; if that's not good enough
once real candidate data is involved, look at Vercel Blob's client-upload + signed-URL options,
or move to S3 with real per-object ACLs.

## CAPTCHA / spam protection

Every public form (register, submit-resume, contact, book-consultation) has two layers:

1. **A signed math challenge** (`src/lib/captcha.ts`) — "what's 3 + 7?", generated server-side,
   the expected answer + expiry embedded in an HMAC-signed token so it can't be tampered with,
   and nothing is stored in the database for it.
2. **A honeypot field** (`src/components/Captcha.tsx`) — an input hidden from sighted users via
   CSS but present in the HTML; most bots fill in every field they find, real users never see
   it.

This stops generic spam bots without needing an external service or API key from anyone. If
abuse gets more sophisticated later, swap in reCAPTCHA/hCaptcha — that needs a site key from
whoever owns the domain's Google/hCaptcha account.

## Consultation workflow

Per the business decision to skip real-time calendar booking for now: `/book-consultation`
(`src/app/book-consultation/page.tsx`) is a `POST /api/inquiries` form like Contact, but with
`type="CONSULTATION"` and a required phone number — every request needs a manual phone
confirmation call before it's a real booking, and the page displays the 24-hour
cancellation-notice policy above the form. In `/admin`, consultation requests are visibly
tagged "Consultation — call to confirm" and show the phone number, so the admin knows which
messages need a call rather than just a reply.

## Payments / donations

Full payment processing (bank + tax + ZarrinPal) is being set up on the business side, but
isn't connected to this codebase yet — that needs real ZarrinPal merchant credentials passed in
as environment variables, which nobody has entered here. As an immediate, honest placeholder:
the footer has a "Buy Me a Coffee" link to `/support` (`src/app/support/page.tsx`), which
explains payments aren't live yet rather than showing a donate button that silently does
nothing (or worse, pretends to work). Once ZarrinPal credentials exist, wire the real payment
flow into that page and remove the "coming soon" notice.

## What's not wired up yet (by design — needs decisions/access from the business owner)

- **Real email delivery.** Contact/consultation-request messages are stored in the database
  and show up in `/admin`, but nothing emails anyone yet — there's no SMTP/Resend/SendGrid
  account configured. Once one exists, send an email from inside
  `src/app/api/inquiries/route.ts` (and optionally `src/app/api/submissions/route.ts`) after the
  database write.
- **Real ZarrinPal payment processing** — see "Payments / donations" above.
- **The hero photo.** `src/components/Hero.tsx` looks for `public/hero-photo.jpg` and uses it
  automatically if present, otherwise it falls back to the original abstract illustration.
- **Real page content.** About, Services (detail), FAQ, Blog, Job Opportunities, Career
  Resources, and Employer Recruitment are still the original "Coming soon" placeholders — they
  need real copy from the business (pricing, actual differentiators, actual job listings).

## Continuing this project

- `npx prisma studio` opens a local GUI to browse/edit the database directly — handy for
  promoting a user to admin or inspecting a submission without writing SQL.
- There's no test suite. Given the size of the project, manual testing through the UI is the
  intended workflow for now — add tests if/when the app grows past what one person can
  eyeball-verify.
- Keep new backend logic inside `src/lib/*` and thin `route.ts` handlers, the same pattern used
  throughout — it keeps each API route readable in isolation.
