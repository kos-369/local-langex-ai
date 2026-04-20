import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Local LangEx AI" },
    { name: "description", content: "Local translation and grammar-check app." },
  ];
}

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Local LangEx AI</h1>
    </main>
  );
}
