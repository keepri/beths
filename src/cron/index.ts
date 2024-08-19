import { Elysia } from "elysia";

import { dbSync } from "./jobs/db-sync";

const NAME = "CronJobs";

export const cronJobs = new Elysia({ name: NAME }).use(dbSync);
