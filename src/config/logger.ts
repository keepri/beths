import { createPinoLogger } from "@bogeychan/elysia-logger";
import { default as pinoPretty } from "pino-pretty";

import { env } from "@/config/env";

export const log = createPinoLogger({
    level: env.LOG_LEVEL,
    stream: pinoPretty({
        colorize: true,
        colorizeObjects: true,
        translateTime: "SYS:standard",
        levelFirst: true,
        singleLine: true,
    }),
    hooks: {
        logMethod(args, method) {
            const arg = args[0] as unknown;

            if (!arg) {
                this.debug("Logger called with no arguments");
                return;
            }

            if (typeof arg === "object" && "code" in arg) {
                // errors get logged in the error handler middleware
                return;
            }

            method.apply(this, args);
        },
    },
});
