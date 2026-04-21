import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { toErrorResponse } from "../lib/api-errors.server";
import { LANGUAGE_CODES } from "../lib/languages";
import { getLLMClient } from "../lib/llm/index.server";

const languageCode = z.enum(LANGUAGE_CODES);

const grammarCheckRequestSchema = z.object({
  text: z.string().min(1, "text must not be empty"),
  language: languageCode,
});

export async function action({ request }: ActionFunctionArgs): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  try {
    const body = await request.json();
    const parsed = grammarCheckRequestSchema.parse(body);
    const result = await getLLMClient().grammarCheck(parsed);
    return Response.json(result);
  } catch (err) {
    return toErrorResponse(err);
  }
}
