import { Elysia } from "elysia";

import { DB_SYNC_CRON, dbSyncCron } from "./jobs/db-sync";
import { register } from "./utils";

const dbSync = register(DB_SYNC_CRON, dbSyncCron);

export const cronJobs = new Elysia({ name: "CronJobs" }).use(dbSync);
