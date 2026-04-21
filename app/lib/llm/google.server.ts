import { GoogleGenAI, Type } from "@google/genai";
import type { GrammarCheckResponse, TranslateResponse } from "../../types/api";
import { DEFAULT_MODELS } from "../env.server";
import { buildGrammarCheckPrompt, buildTranslatePrompt, grammarCheckSchema } from "../prompts";
import { type GrammarCheckArgs, type LLMClient, LLMParseError, type TranslateArgs } from "./types";

const grammarResponseSchema = {
  type: Type.OBJECT,
  properties: {
    corrected: { type: Type.STRING },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["grammar", "spelling", "style"] },
          original: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["type", "original", "suggestion", "explanation"],
      },
    },
  },
  required: ["corrected", "issues"],
};

export function createGoogleClient(args: { apiKey: string; model?: string }): LLMClient {
  const client = new GoogleGenAI({ apiKey: args.apiKey });
  const model = args.model ?? DEFAULT_MODELS.google;

  return {
    async translate(req: TranslateArgs): Promise<TranslateResponse> {
      const res = await client.models.generateContent({
        model,
        contents: buildTranslatePrompt(req),
      });

      const text = res.text;
      if (!text) {
        throw new LLMParseError("No text content in Google response.");
      }
      return { translated: text.trim() };
    },

    async grammarCheck(req: GrammarCheckArgs): Promise<GrammarCheckResponse> {
      const res = await client.models.generateContent({
        model,
        contents: buildGrammarCheckPrompt(req),
        config: {
          responseMimeType: "application/json",
          responseSchema: grammarResponseSchema,
        },
      });

      const text = res.text;
      if (!text) {
        throw new LLMParseError("No text content in Google response.");
      }

      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new LLMParseError("Google response is not valid JSON.");
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
