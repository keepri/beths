import { type InvertedStatusMap, ValidationError } from "elysia";
import * as StackParser from "error-stack-parser";

import { CustomError, type CustomErrorMetadata } from ".";
import { ERROR_CODE } from "./constants";
import { type StackEntry } from "./types";

const CAUSE = "Unknown cause";

type MappedError = {
    name: string;
    message: string;
    cause: unknown;
    stack: Array<StackEntry>;
    statusCode: keyof InvertedStatusMap;
    errorCode: ERROR_CODE;
    metadata: CustomErrorMetadata;
};

export function mapError<T extends Error>(error: T): MappedError {
    const stack = mapStackTrace(error);

    const mappedError: MappedError = {
        name: error.name,
        message: error.message,
        cause: error.cause ?? CAUSE,
        stack,
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

export function mapStackTrace<T extends Error>(error: T): Array<StackEntry> {
    const parsedStack = StackParser.parse(error);
    const stack = parsedStack.map((frame) => ({
        function: frame.functionName ?? "<anonymous>",
        position: frame.lineNumber + ":" + frame.columnNumber,
        file: frame.fileName,
    }));

    return stack;
}

export function mapRequest<
    Req extends Request,
    Params extends Record<string, unknown>,
    Query extends Record<string, unknown>,
>(req: Req, params: Params, query: Query) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        params,
        query,
        body: req.body,
    };
}
