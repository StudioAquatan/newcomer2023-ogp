module.export = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "import"],
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    tsconfigRootDir: ".",
  },
  rules: {
    "sort-imports": "off",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
        groups: [["builtin", "external"], "parent", "sibling", "index"],
      },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-empty": "off",
    "no-case-declarations": "off",
  },
};
