import { type Logger } from "@bogeychan/elysia-logger/src/types";
import { type Elysia, type InvertedStatusMap, ValidationError } from "elysia";
import * as StackParser from "error-stack-parser";

import { CustomError, type CustomErrorMetadata } from "@/errors";
import { InternalServerError } from "@/errors/internal";
import { type StackEntry } from "@/errors/types";
import { ERROR_CODE } from "@/errors/utils";

const CODE = "CUSTOM_ERROR";
const CAUSE = "Unknown cause";

export function errorHandler(app: Elysia) {
    return app
        .error(CODE, CustomError)
        .error(CODE, InternalServerError)
        .onError(function onError(ctx) {
            // TODO improve error responses (problem details)

            // @ts-expect-error - `log` is actually defined but we can't InferErrorContext<App>
            const log = ctx.log as Logger;

            const error = mapError(ctx.error);
            const stack = mapStackTrace(ctx.error);
            const request: Record<string, unknown> = mapRequest(
                ctx.request,
                ctx.params,
                ctx.query,
            );

            log.error(
                {
                    name: error.name,
                    cause: error.cause,
                    statusCode: error.statusCode,
                    errorCode: error.errorCode,
                    ...error.metadata,
                    stack,
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

type MappedError = {
    name: string;
    message: string;
    cause: unknown;
    statusCode: keyof InvertedStatusMap;
    errorCode: ERROR_CODE;
    metadata: CustomErrorMetadata;
};

function mapError<T extends Error>(error: T): MappedError {
    const mappedError: MappedError = {
        name: error.name,
        message: error.message,
        cause: error.cause ?? CAUSE,
        statusCode: 500,
        errorCode: ERROR_CODE.INTERNAL,
        // TODO populate with necessary info like the authenticated user, etc.
        metadata: {},
    };

    if (error instanceof CustomError) {
        mappedError.statusCode = error.statusCode;
        mappedError.errorCode = error.errorCode;
        Object.assign(mappedError.metadata, error.metadata);
    }

    // TODO extract additional information from the error
    if (error instanceof ValidationError) {
        mappedError.statusCode = 422;
        mappedError.errorCode = ERROR_CODE.UNPROCESSABLE_CONTENT;
    }

    return mappedError;
}

function mapStackTrace<T extends Error>(error: T): Array<StackEntry> {
    const parsedStack = StackParser.parse(error);
    const stack = parsedStack.map((frame) => ({
        function: frame.functionName ?? "<anonymous>",
        position: frame.lineNumber + ":" + frame.columnNumber,
        file: frame.fileName,
    }));

    return stack;
}

function mapRequest<
    Req extends Request,
    Params extends Record<string, unknown>,
    Query extends Record<string, unknown>,
>(req: Req, params: Params, query: Query): Record<string, unknown> {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        params,
        query,
        body: req.body,
    };
}
