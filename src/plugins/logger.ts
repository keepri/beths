import { Elysia } from "elysia";

import { CORRELATION_ID_HEADER } from "@/config/constants";
import { log } from "@/config/logger";

const NAME = "Plugin.Logger";
const LOGGER_CONFIG = {
    customProps(ctx) {
        return {
            correlationId: ctx.request.headers.get(CORRELATION_ID_HEADER),
        };
    },
    autoLogging: {
        ignore(ctx) {
            // we ignore error logging as we are doing it manually in the error handler
            return ctx.isError;
        },
    },
} as const satisfies Parameters<typeof log.into>[0];

export const LoggerPlugin = new Elysia({ name: NAME }).use(
    log.into(LOGGER_CONFIG),
);
