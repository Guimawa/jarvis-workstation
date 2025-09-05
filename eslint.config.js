import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/logs/**",
      "**/test-data/**",
      "**/test-*.js",
      "**/Uploaded Files Overview and Dashboard Design/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { 
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json"
      },
    },
    plugins: { 
      "react-hooks": reactHooks, 
      react, 
      "jsx-a11y": jsxA11y, 
      jest, 
      "testing-library": testingLibrary 
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      ...reactHooks.configs.recommended.rules,
    },
    settings: { 
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    rules: {
      ...jest.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
    },
  },
];
