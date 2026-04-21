export interface Language {
  code: string;
  name: string;
  nameJa: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: "ja", name: "Japanese", nameJa: "日本語" },
  { code: "en", name: "English", nameJa: "英語" },
  { code: "zh", name: "Chinese", nameJa: "中国語" },
  { code: "ko", name: "Korean", nameJa: "韓国語" },
  { code: "es", name: "Spanish", nameJa: "スペイン語" },
  { code: "fr", name: "French", nameJa: "フランス語" },
  { code: "de", name: "German", nameJa: "ドイツ語" },
  { code: "pt", name: "Portuguese", nameJa: "ポルトガル語" },
  { code: "ru", name: "Russian", nameJa: "ロシア語" },
  { code: "it", name: "Italian", nameJa: "イタリア語" },
] as const satisfies readonly Language[];

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as LanguageCode[];

export function getLanguageName(code: LanguageCode | "auto"): string {
  if (code === "auto") return "auto-detected";
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}
