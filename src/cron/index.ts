import { Elysia } from "elysia";
import { cron, type CronConfig } from "@elysiajs/cron";

import { dbSyncCron } from "./db-sync";

export const cronJobs = new Elysia({ name: "CronJobs" }).use(dbSyncCron);

export function makeCronJob<T extends CronConfig["name"]>(
    config: CronConfig<T>,
) {
    const name = config.name;
    let fails = 0;

    return cron(
        Object.assign(config, {
            run(cron) {
                const start = performance.now();
                void config.run(cron).then(success).catch(fail);

                function success() {
                    const diffMs = +(performance.now() - start).toPrecision(2);
                    if (diffMs > 250) {
                        console.warn(
                            `Cron job ${name} completed in ${diffMs}ms.`,
                        );
                    }
                }

                function fail() {
                    if (++fails > 7) {
                        console.error(
                            `Cron job failed too many times, stopping ${name} cron.`,
                        );
                        cron.stop();
                    }
                }
            },
        } satisfies Omit<CronConfig<T>, "name" | "pattern">),
    );
}
