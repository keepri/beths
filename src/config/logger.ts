import { createPinoLogger } from "@bogeychan/elysia-logger";
import { default as pinoPretty } from "pino-pretty";

import { env } from "@/config/env";
import { mapRequest } from "@/errors/mappers/request";

import { CORRELATION_ID_HEADER } from "./constants";
import { isCorrelationId, origin } from "./lib";

const COLORIZE = true; // !IS_PRODUCTION

/**
 * @description WARN using this instance of logger will not include the custom props, e.g correlationId
 */
export const log = createPinoLogger({
    level: env.LOG_LEVEL,
    stream: pinoPretty({
        colorize: COLORIZE,
        colorizeObjects: COLORIZE,
        translateTime: "SYS:standard",
        levelFirst: true,
        singleLine: true,
    }),
    hooks: {
        logMethod(args, method) {
            const extras = {};
            const arg = args[0] as unknown;

            if (args.length === 0 || arg === null) {
                // @ts-expect-error args[0] can be anything
                args[0] = extras;
                args[1] = "Logger called with no parameters";
                method.apply(this, args);
                return;
            }

            switch (typeof arg) {
                case "object": {
                    if (Array.isArray(arg)) {
                        args.unshift(extras);
                        args[1] = arg.join(", ");
                        break;
                    }

                    if ("request" in arg && arg.request instanceof Request) {
                        const request = mapRequest(arg.request);
                        const path = request.url.split(origin())[1];
                        const hasCorrelationId = isCorrelationId(
                            request.headers[CORRELATION_ID_HEADER],
                        );

                        if (hasCorrelationId) {
                            delete request.headers[CORRELATION_ID_HEADER];
                        }

                        // @ts-expect-error sht
                        args[0] = {
                            ...extras,
                            msg: path,
                            requestInfo: request,
                        };
                        break;
                    }

                    for (const key in extras) {
                        // @ts-expect-error sht
                        if (typeof arg[key] !== "undefined") {
                            continue;
                        }

                        // @ts-expect-error sht
                        arg[key] = extras[key];
                    }

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
