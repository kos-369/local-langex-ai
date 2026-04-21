import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/translate", "routes/api.translate.ts"),
  route("api/grammar-check", "routes/api.grammar-check.ts"),
] satisfies RouteConfig;
