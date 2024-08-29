import { type Elysia } from "elysia";

import { dbSync } from "./jobs/db-sync";

export function cronJobs(app: Elysia) {
    return app.use(dbSync);
}
