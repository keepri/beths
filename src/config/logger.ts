import { createPinoLogger } from "@bogeychan/elysia-logger";
import { getId } from "correlation-id";
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
            const extras = { correlationId: getId() };

            switch (typeof arg) {
                case "object": {
                    if (arg === null) {
                        args.unshift(extras);
                        break;
                    }

                    if (Array.isArray(arg)) {
                        arg.push(getId());
                        break;
                    }

                    Object.assign(arg, extras);
                    break;
                }

                default: {
                    args.unshift(extras);
                    break;
                }
            }

            method.apply(this, args);
        },
    },
});
