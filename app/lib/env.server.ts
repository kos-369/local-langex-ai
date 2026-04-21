import { z } from "zod";

const envSchema = z
  .object({
    LLM_PROVIDER: z.enum(["anthropic", "openai", "google"]),
    ANTHROPIC_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    GOOGLE_API_KEY: z.string().optional(),
    ANTHROPIC_MODEL: z.string().optional(),
    OPENAI_MODEL: z.string().optional(),
    GOOGLE_MODEL: z.string().optional(),
  })
  .refine((env) => env.LLM_PROVIDER !== "anthropic" || !!env.ANTHROPIC_API_KEY, {
    message: "ANTHROPIC_API_KEY is required when LLM_PROVIDER=anthropic. Check your .env.local.",
    path: ["ANTHROPIC_API_KEY"],
  })
  .refine((env) => env.LLM_PROVIDER !== "openai" || !!env.OPENAI_API_KEY, {
    message: "OPENAI_API_KEY is required when LLM_PROVIDER=openai. Check your .env.local.",
    path: ["OPENAI_API_KEY"],
  })
  .refine((env) => env.LLM_PROVIDER !== "google" || !!env.GOOGLE_API_KEY, {
    message: "GOOGLE_API_KEY is required when LLM_PROVIDER=google. Check your .env.local.",
    path: ["GOOGLE_API_KEY"],
  });

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function getEnv(): Env {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const msg = firstIssue?.message ?? "Invalid environment configuration.";
    throw new Error(msg);
  }

  cached = parsed.data;
  return cached;
}

export const DEFAULT_MODELS = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o",
  google: "gemini-2.0-flash",
} as const;
