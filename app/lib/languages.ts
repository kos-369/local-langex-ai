export interface Language {
  code: string;
  name: string;
  originalName: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: "ja", name: "Japanese", originalName: "日本語" },
  { code: "en", name: "English", originalName: "English" },
  { code: "zh", name: "Chinese", originalName: "中文" },
  { code: "ko", name: "Korean", originalName: "한국어" },
  { code: "es", name: "Spanish", originalName: "Español" },
  { code: "fr", name: "French", originalName: "Français" },
  { code: "de", name: "German", originalName: "Deutsch" },
  { code: "pt", name: "Portuguese", originalName: "Português" },
  { code: "ru", name: "Russian", originalName: "Русский" },
  { code: "it", name: "Italian", originalName: "Italiano" },
] as const satisfies readonly Language[];

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as [
  LanguageCode,
  ...LanguageCode[],
];

export function getLanguageName(code: LanguageCode | "auto"): string {
  if (code === "auto") return "auto-detected";
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}
