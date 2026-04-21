import type { GrammarCheckResponse, TranslateResponse } from "../../types/api";

export interface TranslateArgs {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface GrammarCheckArgs {
  text: string;
  language: string;
}

export interface LLMClient {
  translate(args: TranslateArgs): Promise<TranslateResponse>;
  grammarCheck(args: GrammarCheckArgs): Promise<GrammarCheckResponse>;
}

export class LLMAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMAuthError";
  }
}

export class LLMRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMRateLimitError";
  }
}

export class LLMParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMParseError";
  }
}
