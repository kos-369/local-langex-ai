import type { LanguageCode } from "../lib/languages";

export interface TranslateRequest {
  text: string;
  sourceLang: LanguageCode | "auto";
  targetLang: LanguageCode;
}

export interface TranslateResponse {
  translated: string;
}

export interface GrammarCheckRequest {
  text: string;
  language: LanguageCode;
}

export type GrammarIssueType = "grammar" | "spelling" | "style";

export interface GrammarIssue {
  type: GrammarIssueType;
  original: string;
  suggestion: string;
  explanation: string;
}

export interface GrammarCheckResponse {
  corrected: string;
  issues: GrammarIssue[];
}

export interface ApiError {
  error: string;
}
