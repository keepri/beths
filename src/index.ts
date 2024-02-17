import { staticPlugin } from "@elysiajs/static";
import { Elysia, type ElysiaConfig } from "elysia";

import { api } from "@/api";
import { APP_NAME, env, initCors, staticDir } from "@/config";
import { context } from "@/context";
import { cronJobs } from "@/cron";
import { pages } from "@/pages";

const APP_CONFIG = Object.freeze({
    name: APP_NAME,
    serve: {
        hostname: env.HOSTNAME,
        port: env.PORT,
        development: env.NODE_ENV === "development",
        maxRequestBodySize: 1024 * 1024 * 4, // 4mb
    },
} satisfies ElysiaConfig);

export const app = new Elysia(APP_CONFIG)
    .use(initCors())
    .use(staticPlugin({ prefix: staticDir(), assets: "static" }))
    .use(context)
    .use(cronJobs)
    .use(api)
    .use(pages)
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
        const mode =
            env.NODE_ENV === "development" ? "development" : "production";
        console.log(
            `🚀 ${app.config.name} is running on ${server.url.protocol}//${server.hostname}:${server.port} in ${mode} mode.`,
        );
    });
