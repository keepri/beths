import { Elysia, type ElysiaConfig } from "elysia";

import { APP_NAME, MAX_BODY_SIZE_KB, config } from "@/config";
import { IS_PRODUCTION, env } from "@/config/env";
import { context } from "@/context";
import { cronJobs } from "@/cron";
import { errorHandler } from "@/middleware/error";
import { apiRoutes, pagesRoutes } from "@/routes";

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
    .use(config)
    .use(context)
    .use(errorHandler)
    .use(cronJobs)
    .use(apiRoutes)
    .use(pagesRoutes)
    .onStart(handleStart);

export type App = typeof app;

export function startServer() {
    app.listen({});
}

function handleStart(app: App) {
    const server = app.server;

    if (!server) {
        return;
    }

    const appName = app.config.name;
    const url =
        server.url.protocol + "//" + server.hostname + ":" + server.port;
    console.log(`🚀 ${appName} is running on ${url} in ${env.NODE_ENV} mode.`);
}
