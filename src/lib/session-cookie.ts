// Split out from auth.ts so middleware.ts (which runs on the Edge runtime)
// can read the cookie name without pulling in Prisma/bcrypt/Node's `crypto`
// — none of which the Edge runtime supports.
export const SESSION_COOKIE = "hrproa_session";
