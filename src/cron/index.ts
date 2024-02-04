import { Elysia } from "elysia";
import { cron, type CronConfig } from "@elysiajs/cron";

import { dbSyncCron } from "./db-sync";

export const cronJobs = new Elysia({ name: "CronJobs" }).use(dbSyncCron);

export function makeCronJob(
    config: Omit<CronConfig, "run">,
    callback: CronConfig["run"],
) {
    let fails = 0;

    return cron(
        Object.assign(config, {
            run(cron) {
                console.log(`Cron job ${config.name} started.`);
                const start = performance.now();
                callback(cron)?.then(success)?.catch(fail);

                function success() {
                    const diffMs = +(performance.now() - start).toPrecision(2);
                    if (diffMs > 250) {
                        console.warn(
                            `Cron job ${config.name} completed in ${diffMs}ms.`,
                        );
                    }
                }

                function fail(error: Error) {
                    if (++fails > 7) {
                        console.error(
                            `Cron job failed too many times, stopping ${config.name} cron.`,
                        );
                        cron.stop();
                        return;
                    }

                    console.error(
                        `Cron job ${config.name} failed. ${error.message}`,
                    );
                }
            },
        } satisfies Pick<CronConfig, "run">),
    );
}
