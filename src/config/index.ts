import type { ElysiaLoggerOptions } from "@bogeychan/elysia-logger/src/types";
import { bearer } from "@elysiajs/bearer";
import { staticPlugin } from "@elysiajs/static";
import { type Elysia, type ElysiaConfig } from "elysia";
import { join } from "node:path";

import { cors } from "./cors";
import { IS_PRODUCTION, env } from "./env";
import { html } from "./html";
import { log } from "./logger";

export const APP_NAME = "App";

export const MAX_BODY_SIZE_KB = 1024 * 1024 * 1; // 1mb

const STATIC_DIR = "static";
export function staticDir(...path: Array<string>): string {
    return join(STATIC_DIR, ...path);
}

// when changing this, also change package.json `start` script
const OUT_DIR = ".out";
export function buildDir(...path: Array<string>): string {
    return join(OUT_DIR, ...path);
}

export const APP_CONFIG = {
    name: APP_NAME,
    serve: {
        hostname: env.HOST,
        port: env.PORT,
        development: !IS_PRODUCTION,
        maxRequestBodySize: MAX_BODY_SIZE_KB,
    },
} as const satisfies ElysiaConfig<undefined, undefined>;

export function config(app: Elysia) {
    const staticPluginConfig: Parameters<typeof staticPlugin>[0] = {
        prefix: staticDir(),
        assets: "static",
    };
    const loggerConfig: ElysiaLoggerOptions = {
        autoLogging: {
            ignore() {
                return true;
            },
        },
    };

    return app
        .use(staticPlugin(staticPluginConfig))
        .use(bearer())
        .use(cors())
        .use(log.into(loggerConfig))
        .use(html());
}
