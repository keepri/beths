import { type Elysia } from "elysia";

import { decodeError } from "./decode";

export function apiErrorHandler(app: Elysia) {
    return app.onError(function handleError(ctx) {
        const error = decodeError(ctx);

        ctx.set.status = error.statusCode;

        return {
            name: error.name,
            message: error.message,
            cause: error.cause,
            code: error.errorCode,
        };
    });
}
