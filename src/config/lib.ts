import { join } from "path";

import { UUIDV4 } from "@/lib/regex";

import {
    DEFAULT_LANG,
    LANGS,
    OUT_DIR_NAME,
    PAGES_CACHE_DIR_NAME,
    STATIC_DIR_NAME,
} from "./constants";
import { IS_PRODUCTION, env } from "./env";
import { type AppLanguage } from "./types";

export function buildDir(...path: Array<string>): string {
    return join(OUT_DIR_NAME, ...path);
}

export function staticDir(...path: Array<string>): string {
    return join(STATIC_DIR_NAME, ...path);
}

export async function pagesCacheDir() {
    const path = join(buildDir(), staticDir(), PAGES_CACHE_DIR_NAME);
    const exists = await Bun.file(path).exists();

    if (!exists) {
        Bun.spawnSync(["mkdir", "-p", path]);
    }

    return path;
}

export function processLang(lang: unknown): AppLanguage {
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

export function origin() {
    const protocol = IS_PRODUCTION ? "https://" : "http://";
    const port = IS_PRODUCTION ? "" : ":" + env.PORT;

    return protocol + env.HOST + port;
}

export function isCorrelationId(value: unknown): boolean {
    return typeof value === "string" && UUIDV4.test(value);
}
