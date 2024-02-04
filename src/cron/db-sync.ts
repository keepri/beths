import { makeCronJob } from ".";
import { EVERY_TWO_MINUTES_PATTERN } from "./patterns";

import { env } from "@/config";
import { client } from "@/db";

export const DB_SYNC_CRON = "db_sync" as const;

export const dbSyncCron = makeCronJob(
    { name: DB_SYNC_CRON, pattern: EVERY_TWO_MINUTES_PATTERN },
    () => {
        if (!env.DATABASE_SYNC_URL) {
            return;
        }

        client.sync().catch((error) => {
            console.error("Database sync failed.", error);
        });
    },
);
