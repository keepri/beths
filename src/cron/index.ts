import { Elysia } from "elysia";

import { dbSyncCron } from "./db-sync";

export const cronJobs = new Elysia({ name: "CronJobs" })
    .use(dbSyncCron);
