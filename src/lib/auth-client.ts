import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

function getValidClientUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const raw =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "http://localhost:3000";

  let cleaned = raw.trim();
  const mdMatch = cleaned.match(/https?:\/\/[^\s\)]+/);
  if (mdMatch) {
    cleaned = mdMatch[0];
  }
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return "http://localhost:3000";
  }
}

export const authClient = createAuthClient({
  baseURL: getValidClientUrl(),
  plugins: [jwtClient()],
});
