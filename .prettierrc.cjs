/** @type {import("prettier").Options} */
module.exports = {
    parser: "typescript",
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    bracketSpacing: true,
    arrowParens: "always",
    trailingComma: "all",

    // @trivago/prettier-plugin-sort-imports
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrder: ["^@/(.*)$", "^[./]"],
};
