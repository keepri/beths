import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "@/db/schema";

import { env } from "./env";

export const LIBSQL_CLIENT = createClient({
    url: env.DATABASE_URL,
    syncUrl: env.DATABASE_SYNC_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
});

try {
    await LIBSQL_CLIENT.execute("select 6 + 9;");
} catch (error) {
    console.error("Could not establish database connection", error);
    process.exit(1);
}

export const DRIZZLE_CLIENT = createDrizzleClient({
    logger: console.trace.bind(console),
});

export function createDrizzleClient(config: {
    logger(message?: unknown, ...optionalParams: Array<unknown>): void;
}) {
    const client = drizzle(LIBSQL_CLIENT, {
        schema,
        logger: {
            logQuery(query, params) {
                config.logger(
                    {
                        query,
                        params,
                    },
                    "Query",
                );
            },
        },
    });

    return client;
}
