import OpenAI from "openai";
import type { GrammarCheckResponse, TranslateResponse } from "../../types/api";
import { DEFAULT_MODELS } from "../env.server";
import {
  buildGrammarCheckPrompt,
  buildTranslatePrompt,
  grammarCheckJsonSchema,
  grammarCheckSchema,
} from "../prompts";
import { type GrammarCheckArgs, type LLMClient, LLMParseError, type TranslateArgs } from "./types";

export function createOpenAIClient(args: { apiKey: string; model?: string }): LLMClient {
  const client = new OpenAI({ apiKey: args.apiKey });
  const model = args.model ?? DEFAULT_MODELS.openai;

  return {
    async translate(req: TranslateArgs): Promise<TranslateResponse> {
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: buildTranslatePrompt(req) }],
      });

      const text = res.choices[0]?.message?.content;
      if (!text) {
        throw new LLMParseError("No text content in OpenAI response.");
      }
      return { translated: text.trim() };
    },

    async grammarCheck(req: GrammarCheckArgs): Promise<GrammarCheckResponse> {
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: buildGrammarCheckPrompt(req) }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "grammar_check",
            strict: true,
            schema: grammarCheckJsonSchema,
          },
        },
      });

      const text = res.choices[0]?.message?.content;
      if (!text) {
        throw new LLMParseError("No text content in OpenAI response.");
      }

      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new LLMParseError("OpenAI response is not valid JSON.");
      }

      const parsed = grammarCheckSchema.safeParse(json);
      if (!parsed.success) {
        throw new LLMParseError(
          `Grammar-check output failed schema validation: ${parsed.error.message}`,
        );
      }
      return parsed.data;
    },
  };
}
