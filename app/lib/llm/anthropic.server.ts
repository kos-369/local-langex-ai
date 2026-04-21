import Anthropic from "@anthropic-ai/sdk";
import type { GrammarCheckResponse, TranslateResponse } from "../../types/api";
import { DEFAULT_MODELS } from "../env.server";
import {
  buildGrammarCheckPrompt,
  buildTranslatePrompt,
  grammarCheckJsonSchema,
  grammarCheckSchema,
} from "../prompts";
import { type GrammarCheckArgs, type LLMClient, LLMParseError, type TranslateArgs } from "./types";

const GRAMMAR_TOOL_NAME = "submit_grammar_check";

export function createAnthropicClient(args: { apiKey: string; model?: string }): LLMClient {
  const client = new Anthropic({ apiKey: args.apiKey });
  const model = args.model ?? DEFAULT_MODELS.anthropic;

  return {
    async translate(req: TranslateArgs): Promise<TranslateResponse> {
      const res = await client.messages.create({
        model,
        max_tokens: 4096,
        messages: [{ role: "user", content: buildTranslatePrompt(req) }],
      });

      const textBlock = res.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new LLMParseError("No text content in Anthropic response.");
      }
      return { translated: textBlock.text.trim() };
    },

    async grammarCheck(req: GrammarCheckArgs): Promise<GrammarCheckResponse> {
      const res = await client.messages.create({
        model,
        max_tokens: 4096,
        messages: [{ role: "user", content: buildGrammarCheckPrompt(req) }],
        tools: [
          {
            name: GRAMMAR_TOOL_NAME,
            description: "Submit the grammar-check result.",
            input_schema: grammarCheckJsonSchema as Anthropic.Tool.InputSchema,
          },
        ],
        tool_choice: { type: "tool", name: GRAMMAR_TOOL_NAME },
      });

      const toolUse = res.content.find((b) => b.type === "tool_use");
      if (!toolUse || toolUse.type !== "tool_use") {
        throw new LLMParseError("Anthropic response is missing the tool_use block.");
      }

      const parsed = grammarCheckSchema.safeParse(toolUse.input);
      if (!parsed.success) {
        throw new LLMParseError(
          `Grammar-check output failed schema validation: ${parsed.error.message}`,
        );
      }
      return parsed.data;
    },
  };
}
