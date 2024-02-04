import { type Elysia } from "elysia";

import { makeCronJob } from ".";
import { client } from "@/db";

export const CRON_NAME = "db_sync" as const;
export const CRON_PATTERN = "2 * * * * *" as const;

export function dbSyncCron(app: Elysia) {
    return makeCronJob({
        name: CRON_NAME,
        pattern: CRON_PATTERN,
        run() {
            void client.sync().catch((error: Error) => {
                console.error("Database sync failed.", error);
            });
        },
    })(app);
}
