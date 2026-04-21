import { getEnv } from "../env.server";
import { createAnthropicClient } from "./anthropic.server";
import { createGoogleClient } from "./google.server";
import { createOpenAIClient } from "./openai.server";
import type { LLMClient } from "./types";

let cached: LLMClient | undefined;

export function getLLMClient(): LLMClient {
  if (cached) return cached;

  const env = getEnv();
  switch (env.LLM_PROVIDER) {
    case "anthropic":
      cached = createAnthropicClient({
        apiKey: env.ANTHROPIC_API_KEY as string,
        model: env.ANTHROPIC_MODEL,
      });
      break;
    case "openai":
      cached = createOpenAIClient({
        apiKey: env.OPENAI_API_KEY as string,
        model: env.OPENAI_MODEL,
      });
      break;
    case "google":
      cached = createGoogleClient({
        apiKey: env.GOOGLE_API_KEY as string,
        model: env.GOOGLE_MODEL,
      });
      break;
  }
  return cached;
}
