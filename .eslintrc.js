// some useful links:
//https://typescript-eslint.io/getting-started
// https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.mdhttps://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
module.exports = {
  root: true,
  env: { node: true },
  // parser to translate typescript to js
  parser: "@typescript-eslint/parser",
  // linters installed
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "import"],
  // settings for plugins
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  // "standard configs" extended
  extends: [
    "eslint:recommended", //general
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  // "custom config" extended
  rules: {
    // turn on errors for missing imports
    "import/no-unresolved": "error",
    "tsdoc/syntax": "warn",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
      },
    ],
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
  },
};
