import { type CronConfig, cron } from "@elysiajs/cron";
import { type Elysia } from "elysia";

import { EVERY_TWO_MINUTES_PATTERN } from "./patterns";

export function register(name: string, cron: (app: Elysia) => Elysia) {
    return function callback(app: Elysia) {
        console.log(`Cron job ${name} registered.`);
        return cron(app);
    };
}

type Config = Omit<CronConfig, "run" | "pattern"> &
    Partial<Pick<CronConfig, "pattern">>;

export function makeCronJob(config: Config, callback: CronConfig["run"]) {
    let fails = 0;
    const pattern = config.pattern ?? EVERY_TWO_MINUTES_PATTERN;

    return cron(
        Object.assign(config, {
            pattern,
            run(cron) {
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
        } satisfies Pick<CronConfig, "run" | "pattern">),
    );
}
