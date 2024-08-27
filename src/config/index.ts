import { bearer } from "@elysiajs/bearer";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

import { cors } from "./cors";
import { html } from "./html";
import { logger } from "./logger";

export const APP_NAME = "App";

export const MAX_BODY_SIZE_KB = 1024 * 1024 * 1; // 1mb

const STATIC_DIR = "static";
export function staticDir(path: string = ""): string {
    return STATIC_DIR + path;
}

// when changing this, also change package.json `start` script
const OUT_DIR = ".out";
export function buildDir(path: string = ""): string {
    return OUT_DIR + path;
}

const NAME = "Config";

export const config = new Elysia({ name: NAME })
    .use(logger())
    .use(html())
    .use(bearer())
    .use(cors())
    .use(
        staticPlugin({
            prefix: staticDir(),
            assets: "static",
        }),
    );
