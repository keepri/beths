import { cors } from "@elysiajs/cors";

import { IS_PRODUCTION, env } from "@/config/env";

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
