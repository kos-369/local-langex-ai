import { z } from "zod";

export function buildTranslatePrompt(args: {
  text: string;
  sourceLang: string;
  targetLang: string;
}): string {
  const source = args.sourceLang === "auto" ? "the detected source language" : args.sourceLang;
  return [
    `Translate the following text from ${source} to ${args.targetLang}.`,
    "Output only the translated text. Do not include explanations, labels, quotes, or any other content.",
    "",
    "Text:",
    args.text,
  ].join("\n");
}

export function buildGrammarCheckPrompt(args: { text: string; language: string }): string {
  return [
    `You are a grammar and writing assistant. Analyze the following ${args.language} text.`,
    "Return a JSON object matching the provided schema with:",
    '- "corrected": the fully corrected version of the input text.',
    '- "issues": an array of issues. Each issue has "type" (one of "grammar", "spelling", "style"),',
    '  "original" (the problematic fragment), "suggestion" (the replacement), and "explanation" (a short reason).',
    "If the text has no issues, return an empty issues array and set corrected to the original text.",
    "Do not include any content outside the JSON object.",
    "",
    "Text:",
    args.text,
  ].join("\n");
}

export const grammarIssueSchema = z.object({
  type: z.enum(["grammar", "spelling", "style"]),
  original: z.string(),
  suggestion: z.string(),
  explanation: z.string(),
});

export const grammarCheckSchema = z.object({
  corrected: z.string(),
  issues: z.array(grammarIssueSchema),
});

export type GrammarCheckParsed = z.infer<typeof grammarCheckSchema>;

export const grammarCheckJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrected: { type: "string" },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "string", enum: ["grammar", "spelling", "style"] },
          original: { type: "string" },
          suggestion: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["type", "original", "suggestion", "explanation"],
      },
    },
  },
  required: ["corrected", "issues"],
};
