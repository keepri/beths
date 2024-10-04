import { Elysia } from "elysia";

import { DbSyncCron } from "./jobs/db-sync";

const NAME = "Cron";

export const Crons = new Elysia({ name: NAME }).use(DbSyncCron);
