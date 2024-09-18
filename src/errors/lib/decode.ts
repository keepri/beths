import { type Logger } from "@bogeychan/elysia-logger/src/types";
import { type ErrorHandler } from "elysia";

import { mapError } from "@/errors/lib/mappers/error";
import { mapRequest } from "@/errors/lib/mappers/request";

type Context = Parameters<ErrorHandler>[0];

export function decodeError(ctx: Context) {
    // TODO improve error responses (problem details)

    // @ts-expect-error - `log` is defined but we can't InferErrorContext<App>
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

    return error;
}
