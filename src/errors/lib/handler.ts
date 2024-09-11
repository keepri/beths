import { type Logger } from "@bogeychan/elysia-logger/src/types";
import { type Elysia } from "elysia";

import { CustomError } from "@/errors";
import { InternalServerError } from "@/errors/internal";
import { mapError } from "@/errors/lib/mappers/error";
import { mapRequest } from "@/errors/lib/mappers/request";

const CODE = "CUSTOM_ERROR";

export function errors(app: Elysia) {
    return app
        .error(CODE, CustomError)
        .error(CODE, InternalServerError)
        .onError(function handleError(ctx) {
            // TODO improve error responses (problem details)

            // @ts-expect-error - `log` is actually defined but we can't InferErrorContext<App>
            const log = ctx.log as Logger;

            const error = mapError(ctx.error);
            const request = mapRequest(ctx.request, ctx.params, ctx.query);

            log.error(
                {
                    name: error.name,
                    cause: error.cause,
                    statusCode: error.statusCode,
                    errorCode: error.errorCode,
                    ...error.metadata,
                    stack: error.stack,
                    request,
                },
                error.message,
            );

            ctx.set.status = error.statusCode;

            return {
                name: error.name,
                message: error.message,
                cause: error.cause,
                code: error.errorCode,
            };
        });
}
