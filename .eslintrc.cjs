/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsdoc/recommended-typescript-flavor",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json"],
        sourceType: "module",
        ecmaVersion: "latest",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["@typescript-eslint", "jsdoc"],
    rules: {
        "jsdoc/require-jsdoc": "off",
        indent: ["warn", 4],
        "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            { fixStyle: "inline-type-imports" },
        ],
        "comma-dangle": ["warn", "always-multiline"],
        "@typescript-eslint/comma-dangle": ["warn", "always-multiline"],
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
        "@typescript-eslint/method-signature-style": ["warn", "method"],
    },
    ignorePatterns: [
        "node_modules",
        "dist",
        "static",
        ".git",
        ".gitignore",
        "*.md",
        "*.lockb",
        "tsconfig.tsbuildinfo",
    ],
};
