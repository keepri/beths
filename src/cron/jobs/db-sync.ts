import { env } from "@/config";
import { client } from "@/db";

import { makeCronJob } from "../utils";

export const DB_SYNC_CRON = "db_sync" as const;

export const dbSyncCron = makeCronJob({ name: DB_SYNC_CRON }, dbSyncCallback);

function dbSyncCallback() {
    if (!env.DATABASE_SYNC_URL) {
        return;
    }

    client.sync().catch((error) => {
        console.error("Database sync failed.", error);
    });
}
