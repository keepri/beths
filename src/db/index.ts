import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/config/env";
import { log } from "@/config/logger";

import * as schema from "./schema";

export const client = createClient({
    url: env.DATABASE_URL,
    syncUrl: env.DATABASE_SYNC_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
});

if (env.DATABASE_SYNC_URL) {
    log.info("Syncing local database replica...");
    try {
        await client.sync();
    } catch (error) {
        log.error(error, "Database sync failed.");
    }
}

export const db = drizzle(client, {
    schema,
    logger: true,
});
