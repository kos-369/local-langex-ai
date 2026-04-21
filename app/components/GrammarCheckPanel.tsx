import { useState } from "react";
import type { LanguageCode } from "../lib/languages";
import type { ApiError, GrammarCheckRequest, GrammarCheckResponse } from "../types/api";
import { LanguageSelector } from "./LanguageSelector";

const ISSUE_LABEL: Record<"grammar" | "spelling" | "style", string> = {
  grammar: "Grammar",
  spelling: "Spelling",
  style: "Style",
};

export function GrammarCheckPanel() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [text, setText] = useState("");
  const [result, setResult] = useState<GrammarCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: GrammarCheckRequest = { text, language };
      const res = await fetch("/api/grammar-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as GrammarCheckResponse | ApiError;
      if (!res.ok) {
        setError("error" in data ? data.error : `Request failed (${res.status})`);
        return;
      }
      setResult(data as GrammarCheckResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="max-w-xs">
        <LanguageSelector
          label="Language"
          value={language}
          onChange={(v) => setLanguage(v as LanguageCode)}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="grammar-input"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Input text
        </label>
        <textarea
          id="grammar-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          disabled={loading}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="Enter text to check"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check grammar"}
        </button>
      </div>
      <section aria-live="polite" aria-busy={loading} className="flex flex-col gap-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </div>
        )}
        {result && (
          <>
            <div>
              <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Corrected text
              </h3>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm whitespace-pre-wrap text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
                {result.corrected}
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Issues ({result.issues.length})
              </h3>
              {result.issues.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">No issues found.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {result.issues.map((issue) => (
                    <li
                      key={`${issue.type}:${issue.original}:${issue.suggestion}`}
                      className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="mb-1 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {ISSUE_LABEL[issue.type] ?? issue.type}
                      </div>
                      <div className="text-gray-900 dark:text-gray-100">
                        <span className="line-through text-red-700 dark:text-red-400">
                          {issue.original}
                        </span>
                        {" → "}
                        <span className="font-medium text-green-700 dark:text-green-400">
                          {issue.suggestion}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {issue.explanation}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
    </form>
  );
}
