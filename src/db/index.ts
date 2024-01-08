import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/config";
import * as schema from "./schema";

export const client = createClient({
    url: env.DATABASE_URL,
    syncUrl: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
});

await client.sync();

export const db = drizzle(client, {
    schema,
    logger: true,
});
