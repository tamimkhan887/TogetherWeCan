import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("TogetherWeCan");

function sanitizeUrl(url?: string): string | undefined {
  if (!url) return undefined;
  let cleaned = url.trim();
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
    return undefined;
  }
}

const getBaseUrl = () => {
  const customUrl = sanitizeUrl(process.env.BETTER_AUTH_URL);
  if (customUrl && !customUrl.includes("localhost")) {
    return customUrl;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return customUrl || "http://localhost:3000";
};

export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: getBaseUrl(),
  trustedOrigins: [
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://together-we-can-seven.vercel.app",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
