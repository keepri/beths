import { createEnv } from "@t3-oss/env-core";
import { type Level } from "pino";
import { z } from "zod";

import {
    API_VERSIONS,
    DEFAULT_API_VERSION,
    LANGS,
    LOG_LEVELS,
} from "./constants";
import { processLang } from "./lib";

// not to be exported
const HOST = "127.0.0.1";
const PORT = 42069;
const DATABASE_URL = `http://${HOST}:8080`;
const LOG_LEVEL: Level = "trace";
const ENV = ["development", "staging", "production"] as const;
const [DEV] = ENV;

export const env = createEnv({
    isServer: true,
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    server: {
        // server
        NODE_ENV: z.enum(ENV).default(DEV),
        HOST: z.string().min(1).optional().default(HOST),
        PORT: z.coerce.number().optional().default(PORT),
        LANG: z.preprocess(processLang, z.enum(LANGS)),
        API_VERSION: z.enum(API_VERSIONS).default(DEFAULT_API_VERSION),

        // auth
        // TODO: remove `.optional()` when using
        GITHUB_CLIENT_ID: z.string().min(1).optional(),
        GITHUB_CLIENT_SECRET: z.string().min(1).optional(),

        // database
        DATABASE_URL: z.string().min(1).default(DATABASE_URL),
        DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
        DATABASE_SYNC_URL: z.string().min(1).optional(),

        // logging
        LOG_LEVEL: z.enum(LOG_LEVELS).optional().default(LOG_LEVEL),
    },
});

export const IS_PRODUCTION = env.NODE_ENV === "production";

export type Env = typeof env;
