import { LIBSQL_CLIENT } from "@/config/db";
import { env } from "@/config/env";
import { log } from "@/config/logger";
import { mapError } from "@/errors/mappers/error";

import { createCronJob } from "../lib/create";

const NAME = "Cron.DbSync";

export const DbSyncCron = createCronJob(dbSync, {
    name: NAME,
});

function dbSync() {
    if (!env.DATABASE_SYNC_URL) {
        return;
    }

    log.info("Syncing local database replica");

    LIBSQL_CLIENT.sync().catch(function onError(error) {
        const e = mapError(error);
        log.error({ error: e }, "Database sync failed");
    });
}
