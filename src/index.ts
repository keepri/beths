import { Elysia } from "elysia";

import { APP_CONFIG, config } from "@/config";
import { env } from "@/config/env";
import { log } from "@/config/logger";
import { context } from "@/context";
import { cronJobs } from "@/cron";
import { NotFoundError } from "@/errors/not-found";
import { errorHandler } from "@/middleware/error";
import { apiRoutes, pagesRoutes } from "@/routes";

const app = new Elysia(APP_CONFIG)
    .use(config)
    .use(context)
    .use(cronJobs)
    .use(errorHandler)
    .use(apiRoutes)
    .use(pagesRoutes)
    .all("*", handleNotFound)
    .onStart(handleStart);

export type App = typeof app;

export function startServer() {
    app.listen({});
}

function handleNotFound() {
    throw new NotFoundError();
}

function handleStart(app: App) {
    const server = app.server;

    if (!server) {
        return;
    }

    const appName = app.config.name;
    const url =
        server.url.protocol + "//" + server.hostname + ":" + server.port;
    log.info(`🚀 ${appName} is running on ${url} in ${env.NODE_ENV} mode.`);
}
