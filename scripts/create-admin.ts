import readline from "node:readline";
import { eq } from "drizzle-orm";
import { auth } from "../src/server/auth/auth";
import { db } from "../src/server/db/client";
import { account, user } from "../src/server/db/schema";

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--") && arg.includes("=")) {
      const [key, value] = arg.slice(2).split("=");
      args[key] = value;
    }
  }
  return args;
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const cliArgs = parseArgs();

  console.log("\n==============================================");
  console.log("  Finergetics CMS — Create Admin Account");
  console.log("==============================================\n");
  console.log("Credentials will be written directly to Neon DB.");
  console.log("No credentials stored in .env or source code.\n");

  let name = cliArgs.name;
  let email = cliArgs.email;
  let password = cliArgs.password;

  let rl: readline.Interface | null = null;
  if (!email || !password) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  if (!name) {
    if (rl) {
      name =
        (await ask(
          rl,
          "Enter Admin Full Name [Default: Finergetics Admin]: ",
        )) || "Finergetics Admin";
    } else {
      name = "Finergetics Admin";
    }
  }

  if (!email && rl) {
    email = await ask(rl, "Enter Admin Email: ");
  }

  if (!email?.includes("@")) {
    console.error("❌ Invalid email address provided.");
    if (rl) rl.close();
    process.exit(1);
  }

  // If user already exists, remove stale records first to allow clean recreate
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email.toLowerCase()))
    .limit(1);

  if (existingUser[0]) {
    console.log(
      `\nFound existing account for "${email}". Refreshing credentials...`,
    );
    await db.delete(account).where(eq(account.userId, existingUser[0].id));
    await db.delete(user).where(eq(user.id, existingUser[0].id));
  }

  if (!password && rl) {
    password = await ask(rl, "Enter Secure Password (min 8 chars): ");
  }

  if (!password || password.length < 8) {
    console.error("❌ Password must be at least 8 characters long.");
    if (rl) rl.close();
    process.exit(1);
  }

  if (rl) rl.close();

  console.log("\n⏳ Registering admin via Better Auth server API...");
  const res = await auth.api.signUpEmail({
    body: {
      email: email.toLowerCase(),
      password,
      name,
    },
  });

  if (!res?.user) {
    console.error("❌ Better Auth registration failed.");
    process.exit(1);
  }

  // Elevate user to admin role
  await db
    .update(user)
    .set({ role: "admin", emailVerified: true })
    .where(eq(user.id, res.user.id));

  console.log("\n✅ Admin account created successfully!");
  console.log(`   User ID: ${res.user.id}`);
  console.log(`   Name:    ${name}`);
  console.log(`   Email:   ${email.toLowerCase()}`);
  console.log(`   Role:    admin`);
  console.log(
    "\nYou can now log in at /admin/login using these credentials.\n",
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Fatal error creating admin user:", err);
  process.exit(1);
});
