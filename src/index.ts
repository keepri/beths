import { Elysia } from "elysia";

import { APP_CONFIG, config } from "@/config";
import { env } from "@/config/env";
import { log } from "@/config/logger";
import { context } from "@/context";
import { cronJobs } from "@/cron";
import { errors } from "@/errors/lib/errors";
import { routes } from "@/routes";

const app = new Elysia(APP_CONFIG)
    .use(errors)
    .use(config)
    .use(context)
    .use(cronJobs)
    .use(routes)
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
    log.info(`🚀 ${appName} is running on ${url} in ${env.NODE_ENV} mode`);
}
