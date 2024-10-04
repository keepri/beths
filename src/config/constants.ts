import { TimeSpan } from "lucia";
import { type Level } from "pino";

import { type APIVersion, type AppLanguage } from "./types";

export const APP_NAME = "App";

export const DEFAULT_API_VERSION: APIVersion = "1";
export const API_VERSIONS: [APIVersion, ...Array<APIVersion>] = [
    DEFAULT_API_VERSION,
];

// when changing this, also change package.json `start` script
export const OUT_DIR_NAME = ".out";

export const STATIC_DIR_NAME = "static";

export const PAGES_CACHE_DIR_NAME = "pages";

export const DEFAULT_LANG: AppLanguage = "en";
export const LANGS: [AppLanguage, ...Array<AppLanguage>] = [
    DEFAULT_LANG,
] as const;

export const LOG_LEVELS: [Level, ...Array<Level>] = [
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
] as const;

export const SESSION_LENGTH: TimeSpan = new TimeSpan(1, "d");

export const CORRELATION_ID_HEADER = "x-correlation-id";
