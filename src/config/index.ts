import { bearer } from "@elysiajs/bearer";
import { staticPlugin } from "@elysiajs/static";
import { type Elysia } from "elysia";

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

export function config(app: Elysia) {
    return app
        .use(
            staticPlugin({
                prefix: staticDir(),
                assets: "static",
            }),
        )
        .use(bearer())
        .use(cors())
        .use(logger())
        .use(html());
}
