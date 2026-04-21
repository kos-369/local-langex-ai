import { ZodError } from "zod";
import type { ApiError } from "../types/api";
import { LLMParseError } from "./llm/types";

function jsonError(status: number, message: string): Response {
  const body: ApiError = { error: message };
  return Response.json(body, { status });
}

export function toErrorResponse(err: unknown): Response {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    const path = first?.path.join(".") || "request";
    return jsonError(400, `Invalid request: ${path} — ${first?.message ?? "validation failed"}.`);
  }

  if (err instanceof LLMParseError) {
    return jsonError(502, `Failed to parse LLM output: ${err.message}`);
  }

  if (err && typeof err === "object" && "status" in err && typeof err.status === "number") {
    const status = err.status;
    const message =
      "message" in err && typeof err.message === "string" ? err.message : "LLM request failed.";
    if (status === 401 || status === 403) {
      return jsonError(401, `LLM provider authentication failed: ${message}`);
    }
    if (status === 429) {
      return jsonError(429, `LLM provider rate limit exceeded: ${message}`);
    }
    if (status >= 500 && status < 600) {
      return jsonError(502, `LLM provider error: ${message}`);
    }
  }

  const message = err instanceof Error ? err.message : "Unknown error.";
  return jsonError(500, message);
}
