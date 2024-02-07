import { env } from "./src/config";

/** @type {import("drizzle-kit").Config} */
export default {
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
