import { Elysia, type ElysiaConfig } from "elysia";
import { staticPlugin } from "@elysiajs/static";

import { APP_NAME, env, staticDir, initCors } from "@/config";
import { api } from "@/api";
import { pages } from "@/pages";
import { cronJobs } from "@/cron";
import { context } from "@/context";

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
    .use(initCors(env.ORIGIN))
    .use(staticPlugin({ prefix: staticDir("/"), assets: "static" }))
    .use(context)
    .use(cronJobs)
    .use(api)
    .use(pages)
    .onError(function onError(ctx) {
        ctx.log.error(ctx.error);
        const status: number = "status" in ctx.error ? ctx.error.status : 500;

        return new Response(ctx.error.message || "Something went wrong.", {
            status,
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
