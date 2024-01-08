const { env } = require("./src/config");

/** @type {import("drizzle-kit").Config} */
const config = {
    strict: true,
    verbose: true,
    driver: "turso",
    schema: "./src/db/schema/index.ts",
    out: "src/db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
    },
};

module.exports = config;
