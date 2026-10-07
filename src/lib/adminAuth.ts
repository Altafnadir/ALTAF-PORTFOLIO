import { NextRequest } from "next/server";
import { createHmac } from "crypto";

const COOKIE_NAME = "altaf_admin_session";
const FALLBACK_SECRET = "portfolio-admin-secret-salt-2026";

/**
 * Returns the configured admin password from environment.
 */
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

/**
 * Generates an authentication token signed with the admin secret.
 */
export function generateAdminToken(): string {
  const secret = getAdminPassword() + FALLBACK_SECRET;
  return createHmac("sha256", secret).update("authenticated_admin").digest("hex");
}

/**
 * Validates whether the incoming request contains a valid admin session cookie.
 */
export function isRequestAuthenticated(req: NextRequest): boolean {
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!sessionCookie) return false;

  const validToken = generateAdminToken();
  return sessionCookie === validToken;
}

export { COOKIE_NAME };
