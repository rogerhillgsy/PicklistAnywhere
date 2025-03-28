import eslintjs from "@eslint/js";
import microsoftPowerApps from "@microsoft/eslint-plugin-power-apps";
import pluginPromise from "eslint-plugin-promise";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["**/generated",
      "typings/xrmdefinitelytyped",
      "ci2",
      "dist",
      "js/lib/xrmquery",
      "node_modules",
      "out",
      "generated",
      "",
      ".eslintrc.json",
      ".huskyrc.json",
      ".lintstagedrc.json",
      ".prettierignore",
      ".prettierrc.json",
      ".yo-rc.json",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "webpack.config.js",
      "jest.config.js"
    ],
  },
  eslintjs.configs.recommended,
  ...typescriptEslint.configs.recommendedTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  pluginPromise.configs["flat/recommended"],
  microsoftPowerApps.configs.paCheckerHosted,
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      "@microsoft/power-apps": microsoftPowerApps,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ComponentFramework: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn"
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
