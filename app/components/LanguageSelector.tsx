import { useId } from "react";
import { type LanguageCode, SUPPORTED_LANGUAGES } from "../lib/languages";

type Value = LanguageCode | "auto";

interface LanguageSelectorProps {
  label: string;
  value: Value;
  onChange: (value: Value) => void;
  includeAuto?: boolean;
  disabled?: boolean;
}

export function LanguageSelector({
  label,
  value,
  onChange,
  includeAuto = false,
  disabled = false,
}: LanguageSelectorProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as Value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        {includeAuto && <option value="auto">Auto detect</option>}
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.originalName}
          </option>
        ))}
      </select>
    </div>
  );
}
