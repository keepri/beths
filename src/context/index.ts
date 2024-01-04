import { Elysia } from "elysia";
import { type LoggerOptions } from "@bogeychan/elysia-logger/types";
import { logger as elysiaLogger } from "@bogeychan/elysia-logger";
import pretty from "pino-pretty";

import { db } from "../db";
import { env } from "../config";

export const context = new Elysia({ name: "Context" })
    .decorate("db", db)
    .decorate("config", { env })
    .use(logger(env.LOG_LEVEL))
    .derive(function deriveSession(ctx) {
        const now = performance.now();
        const session = null;
        ctx.log.trace({ ms: (performance.now() - now).toPrecision(3) }, "Checking session.");

        return { session };
    });

function logger(level: LoggerOptions["level"]) {
    return elysiaLogger({
        level,
        stream: pretty({
            colorize: true,
            colorizeObjects: true,
            translateTime: "SYS:standard",
            levelFirst: true,
            minimumLevel: level as any,
            singleLine: true,
        }),
    });
}
