import Elysia from "elysia";

import { env } from "./config";

const NAME = "Interceptors";

export const interceptors = new Elysia({ name: NAME })
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
    })
    .onError(function onError(ctx) {
        // TODO add logging
        const status: number = "status" in ctx.error ? ctx.error.status : 500;
        const message = ctx.error.message || "Something went wrong.";

        return new Response(message, {
            status,
            statusText:
                "code" in ctx.error ? ctx.error.code : "Internal Server Error",
        });
    });
