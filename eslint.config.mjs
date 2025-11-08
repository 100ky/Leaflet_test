import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import js from "@eslint/js";

export default tseslint.config([
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextVitals,
  {
    // You can add custom rules here
    rules: {},
  },
]);