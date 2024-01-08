module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsdoc/recommended-typescript-flavor",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.json"],
    },
    plugins: ["@typescript-eslint", "jsdoc"],
    rules: {
        "jsdoc/require-jsdoc": "off",
        "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            { fixStyle: "inline-type-imports" },
        ],
        "@typescript-eslint/comma-dangle": ["warn", "always-multiline"],
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
        "@typescript-eslint/method-signature-style": ["warn", "method"],
    },
    ignorePatterns: [
        "src/**/*.test.ts",
        "static/*",
        "*.lockb",
        "*.md",
        ".git",
        ".gitignore",
        "tsconfig.tsbuildinfo",
        "node_modules",
    ],
};
