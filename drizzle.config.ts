import { type Config } from "drizzle-kit";
import { env } from "./src/config";

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
} satisfies Config;
