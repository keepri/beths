import { type CronConfig, Patterns, cron } from "@elysiajs/cron";

import { log } from "@/config/logger";
import { mapError } from "@/errors/lib/mappers/error";

type CreateCronConfig = Omit<CronConfig, "run" | "pattern" | "catch"> &
    Partial<Pick<CronConfig, "pattern">>;

export function createCronJob(
    callback: CronConfig["run"],
    config: CreateCronConfig,
) {
    return cron(
        Object.assign(config, {
            pattern: config.pattern ?? Patterns.everyMinutes(5),
            async run(store) {
                const start = performance.now();

                await callback(store);

                const now = performance.now();
                const durationMs = +(now - start).toPrecision(2);

                log.info(
                    {
                        jobName: config.name,
                        date: new Date().toJSON(),
                        durationMs,
                    },
                    "Cronjob ran.",
                );
            },
            // TODO check in later versions of Elysia if second argument, cron,
            // has `cron.name` is available, as of v1.1.11 it is not
            catch(error) {
                if (error instanceof Error) {
                    error = mapError(error);
                }

                log.error(
                    {
                        jobName: config.name,
                        date: new Date().toJSON(),
                        error,
                    },
                    "Cronjob failed.",
                );
            },
        } satisfies Pick<CronConfig, "run" | "pattern" | "catch">),
    );
}
