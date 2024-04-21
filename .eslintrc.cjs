module.exports = {
  env: {
    amd: true,
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off",
    "react-refresh/only-export-components": "warn",
    "no-unused-vars": "warn", // check no unused vars
    "no-unreachable": "warn", // check return before some unreachable code
    "react-hooks/exhaustive-deps": "warn", // check effect deps
  },
};
