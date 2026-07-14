import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/",
      "bin/",
      "obj/",
      "src/IntraMessenger.Web/Scripts/dist/",
      "src/IntraMessenger.Web/Content/app/",
    ],
  },
  {
    files: ["frontend/src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["tools/**/*.mjs", "frontend/tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];
