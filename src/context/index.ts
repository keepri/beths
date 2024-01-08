import { Elysia } from "elysia";
import { logger as elysiaLogger } from "@bogeychan/elysia-logger";
import bearer from "@elysiajs/bearer";
import pretty from "pino-pretty";

import { db } from "@/db";
import { env, type Env } from "@/config";

export const context = new Elysia({ name: "Context" })
    .decorate("db", db)
    .decorate("config", { env })
    .use(logger(env.LOG_LEVEL))
    .use(bearer())
    .derive(function deriveSession(ctx) {
        const start = performance.now();
        const session = null;
        ctx.log.trace(
            { ms: (performance.now() - start).toPrecision(3) },
            "Checking session.",
        );

        return { session };
    });

export function logger(level: Env["LOG_LEVEL"]) {
    return elysiaLogger({
        level,
        stream: pretty({
            colorize: true,
            colorizeObjects: true,
            translateTime: "SYS:standard",
            levelFirst: true,
            singleLine: true,
        }),
    });
}
