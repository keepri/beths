import { staticPlugin } from "@elysiajs/static";
import { Elysia, type ElysiaConfig } from "elysia";

import { APP_NAME, IS_PRODUCTION, env, initCors, staticDir } from "@/config";
import { cronJobs } from "@/cron";
import { apiRoute, pagesRoute } from "@/routes";

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
    .use(initCors())
    .use(staticPlugin({ prefix: staticDir(), assets: "static" }))
    .use(cronJobs)
    .use(apiRoute)
    .use(pagesRoute)
    .onError(function onError(ctx) {
        const status: number = "status" in ctx.error ? ctx.error.status : 500;
        const message = ctx.error.message || "Something went wrong.";

        return new Response(message, {
            status,
            statusText:
                "code" in ctx.error ? ctx.error.code : "Internal Server Error",
        });
    })
    .onStart(function onStart(app) {
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
