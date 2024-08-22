import { staticPlugin } from "@elysiajs/static";
import { Elysia, type ElysiaConfig } from "elysia";

import { APP_NAME, IS_PRODUCTION, env, initCors, staticDir } from "@/config";
import { cronJobs } from "@/cron";
import { apiRoute, pagesRoute } from "@/routes";

import { errorHandler } from "./middleware/error";

const elysiaCors = initCors();
const elysiaStatic = staticPlugin({
    prefix: staticDir(),
    assets: "static",
});

const APP_CONFIG = {
    name: APP_NAME,
    serve: {
        hostname: env.HOST,
        port: env.PORT,
        development: !IS_PRODUCTION,
        maxRequestBodySize: 1024 * 1024 * 4, // 4mb
    },
} as const satisfies ElysiaConfig<undefined, undefined>;

export const app = new Elysia(APP_CONFIG)
    .use(elysiaCors)
    .use(elysiaStatic)
    .use(errorHandler)
    .use(cronJobs)
    .use(apiRoute)
    .use(pagesRoute)
    .onStart(function handleStart(app) {
        const server = app.server;
        if (server === null) {
            return;
        }
        const appName = app.config.name;
        const url =
            server.url.protocol + "//" + server.hostname + ":" + server.port;
        console.log(
            `🚀 ${appName} is running on ${url} in ${env.NODE_ENV} mode.`,
        );
    });
