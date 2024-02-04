import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const APP_NAME = "App" as const;
const STATIC_DIR = "" as const;

export function staticDir(path?: string): string {
    return `${STATIC_DIR}${path}`;
}

export const env = createEnv({
    isServer: true,
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    server: {
        // required
        NODE_ENV: z.enum(["development", "production"]),
        DATABASE_URL: z.string().min(1),
        ORIGIN: z.string().min(1),

        //optional
        HOSTNAME: z.string().min(1).optional().default("127.0.0.1"),
        PORT: z.coerce.number().optional().default(42069),
        DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
        DATABASE_SYNC_URL: z.string().min(1).optional(),
        LOG_LEVEL: z
            .enum(["fatal", "error", "warn", "info", "debug", "trace"])
            .optional()
            .default("trace"),
    },
});

export type Env = typeof env;

export function initCors(origin: Env["ORIGIN"]) {
    return cors({ allowedHeaders: "*", origin, credentials: true });
}

export function initHtml() {
    return html({ autoDoctype: "full" });
}
