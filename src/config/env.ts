import { createEnv } from "@t3-oss/env-core";
import { type Level } from "pino";
import { z } from "zod";

const DEFAULT_LANG: AppLanguage = "en";
export const LANGS: [AppLanguage, ...Array<AppLanguage>] = [
    DEFAULT_LANG,
] as const;

const LOG_LEVELS: [Level, ...Array<Level>] = [
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
];

export const env = createEnv({
    isServer: true,
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    server: {
        // server
        NODE_ENV: z.enum(["development", "production"]),
        HOST: z.string().min(1).optional().default("127.0.0.1"),
        PORT: z.coerce.number().optional().default(42069),
        LANG: z.preprocess(processLang, z.enum(LANGS)),

        // auth
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),

        // database
        DATABASE_URL: z.string().min(1),
        DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
        DATABASE_SYNC_URL: z.string().min(1).optional(),

        // logging
        LOG_LEVEL: z.enum(LOG_LEVELS).optional().default("trace"),
    },
});

export const IS_PRODUCTION = env.NODE_ENV === "production";

export type AppLanguage = "en";
export type Env = typeof env;

function processLang(lang: unknown): AppLanguage {
    if (typeof lang !== "string") {
        return DEFAULT_LANG;
    }

    lang = lang.split("_")[0];

    // @ts-expect-error - lang is a string
    if (!LANGS.includes(lang)) {
        return DEFAULT_LANG;
    }

    // we know lang is of type AppLanguage here
    return lang as AppLanguage;
}
