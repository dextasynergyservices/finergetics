import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";
import { db } from "@/server/db/client";
import { account, session, user, verification } from "@/server/db/schema/auth";
import { sendPasswordResetEmail } from "@/server/email/send";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user: targetUser, token }) => {
      try {
        await sendPasswordResetEmail({
          name: targetUser.name,
          email: targetUser.email,
          token,
          requestedBy: "An administrator",
        });
      } catch (err) {
        console.error(
          "[Better Auth] Failed to dispatch password reset email:",
          err,
        );
      }
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "editor",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});

export type Auth = typeof auth;
