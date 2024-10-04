import { type ErrorHandler } from "elysia";

import { mapError } from "./error";
import { mapRequest } from "./request";

type Context = Parameters<ErrorHandler>[0];

export function mapErrorContext(ctx: Context) {
    // TODO improve error responses (problem details)

    const error = mapError(ctx.error);
    const request = mapRequest(ctx);

    return {
        error,
        request,
    };
}
