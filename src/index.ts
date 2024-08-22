import { staticPlugin } from "@elysiajs/static";
import { Elysia, type ElysiaConfig } from "elysia";

import { APP_NAME, IS_PRODUCTION, env, initCors, staticDir } from "@/config";
import { cronJobs } from "@/cron";
import { apiRoute, pagesRoute } from "@/routes";

import { interceptors } from "./config/interceptors";

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
    .use(interceptors)
    .use(elysiaCors)
    .use(elysiaStatic)
    .use(cronJobs)
    .use(apiRoute)
    .use(pagesRoute);
