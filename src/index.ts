import { Elysia, type ElysiaConfig } from "elysia";

import { Config } from "@/config";
import { APP_NAME } from "@/config/constants";
import { IS_PRODUCTION, env } from "@/config/env";
import { log } from "@/config/logger";
import { StaticConfig } from "@/config/static";
import { Crons } from "@/cron";
import { Plugins } from "@/plugins";
import { Routes } from "@/routes";
import { MAX_BODY_SIZE_KB } from "@/routes/lib/constants";

const APP_CONFIG = {
    name: APP_NAME,
    serve: {
        hostname: env.HOST,
        port: env.PORT,
        development: !IS_PRODUCTION,
        maxRequestBodySize: MAX_BODY_SIZE_KB,
    },
} as const satisfies ElysiaConfig<undefined, undefined>;

const app = new Elysia(APP_CONFIG)
    .use(StaticConfig)
    .use(Config)
    .use(Plugins)
    .use(Crons)
    .use(Routes)
    .onStart(function handleStart(app) {
        const server = app.server;

        if (!server) {
            return;
        }

        const appName = app.config.name;
        const url =
            server.url.protocol + "//" + server.hostname + ":" + server.port;
        log.info(`🚀 ${appName} is running on ${url} in ${env.NODE_ENV} mode`);
    });

export function run() {
    app.listen({});
}
