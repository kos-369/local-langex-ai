import { useState } from "react";
import type { LanguageCode } from "../lib/languages";
import type { ApiError, TranslateRequest, TranslateResponse } from "../types/api";
import { LanguageSelector } from "./LanguageSelector";

export function TranslatePanel() {
  const [sourceLang, setSourceLang] = useState<LanguageCode | "auto">("auto");
  const [targetLang, setTargetLang] = useState<LanguageCode>("ja");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: TranslateRequest = { text, sourceLang, targetLang };
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as TranslateResponse | ApiError;
      if (!res.ok) {
        setError("error" in data ? data.error : `Request failed (${res.status})`);
        return;
      }
      setResult((data as TranslateResponse).translated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LanguageSelector
          label="Source language"
          value={sourceLang}
          onChange={(v) => setSourceLang(v)}
          includeAuto
          disabled={loading}
        />
        <LanguageSelector
          label="Target language"
          value={targetLang}
          onChange={(v) => setTargetLang(v as LanguageCode)}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="translate-input"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Input text
        </label>
        <textarea
          id="translate-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          disabled={loading}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="Enter text to translate"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>
      <section aria-live="polite" aria-busy={loading} className="flex flex-col gap-2">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </div>
        )}
        {result !== null && (
          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm whitespace-pre-wrap text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
            {result}
          </div>
        )}
      </section>
    </form>
  );
}
