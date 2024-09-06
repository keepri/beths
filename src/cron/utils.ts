import { type CronConfig, cron } from "@elysiajs/cron";

import { EVERY_FIVE_MINUTES_PATTERN } from "./patterns";

type CreateCronConfig = Omit<CronConfig, "run" | "pattern"> &
    Partial<Pick<CronConfig, "pattern">>;

export function createCronJob(
    callback: CronConfig["run"],
    config: CreateCronConfig,
) {
    let fails = 0;
    const pattern = config.pattern ?? EVERY_FIVE_MINUTES_PATTERN;

    return cron(
        Object.assign(config, {
            pattern,
            run(cron) {
                const now = new Date().toISOString();
                const start = performance.now();
                callback(cron)?.then(success)?.catch(fail);

                function success() {
                    console.log(`Cron job ${config.name} completed on ${now}.`);
                    const diffMs = +(performance.now() - start).toPrecision(2);
                    if (diffMs > 250) {
                        console.warn(
                            `Cron job ${config.name} completed on ${now} took ${diffMs}ms.`,
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
                        `Cron job ${config.name} failed on ${now}. ${error.message}`,
                    );
                }
            },
        } satisfies Pick<CronConfig, "run" | "pattern">),
    );
}
