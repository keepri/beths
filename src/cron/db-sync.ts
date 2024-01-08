import { cron } from "@elysiajs/cron";
import { type Elysia } from "elysia";
import { client } from "@/db";

export function dbSyncCron(app: Elysia) {
    const name = "db_sync" as const;
    let fails = 0;

    const syncCron = cron({
        name,
        pattern: "2 * * * * *",
        run(cron) {
            const start = performance.now();
            void client.sync().then(success).catch(fail);

            function success() {
                const diffMs = +(performance.now() - start).toPrecision(2);
                if (diffMs > 250) {
                    console.warn(`Database synced in ${diffMs}ms.`);
                }
            }

            function fail(error: Error) {
                console.error("Database sync failed", error);
                if (++fails > 7) {
                    console.error(
                        `Database sync failed too many times, stopping ${name} cron.`,
                    );
                    cron.stop();
                }
            }
        },
    });

    return syncCron(app);
}
