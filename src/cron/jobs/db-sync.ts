import { env } from "@/config/env";
import { client } from "@/db";

import { createCronJob } from "../utils";

const DB_SYNC_CRON = "db_sync";

export const dbSync = createCronJob(dbSyncCallback, { name: DB_SYNC_CRON });

function dbSyncCallback() {
    if (!env.DATABASE_SYNC_URL) {
        return;
    }

    client.sync().catch((error) => {
        console.error("Database sync failed.", error);
    });
}
