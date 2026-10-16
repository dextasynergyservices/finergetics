import { z } from "zod";

export const inviteUserSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid work email address"),
  role: z.enum(["admin", "editor"]).default("editor"),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
