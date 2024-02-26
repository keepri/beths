import { staticPlugin } from "@elysiajs/static";
import { Elysia, type ElysiaConfig } from "elysia";

import { APP_NAME, IS_PRODUCTION, env, initCors, staticDir } from "@/config";
import { context } from "@/context";
import { cronJobs } from "@/cron";
import { apiRoute, pagesRoute } from "@/routes";

const APP_CONFIG = Object.freeze({
    name: APP_NAME,
    serve: {
        hostname: env.HOST,
        port: env.PORT,
        development: !IS_PRODUCTION,
        maxRequestBodySize: 1024 * 1024 * 4, // 4mb
    },
} satisfies ElysiaConfig);

export const app = new Elysia(APP_CONFIG)
    .use(initCors())
    .use(staticPlugin({ prefix: staticDir(), assets: "static" }))
    .use(context)
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
        console.log(
            `🚀 ${app.config.name} is running on ${server.url.protocol}//${server.hostname}:${server.port} in ${env.NODE_ENV} mode.`,
        );
    });
