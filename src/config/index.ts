import { cors } from "@elysiajs/cors";
import { type HtmlOptions, html } from "@elysiajs/html";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const APP_NAME = "App" as const;
const STATIC_DIR = "static" as const;
// when changing this, also change package.json `start` script
const OUT_DIR = ".out" as const;

export function staticDir(path: string = ""): string {
    return STATIC_DIR + path;
}

export function buildDir(path: string = ""): string {
    return OUT_DIR + path;
}

export const env = createEnv({
    isServer: true,
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    server: {
        // server
        NODE_ENV: z.enum(["development", "production"]),
        HOST: z.string().min(1).optional().default("127.0.0.1"),
        PORT: z.coerce.number().optional().default(42069),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),

        // database
        DATABASE_URL: z.string().min(1),
        DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
        DATABASE_SYNC_URL: z.string().min(1).optional(),

        // logging
        LOG_LEVEL: z
            .enum(["fatal", "error", "warn", "info", "debug", "trace"])
            .optional()
            .default("trace"),
    },
});

export type Env = typeof env;

export const IS_PRODUCTION = env.NODE_ENV === "production";

export function initCors() {
    return cors({
        allowedHeaders: "*",
        origin: [origin(), "https://github.com"],
        credentials: true,
    });
}

export function origin() {
    const protocol = IS_PRODUCTION ? "https://" : "http://";
    const port = IS_PRODUCTION ? "" : `:${env.PORT}`;
    return protocol + env.HOST + port;
}

export function initHtml(options?: HtmlOptions) {
    return html(Object.assign({ autoDoctype: "full" }, options));
}
