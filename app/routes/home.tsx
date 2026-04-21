import { GrammarCheckPanel } from "../components/GrammarCheckPanel";
import { Tabs } from "../components/Tabs";
import { TranslatePanel } from "../components/TranslatePanel";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Local LangEx AI" },
    { name: "description", content: "Local translation and grammar-check app." },
  ];
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Local LangEx AI</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Local translation and grammar checking.
        </p>
      </header>
      <Tabs
        tabs={[
          { id: "translate", label: "Translation", content: <TranslatePanel /> },
          { id: "grammar", label: "Grammar Check", content: <GrammarCheckPanel /> },
        ]}
      />
    </main>
  );
}
