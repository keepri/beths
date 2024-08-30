import { type Logger } from "@bogeychan/elysia-logger/src/types";
import { type Elysia } from "elysia";

import { CUSTOM_ERROR_NAME, CustomError } from "@/errors";
import { InternalServerError } from "@/errors/internal";

export function errorHandler(app: Elysia) {
    return app
        .error(CUSTOM_ERROR_NAME, CustomError)
        .error(CUSTOM_ERROR_NAME, InternalServerError)
        .onError(function onError(ctx) {
            // TODO improve error responses (problem details)
            // TODO add logging
            // @ts-expect-error - `log` is actually defined but we can't InferErrorContext<App>
            const log = ctx.log as Logger;

            switch (ctx.code) {
                case "CUSTOM_ERROR": {
                    ctx.set.status = ctx.error.statusCode;

                    return ctx.error.message;
                }

                case "VALIDATION": {
                    ctx.set.status = "Unprocessable Content";

                    return "Unprocessable Content";
                }

                default: {
                    ctx.set.status = "Internal Server Error";

                    return "Something went wrong.";
                }
            }
        });
}
